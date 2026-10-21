import { useEffect, useState } from 'react'

type Tab = 'Tổng quan' | 'Sự kiện' | 'Cẩm nang' | 'Portfolio' | 'Lịch của tôi'
type EventStatus = 'Đang diễn ra' | 'Chuẩn bị' | 'Sắp tới'
type EventColor = 'orange' | 'blue' | 'purple'
type EventFilterStatus = 'Tất cả' | EventStatus

type EventItem = {
  id: string
  title: string
  date: string
  status: EventStatus
  progress: number
  people: number
  color: EventColor
}

type EventFormState = {
  title: string
  date: string
  status: EventStatus
  people: string
  progress: string
}

type EventFormErrors = Partial<Record<keyof EventFormState, string>>

const guideCards = [
  {
    icon: '🧠',
    title: 'Tiếng Anh chuyên ngành',
    text: 'Sinh viên ngành Ngôn ngữ & CNTT thường mất thời gian khi đọc tài liệu kỹ thuật, tham gia seminar bằng tiếng Anh và viết báo cáo dự án. Đây là điểm mấu chốt giúp bạn giao tiếp chuyên nghiệp trong môi trường công nghệ.',
    color: 'orange',
    tag: 'English for IT',
  },
  {
    icon: '💻',
    title: 'Lập trình & AI',
    text: 'Việc học code, AI, GitHub và công cụ hỗ trợ vẫn là thách thức lớn đối với sinh viên mới. Cần xây dựng nền tảng kỹ năng từ cơ bản đến nâng cao.',
    color: 'purple',
    tag: 'Coding + AI',
  },
  {
    icon: '🤝',
    title: 'Làm việc nhóm',
    text: 'Nhiều bạn gặp khó khăn khi phối hợp trong dự án, phân công công việc, thuyết trình và xử lý mâu thuẫn giữa các thành viên trong nhóm.',
    color: 'green',
    tag: 'Teamwork',
  },
  {
    icon: '📦',
    title: 'Portfolio & dự án cá nhân',
    text: 'Sinh viên cần có sản phẩm rõ ràng để chứng minh kỹ năng: project, case study, GitHub, CV, video demo và bài viết giới thiệu công việc.',
    color: 'red',
    tag: 'Portfolio',
  },
  {
    icon: '⏱️',
    title: 'Quản lý thời gian',
    text: 'Việc vừa học lập trình, vừa luyện tiếng Anh, vừa tham gia hoạt động xã hội khiến nhiều bạn mất cân bằng học tập và sức khỏe.',
    color: 'blue',
    tag: 'Study Life',
  },
  {
    icon: '🚀',
    title: 'Kỹ năng nghề nghiệp',
    text: 'Sinh viên cần hiểu rõ về CV, kỹ năng phỏng vấn, internship, networking và cách chuẩn bị cho môi trường làm việc thực tế.',
    color: 'cyan',
    tag: 'Career',
  },
]

const EVENT_STORAGE_KEY = 'student-event-hub-events-v1'
const EVENT_STATUS_FILTERS: EventFilterStatus[] = ['Tất cả', 'Đang diễn ra', 'Chuẩn bị', 'Sắp tới']

const defaultEvents: EventItem[] = [
  { id: 'default-1', title: 'Workshop: English for IT', date: '2026-10-12', status: 'Đang diễn ra', progress: 72, people: 32, color: 'orange' },
  { id: 'default-2', title: 'Seminar: AI & Ngôn ngữ', date: '2026-10-18', status: 'Chuẩn bị', progress: 45, people: 21, color: 'blue' },
  { id: 'default-3', title: 'Hackathon: Build Your Portfolio', date: '2026-10-24', status: 'Sắp tới', progress: 18, people: 12, color: 'purple' },
]

const tasks = [
  { label: 'Hoàn thiện portfolio dự án AI', meta: 'Hôm nay • 2h', tag: 'Portfolio', done: true },
  { label: 'Luyện IELTS chuyên ngành CNTT', meta: '2:00 PM • 45 phút', tag: 'Tiếng Anh', done: false },
  { label: 'Chuẩn bị slide thuyết trình nhóm', meta: 'Tuần này • 1 bài', tag: 'Nhóm', done: false },
  { label: 'Nộp bài tập ngôn ngữ học số', meta: 'Hạn chót 18:00', tag: 'Học tập', done: false },
]

