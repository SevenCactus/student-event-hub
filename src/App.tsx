import { useState } from 'react'

type Tab = 'Tổng quan' | 'Sự kiện' | 'Cẩm nang' | 'Portfolio'

const guideCards = [
  { icon: '🧠', title: 'Tiếng Anh chuyên ngành', text: 'Nâng cao kỹ năng đọc, nghe và thuyết trình trong môi trường CNTT và truyền thông số.', color: 'orange' },
  { icon: '💻', title: 'Lập trình & AI', text: 'Làm quen với công cụ code, AI và kỹ năng xây dựng sản phẩm số.', color: 'purple' },
  { icon: '🤝', title: 'Làm việc nhóm', text: 'Rèn kỹ năng hợp tác, giao tiếp và giải quyết vấn đề trong dự án thực tế.', color: 'green' },
  { icon: '📦', title: 'Portfolio & dự án', text: 'Tổng hợp sản phẩm, bài tập và trải nghiệm để tăng sức cạnh tranh.', color: 'red' },
]

const events = [
  { title: 'Workshop: English for IT', date: '12 Oct 2026', status: 'Đang diễn ra', progress: 68, people: 32, color: 'orange' },
  { title: 'Seminar: AI & Ngôn ngữ', date: '18 Oct 2026', status: 'Chuẩn bị', progress: 45, people: 21, color: 'blue' },
  { title: 'Hackathon: Build Your Portfolio', date: '24 Oct 2026', status: 'Sắp tới', progress: 18, people: 12, color: 'purple' },
]

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Tổng quan')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">✦</div><div><strong>Lang<span>IT</span></strong><small>Ngôn ngữ & CNTT</small></div></div>
        <div className="profile-mini"><div className="avatar">LT</div><div><b>Seven Cactus</b><small>Sinh viên • Ngôn ngữ & CNTT</small></div><span>⌄</span></div>
        <nav>
          <p className="nav-label">WORKSPACE</p>
          {(['Tổng quan', 'Sự kiện', 'Cẩm nang', 'Portfolio'] as Tab[]).map((item) => <button key={item} className={`nav-item ${activeTab === item ? 'active' : ''}`} onClick={() => setActiveTab(item)}><span>{item === 'Tổng quan' ? '◫' : item === 'Sự kiện' ? '▣' : item === 'Cẩm nang' ? '✦' : '◌'}</span>{item}</button>)}
          <p className="nav-label space">CÁ NHÂN</p>
          <button className="nav-item" onClick={() => notify('Tính năng lịch đang được phát triển')}><span>□</span>Lịch của tôi</button>
          <button className="nav-item" onClick={() => notify('Đã mở phần cơ hội')}><span>♢</span>Cơ hội</button>
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><span>💡</span><b>Cần hỗ trợ?</b><small>Xem hướng dẫn sử dụng Hub</small><button onClick={() => notify('Đã mở hướng dẫn hỗ trợ')}><span>→</span> Mở ngay</button></div></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <b>{activeTab}</b></div><div className="top-actions"><label className="search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm..." /></label><button className="primary-btn" onClick={() => setShowModal(true)}>+ Tạo mới</button></div></header>
        {activeTab === 'Tổng quan' ? <Dashboard onCreate={() => setShowModal(true)} onNotify={notify} /> : <SectionPage tab={activeTab} onCreate={() => setShowModal(true)} onNotify={notify} search={search} />}
      </main>
      {showModal && <CreateModal onClose={() => setShowModal(false)} onCreated={() => { setShowModal(false); notify('Đã tạo sự kiện mới thành công') }} />}
      {toast && <div className="toast">✓ &nbsp; {toast}</div>}
    </div>
  )
}

