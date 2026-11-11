import { useState } from 'react'

type Message = {
  id: string
  sender: 'user' | 'assistant'
  text: string
  time: string
}

const PRESET_QUESTIONS = [
  'Làm sao để vừa giữ GPA khá giỏi vừa tham gia CLB?',
  'Cách viết mô tả dự án theo mẫu STAR cho Portfolio?',
  'Tuần này em bị dồn deadline, nên sắp xếp thế nào?',
  'Năm nhất có nên đi làm thêm ngay không?',
]

const SMART_REPLIES: Record<string, string> = {
  gpa: 'Để giữ GPA vững mà vẫn trải nghiệm, quy tắc số 1 là xác định "Ngưỡng điểm an toàn" (thường 2.8 - 3.2 tùy học bổng). Khi nhận bất kỳ hoạt động nào, hãy dùng "Bảng kiểm 5 tiêu chí" trong Cẩm nang. Nếu môn học đang dưới 6.5, hãy dũng cảm giảm bớt 1 buổi sinh hoạt CLB nhé!',
  star: 'Mẫu STAR gồm 4 bước: (1) S - Situation (Bối cảnh bài toán), (2) T - Task (Nhiệm vụ cụ thể bạn đảm nhận), (3) A - Action (Bạn đã dùng công nghệ, kỹ năng gì để giải quyết), (4) R - Result (Kết quả đo lường được bằng số liệu). Bạn có thể sang tab Portfolio để điền trực tiếp vào form!',
  deadline: 'Khi dồn deadline, hãy áp dụng kỹ thuật "Ma trận khẩn cấp": (1) Liệt kê toàn bộ ra danh sách Việc cần làm ở Trang chính, (2) Xếp thứ tự môn có hệ số điểm cao trước, (3) Chia nhỏ mỗi bài thành các mốc 45 phút Pomodoro. Đừng quên giữ tối thiểu 6-7 giờ ngủ để không bị sập nguồn!',
  namnhat: 'Theo khảo sát của LEEP trên 120 sinh viên, kỳ 1 năm nhất bạn nên ưu tiên làm quen nhịp học đại học và tạo nhóm học tập tốt. Bạn chưa cần vội đi làm thêm ngay; kỳ 2 hoặc năm 2 khi GPA đã ổn định sẽ là thời điểm vàng để bắt đầu thực tập bán thời gian!',
}

export default function AiAssistantModal({
  onClose,
  onNavigateTab,
}: {
  onClose: () => void
  onNavigateTab?: (tab: 'Cẩm nang' | 'Portfolio' | 'Sự kiện') => void
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Chào bạn! Mình là Trợ lý AI học tập LEEP (Freshman AI Assistant). Mình có thể hỗ trợ bạn lên kế hoạch học tập, gỡ rối deadline, hoặc hướng dẫn xây dựng Portfolio. Bạn đang cần hỗ trợ điều gì hôm nay?',
      time: 'Vừa xong',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || input).trim()
    if (!q) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      time: 'Bây giờ',
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsTyping(true)

    setTimeout(() => {
      let replyText =
        'Cảm ơn bạn đã chia sẻ! Đối với vấn đề này, mình khuyên bạn nên kết hợp xem hướng dẫn chi tiết trong mục Cẩm nang sinh viên năm nhất và ghi lại đầu việc vào danh sách Việc cần làm để theo dõi sát sao nhé.'

      const lower = q.toLowerCase()
      if (lower.includes('gpa') || lower.includes('điểm') || lower.includes('học tập')) {
        replyText = SMART_REPLIES.gpa
      } else if (lower.includes('star') || lower.includes('portfolio') || lower.includes('dự án')) {
        replyText = SMART_REPLIES.star
      } else if (lower.includes('deadline') || lower.includes('dồn') || lower.includes('thời gian')) {
        replyText = SMART_REPLIES.deadline
      } else if (lower.includes('làm thêm') || lower.includes('năm nhất') || lower.includes('clb')) {
        replyText = SMART_REPLIES.namnhat
      }

      const botMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        time: 'Vừa xong',
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 600)
  }

  return (
    <div className="ai-modal-backdrop" onClick={onClose}>
      <div className="ai-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-modal-head">
          <div className="ai-modal-title-group">
            <div className="ai-bot-avatar">🤖</div>
            <div>
              <h3>Trợ lý AI LEEP (Freshman Assistant)</h3>
              <p>Hỗ trợ học tập, định hướng và cân bằng trải nghiệm sinh viên</p>
            </div>
          </div>
          <button type="button" className="ai-close-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        {/* Chat History */}
        <div className="ai-chat-body">
          {messages.map((msg) => (
            <div key={msg.id} className={`ai-message-row ${msg.sender}`}>
              {msg.sender === 'assistant' && <div className="ai-msg-avatar">🤖</div>}
              <div className="ai-bubble">
                <p>{msg.text}</p>
                <span className="ai-time">{msg.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="ai-message-row assistant">
              <div className="ai-msg-avatar">🤖</div>
              <div className="ai-bubble typing">
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </div>
            </div>
          )}
        </div>

        {/* Preset Questions */}
        <div className="ai-presets-tray">
          <small>Gợi ý câu hỏi nhanh:</small>
          <div className="ai-presets-scroll">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                className="ai-preset-chip"
                onClick={() => handleSend(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Nav Shortcut Buttons */}
        {onNavigateTab && (
          <div className="ai-shortcuts-bar">
            <span>Truy cập nhanh:</span>
            <button
              type="button"
              className="ai-quick-btn"
              onClick={() => {
                onClose()
                onNavigateTab('Cẩm nang')
              }}
            >
              📖 Mở Cẩm nang
            </button>
            <button
              type="button"
              className="ai-quick-btn"
              onClick={() => {
                onClose()
                onNavigateTab('Portfolio')
              }}
            >
              💼 Tạo Portfolio
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form
          className="ai-input-form"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
        >
          <input
            type="text"
            className="ai-text-input"
            placeholder="Hỏi trợ lý AI bất kỳ điều gì về học tập, thời gian, deadline..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="ai-send-btn">
            Gửi ➔
          </button>
        </form>
      </div>
    </div>
  )
}
