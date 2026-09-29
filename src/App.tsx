import { useState } from 'react'

type Tab = 'Tổng quan' | 'Sự kiện' | 'Cẩm nang' | 'Portfolio'
type PersonalTab = 'Lịch của tôi' | 'Cơ hội'

type TimeSlot = {
  id: string
  day: string
  time: string
  subject: string
  room: string
  instructor?: string
  color: string
}

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
  const [activePersonalTab, setActivePersonalTab] = useState<PersonalTab>('Lịch của tôi')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [timetableSlots, setTimetableSlots] = useState<TimeSlot[]>([
    { id: '1', day: 'Thứ 2', time: '08:00 - 09:30', subject: 'Toán Cao Cấp', room: 'A302', instructor: 'TS. Nguyễn A', color: 'blue' },
    { id: '2', day: 'Thứ 3', time: '10:00 - 11:30', subject: 'Lập Trình Web', room: 'B401', instructor: 'ThS. Trần B', color: 'purple' },
    { id: '3', day: 'Thứ 4', time: '08:00 - 09:30', subject: 'Cơ Sở Dữ Liệu', room: 'C205', instructor: 'ThS. Lê C', color: 'orange' },
    { id: '4', day: 'Thứ 5', time: '13:00 - 14:30', subject: 'Hệ Điều Hành', room: 'A104', color: 'green' },
    { id: '5', day: 'Thứ 6', time: '10:00 - 11:30', subject: 'Tiếng Anh', room: 'D301', color: 'red' },
  ])

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
          <button className="nav-item" onClick={() => setActivePersonalTab('Lịch của tôi')}><span>□</span>Lịch của tôi</button>
          <button className="nav-item" onClick={() => notify('Đã mở phần cơ hội')}><span>♢</span>Cơ hội</button>
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><span>💡</span><b>Cần hỗ trợ?</b><small>Xem hướng dẫn sử dụng Hub</small><button onClick={() => notify('Đã mở phần hỗ trợ')}>Xem tại đây</button></div></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <b>{activePersonalTab === 'Lịch của tôi' ? activePersonalTab : activeTab}</b></div><div className="top-actions"><label className="search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm..." /></label><button className="btn-primary" onClick={() => setShowModal(true)}>+ Tạo sự kiện</button></div></header>
        {activePersonalTab === 'Lịch của tôi' ? (
          <Timetable slots={timetableSlots} setSlots={setTimetableSlots} onNotify={notify} />
        ) : (
          <>
            {activeTab === 'Tổng quan' && <Dashboard onCreate={() => setShowModal(true)} onNotify={notify} />}
            {activeTab !== 'Tổng quan' && <SectionPage tab={activeTab} onCreate={() => setShowModal(true)} onNotify={notify} search={search} />}
          </>
        )}
      </main>
      {showModal && <CreateModal onClose={() => setShowModal(false)} onCreated={() => { setShowModal(false); notify('Đã tạo sự kiện mới thành công') }} />}
      {toast && <div className="toast">✓ &nbsp; {toast}</div>}
    </div>
  )
}

