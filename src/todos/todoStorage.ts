import { TodoItem } from './types'

const STORAGE_KEY = 'leep_dashboard_tasks_v1'
const CURRENT_VERSION = 1

type StoredPayload = {
  version: number
  tasks: TodoItem[]
}

const DEFAULT_TASKS: TodoItem[] = [
  {
    id: 'default-task-1',
    label: 'Hoàn thiện portfolio dự án AI',
    meta: 'Hôm nay • 2h',
    tag: 'Portfolio',
    done: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-task-2',
    label: 'Luyện IELTS chuyên ngành CNTT',
    meta: '2:00 PM • 45 phút',
    tag: 'Tiếng Anh',
    done: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-task-3',
    label: 'Chuẩn bị slide thuyết trình nhóm',
    meta: 'Tuần này • 1 bài',
    tag: 'Nhóm',
    done: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-task-4',
    label: 'Nộp bài tập ngôn ngữ học số',
    meta: 'Hạn chót 18:00',
    tag: 'Học tập',
    done: false,
    createdAt: new Date().toISOString(),
  },
]

export function loadSavedTasks(): TodoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      saveTasksToStorage(DEFAULT_TASKS)
      return DEFAULT_TASKS
    }
    const parsed = JSON.parse(raw) as StoredPayload
    if (parsed && Array.isArray(parsed.tasks)) {
      return parsed.tasks
    }
  } catch (err) {
    console.error('Lỗi khi đọc danh sách việc cần làm:', err)
  }
  return DEFAULT_TASKS
}

export function saveTasksToStorage(tasks: TodoItem[]): boolean {
  try {
    const payload: StoredPayload = {
      version: CURRENT_VERSION,
      tasks,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return true
  } catch (err) {
    console.error('Lỗi khi lưu danh sách việc cần làm:', err)
    return false
  }
}

