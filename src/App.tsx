import { useState } from 'react'

type Tab = 'Tổng quan' | 'Sự kiện' | 'Cẩm nang' | 'Portfolio'

const guideCards = [
  { icon: '⏱️', title: 'Quản lý thời gian', text: 'Cân bằng học tập, sức khỏe và hoạt động phong trào.', color: 'orange' },
  { icon: '🎨', title: 'Xây dựng Portfolio', text: 'Lưu lại thành quả và biến trải nghiệm thành lợi thế.', color: 'purple' },
  { icon: '💰', title: 'Tài chính & học bổng', text: 'Khám phá cơ hội hỗ trợ và việc làm phù hợp.', color: 'green' },
  { icon: '🧯', title: 'Xử lý khủng hoảng', text: 'SOP và phương án dự phòng cho mọi tình huống.', color: 'red' },
]

const events = [
  { title: 'FPTU Summer Festival 2026', date: '22 Sep 2026', status: 'Đang diễn ra', progress: 75, people: 24, color: 'orange' },
  { title: 'Chương trình Quân sự đầu khóa', date: '29 Sep 2026', status: 'Chuẩn bị', progress: 42, people: 18, color: 'blue' },
  { title: 'Workshop: Từ phong trào đến CV', date: '05 Oct 2026', status: 'Sắp tới', progress: 15, people: 8, color: 'purple' },
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
        <div className="brand"><div className="brand-mark">✦</div><div><strong>Student<span>Hub</span></strong><small>FPTU Đà Nẵng</small></div></div>
        <div className="profile-mini"><div className="avatar">SC</div><div><b>Seven Cactus</b><small>Sinh viên • K18</small></div><span>⌄</span></div>
        <nav>
          <p className="nav-label">WORKSPACE</p>
          {(['Tổng quan', 'Sự kiện', 'Cẩm nang', 'Portfolio'] as Tab[]).map((item, i) => <button key={item} className={`nav-item ${activeTab === item ? 'active' : ''}`} onClick={() => setActiveTab(item)}><span>{i === 0 ? '◆' : i === 1 ? '◉' : i === 2 ? '⊞' : '◈'}</span>{item}</button>)}
          <p className="nav-label space">CÁ NHÂN</p>
          <button className="nav-item" onClick={() => notify('Tính năng lịch đang được phát triển')}><span>□</span>Lịch của tôi</button>
          <button className="nav-item" onClick={() => notify('Đã mở phần cơ hội')}><span>♢</span>Cơ hội</button>
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><span>💡</span><b>Cần hỗ trợ?</b><small>Xem hướng dẫn sử dụng Hub</small><button onClick={() => notify('Đã mở trang hỗ trợ')}></button></div></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <b>{activeTab}</b></div><div className="top-actions"><label className="search"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm..." /></label><button className="icon-btn">🔔</button><button className="icon-btn">⚙️</button></div></header>
        {activeTab === 'Tổng quan' ? <Dashboard onCreate={() => setShowModal(true)} onNotify={notify} /> : <SectionPage tab={activeTab} onCreate={() => setShowModal(true)} onNotify={notify} search={search} />}
      </main>
      {showModal && <CreateModal onClose={() => setShowModal(false)} onCreated={() => { setShowModal(false); notify('Đã tạo sự kiện mới thành công') }} />}
      {toast && <div className="toast">✓ &nbsp; {toast}</div>}
    </div>
  )
}

