import { useEffect, useState } from 'react'
import { GuideCardItem } from './types'

const CHECKLIST_STORAGE_KEY = 'leep_guide_checklist_v1'

type ChecklistState = Record<string, boolean>

function loadChecklist(): ChecklistState {
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ChecklistState
  } catch {
    // safe fallback
  }
  return {}
}

function saveChecklist(state: ChecklistState) {
  try {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // safe fallback
  }
}

export default function GuideModal({
  guide,
  onClose,
  onOpenTool,
  onNavigateTab,
}: {
  guide: GuideCardItem
  onClose: () => void
  onOpenTool?: (toolType: 'activity_decision' | 'time_budget') => void
  onNavigateTab?: (tab: 'Portfolio') => void
}) {
  const [checkedMap, setCheckedMap] = useState<ChecklistState>(() => loadChecklist())

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const toggleCheck = (idx: number) => {
    const key = `${guide.id || guide.title}_${idx}`
    setCheckedMap((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      saveChecklist(next)
      return next
    })
  }

  const isBalanceCard = guide.category === 'balance'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal guide-modal guide-modal--enhanced"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="modal-head">
          <div className="guide-modal-badge-group">
            <span className="guide-modal-icon">{guide.icon}</span>
            <div>
              <span className="guide-modal-tag">{guide.tag}</span>
              <h3>{guide.title}</h3>
            </div>
          </div>
          <button type="button" aria-label="Đóng modal" onClick={onClose}>✕</button>
        </div>

        {/* Modal Body */}
        <div className="guide-modal-body">
          {isBalanceCard ? (
            /* ========================================================
               A3: 4-PART STRUCTURE FOR BALANCE RESEARCH CARDS
               ======================================================== */
            <div className="guide-detail-four-parts">
              {/* Mục 1: Vấn đề thực tế */}
              <div className="guide-detail-section">
                <div className="guide-section-label">
                  <span className="label-num">1</span>
                  <h4>Vấn đề thực tế</h4>
                </div>
                <p className="guide-detail-text">
                  {guide.realProblem || guide.text}
                </p>
                {guide.statHighlight && (
                  <div className="guide-detail-stat-pill">
                    <span>📊</span>
                    <span>{guide.statHighlight}</span>
                  </div>
                )}
              </div>

              {/* Mục 2: Góc nhìn người đi trước */}
              {guide.seniorPerspective && (
                <div className="guide-detail-section">
                  <div className="guide-section-label">
                    <span className="label-num">2</span>
                    <h4>Góc nhìn người đi trước</h4>
                  </div>
                  <blockquote className="guide-quote-box">
                    <p>“{guide.seniorPerspective.quote}”</p>
                    <cite>— {guide.seniorPerspective.role}</cite>
                  </blockquote>
                </div>
              )}

              {/* Lộ trình mốc theo kỳ (Dành riêng cho thẻ Roadmap) */}
              {guide.roadmapMilestones && guide.roadmapMilestones.length > 0 && (
                <div className="guide-detail-section">
                  <div className="guide-section-label">
                    <span className="label-num">✦</span>
                    <h4>Lộ trình định hướng 5 mốc theo kỳ</h4>
                  </div>
                  <div className="guide-roadmap-list">
                    {guide.roadmapMilestones.map((m, idx) => (
                      <div key={idx} className="guide-roadmap-item">
                        <span className="roadmap-badge">{m.semester}</span>
                        <div>
                          <strong>{m.focus}</strong>
                          <p>{m.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="guide-roadmap-note">
                    * Ghi chú: Lộ trình mang tính tham khảo linh hoạt, không bắt buộc sinh viên phải đi làm ngay ở năm nhất.
                  </p>
                </div>
              )}

              {/* Mục 3: Làm gì tuần này (Checklist với localStorage) */}
              {guide.weeklyActions && guide.weeklyActions.length > 0 && (
                <div className="guide-detail-section">
                  <div className="guide-section-label">
                    <span className="label-num">3</span>
                    <h4>Làm gì tuần này (Hành động nhỏ)</h4>
                  </div>
                  <div className="guide-checklist-container">
                    {guide.weeklyActions.map((action, idx) => {
                      const itemKey = `${guide.id || guide.title}_${idx}`
                      const isDone = Boolean(checkedMap[itemKey])
                      return (
                        <label
                          key={idx}
                          className={`guide-checklist-item ${isDone ? 'done' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => toggleCheck(idx)}
                          />
                          <span className="checkbox-custom" />
                          <span className="action-text">{action}</span>
                        </label>
                      )
                    })}
                  </div>
                  <small className="guide-checklist-hint">
                    ✓ Trạng thái tick được lưu tự động trên thiết bị của bạn.
                  </small>
                </div>
              )}

              {/* Mục 4: Công cụ liên quan */}
              {guide.relatedTool && (
                <div className="guide-detail-section">
                  <div className="guide-section-label">
                    <span className="label-num">4</span>
                    <h4>Công cụ liên quan</h4>
                  </div>
                  <div className="guide-tool-card-preview">
                    <div>
                      <strong>{guide.relatedTool.label}</strong>
                      <p>{guide.relatedTool.description}</p>
                    </div>
                    {guide.relatedTool.type === 'portfolio' ? (
                      <button
                        type="button"
                        className="guide-tool-nav-btn"
                        onClick={() => {
                          onClose()
                          if (onNavigateTab) onNavigateTab('Portfolio')
                        }}
                      >
                        Mở Portfolio ↗
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="guide-tool-nav-btn"
                        onClick={() => {
                          if (onOpenTool && guide.relatedTool) {
                            onOpenTool(guide.relatedTool.type as 'activity_decision' | 'time_budget')
                          }
                        }}
                      >
                        Mở công cụ ngay ↗
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="guide-disclaimer-box">
                <small>
                  ⚠️ <b>Lưu ý:</b> Các gợi ý trên dựa trên nghiên cứu và phỏng vấn sinh viên, chỉ mang tính chất tham khảo thực tế, không khẳng định cải thiện GPA hay thay thế tư vấn học thuật, y tế và sức khỏe tâm thần.
                </small>
              </div>
            </div>
          ) : (
            /* ========================================================
               CAREER INDUSTRY CARDS (Preserve existing tips layout)
               ======================================================== */
            <>
              <p className="guide-modal-desc">{guide.text}</p>
              {guide.tips && guide.tips.length > 0 && (
                <div className="guide-modal-tips">
                  <h4>✦ Lời khuyên & Bước hành động:</h4>
                  <ul>
                    {guide.tips.map((tip, idx) => (
                      <li key={idx}>
                        <span className="tip-num">{idx + 1}</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-actions">
          <button type="button" className="primary-btn" onClick={onClose}>
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

