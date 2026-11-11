import { useEffect, useState } from 'react'
import AuthPage from './AuthPage'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import PortfolioManager from './portfolio/PortfolioManager'
import { GuideCardItem } from './guides/types'
import { guideCards } from './guides/guideData'
import GuideModal from './guides/GuideModal'
import ActivityDecisionTool from './guide-tools/ActivityDecisionTool'
import WeeklyTimeBudgetTool from './guide-tools/WeeklyTimeBudgetTool'
import TodoManager from './todos/TodoManager'
import AiAssistantModal from './assistant/AiAssistantModal'
import './guides/guides.css'
import './guide-tools/guideTools.css'
import './todos/todos.css'
import './assistant/assistant.css'

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

const EVENT_STORAGE_KEY = 'student-event-hub-events-v1'
const EVENT_STATUS_FILTERS: EventFilterStatus[] = ['Tất cả', 'Đang diễn ra', 'Chuẩn bị', 'Sắp tới']

const defaultEvents: EventItem[] = [
  { id: 'default-1', title: 'Workshop: English for IT', date: '2026-10-12', status: 'Đang diễn ra', progress: 72, people: 32, color: 'orange' },
  { id: 'default-2', title: 'Seminar: AI & Ngôn ngữ', date: '2026-10-18', status: 'Chuẩn bị', progress: 45, people: 21, color: 'blue' },
  { id: 'default-3', title: 'Hackathon: Build Your Portfolio', date: '2026-10-24', status: 'Sắp tới', progress: 18, people: 12, color: 'purple' },
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
  const [showAuth, setShowAuth] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string; full_name?: string } | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('Tổng quan')
  const [showModal, setShowModal] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState<GuideCardItem | null>(null)
  const [activeTool, setActiveTool] = useState<'activity_decision' | 'time_budget' | null>(null)
  const [showAssistant, setShowAssistant] = useState(false)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [events, setEvents] = useState<EventItem[]>(getInitialEvents)
  const [modalForm, setModalForm] = useState<EventFormState>(emptyForm())
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<EventFormErrors>({})

  // Kiểm tra phiên đăng nhập từ Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          full_name: (session.user.user_metadata?.full_name as string) || session.user.email?.split('@')[0] || 'Sinh viên',
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          full_name: (session.user.user_metadata?.full_name as string) || session.user.email?.split('@')[0] || 'Sinh viên',
        })
      } else {
        setCurrentUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Tải danh sách sự kiện từ Supabase nếu đã cấu hình
  useEffect(() => {
    if (!isSupabaseConfigured) return

    async function fetchSupabaseEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true })

        if (!error && data && data.length > 0) {
          setEvents(
            data.map((item) => ({
              id: item.id,
              title: item.title,
              date: item.date,
              status: item.status,
              progress: Number(item.progress),
              people: Number(item.people),
              color: getStatusColor(item.status),
            }))
          )
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using local storage:', err)
      }
    }

    fetchSupabaseEvents()
  }, [])

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

    // Đồng bộ lên Supabase nếu có kết nối
    if (isSupabaseConfigured) {
      if (editingEventId) {
        supabase
          .from('events')
          .update({
            title: nextEvent.title,
            date: nextEvent.date,
            status: nextEvent.status,
            progress: nextEvent.progress,
            people: nextEvent.people,
            color: nextEvent.color,
          })
          .eq('id', editingEventId)
          .then(({ error }) => {
            if (error) console.warn('Supabase update event error:', error)
          })
      } else {
        supabase
          .from('events')
          .insert({
            title: nextEvent.title,
            date: nextEvent.date,
            status: nextEvent.status,
            progress: nextEvent.progress,
            people: nextEvent.people,
            color: nextEvent.color,
            user_id: currentUser?.id ?? null,
          })
          .select('id')
          .then(({ data, error }) => {
            if (!error && data?.[0]?.id) {
              setEvents((currentEvents) =>
                currentEvents.map((e) => (e.id === nextEvent.id ? { ...e, id: data[0].id } : e))
              )
            }
          })
      }
    }

    notify(editingEventId ? 'Đã cập nhật sự kiện thành công' : 'Đã tạo sự kiện mới thành công')
    closeModal()
  }

  const deleteEvent = (eventId: string, eventTitle: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sự kiện "${eventTitle}"?`)) {
      return
    }

    setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventId))

    if (isSupabaseConfigured) {
      supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .then(({ error }) => {
          if (error) console.warn('Supabase delete event error:', error)
        })
    }

    notify('Đã xóa sự kiện')
  }

  if (showAuth) {
    return <AuthPage onExplore={() => setShowAuth(false)} />
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-wrap">
          <div className="brand-mark">✦</div>
          <div>
            <div className="brand-name">LEEP<span>.</span></div>
            <small>Ngôn ngữ & CNTT</small>
          </div>
        </div>

        <div className="profile-mini">
          <div className="avatar">
            {currentUser?.full_name ? currentUser.full_name.slice(0, 2).toUpperCase() : 'LT'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <b style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.full_name || 'Seven Cactus'}
            </b>
            <small style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.email || 'Sinh viên • K18'}
            </small>
          </div>
          {currentUser && (
            <button
              type="button"
              title="Đăng xuất"
              onClick={() => {
                supabase.auth.signOut()
                setCurrentUser(null)
                notify('Đã đăng xuất')
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(237, 244, 255, 0.6)',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '4px',
              }}
            >
              ⎋
            </button>
          )}
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
        </nav>

        <div className="help-card" onClick={() => setShowAssistant(true)} style={{ cursor: 'pointer' }}>
          <span>💡</span>
          <div>
            <b>Cần hỗ trợ?</b>
            <small>Trò chuyện với Trợ lý AI LEEP</small>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setShowAssistant(true); }}>Mở</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">Workspace <span>/</span> <b>{activeTab}</b></div>
          <div className="top-actions">
            <button className="primary-btn" onClick={openCreateModal}>+ Tạo mới</button>
            <button className="secondary-btn" onClick={() => setShowAuth(true)}>Đăng nhập</button>
          </div>
        </header>

        {activeTab === 'Tổng quan' ? (
          <Dashboard
            userName={currentUser?.full_name}
            events={events}
            onCreate={openCreateModal}
            onEdit={openEditModal}
            onDelete={deleteEvent}
            onNotify={notify}
            onSelectGuide={(guide) => {
              setActiveTab('Cẩm nang')
              setSelectedGuide(guide)
            }}
            onNavigateTab={setActiveTab}
          />
        ) : activeTab === 'Portfolio' ? (
          <PortfolioManager
            events={events}
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
            onSelectGuide={setSelectedGuide}
            onOpenTool={(tool) => setActiveTool(tool)}
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

      {selectedGuide && (
        <GuideModal
          guide={selectedGuide}
          onClose={() => setSelectedGuide(null)}
          onOpenTool={(tool) => {
            setSelectedGuide(null)
            setActiveTool(tool)
          }}
          onNavigateTab={(tab) => {
            setActiveTab(tab)
          }}
        />
      )}

      {activeTool === 'activity_decision' && (
        <div className="guide-tool-modal-backdrop" onClick={() => setActiveTool(null)}>
          <div className="guide-tool-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <ActivityDecisionTool onClose={() => setActiveTool(null)} />
          </div>
        </div>
      )}

      {activeTool === 'time_budget' && (
        <div className="guide-tool-modal-backdrop" onClick={() => setActiveTool(null)}>
          <div className="guide-tool-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <WeeklyTimeBudgetTool onClose={() => setActiveTool(null)} />
          </div>
        </div>
      )}

      {showAssistant && (
        <AiAssistantModal
          onClose={() => setShowAssistant(false)}
          onNavigateTab={(tab) => {
            setActiveTab(tab)
          }}
        />
      )}

      {toast && <div className="toast">✓ &nbsp; {toast}</div>}
    </div>
  )
}

function Dashboard({
  userName,
  events,
  onCreate,
  onEdit,
  onDelete,
  onNotify,
  onSelectGuide,
  onNavigateTab,
}: {
  userName?: string
  events: EventItem[]
  onCreate: () => void
  onEdit: (event: EventItem) => void
  onDelete: (id: string, title: string) => void
  onNotify: (message: string) => void
  onSelectGuide: (guide: GuideCardItem) => void
  onNavigateTab?: (tab: Tab) => void
}) {
  return (
    <div className="page">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">THỨ BA, 22 THÁNG 9, 2026</p>
          <h1>Chào bạn, {userName || 'Sinh viên'} <span>👋</span></h1>
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
            <button
              className="link-btn"
              onClick={() => {
                if (onNavigateTab) {
                  onNavigateTab('Sự kiện')
                } else {
                  onNotify('Đã mở danh sách sự kiện')
                }
              }}
            >
              Xem tất cả
            </button>
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
              <h2>Cẩm nang sinh viên năm nhất</h2>
              <p className="muted">Cân bằng học tập, điểm số và trải nghiệm thực tế</p>
            </div>
            {onNavigateTab && (
              <button
                type="button"
                className="guide-quick-switch-btn"
                onClick={() => onNavigateTab('Cẩm nang')}
              >
                Mở Cẩm nang →
              </button>
            )}
          </div>

          <div className="guide-grid">
            {guideCards.slice(0, 4).map((card) => (
              <div
                key={card.title}
                className={`guide-card ${card.color}`}
                onClick={() => onSelectGuide(card)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectGuide(card)}
              >
                <div>
                  <span>{card.icon}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
                <div className="guide-card-footer">
                  <small>{card.tag}</small>
                  <button
                    type="button"
                    className="guide-card-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectGuide(card)
                    }}
                  >
                    Xem chi tiết ↗
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px', width: '100%' }}>
        <TodoManager />
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

function renderStatHighlight(text: string) {
  const parts = text.split(/(\d+(?:\.\d+)?%|\d+(?:\.\d+)?\s*(?:giờ\/đêm|h\/đêm))/g)
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <strong key={index} className="guide-stat__num">
          {part}
        </strong>
      )
    }
    return part
  })
}

function SectionPage({
  tab,
  events,
  onCreate,
  onEdit,
  onDelete,
  onNotify,
  onSelectGuide,
  onOpenTool,
  search,
}: {
  tab: Tab
  events: EventItem[]
  onCreate: () => void
  onEdit: (event: EventItem) => void
  onDelete: (id: string, title: string) => void
  onNotify: (message: string) => void
  onSelectGuide: (guide: GuideCardItem) => void
  onOpenTool?: (tool: 'activity_decision' | 'time_budget') => void
  search: string
}) {
  const [eventSearch, setEventSearch] = useState('')
  const [eventStatusFilter, setEventStatusFilter] = useState<EventFilterStatus>('Tất cả')

  const title =
    tab === 'Sự kiện'
      ? 'Quản lý sự kiện học tập'
      : tab === 'Cẩm nang'
        ? 'Cẩm nang sinh viên năm nhất'
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
    const balanceCards = displayCards.filter((card) => card.category === 'balance')
    const careerCards = displayCards.filter((card) => card.category === 'career')

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
            <h2>Cẩm nang sinh viên năm nhất (Freshman Balance Hub)</h2>
            <p className="muted">
              Những khó khăn thực tế khi vừa học, vừa xây dựng trải nghiệm ở năm nhất, dựa trên khảo sát 120 sinh viên và 4 buổi phỏng vấn của nhóm.
            </p>
          </div>

          {/* NHÓM 1: Cân bằng học tập – trải nghiệm */}
          <div className="guide-section-group">
            <div className="guide-group-head">
              <div>
                <h2>⚖️ Cân bằng học tập – trải nghiệm</h2>
                <p className="guide-group-desc">
                  Giải quyết các thách thức về thời gian, GPA, lựa chọn hoạt động và sức khỏe tinh thần năm nhất.
                </p>
              </div>
              <span className="guide-group-badge">Khảo sát 120 sinh viên</span>
            </div>

            <div className="guide-grid full">
              {balanceCards.map((card) => (
                <div
                  key={card.id || card.title}
                  className={`guide-card guide-card--balance ${card.color}`}
                  onClick={() => onSelectGuide(card)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectGuide(card)}
                >
                  <div className="guide-card__body">
                    <span>{card.icon}</span>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                    {card.statHighlight && (
                      <div className="guide-stat">
                        <div className="guide-stat__icon" aria-hidden="true">📊</div>
                        <div className="guide-stat__text">
                          {renderStatHighlight(card.statHighlight)}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="guide-card-footer">
                    <small>{card.tag}</small>
                    <button
                      type="button"
                      className="guide-card-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectGuide(card)
                      }}
                    >
                      Xem chi tiết ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NHÓM 2: Kỹ năng theo ngành (Giữ nguyên 3 thẻ) */}
          <div className="guide-section-group" style={{ marginTop: '36px' }}>
            <div className="guide-group-head">
              <div>
                <h2>🚀 Kỹ năng theo ngành</h2>
                <p className="guide-group-desc">
                  Kỹ năng chuyên môn nền tảng cho sinh viên ngành Ngôn ngữ & Công nghệ thông tin.
                </p>
              </div>
              <span className="guide-group-badge">Kỹ năng cốt lõi</span>
            </div>

            <div className="guide-grid full">
              {careerCards.map((card) => (
                <div
                  key={card.id || card.title}
                  className={`guide-card ${card.color}`}
                  onClick={() => onSelectGuide(card)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectGuide(card)}
                >
                  <div>
                    <span>{card.icon}</span>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                  <div className="guide-card-footer">
                    <small>{card.tag}</small>
                    <button
                      type="button"
                      className="guide-card-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectGuide(card)
                      }}
                    >
                      Xem chi tiết ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BANNER 2 CÔNG CỤ NHỎ (A4) */}
          {onOpenTool && (
            <div className="guide-tools-banner">
              <div className="guide-tools-banner-info">
                <h3>🛠️ Công cụ hỗ trợ sinh viên năm nhất (Freshman Balance Tools)</h3>
                <p>Chạy trực tiếp trên trình duyệt, dữ liệu lưu trên thiết bị của bạn, không gửi lên máy chủ.</p>
              </div>
              <div className="guide-tools-banner-actions">
                <button
                  type="button"
                  className="guide-tool-banner-btn"
                  onClick={() => onOpenTool('activity_decision')}
                >
                  🎯 Bảng kiểm nhận hoạt động
                </button>
                <button
                  type="button"
                  className="guide-tool-banner-btn"
                  onClick={() => onOpenTool('time_budget')}
                >
                  ⏱️ Ước lượng quỹ thời gian tuần
                </button>
              </div>
            </div>
          )}
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
