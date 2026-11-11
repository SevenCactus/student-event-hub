import { useState, useEffect } from 'react'

const STORAGE_KEY = 'leep_guide_time_budget_v1'
const TOTAL_HOURS_IN_WEEK = 168

type TimeBudgetState = {
  credits: number // số tín chỉ đang học
  classHours: number // giờ học trên lớp (nếu nhập trực tiếp, hoặc tín chỉ * 2.5)
  selfStudyHours: number // giờ tự học dự kiến
  workAndClubHours: number // giờ làm thêm / câu lạc bộ / hoạt động
  sleepHoursPerNight: number // giờ ngủ trung bình mỗi đêm
}

const DEFAULT_STATE: TimeBudgetState = {
  credits: 16,
  classHours: 20,
  selfStudyHours: 15,
  workAndClubHours: 12,
  sleepHoursPerNight: 7,
}

export default function WeeklyTimeBudgetTool({ onClose }: { onClose?: () => void }) {
  const [form, setForm] = useState<TimeBudgetState>(DEFAULT_STATE)
  const [toastMsg, setToastMsg] = useState('')

  // Load saved state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<TimeBudgetState>
        setForm((prev) => ({ ...prev, ...parsed }))
      }
    } catch {
      // safe fallback
    }
  }, [])

  // Auto-save helper
  const updateField = (key: keyof TimeBudgetState, val: number) => {
    const validVal = isNaN(val) ? 0 : Math.max(0, val)
    setForm((prev) => {
      const next = { ...prev, [key]: validVal }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại toàn bộ thông số về mặc định?')) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      setForm(DEFAULT_STATE)
      setToastMsg('Đã xóa dữ liệu quỹ thời gian')
      setTimeout(() => setToastMsg(''), 2500)
    }
  }

  // Calculations
  const weeklySleep = form.sleepHoursPerNight * 7
  const totalCommitted = form.classHours + form.selfStudyHours + form.workAndClubHours + weeklySleep
  const remainingHours = TOTAL_HOURS_IN_WEEK - totalCommitted
  const remainingHoursPerDay = (remainingHours / 7).toFixed(1)

  // Status flags
  const isOverloaded = remainingHours < 14 // Dưới 2 giờ/ngày cho ăn uống, di chuyển, vệ sinh là quá tải
  const isSleepDeprived = form.sleepHoursPerNight < 7

  return (
    <div className="guide-tool-container">
      <div className="guide-tool-head">
        <div>
          <span className="guide-tool-badge">Công cụ số 2</span>
          <h3>Ước lượng quỹ thời gian tuần</h3>
          <p className="guide-tool-sub">
            Một tuần có đúng 168 giờ. Cân đối thời gian học, làm thêm và ngủ nghỉ để phát hiện nguy cơ quá tải trước mùa thi.
          </p>
        </div>
        {onClose && (
          <button type="button" className="guide-tool-close-btn" onClick={onClose} aria-label="Đóng công cụ">
            ✕
          </button>
        )}
      </div>

      <div className="guide-tool-body">
        {toastMsg && <div className="guide-tool-toast">{toastMsg}</div>}

        <div className="guide-tool-grid-inputs">
          <div className="guide-tool-field">
            <label htmlFor="tb-credits">
              Số tín chỉ kỳ này:
              <span className="guide-tool-hint">Thường 14 - 18 tín</span>
            </label>
            <input
              id="tb-credits"
              type="number"
              min="0"
              max="35"
              className="guide-tool-number-input"
              value={form.credits}
              onChange={(e) => {
                const credits = parseInt(e.target.value) || 0
                updateField('credits', credits)
                // Gợi ý giờ học lớp: tín chỉ * 1.3
                if (credits > 0) {
                  updateField('classHours', Math.round(credits * 1.3))
                }
              }}
            />
          </div>

          <div className="guide-tool-field">
            <label htmlFor="tb-class">
              Giờ học trên lớp / tuần:
              <span className="guide-tool-hint">Bao gồm cả ca thực hành</span>
            </label>
            <input
              id="tb-class"
              type="number"
              min="0"
              max="60"
              className="guide-tool-number-input"
              value={form.classHours}
              onChange={(e) => updateField('classHours', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="guide-tool-field">
            <label htmlFor="tb-self-study">
              Giờ tự học & làm bài / tuần:
              <span className="guide-tool-hint">Đọc sách, làm đồ án, bài tập</span>
            </label>
            <input
              id="tb-self-study"
              type="number"
              min="0"
              max="60"
              className="guide-tool-number-input"
              value={form.selfStudyHours}
              onChange={(e) => updateField('selfStudyHours', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="guide-tool-field">
            <label htmlFor="tb-work-club">
              Giờ CLB, sự kiện & làm thêm / tuần:
              <span className="guide-tool-hint">Họp ban, trực ca, việc ngoài</span>
            </label>
            <input
              id="tb-work-club"
              type="number"
              min="0"
              max="80"
              className="guide-tool-number-input"
              value={form.workAndClubHours}
              onChange={(e) => updateField('workAndClubHours', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="guide-tool-field" style={{ gridColumn: 'span 2' }}>
            <label htmlFor="tb-sleep">
              Giờ ngủ trung bình mỗi đêm:
              <span className="guide-tool-hint">Khuyến nghị chuyên gia: ≥ 7 giờ</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <input
                id="tb-sleep"
                type="range"
                min="4"
                max="10"
                step="0.5"
                style={{ flex: 1 }}
                value={form.sleepHoursPerNight}
                onChange={(e) => updateField('sleepHoursPerNight', parseFloat(e.target.value) || 7)}
              />
              <span className="guide-tool-range-val">
                <b>{form.sleepHoursPerNight}</b> giờ/đêm ({weeklySleep}h/tuần)
              </span>
            </div>
          </div>
        </div>

        {/* Visual Bar Breakdown */}
        <div className="guide-tool-bar-wrapper">
          <div className="guide-tool-bar-label">
            <span>Phân bổ quỹ 168 giờ:</span>
            <span>Đã cam kết: <b>{totalCommitted}h</b> / Còn lại: <b>{remainingHours}h</b></span>
          </div>
          <div className="guide-tool-progress-bar">
            <div
              className="guide-tool-seg seg-class"
              style={{ width: `${Math.min(100, (form.classHours / 168) * 100)}%` }}
              title={`Học lớp: ${form.classHours}h`}
            />
            <div
              className="guide-tool-seg seg-study"
              style={{ width: `${Math.min(100, (form.selfStudyHours / 168) * 100)}%` }}
              title={`Tự học: ${form.selfStudyHours}h`}
            />
            <div
              className="guide-tool-seg seg-activity"
              style={{ width: `${Math.min(100, (form.workAndClubHours / 168) * 100)}%` }}
              title={`CLB/Việc: ${form.workAndClubHours}h`}
            />
            <div
              className="guide-tool-seg seg-sleep"
              style={{ width: `${Math.min(100, (weeklySleep / 168) * 100)}%` }}
              title={`Giấc ngủ: ${weeklySleep}h`}
            />
          </div>
          <div className="guide-tool-bar-legend">
            <span className="legend-item"><i className="dot seg-class"></i> Học lớp ({form.classHours}h)</span>
            <span className="legend-item"><i className="dot seg-study"></i> Tự học ({form.selfStudyHours}h)</span>
            <span className="legend-item"><i className="dot seg-activity"></i> CLB/Làm thêm ({form.workAndClubHours}h)</span>
            <span className="legend-item"><i className="dot seg-sleep"></i> Ngủ nghỉ ({weeklySleep}h)</span>
          </div>
        </div>

        {/* Cảnh báo & Đánh giá */}
        <div className="guide-tool-alerts-container">
          {remainingHours < 0 ? (
            <div className="guide-tool-alert alert-danger">
              <h4>🚨 BÁO ĐỘNG QUÁ TẢI NGHIÊM TRỌNG!</h4>
              <p>
                Tổng số giờ cam kết ({totalCommitted}h) đã vượt quá 168 giờ trong tuần. Lịch trình này là bất khả thi và sẽ khiến bạn kiệt sức ngay tuần đầu tiên. Hãy cắt giảm ngay giờ làm thêm hoặc rút bớt câu lạc bộ!
              </p>
            </div>
          ) : isOverloaded ? (
            <div className="guide-tool-alert alert-warning">
              <h4>⚠️ CẢNH BÁO: Quỹ thời gian quá mỏng ({remainingHours}h còn lại)</h4>
              <p>
                Bạn chỉ còn khoảng {remainingHoursPerDay} giờ/ngày cho tất cả việc ăn uống, di chuyển, tắm rửa và nghỉ ngơi cá nhân. Chỉ cần một deadline đột xuất là bạn sẽ bị mất ngủ hoặc trễ bài.
              </p>
            </div>
          ) : (
            <div className="guide-tool-alert alert-success">
              <h4>✓ Quỹ thời gian tuần tương đối cân bằng!</h4>
              <p>
                Bạn còn khoảng <b>{remainingHours} giờ</b> trong tuần (khoảng ~{remainingHoursPerDay} giờ/ngày) để ăn uống, di chuyển, thể thao và thư giãn cùng bạn bè.
              </p>
            </div>
          )}

          {isSleepDeprived && (
            <div className="guide-tool-alert alert-warning" style={{ marginTop: '10px' }}>
              <h4>💤 CẢNH BÁO THIẾU NGỦ: Đang ngủ dưới 7 giờ/đêm ({form.sleepHoursPerNight}h)</h4>
              <p>
                Khảo sát nhóm sinh viên kiệt sức cho thấy ngủ dưới 6 giờ/đêm làm giảm 40% khả năng ghi nhớ bài giảng đại học. Đừng lấy giờ ngủ để bù vào bài tập!
              </p>
            </div>
          )}
        </div>

        <div className="guide-tool-disclaimer">
          <p>
            ℹ️ <b>Ghi chú:</b> Dữ liệu được lưu trên thiết bị của bạn, không gửi lên máy chủ. Công cụ giúp bạn hình dung và tối ưu hóa thời khóa biểu chứ không đưa ra chẩn đoán y tế hay học thuật.
          </p>
        </div>

        <div className="guide-tool-actions">
          <button type="button" className="guide-tool-reset-btn" onClick={handleReset}>
            🗑 Xóa dữ liệu của tôi
          </button>
          {onClose && (
            <button type="button" className="guide-tool-primary-btn" onClick={onClose}>
              Đóng lại
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