const portfolioItems = [
  { title: 'Website Portfolio cá nhân', description: 'Trang giới thiệu bản thân, dự án, kỹ năng và contact.', status: 'Đang phát triển' },
  { title: 'AI Assistant for Students', description: 'Ứng dụng hỗ trợ học tập, lên kế hoạch và ôn tập hiệu quả.', status: 'Prototype' },
  { title: 'Case study: English for IT', description: 'Nghiên cứu cách sử dụng tiếng Anh trong môi trường lập trình và công nghệ.', status: 'Chuẩn bị' },
]

const emptyForm = (): EventFormState => ({
  title: '',
  date: '',
  status: 'Đang diễn ra',
  people: '',
  progress: '',
})

const getStatusColor = (status: EventStatus): EventColor => {
  switch (status) {
    case 'Đang diễn ra':
      return 'orange'
    case 'Chuẩn bị':
      return 'blue'
    case 'Sắp tới':
      return 'purple'
    default:
      return 'orange'
  }
}

const formatEventDate = (value: string): string => {
  const normalizedValue = value.includes('-') ? value : value.replace(/\//g, '-')
  const date = new Date(`${normalizedValue}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const normalizeText = (value: string): string => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const getInitialEvents = (): EventItem[] => {
  if (typeof window === 'undefined') {
    return defaultEvents
  }

  try {
    const saved = window.localStorage.getItem(EVENT_STORAGE_KEY)

    if (!saved) {
      return defaultEvents
    }

    const parsed = JSON.parse(saved) as EventItem[]

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultEvents
    }

    return parsed.map((event) => ({
      ...event,
      progress: Number(event.progress),
      people: Number(event.people),
      color: getStatusColor(event.status),
    }))
  } catch {
    return defaultEvents
  }
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Tổng quan')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [events, setEvents] = useState<EventItem[]>(getInitialEvents)
  const [modalForm, setModalForm] = useState<EventFormState>(emptyForm())
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<EventFormErrors>({})

  useEffect(() => {
    window.localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(events))
  }, [events])

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const openCreateModal = () => {
    setEditingEventId(null)
    setModalForm(emptyForm())
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (event: EventItem) => {
    setEditingEventId(event.id)
    setModalForm({
      title: event.title,
      date: event.date,
      status: event.status,
      people: String(event.people),
      progress: String(event.progress),
    })
    setFormErrors({})
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setFormErrors({})
    setEditingEventId(null)
  }

  const validateForm = (form: EventFormState): EventFormErrors => {
    const nextErrors: EventFormErrors = {}

    if (!form.title.trim()) {
      nextErrors.title = 'Vui lòng nhập tên sự kiện.'
    }

    if (!form.date) {
      nextErrors.date = 'Vui lòng chọn ngày diễn ra.'
    }

    if (form.people.trim() && Number(form.people) < 0) {
      nextErrors.people = 'Số người tham gia không hợp lệ.'
    }

    if (form.progress === '' || Number.isNaN(Number(form.progress))) {
      nextErrors.progress = 'Vui lòng nhập tiến độ.'
    } else {
      const progressValue = Number(form.progress)
      if (progressValue < 0 || progressValue > 100) {
        nextErrors.progress = 'Tiến độ phải từ 0 đến 100.'
      }
    }

    return nextErrors
  }

  const saveEvent = () => {
    const errors = validateForm(modalForm)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    const nextEvent: EventItem = {
      id: editingEventId ?? `event-${Date.now()}`,
      title: modalForm.title.trim(),
      date: modalForm.date,
      status: modalForm.status,
      progress: Number(modalForm.progress),
      people: Number(modalForm.people || 0),
      color: getStatusColor(modalForm.status),
    }

    setEvents((currentEvents) => {
      if (editingEventId) {
        return currentEvents.map((event) => (event.id === editingEventId ? nextEvent : event))
      }

      return [nextEvent, ...currentEvents]
    })

    notify(editingEventId ? 'Đã cập nhật sự kiện thành công' : 'Đã tạo sự kiện mới thành công')
    closeModal()
  }

  const deleteEvent = (eventId: string, eventTitle: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sự kiện "${eventTitle}"?`)) {
      return
    }

    setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventId))
    notify('Đã xóa sự kiện')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-wrap">
          <div className="brand-mark">✦</div>
          <div>
            <div className="brand-name">Lang<span>IT</span></div>
            <small>Ngôn ngữ & CNTT</small>
          </div>
        </div>

        <div className="profile-mini">
          <div className="avatar">LT</div>
          <div>
            <b>Seven Cactus</b>
            <small>Sinh viên • K18</small>
          </div>
          <span>⌄</span>
        </div>

        <nav className="nav">
          <p className="nav-label">Workspace</p>
          {(['Tổng quan', 'Sự kiện', 'Cẩm nang', 'Portfolio'] as Tab[]).map((item) => (
            <button
              key={item}
              className={`nav-item ${activeTab === item ? 'active' : ''}`}
              onClick={() => setActiveTab(item)}
            >
              <span>{item === 'Tổng quan' ? '◫' : item === 'Sự kiện' ? '▣' : item === 'Cẩm nang' ? '✦' : '◌'}</span>
              {item}
            </button>
          ))}

          <p className="nav-label space">Cá nhân</p>
          <button className={`nav-item ${activeTab === 'Lịch của tôi' ? 'active' : ''}`} onClick={() => setActiveTab('Lịch của tôi')}>
            <span>□</span>
            Lịch của tôi
          </button>
          <button className="nav-item" onClick={() => notify('Đã mở phần cơ hội')}><span>♢</span>Cơ hội</button>
        </nav>

        <div className="help-card">
          <span>💡</span>
          <div>
            <b>Cần hỗ trợ?</b>
            <small>Xem hướng dẫn sử dụng Hub</small>
          </div>
          <button onClick={() => notify('Đã mở hướng dẫn hỗ trợ')}>Mở</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">Workspace <span>/</span> <b>{activeTab}</b></div>
          <div className="top-actions">
            <label className="search-box">
              <span>⌕</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm kiếm..." />
            </label>
            <button className="primary-btn" onClick={openCreateModal}>+ Tạo mới</button>
          </div>
        </header>

        {activeTab === 'Tổng quan' ? (
          <Dashboard
            events={events}
            onCreate={openCreateModal}
            onEdit={openEditModal}
            onDelete={deleteEvent}
            onNotify={notify}
          />
        ) : (
          <SectionPage
            tab={activeTab}
            events={events}
            search={search}
            onCreate={openCreateModal}
            onEdit={openEditModal}
            onDelete={deleteEvent}
            onNotify={notify}
          />
        )}
      </main>

      {showModal && (
        <CreateModal
          form={modalForm}
          errors={formErrors}
          isEditing={Boolean(editingEventId)}
          onChange={setModalForm}
          onClose={closeModal}
          onSubmit={saveEvent}
        />
      )}

      {toast && <div className="toast">✓ &nbsp; {toast}</div>}
    </div>
  )
}

