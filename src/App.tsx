import { useState } from 'react'

type Tab = 'Tổng quan' | 'Sự kiện' | 'Cẩm nang' | 'Portfolio'

const guideCards = [
  {
    icon: '🧠',
    title: 'Tiếng Anh chuyên ngành',
    text: 'Sinh viên ngành Ngôn ngữ & CNTT thường mất thời gian khi đọc tài liệu kỹ thuật, tham gia seminar bằng tiếng Anh và viết báo cáo dự án. Đây là điểm yếu lớn cần được rèn luyện liên tục.',
    color: 'orange',
    tag: 'English for IT',
  },
  {
    icon: '💻',
    title: 'Lập trình & AI',
    text: 'Việc học code, AI, GitHub và công cụ hỗ trợ vẫn là thách thức lớn đối với sinh viên mới. Cần xây dựng nền tảng kỹ năng từ cơ bản đến thực hành dự án.',
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

const events = [
  { title: 'Workshop: English for IT', date: '12 Oct 2026', status: 'Đang diễn ra', progress: 72, people: 32, color: 'orange' },
  { title: 'Seminar: AI & Ngôn ngữ', date: '18 Oct 2026', status: 'Chuẩn bị', progress: 45, people: 21, color: 'blue' },
  { title: 'Hackathon: Build Your Portfolio', date: '24 Oct 2026', status: 'Sắp tới', progress: 18, people: 12, color: 'purple' },
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

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Tổng quan')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
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
          <button className="nav-item" onClick={() => notify('Tính năng lịch đang được phát triển')}><span>□</span>Lịch của tôi</button>
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
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm..." />
            </label>
            <button className="primary-btn" onClick={() => setShowModal(true)}>+ Tạo mới</button>
          </div>
        </header>

        {activeTab === 'Tổng quan' ? (
          <Dashboard onCreate={() => setShowModal(true)} onNotify={notify} />
        ) : (
          <SectionPage tab={activeTab} onCreate={() => setShowModal(true)} onNotify={notify} search={search} />
        )}
      </main>

      {showModal && (
        <CreateModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false)
            notify('Đã tạo sự kiện mới thành công')
          }}
        />
      )}

      {toast && <div className="toast">✓ &nbsp; {toast}</div>}
    </div>
  )
}

function Dashboard({ onCreate, onNotify }: { onCreate: () => void; onNotify: (s: string) => void }) {
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
        <Stat icon="◉" title="Sự kiện đang theo dõi" value="03" note="1 sự kiện sắp diễn ra" tone="blue" />
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
              <button key={event.title} className="event-card" onClick={() => onNotify(`Đang mở sự kiện: ${event.title}`)}>
                <div className="event-top">
                  <span className={`dot ${event.color}`} />
                  <small>{event.status}</small>
                </div>
                <h3>{event.title}</h3>
                <p>{event.date}</p>
                <div className="progress-bar">
                  <span style={{ width: `${event.progress}%` }} />
                </div>
                <div className="event-meta">
                  <span>{event.people} người tham gia</span>
                  <span>{event.progress}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Khó khăn thực tế</h2>
              <p className="muted">Những vấn đề thường gặp của sinh viên Ngôn ngữ & CNTT</p>
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

function SectionPage({ tab, onCreate, onNotify, search }: { tab: Tab; onCreate: () => void; onNotify: (s: string) => void; search: string }) {
  const title =
    tab === 'Sự kiện'
      ? 'Quản lý sự kiện học tập'
      : tab === 'Cẩm nang'
        ? 'Cẩm nang sinh viên Ngôn ngữ & CNTT'
        : 'Portfolio & kết quả học tập'

  const filtered = guideCards.filter(
    (item) => item.title.toLowerCase().includes(search.toLowerCase()) || item.text.toLowerCase().includes(search.toLowerCase())
  )

  const displayCards = search ? filtered : guideCards

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

      {tab === 'Portfolio' && (
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
      )}
    </div>
  )
}

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Tạo hoạt động mới</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label>Tên hoạt động</label>
          <input placeholder="Ví dụ: Workshop AI & Ngôn ngữ" />
        </div>

        <div className="form-group">
          <label>Loại</label>
          <input placeholder="Sự kiện, workshop, dự án" />
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>Hủy</button>
          <button className="primary-btn" onClick={onCreated}>Lưu</button>
        </div>
      </div>
    </div>
  )
}

export default App
