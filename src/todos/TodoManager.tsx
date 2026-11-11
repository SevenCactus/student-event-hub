import { useState, useEffect, useMemo, useRef } from 'react'
import { TodoItem, TodoTag, TodoFilter, TODO_TAG_COLORS } from './types'
import { loadSavedTasks, saveTasksToStorage } from './todoStorage'

const TAG_OPTIONS: TodoTag[] = ['Học tập', 'Portfolio', 'Tiếng Anh', 'Nhóm', 'Sự kiện', 'Khác']

export default function TodoManager() {
  const [tasks, setTasks] = useState<TodoItem[]>(() => loadSavedTasks())
  const [filter, setFilter] = useState<TodoFilter>('all')
  const [isManageMode, setIsManageMode] = useState(false)

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TodoItem | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formDueDate, setFormDueDate] = useState('')
  const [formDueTime, setFormDueTime] = useState('')
  const [formDuration, setFormDuration] = useState('')
  const [formTag, setFormTag] = useState<TodoTag>('Học tập')
  const [titleError, setTitleError] = useState('')

  // Undo Delete State
  const [lastDeleted, setLastDeleted] = useState<{ task: TodoItem; index: number } | null>(null)
  const undoTimeoutRef = useRef<number | null>(null)

  // Persist tasks on change
  const updateTasks = (newTasks: TodoItem[]) => {
    setTasks(newTasks)
    saveTasksToStorage(newTasks)
  }

  // Count pending tasks
  const pendingCount = useMemo(() => tasks.filter((t) => !t.done).length, [tasks])
  const completedCount = useMemo(() => tasks.filter((t) => t.done).length, [tasks])

  // Check if a task is overdue
  const isOverdue = (task: TodoItem) => {
    if (!task.dueDate || task.done) return false
    const now = new Date()
    const taskDate = new Date(`${task.dueDate}T${task.dueTime || '23:59:59'}`)
    return taskDate < now
  }

  // Filter & Sort tasks: Unfinished first, finished below
  const filteredTasks = useMemo(() => {
    let result = [...tasks]
    if (filter === 'pending') {
      result = result.filter((t) => !t.done)
    } else if (filter === 'completed') {
      result = result.filter((t) => t.done)
    }

    // Sort: pending first, then by createdAt descending
    return result.sort((a, b) => {
      if (a.done === b.done) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return a.done ? 1 : -1
    })
  }, [tasks, filter])

  // Toggle Done
  const toggleTask = (id: string) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    updateTasks(next)
  }

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingTask(null)
    setFormTitle('')
    setFormDueDate('')
    setFormDueTime('')
    setFormDuration('')
    setFormTag('Học tập')
    setTitleError('')
    setIsModalOpen(true)
  }

  // Open Modal for Edit
  const handleOpenEdit = (task: TodoItem) => {
    setEditingTask(task)
    setFormTitle(task.label)
    setFormDueDate(task.dueDate || '')
    setFormDueTime(task.dueTime || '')
    setFormDuration(task.duration || '')
    setFormTag(task.tag)
    setTitleError('')
    setIsModalOpen(true)
  }

  // Save Add/Edit
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanTitle = formTitle.trim()
    if (!cleanTitle) {
      setTitleError('Tiêu đề công việc không được để trống.')
      return
    }
    if (cleanTitle.length > 100) {
      setTitleError('Tiêu đề tối đa 100 ký tự.')
      return
    }

    // Format meta string
    const metaParts: string[] = []
    if (formDueDate) {
      metaParts.push(formDueTime ? `${formDueDate} • ${formDueTime}` : formDueDate)
    }
    if (formDuration) {
      metaParts.push(formDuration)
    }
    const metaStr = metaParts.length > 0 ? metaParts.join(' • ') : 'Công việc mới'

    if (editingTask) {
      // Update existing
      const next = tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              label: cleanTitle,
              meta: metaStr,
              tag: formTag,
              dueDate: formDueDate || undefined,
              dueTime: formDueTime || undefined,
              duration: formDuration || undefined,
            }
          : t
      )
      updateTasks(next)
    } else {
      // Add new
      const newTask: TodoItem = {
        id: `task-${Date.now()}`,
        label: cleanTitle,
        meta: metaStr,
        tag: formTag,
        done: false,
        dueDate: formDueDate || undefined,
        dueTime: formDueTime || undefined,
        duration: formDuration || undefined,
        createdAt: new Date().toISOString(),
      }
      updateTasks([newTask, ...tasks])
    }

    setIsModalOpen(false)
  }

  // Delete Task with Undo Toast
  const handleDeleteTask = (task: TodoItem) => {
    const index = tasks.findIndex((t) => t.id === task.id)
    const next = tasks.filter((t) => t.id !== task.id)
    updateTasks(next)

    // Store for undo
    setLastDeleted({ task, index })
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current)
    undoTimeoutRef.current = window.setTimeout(() => {
      setLastDeleted(null)
    }, 4500)
  }

  // Undo Delete
  const handleUndoDelete = () => {
    if (!lastDeleted) return
    const next = [...tasks]
    next.splice(lastDeleted.index, 0, lastDeleted.task)
    updateTasks(next)
    setLastDeleted(null)
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current)
  }

  // Clear all completed tasks (in Manage Mode)
  const handleClearCompleted = () => {
    if (completedCount === 0) return
    if (window.confirm(`Bạn có chắc chắn muốn xóa tất cả ${completedCount} việc đã hoàn thành không?`)) {
      const next = tasks.filter((t) => !t.done)
      updateTasks(next)
    }
  }

  return (
    <div className="todo-panel">
      {/* Top Header */}
      <div className="todo-head">
        <div>
          <h2>
            <span>✓</span> Việc cần làm
          </h2>
          <p className={`todo-head-desc ${pendingCount === 0 ? 'completed-all' : ''}`}>
            {pendingCount === 0
              ? '🎉 Bạn đã hoàn thành tất cả nhiệm vụ!'
              : `Bạn có ${pendingCount} nhiệm vụ trong tuần này`}
          </p>
        </div>

        <div className="todo-head-actions">
          <button
            type="button"
            className="todo-btn-primary"
            onClick={handleOpenAdd}
            aria-label="Thêm việc mới"
          >
            <span>+</span> Thêm việc
          </button>
          <button
            type="button"
            className="todo-btn-secondary"
            onClick={() => setIsManageMode(!isManageMode)}
          >
            {isManageMode ? '← Thu gọn' : 'Quản lý'}
          </button>
        </div>
      </div>

      {/* Management View Bar */}
      {isManageMode && (
        <div className="todo-manage-view">
          <div className="todo-manage-bar">
            <span style={{ fontSize: '0.85rem', color: '#475569' }}>
              Tổng cộng: <b>{tasks.length}</b> | Chưa xong: <b>{pendingCount}</b> | Đã xong: <b>{completedCount}</b>
            </span>
            {completedCount > 0 && (
              <button
                type="button"
                className="todo-clear-completed-btn"
                onClick={handleClearCompleted}
              >
                🗑 Xóa {completedCount} việc đã hoàn thành
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter Tabs Bar */}
      <div className="todo-filters-bar">
        <div className="todo-filter-pills" role="tablist">
          <button
            type="button"
            className={`todo-filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả ({tasks.length})
          </button>
          <button
            type="button"
            className={`todo-filter-pill ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Chưa xong ({pendingCount})
          </button>
          <button
            type="button"
            className={`todo-filter-pill ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Đã xong ({completedCount})
          </button>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="todo-empty-state">
          <div className="todo-empty-icon">📝</div>
          <p>
            {filter === 'completed'
              ? 'Chưa có công việc nào được hoàn thành.'
              : filter === 'pending'
              ? 'Tuyệt vời! Không còn công việc nào tồn đọng.'
              : 'Chưa có công việc nào. Hãy thêm việc để bắt đầu quản lý!'}
          </p>
          <button type="button" className="todo-btn-primary" onClick={handleOpenAdd}>
            + Thêm việc mới
          </button>
        </div>
      ) : (
        <div className="todo-list" role="list">
          {filteredTasks.map((task) => {
            const overdue = isOverdue(task)
            return (
              <div
                key={task.id}
                className={`todo-row ${task.done ? 'done' : ''} ${overdue ? 'overdue' : ''}`}
                role="listitem"
              >
                {/* Checkbox button */}
                <button
                  type="button"
                  className={`todo-check-btn ${task.done ? 'checked' : ''}`}
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.done ? `Đánh dấu chưa xong: ${task.label}` : `Hoàn thành: ${task.label}`}
                >
                  {task.done ? '✓' : ''}
                </button>

                {/* Content */}
                <div className="todo-content">
                  <span className="todo-label">{task.label}</span>
                  <div className="todo-meta">
                    <span>{task.meta}</span>
                    {overdue && <span className="todo-overdue-tag">⚠️ Quá hạn</span>}
                  </div>
                </div>

                {/* Tag Badge */}
                <span
                  className="todo-tag-badge"
                  style={{
                    color: TODO_TAG_COLORS[task.tag] || '#475569',
                    background: `${TODO_TAG_COLORS[task.tag] || '#64748b'}15`,
                  }}
                >
                  {task.tag}
                </span>

                {/* Row Actions: Edit, Delete */}
                <div className="todo-row-actions">
                  <button
                    type="button"
                    className="todo-icon-btn"
                    onClick={() => handleOpenEdit(task)}
                    title="Chỉnh sửa việc này"
                    aria-label={`Sửa: ${task.label}`}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="todo-icon-btn delete"
                    onClick={() => handleDeleteTask(task)}
                    title="Xóa việc này"
                    aria-label={`Xóa: ${task.label}`}
                  >
                    🗑
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="todo-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="todo-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="todo-modal-head">
              <h3>{editingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}</h3>
              <button
                type="button"
                className="todo-icon-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="todo-field">
                <label htmlFor="todo-title-input">
                  Tiêu đề công việc <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="todo-title-input"
                  type="text"
                  className={`todo-input ${titleError ? 'todo-input-error' : ''}`}
                  placeholder="Ví dụ: Ôn tập từ vựng IT Unit 4..."
                  maxLength={100}
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value)
                    if (titleError) setTitleError('')
                  }}
                  autoFocus
                />
                {titleError && <small className="todo-error-msg">{titleError}</small>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="todo-field">
                  <label htmlFor="todo-date-input">Hạn hoàn thành (Ngày):</label>
                  <input
                    id="todo-date-input"
                    type="date"
                    className="todo-input"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                  />
                </div>
                <div className="todo-field">
                  <label htmlFor="todo-time-input">Giờ hạn (nếu có):</label>
                  <input
                    id="todo-time-input"
                    type="time"
                    className="todo-input"
                    value={formDueTime}
                    onChange={(e) => setFormDueTime(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="todo-field">
                  <label htmlFor="todo-duration-input">Thời lượng ước tính:</label>
                  <input
                    id="todo-duration-input"
                    type="text"
                    className="todo-input"
                    placeholder="Ví dụ: 45 phút, 2h..."
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                  />
                </div>
                <div className="todo-field">
                  <label htmlFor="todo-tag-select">Nhãn phân loại:</label>
                  <select
                    id="todo-tag-select"
                    className="todo-input"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value as TodoTag)}
                  >
                    {TAG_OPTIONS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="todo-modal-actions">
                <button
                  type="button"
                  className="todo-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="todo-btn-primary">
                  {editingTask ? 'Lưu thay đổi' : 'Thêm công việc'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Undo Delete Toast */}
      {lastDeleted && (
        <div className="todo-toast-undo">
          <span>Đã xóa: <b>{lastDeleted.task.label}</b></span>
          <button type="button" className="todo-toast-undo-btn" onClick={handleUndoDelete}>
            Hoàn tác ↩
          </button>
        </div>
      )}
    </div>
  )
}