function Dashboard({
  events,
  onCreate,
  onEdit,
  onDelete,
  onNotify,
}: {
  events: EventItem[]
  onCreate: () => void
  onEdit: (event: EventItem) => void
  onDelete: (id: string, title: string) => void
  onNotify: (message: string) => void
}) {
  return (
    <div className="page">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">THỨ BA, 22 THÁNG 9, 2026</p>
          <h1>Chào bạn, Seven <span>👋</span></h1>
          <p className="muted">
            Bạn đang trên hành trình trở thành sinh viên ngành Ngôn ngữ & CNTT với nhiều thách thức thực tế:
            kỹ năng tiếng Anh, lập trình, AI, làm việc nhóm và xây dựng portfolio cá nhân.
          </p>
        </div>
        <button className="primary-btn" onClick={onCreate}>+ Tạo hoạt động mới</button>
      </div>

      <div className="stats-grid">
        <Stat icon="◷" title="Nhiệm vụ hôm nay" value="07" note="2 việc cần ưu tiên" tone="orange" />
        <Stat icon="◉" title="Sự kiện đang theo dõi" value={String(events.length)} note="1 sự kiện sắp diễn ra" tone="blue" />
        <Stat icon="◈" title="Dự án cá nhân" value="04" note="2 dự án đang hoàn thiện" tone="green" />
      </div>

      <div className="content-grid two-col">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Sự kiện của tôi</h2>
              <p className="muted">Theo dõi tiến độ các hoạt động học tập và dự án</p>
            </div>
            <button className="link-btn" onClick={() => onNotify('Đã mở danh sách sự kiện')}>Xem tất cả</button>
          </div>

          <div className="event-list">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Những câu hỏi thường gặp</h2>
              <p className="muted">Gợi ý nhanh cho quá trình học tập và nghề nghiệp</p>
            </div>
          </div>

          <div className="guide-grid">
            {guideCards.slice(0, 4).map((card) => (
              <div key={card.title} className={`guide-card ${card.color}`}>
                <span>{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <small>{card.tag}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="content-grid lower-grid">
        <div className="panel tasks-panel">
          <div className="panel-head">
            <div>
              <h2>Việc cần làm</h2>
              <p className="muted">Bạn có 4 nhiệm vụ trong tuần này</p>
            </div>
            <button className="link-btn" onClick={() => onNotify('Đã mở mục việc cần làm')}>Quản lý</button>
          </div>

          {tasks.map((task) => (
            <TaskCard key={task.label} label={task.label} meta={task.meta} tag={task.tag} done={task.done} />
          ))}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Portfolio</h2>
              <p className="muted">Các dự án bạn đang xây dựng để chứng minh năng lực</p>
            </div>
          </div>

          <div className="portfolio-list">
            {portfolioItems.map((item) => (
              <div key={item.title} className="portfolio-item">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="status-pill">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, title, value, note, tone }: { icon: string; title: string; value: string; note: string; tone: string }) {
  return (
    <div className="stat-box">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div>
        <h3>{value}</h3>
        <p>{title}</p>
        <small>{note}</small>
      </div>
    </div>
  )
}

function TaskCard({ label, meta, tag, done }: { label: string; meta: string; tag: string; done: boolean }) {
  const [checked, setChecked] = useState(done)

  return (
    <div className={`task-row ${checked ? 'done' : ''}`}>
      <button className={`check-btn ${checked ? 'on' : ''}`} onClick={() => setChecked(!checked)}>{checked ? '✓' : ''}</button>
      <div className="task-content">
        <strong>{label}</strong>
        <small>{meta}</small>
      </div>
      <span className="task-tag">{tag}</span>
    </div>
  )
}

function SectionPage({
  tab,
  events,
  onCreate,
  onEdit,
  onDelete,
  onNotify,
  search,
}: {
  tab: Tab
  events: EventItem[]
  onCreate: () => void
  onEdit: (event: EventItem) => void
  onDelete: (id: string, title: string) => void
  onNotify: (message: string) => void
  search: string
}) {
  const [eventSearch, setEventSearch] = useState('')
  const [eventStatusFilter, setEventStatusFilter] = useState<EventFilterStatus>('Tất cả')

  const title =
    tab === 'Sự kiện'
      ? 'Quản lý sự kiện học tập'
      : tab === 'Cẩm nang'
        ? 'Cẩm nang sinh viên Ngôn ngữ & CNTT'
        : tab === 'Lịch của tôi'
          ? 'Lịch của tôi'
          : 'Portfolio & kết quả học tập'

  const filteredGuideCards = guideCards.filter((item) => {
    const haystack = normalizeText(`${item.title} ${item.text}`)
    return haystack.includes(normalizeText(search))
  })

  const displayCards = search ? filteredGuideCards : guideCards

  const filteredEvents = events.filter((event) => {
    const matchesStatus = eventStatusFilter === 'Tất cả' || event.status === eventStatusFilter
    const matchesSearch = !eventSearch || normalizeText(event.title).includes(normalizeText(eventSearch))
    return matchesStatus && matchesSearch
  })

  if (tab === 'Sự kiện') {
    return (
      <div className="page">
        <div className="section-header">
          <div>
            <p className="eyebrow">SỰ KIỆN</p>
            <h1>{title}</h1>
          </div>
          <button className="primary-btn" onClick={onCreate}>+ Tạo mới</button>
        </div>

        <div className="panel section-panel">
          <div className="panel-head">
            <div>
              <h2>Sự kiện của tôi</h2>
              <p className="muted">Theo dõi và quản lý các sự kiện học tập của bạn</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '18px', alignItems: 'center' }}>
            <label className="search-box" style={{ flex: '1 1 220px', minWidth: '220px', maxWidth: '360px' }}>
              <span>⌕</span>
              <input
                value={eventSearch}
                onChange={(event) => setEventSearch(event.target.value)}
                placeholder="Tìm kiếm sự kiện theo tên..."
              />
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {EVENT_STATUS_FILTERS.map((status) => {
                const isSelected = status === eventStatusFilter
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setEventStatusFilter(status)}
                    style={{
                      border: '1px solid rgba(148, 163, 184, 0.4)',
                      borderRadius: '999px',
                      padding: '8px 12px',
                      background: isSelected ? '#1d4ed8' : '#f8fafc',
                      color: isSelected ? '#fff' : '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {status}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="event-list">
            {filteredEvents.length === 0 ? (
              <div className="empty-state" style={{ padding: '18px', color: '#64748b' }}>
                Không có sự kiện nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} />
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  if (tab === 'Lịch của tôi') {
    const orderedEvents = [...events].sort((first, second) => new Date(first.date).getTime() - new Date(second.date).getTime())

    return (
      <div className="page">
        <div className="section-header">
          <div>
            <p className="eyebrow">LỊCH</p>
            <h1>{title}</h1>
          </div>
          <button className="primary-btn" onClick={onCreate}>+ Tạo mới</button>
        </div>

        <div className="panel section-panel">
          <div className="panel-head">
            <div>
              <h2>Danh sách sự kiện của tôi</h2>
              <p className="muted">Tất cả việc đã tạo và lưu trong hệ thống được hiển thị ở đây</p>
            </div>
          </div>

          <div className="event-list">
            {orderedEvents.map((event) => (
              <EventCard key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (tab === 'Cẩm nang') {
    return (
      <div className="page">
        <div className="section-header">
          <div>
            <p className="eyebrow">CẨM NANG</p>
            <h1>{title}</h1>
          </div>
          <button className="primary-btn" onClick={onCreate}>+ Tạo mới</button>
        </div>

        <div className="panel section-panel">
          <div className="section-intro">
            <h2>Khó khăn thực tế của sinh viên ngành Ngôn ngữ & Công nghệ thông tin</h2>
            <p className="muted">
              Đây là những vấn đề mà sinh viên thường gặp trong quá trình học tập và phát triển nghề nghiệp: mất cân bằng kỹ năng,
              áp lực mới với công nghệ, khả năng giao tiếp bằng tiếng Anh và việc xây dựng hồ sơ năng lực cá nhân.
            </p>
          </div>

          <div className="guide-grid full">
            {displayCards.map((card) => (
              <div key={card.title} className={`guide-card ${card.color}`}>
                <span>{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <small>{card.tag}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <p className="eyebrow">{tab.toUpperCase()}</p>
          <h1>{title}</h1>
        </div>
        <button className="primary-btn" onClick={onCreate}>+ Tạo mới</button>
      </div>

      <div className="panel section-panel">
        <div className="panel-head">
          <div>
            <h2>Gợi ý nâng cấp hồ sơ</h2>
            <p className="muted">Bạn có thể xây dựng hồ sơ sáng tạo và chuyên nghiệp hơn</p>
          </div>
        </div>

        <div className="portfolio-list">
          {portfolioItems.map((item) => (
            <div key={item.title} className="portfolio-item">
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <span className="status-pill">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EventCard({
  event,
  onEdit,
  onDelete,
}: {
  event: EventItem
  onEdit: (event: EventItem) => void
  onDelete: (id: string, title: string) => void
}) {
  return (
    <div className="event-card">
      <div className="event-card-header">
        <div className="event-top">
          <span className={`dot ${event.color}`} />
          <small>{event.status}</small>
        </div>

        <div className="event-actions">
          <button
            className="event-action-btn"
            type="button"
            aria-label={`Sửa sự kiện ${event.title}`}
            onClick={() => onEdit(event)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M13.76 3.77a1.7 1.7 0 1 1 2.4 2.4l-8.2 8.2-3.2.8.8-3.2 8.2-8.2Zm-8.88 9.78 2.88.72.72 2.88-2.6-2.6-.99-.99Z" fill="currentColor" />
            </svg>
            <span>Sửa</span>
          </button>
          <button
            className="event-action-btn delete"
            type="button"
            aria-label={`Xóa sự kiện ${event.title}`}
            onClick={() => onDelete(event.id, event.title)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M6.5 4.5v-1h7v1h3.5v1.5h-1.3l-.9 10.1a1.5 1.5 0 0 1-1.5 1.3H7.2a1.5 1.5 0 0 1-1.5-1.3L4.8 6H3.5V4.5h3Zm1.5 1.5h4.1l.8 9.1H7.2l.8-9.1Zm1.1-2V4h2v.1h-2Z" fill="currentColor" />
            </svg>
            <span>Xóa</span>
          </button>
        </div>
      </div>

      <h3>{event.title}</h3>
      <p>{formatEventDate(event.date)}</p>
      <div className="progress-bar">
        <span style={{ width: `${Math.min(100, Math.max(0, event.progress))}%` }} />
      </div>
      <div className="event-meta">
        <span>{event.people} người tham gia</span>
        <span>{event.progress}%</span>
      </div>
    </div>
  )
}

function CreateModal({
  form,
  errors,
  isEditing,
  onChange,
  onClose,
  onSubmit,
}: {
  form: EventFormState
  errors: EventFormErrors
  isEditing: boolean
  onChange: (value: EventFormState) => void
  onClose: () => void
  onSubmit: () => void
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <h3>{isEditing ? 'Chỉnh sửa sự kiện' : 'Tạo hoạt động mới'}</h3>
          <button type="button" aria-label="Đóng modal" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label htmlFor="event-name">Tên sự kiện</label>
          <input
            id="event-name"
            className="form-control"
            value={form.title}
            onChange={(event) => onChange({ ...form, title: event.target.value })}
            placeholder="Ví dụ: Workshop AI & Ngôn ngữ"
          />
          {errors.title && <small className="field-error">{errors.title}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="event-date">Ngày</label>
          <input
            id="event-date"
            className="form-control form-date-input"
            type="date"
            value={form.date}
            onChange={(event) => onChange({ ...form, date: event.target.value })}
          />
          {errors.date && <small className="field-error">{errors.date}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="event-status">Trạng thái</label>
          <select
            id="event-status"
            className="form-control form-select"
            value={form.status}
            onChange={(event) => onChange({ ...form, status: event.target.value as EventStatus })}
          >
            <option value="Đang diễn ra">Đang diễn ra</option>
            <option value="Chuẩn bị">Chuẩn bị</option>
            <option value="Sắp tới">Sắp tới</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="event-people">Số người tham gia</label>
          <input
            id="event-people"
            className="form-control"
            type="number"
            min={0}
            step={1}
            value={form.people}
            onChange={(event) => onChange({ ...form, people: event.target.value })}
            placeholder="0"
          />
          {errors.people && <small className="field-error">{errors.people}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="event-progress">Tiến độ (%)</label>
          <input
            id="event-progress"
            className="form-control"
            type="number"
            min={0}
            max={100}
            step={1}
            value={form.progress}
            onChange={(event) => onChange({ ...form, progress: event.target.value })}
            placeholder="0"
          />
          {errors.progress && <small className="field-error">{errors.progress}</small>}
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>Hủy</button>
          <button type="button" className="primary-btn" onClick={onSubmit}>{isEditing ? 'Cập nhật' : 'Lưu'}</button>
        </div>
      </div>
    </div>
  )
}

export default App