function Dashboard({ onCreate, onNotify }: { onCreate: () => void; onNotify: (s: string) => void }) {
  return <div className="page">
    <div className="welcome">
      <div>
        <p className="eyebrow">THỨ BA, 22 THÁNG 9, 2026</p>
        <h1>Chào buổi sáng, Seven <span>👋</span></h1>
        <p className="muted">Một ngày tuyệt vời để bắt đầu</p>
      </div>
      <button className="btn-primary" onClick={onCreate}>+ Tạo sự kiện</button>
    </div>
    <div className="stats">
      <Stat icon="◷" title="Công việc hôm nay" value="08" note="2 việc sắp đến hạn" tone="orange" />
      <Stat icon="◉" title="Sự kiện đang tham gia" value="03" note="1 hôm nay sắp tới" tone="blue" />
      <Stat icon="◐" title="Sự kiện hoàn thành" value="12" note="+1 trong tuần này" tone="purple" />
      <Stat icon="⌛" title="Tổng cộng thời gian" value="48h" note="Tạp thời năng này" tone="green" />
    </div>
    <div className="section-heading">
      <div>
        <h2>Sự kiện của tôi</h2>
        <p className="muted">Theo dõi tiến độ các chương trình bạn đang tham gia</p>
      </div>
      <button className="link-button">Xem tất cả →</button>
    </div>
    <div className="event-grid">{events.map(e => <EventCard key={e.title} {...e} onClick={() => onNotify(`Đã mở sự kiện: ${e.title}`)} />)}</div>
    <div className="lower-grid">
      <div className="panel tasks">
        <div className="panel-head">
          <div>
            <h2>Việc cần làm</h2>
            <p className="muted">Bạn có 5 nhiệm vụ trong tuần này</p>
          </div>
          <button className="btn-icon">⋯</button>
        </div>
        <div>
          <Task label="Nộp báo cáo môn Nhập môn CNPM" meta="Hôm nay, 18:00" tag="Nhập môn CNPM" done={false} />
          <Task label="Tham gia buổi họp nhóm dự án" meta="Ngày mai, 14:00" tag="Dự án" done={false} />
          <Task label="Hoàn thành slide thuyết trình" meta="24 Sep 2026" tag="Thuyết trình" done={true} />
        </div>
      </div>
      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>Cẩm nang phát triển</h2>
            <p className="muted">5 chủ đề hỗ trợ bạn phát triển bản thân</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          {guideCards.map(c => <GuideCard key={c.title} {...c} />)}
        </div>
      </div>
    </div>
  </div>
}

function Stat({ icon, title, value, note, tone }: { icon: string; title: string; value: string; note: string; tone: string }) {
  return <div className="stat"><div className={`stat-icon ${tone}`}>{icon}</div><div><p className="stat-value">{value}</p><p className="stat-note">{note}</p></div></div>
}

function EventCard({ title, date, status, progress, people, color, onClick }: typeof events[number] & { onClick: () => void }) {
  return <button className="event-card" onClick={onClick}><div className={`event-tag ${color}`}>{status}</div><h3>{title}</h3><p className="event-date">{date}</p><div className="progress-bar"></div><div className="event-footer"><span>📊 {progress}%</span><span>👥 {people}</span></div></button>
}

function Task({ label, meta, tag, done }: { label: string; meta: string; tag: string; done: boolean }) {
  const [checked, setChecked] = useState(done)
  return <div className={`task ${checked ? 'completed' : ''}`}><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} /><div><p>{label}</p><small>{meta}</small></div><span className="task-tag">{tag}</span></div>
}

function GuideCard({ icon, title, text, color }: typeof guideCards[number]) {
  return <div className={`guide-card ${color}`}><div className="guide-icon">{icon}</div><h4>{title}</h4><p>{text}</p></div>
}

function SectionPage({ tab, onCreate, onNotify, search }: { tab: Tab; onCreate: () => void; onNotify: (s: string) => void; search: string }) {
  const title = tab === 'Sự kiện' ? 'Quản lý sự kiện' : tab === 'Cẩm nang' ? 'Cẩm nang phát triển' : 'Portfolio'
  return <div className="page"><div className="section-header"><h1>{title}</h1><button className="btn-primary" onClick={onCreate}>+ Tạo mới</button></div><p className="muted" style={{marginBottom: '20px'}}>Nội dung cho {tab.toLowerCase()} sẽ hiển thị tại đây</p></div>
}

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e => e.stopPropagation()}><h2>Tạo sự kiện mới</h2><input type="text" placeholder="Tên sự kiện" /><textarea placeholder="Mô tả sự kiện"></textarea><div style={{display:'flex', gap:'10px', marginTop:'20px'}}><button className="btn-secondary" onClick={onClose}>Hủy</button><button className="btn-primary" onClick={onCreated}>Tạo</button></div></div></div>
}

export default App
