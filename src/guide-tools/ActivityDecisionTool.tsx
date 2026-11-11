import { useState, useEffect } from 'react'

const STORAGE_KEY = 'leep_guide_activity_decision_v1'

type Criterion = {
  id: string
  label: string
  description: string
  score: number
}

const DEFAULT_CRITERIA: Criterion[] = [
  {
    id: 'career_relevance',
    label: '1. Mức độ liên quan đến ngành & định hướng',
    description: 'Hoạt động này có bổ trợ cho chuyên ngành hoặc công việc tương lai của bạn không?',
    score: 3,
  },
  {
    id: 'skill_learning',
    label: '2. Giá trị học hỏi & kỹ năng thực chất',
    description: 'Bạn sẽ học được kỹ năng mới (kỹ thuật, ngoại ngữ, điều phối) hay chỉ làm việc lặp lại?',
    score: 3,
  },
  {
    id: 'time_commitment',
    label: '3. Quỹ thời gian yêu cầu hợp lý',
    description: 'Số giờ yêu cầu mỗi tuần có phù hợp và không gây áp lực dồn dập vào mùa thi không?',
    score: 3,
  },
  {
    id: 'schedule_flexibility',
    label: '4. Tính linh hoạt & không xung đột lịch học',
    description: 'Lịch họp/làm việc có thể linh động đổi ca khi bạn có bài kiểm tra hoặc đồ án không?',
    score: 3,
  },
  {
    id: 'portfolio_output',
    label: '5. Minh chứng & sản phẩm cụ thể cho Portfolio',
    description: 'Kết thúc hoạt động, bạn có tạo ra sản phẩm đo lường được (dự án, bài viết, số liệu) không?',
    score: 3,
  },
]

type SavedData = {
  activityName: string
  criteria: Criterion[]
}

export default function ActivityDecisionTool({ onClose }: { onClose?: () => void }) {
  const [activityName, setActivityName] = useState('')
  const [criteria, setCriteria] = useState<Criterion[]>(DEFAULT_CRITERIA)
  const [toastMsg, setToastMsg] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as SavedData
        if (parsed.activityName) setActivityName(parsed.activityName)
        if (Array.isArray(parsed.criteria) && parsed.criteria.length === 5) {
          setCriteria(parsed.criteria)
        }
      }
    } catch {
      // Safe fallback
    }
  }, [])

  // Auto-save
  const handleScoreChange = (id: string, newScore: number) => {
    const updated = criteria.map((c) => (c.id === id ? { ...c, score: newScore } : c))
    setCriteria(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ activityName, criteria: updated }))
    } catch {
      // ignore
    }
  }

  const handleNameChange = (name: string) => {
    setActivityName(name)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ activityName: name, criteria }))
    } catch {
      // ignore
    }
  }

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu đã chấm điểm không?')) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      setActivityName('')
      setCriteria(DEFAULT_CRITERIA)
      setToastMsg('Đã xóa dữ liệu bảng kiểm')
      setTimeout(() => setToastMsg(''), 2500)
    }
  }

  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0)

  // Recommendation logic
  let recommendation: {
    status: 'should_accept' | 'consider' | 'should_decline'
    title: string
    color: string
    bg: string
    border: string
    advice: string
  }

  if (totalScore >= 20) {
    recommendation = {
      status: 'should_accept',
      title: '✓ Nên nhận (Cơ hội chất lượng cao)',
      color: '#15803d',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      advice:
        'Hoạt động này có sự cân đối xuất sắc giữa giá trị chuyên môn, sản phẩm đầu ra và thời gian. Hãy chủ động lên kế hoạch và nhận trách nhiệm!',
    }
  } else if (totalScore >= 14) {
    recommendation = {
      status: 'consider',
      title: '⚡ Cần cân nhắc kỹ lưỡng',
      color: '#b45309',
      bg: '#fffbeb',
      border: '#fde68a',
      advice:
        'Hoạt động có điểm sáng nhưng cũng tiềm ẩn rủi ro về thời gian hoặc chưa rõ sản phẩm đầu ra. Bạn nên thương lượng lại số giờ cam kết hoặc hoãn sang kỳ sau nếu lịch học kỳ này đang nặng.',
    }
  } else {
    recommendation = {
      status: 'should_decline',
      title: '✕ Nên hoãn hoặc từ chối',
      color: '#b91c1c',
      bg: '#fef2f2',
      border: '#fecaca',
      advice:
        'Điểm đánh giá thấp cho thấy hoạt động này ít đóng góp cho định hướng năm nhất mà lại dễ gây phân tán, quá tải. Dũng cảm nói "không" để bảo vệ thời gian học tập cốt lõi của bạn!',
    }
  }

  return (
    <div className="guide-tool-container">
      <div className="guide-tool-head">
        <div>
          <span className="guide-tool-badge">Công cụ số 1</span>
          <h3>Bảng kiểm: Có nên nhận hoạt động này không?</h3>
          <p className="guide-tool-sub">
            Chấm điểm theo 5 tiêu chí để đưa ra quyết định có căn cứ, tránh tham gia theo cảm tính (FOMO).
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

        <div className="guide-tool-input-group">
          <label htmlFor="activity-name-input">
            Tên hoạt động / CLB / Dự án dự định tham gia:
          </label>
          <input
            id="activity-name-input"
            type="text"
            className="guide-tool-text-input"
            placeholder="Ví dụ: Ban Truyền thông CLB Tiếng Anh, Dự án web nhóm..."
            value={activityName}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>

        <div className="guide-tool-criteria-list">
          {criteria.map((item, idx) => (
            <div key={item.id} className="guide-tool-criterion-row">
              <div className="guide-tool-criterion-info">
                <strong>{item.label}</strong>
                <p>{item.description}</p>
              </div>
              <div className="guide-tool-score-selector">
                <span className="guide-tool-score-label">Điểm: <b>{item.score}/5</b></span>
                <div className="guide-tool-buttons-group">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`guide-tool-btn-val ${item.score === val ? 'active' : ''}`}
                      onClick={() => handleScoreChange(item.id, val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Result summary */}
        <div
          className="guide-tool-result-box"
          style={{ background: recommendation.bg, borderColor: recommendation.border }}
        >
          <div className="guide-tool-result-header">
            <div>
              <span className="guide-tool-score-big" style={{ color: recommendation.color }}>
                {totalScore} / 25 điểm
              </span>
              <h4 style={{ color: recommendation.color, margin: '4px 0 0' }}>
                {recommendation.title}
              </h4>
            </div>
            {activityName && (
              <span className="guide-tool-target-pill">
                Mục tiêu: <b>{activityName}</b>
              </span>
            )}
          </div>
          <p className="guide-tool-result-advice">{recommendation.advice}</p>
        </div>

        <div className="guide-tool-disclaimer">
          <p>
            ℹ️ <b>Ghi chú:</b> Dữ liệu được lưu trên thiết bị của bạn, không gửi lên máy chủ. Kết quả chấm điểm chỉ mang tính tham khảo, giúp bạn tự phản chiếu quyết định chứ không phải lời khuyên học thuật bắt buộc.
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