function Timetable({ slots, setSlots, onNotify }: { slots: TimeSlot[]; setSlots: (slots: TimeSlot[]) => void; onNotify: (s: string) => void }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSlot, setNewSlot] = useState({ day: 'Thứ 2', time: '08:00', subject: '', room: '', instructor: '', color: 'blue' })

  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
  const timeSlots = ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00']
  const colors = ['blue', 'purple', 'orange', 'green', 'red']

  const handleAddSlot = () => {
    if (!newSlot.subject || !newSlot.room) {
      onNotify('Vui lòng điền đầy đủ thông tin')
      return
    }
    const slot: TimeSlot = {
      id: Date.now().toString(),
      day: newSlot.day,
      time: `${newSlot.time} - ${String(parseInt(newSlot.time.split(':')[0]) + 1).padStart(2, '0')}:${newSlot.time.split(':')[1]}`,
      subject: newSlot.subject,
      room: newSlot.room,
      instructor: newSlot.instructor,
      color: newSlot.color,
    }
    setSlots([...slots, slot])
    setShowAddModal(false)
    setNewSlot({ day: 'Thứ 2', time: '08:00', subject: '', room: '', instructor: '', color: 'blue' })
    onNotify('Đã thêm lớp học thành công')
  }

  const handleDeleteSlot = (id: string) => {
    setSlots(slots.filter(s => s.id !== id))
    onNotify('Đã xóa lớp học')
  }

  return (
    <div className="page">
      <div className="timetable">
        <div className="timetable-header">
          <div>
            <h2>Lịch học tuần này</h2>
            <p className="muted">Quản lý thời khoá biểu của bạn</p>
          </div>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Thêm lớp học</button>
        </div>
        
        <div className="timetable-grid">
          <div className="timetable-time-column">
            <div className="time-header">Giờ</div>
            {timeSlots.map(time => (
              <div key={time} className="time-slot">{time}</div>
            ))}
          </div>
          
          {days.map(day => (
            <div key={day} className="timetable-day-column">
              <div className="day-header">{day}</div>
              {timeSlots.map(time => {
                const slot = slots.find(s => s.day === day && s.time.startsWith(time))
                return (
                  <div key={`${day}-${time}`} className={`day-slot ${slot ? `event-${slot.color}` : ''}`}>
                    {slot && (
                      <button 
                        className="slot-content"
                        onClick={() => onNotify(`${slot.subject} - ${slot.room}${slot.instructor ? ' (' + slot.instructor + ')' : ''}`)}
                        style={{ all: 'unset', cursor: 'pointer', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '8px' }}
                      >
                        <p className="slot-subject">{slot.subject}</p>
                        <p className="slot-room">{slot.room}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <small className="slot-time">{slot.time}</small>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slot.id) }}
                            className="slot-delete"
                            title="Xóa"
                          >✕</button>
                        </div>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm lớp học mới</h3>
              <button onClick={() => setShowAddModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Tên lớp học</label>
                <input
                  type="text"
                  value={newSlot.subject}
                  onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
                  placeholder="VD: Toán Cao Cấp"
                />
              </div>
              <div className="form-group">
                <label>Phòng học</label>
                <input
                  type="text"
                  value={newSlot.room}
                  onChange={(e) => setNewSlot({ ...newSlot, room: e.target.value })}
                  placeholder="VD: A302"
                />
              </div>
              <div className="form-group">
                <label>Giảng viên (tùy chọn)</label>
                <input
                  type="text"
                  value={newSlot.instructor}
                  onChange={(e) => setNewSlot({ ...newSlot, instructor: e.target.value })}
                  placeholder="VD: TS. Nguyễn A"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Thứ</label>
                  <select value={newSlot.day} onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Giờ bắt đầu</label>
                  <select value={newSlot.time} onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Màu sắc</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setNewSlot({ ...newSlot, color: c })}
                      className={`color-picker event-${c}`}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: newSlot.color === c ? '2px solid #000' : '2px solid transparent',
                        cursor: 'pointer',
                        fontWeight: newSlot.color === c ? 'bold' : 'normal'
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">Hủy</button>
              <button onClick={handleAddSlot} className="btn-primary">Thêm lớp học</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Dashboard({ onCreate, onNotify }: { onCreate: () => void; onNotify: (s: string) => void }) {
  return <div className="page"><div className="welcome"><div><p className="eyebrow">THỨ BA, 22 THÁNG 9, 2026</p><h1>Chào buổi sáng, Seven <span>👋</span></h1><p className="muted">Một ngày mới, một cơ hội mới để phát triển</p></div></div>
    <div className="stats"><Stat icon="◷" title="Công việc hôm nay" value="08" note="2 việc sắp đến hạn" tone="orange" /><Stat icon="◉" title="Sự kiện đang tham gia" value="03" note="Sự kiện đang theo dõi" tone="blue" /><Stat icon="⊕" title="Hoàn thành tuần này" value="12" note="12 mục tiêu hoàn thành" tone="green" /></div>
    <div className="section-heading"><div><h2>Sự kiện của tôi</h2><p className="muted">Theo dõi tiến độ các chương trình bạn đang tham gia</p></div><button className="link-button" onClick={() => onNotify('Xem tất cả sự kiện')}>Xem tất cả →</button></div>
    <div className="event-grid">{events.map(e => <EventCard key={e.title} {...e} onClick={() => onNotify(`Đã mở sự kiện: ${e.title}`)} />)}</div>
    <div className="lower-grid"><div className="panel tasks"><div className="panel-head"><div><h2>Việc cần làm</h2><p className="muted">Bạn có 5 nhiệm vụ trong tuần này</p></div><button className="link-button" onClick={() => onNotify('Xem tất cả việc cần làm')}>Xem tất cả →</button></div>
      <div><Task label="Nộp báo cáo môn Nhập môn CNPM" meta="Hôm nay, 18:00" tag="Nhập môn CNPM" done={false} /><Task label="Tham gia buổi họp nhóm dự án" meta="Ngày mai, 14:00" tag="Dự án" done={false} /><Task label="Hoàn thành bài tập Cơ sở dữ liệu" meta="29 Sep, 23:59" tag="Cơ sở dữ liệu" done={false} /><Task label="Chuẩn bị thuyết trình cho demo ngày 01 Oct" meta="01 Oct, 09:00" tag="Demo" done={false} /><Task label="Tìm hiểu thêm về các công nghệ mới" meta="Hàng tuần" tag="Self-learning" done={true} /></div>
    </div><div className="panel"><div className="panel-head"><div><h2>Cẩm nang phát triển</h2><p className="muted">5 chủ đề hỗ trợ bạn phát triển bản thân</p></div></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>{guideCards.map(c => <GuideCard key={c.title} {...c} />)}</div>
    </div></div>
  </div>
}

function Stat({ icon, title, value, note, tone }: { icon: string; title: string; value: string; note: string; tone: string }) { return <div className="stat"><div className={`stat-icon ${tone}`}>{icon}</div><div><h3>{value}</h3><p>{title}</p><small>{note}</small></div></div> }
function EventCard({ title, date, status, progress, people, color, onClick }: typeof events[number] & { onClick: () => void }) { return <button className="event-card" onClick={onClick}><div className={`event-color ${color}`}></div><div><h4>{title}</h4><p>{date} • {status}</p><div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div><small>{progress}% • {people} người tham gia</small></div></button> }
function Task({ label, meta, tag, done }: { label: string; meta: string; tag: string; done: boolean }) { const [checked, setChecked] = useState(done); return <div className={`task ${checked ? 'completed' : ''}`}><input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} /><div><p>{label}</p><small>{meta}</small></div><span className="tag">{tag}</span></div> }
function GuideCard({ icon, title, text, color }: typeof guideCards[number]) { return <div className={`guide-card ${color}`}><div className="guide-icon">{icon}</div><h4>{title}</h4><p>{text}</p></div> }

function SectionPage({ tab, onCreate, onNotify, search }: { tab: Tab; onCreate: () => void; onNotify: (s: string) => void; search: string }) { const title = tab === 'Sự kiện' ? 'Quản lý sự kiện' : tab === 'Cẩm nang' ? 'Cẩm nang phát triển' : 'Portfolio'; return <div className="page"><div className="section-header"><h1>{title}</h1><button className="btn-primary" onClick={onCreate}>+ Thêm mới</button></div><div className="empty-state"><p>Chưa có nội dung cho '{tab}'</p><small>Sắp ra mắt</small></div></div> }

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) { return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-header"><h3>Tạo sự kiện mới</h3><button onClick={onClose} className="close-btn">✕</button></div><div className="modal-body"><input type="text" placeholder="Tên sự kiện" /><textarea placeholder="Mô tả sự kiện" rows={4}></textarea><input type="date" /><input type="time" /></div><div className="modal-footer"><button onClick={onClose} className="btn-secondary">Hủy</button><button onClick={onCreated} className="btn-primary">Tạo sự kiện</button></div></div></div> }

export default App