function Dashboard({ onCreate, onNotify }: { onCreate: () => void; onNotify: (s: string) => void }) {
  return <div className="page"><div className="welcome"><div><p className="eyebrow">THỨ BA, 22 THÁNG 9, 2026</p><h1>Chào bạn, Seven <span>👋</span></h1><p className="muted">Sinh viên ngành Ngôn ngữ và Công nghệ thông tin đang xây dựng kỹ năng tiếng Anh, lập trình, và portfolio cá nhân.</p></div><button className="primary-btn" onClick={onCreate}>+ Tạo hoạt động mới</button></div>
    <div className="stats"><Stat icon="◷" title="Nhiệm vụ hôm nay" value="07" note="2 việc cần ưu tiên" tone="orange" /><Stat icon="◉" title="Sự kiện đang theo dõi" value="03" note="1 sự kiện sắp diễn ra" tone="blue" /><Stat icon="◈" title="Dự án cá nhân" value="04" note="2 dự án đang hoàn thiện" tone="green" /></div>
    <div className="section-heading"><div><h2>Sự kiện của tôi</h2><p className="muted">Theo dõi tiến độ các hoạt động học tập và dự án</p></div><button className="link-button" onClick={() => onNotify('Đã mở danh sách sự kiện')}>Xem tất cả</button></div>
    <div className="event-grid">{events.map(e => <EventCard key={e.title} {...e} onClick={() => onNotify(`Đang mở sự kiện: ${e.title}`)} />)}</div>
    <div className="lower-grid"><div className="panel tasks"><div className="panel-head"><div><h2>Việc cần làm</h2><p className="muted">Bạn có 5 nhiệm vụ trong tuần này</p></div><button className="link-button" onClick={() => onNotify('Đã mở mục việc cần làm')}>Quản lý</button></div>{['Hoàn thiện portfolio dự án AI', 'Luyện IELTS chuyên ngành CNTT', 'Chuẩn bị slide thuyết trình nhóm', 'Nộp bài tập ngôn ngữ học số', 'Cập nhật GitHub cho project cá nhân'].map((label, index) => <Task key={label} label={label} meta={['Hôm nay', '2h', '13:30', 'Sắp tới', '27/09'][index % 5]} tag={['Cá nhân', 'Học tập', 'Nhóm', 'Đồ án', 'Portfolio'][index % 5]} done={index < 2} />)}</div><div className="panel"><div className="panel-head"><div><h2>Cẩm nang học tập</h2><p className="muted">Các khó khăn thường gặp của sinh viên Ngôn ngữ & CNTT</p></div></div><div className="guide-grid">{guideCards.map(card => <div key={card.title} className={`guide-card ${card.color}`}><span>{card.icon}</span><h3>{card.title}</h3><p>{card.text}</p></div>)}</div></div></div>
  </div>
}

function Stat({ icon, title, value, note, tone }: { icon: string; title: string; value: string; note: string; tone: string }) { return <div className="stat"><div className={`stat-icon ${tone}`}>{icon}</div><div><h3>{value}</h3><p>{title}</p><small>{note}</small></div></div> }

function EventCard({ title, date, status, progress, people, color, onClick }: typeof events[number] & { onClick: () => void }) { return <button className="event-card" onClick={onClick}><div className="event-top"><span className={`dot ${color}`} /><small>{status}</small></div><h3>{title}</h3><p>{date}</p><div className="progress"><div style={{ width: `${progress}%` }} /></div><div className="event-meta"><span>{people} người tham gia</span><span>{progress}%</span></div></button> }

function Task({ label, meta, tag, done }: { label: string; meta: string; tag: string; done: boolean }) { const [checked, setChecked] = useState(done); return <div className={`task ${checked ? 'completed' : ''}`}><button className={`check ${checked ? 'on' : ''}`} onClick={() => setChecked(!checked)}>{checked ? '✓' : ''}</button><div><strong>{label}</strong><small>{meta}</small></div><span className="tag">{tag}</span></div> }

function SectionPage({ tab, onCreate, onNotify, search }: { tab: Tab; onCreate: () => void; onNotify: (s: string) => void; search: string }) {
  const title = tab === 'Sự kiện' ? 'Quản lý sự kiện học tập' : tab === 'Cẩm nang' ? 'Cẩm nang sinh viên Ngôn ngữ & CNTT' : 'Portfolio & kết quả học tập'
  const filtered = guideCards.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()) || item.text.toLowerCase().includes(search.toLowerCase()))

  return <div className="page"><div className="section-header"><div><p className="eyebrow">{tab.toUpperCase()}</p><h1>{title}</h1></div><button className="primary-btn" onClick={onCreate}>+ Tạo mới</button></div>
    <div className="panel empty-state"><h2>Khó khăn của sinh viên ngành Ngôn ngữ & CNTT</h2><p className="muted">Đây là những thách thức thực tế: mất cân bằng kỹ năng tiếng Anh, lập trình, giao tiếp và xây dựng portfolio cá nhân.</p>
      <div className="guide-grid">{(search ? filtered : guideCards).map(card => <div key={card.title} className={`guide-card ${card.color}`}><span>{card.icon}</span><h3>{card.title}</h3><p>{card.text}</p></div>)}</div>
    </div>
  </div>
}

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) { return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-head"><h3>Tạo hoạt động mới</h3><button onClick={onClose}>✕</button></div><div className="form-group"><label>Tên hoạt động</label><input placeholder="Ví dụ: Workshop AI & Ngôn ngữ" /></div><div className="form-group"><label>Loại</label><input placeholder="Sự kiện, workshop, dự án" /></div><div className="modal-actions"><button className="secondary-btn" onClick={onClose}>Hủy</button><button className="primary-btn" onClick={onCreated}>Lưu</button></div></div></div> }

export default App
