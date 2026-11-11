import type { PortfolioData, PortfolioTemplateId } from './types'
import { PORTFOLIO_COLOR_PALETTES } from './types'
import MinimalTemplate from './templates/MinimalTemplate'
import ModernTemplate from './templates/ModernTemplate'
import CreativeTemplate from './templates/CreativeTemplate'

type Props = {
  data: PortfolioData
  onChangeTemplate: (id: PortfolioTemplateId) => void
  onChangeColor: (color: string) => void
}

const TEMPLATES: { id: PortfolioTemplateId; label: string; desc: string }[] = [
  { id: 'minimal', label: '📄 Tối giản', desc: 'Thanh lịch, chữ rõ, tập trung nội dung' },
  { id: 'modern', label: '💎 Hiện đại', desc: 'Chia khối thẻ, timeline đồ họa sinh động' },
  { id: 'creative', label: '🎨 Sáng tạo', desc: 'Accent màu nổi bật, đánh số dự án' },
]

export default function PortfolioPreview({ data, onChangeTemplate, onChangeColor }: Props) {
  const { personalInfo, aboutMe, education, skills, projects, activities, certificates, socialLinks } = data

  const isPortfolioEmpty =
    !personalInfo.fullName?.trim() &&
    !personalInfo.title?.trim() &&
    !personalInfo.email?.trim() &&
    !personalInfo.headline?.trim() &&
    !aboutMe?.trim() &&
    education.length === 0 &&
    skills.length === 0 &&
    projects.length === 0 &&
    activities.length === 0 &&
    certificates.length === 0 &&
    !Object.values(socialLinks || {}).some(Boolean)

  return (
    <div className="portfolio-preview-panel">
      {/* Template & Color Picker Bar */}
      <div className="portfolio-preview-toolbar">
        <div className="portfolio-template-picker">
          <span className="portfolio-toolbar-label">Mẫu giao diện:</span>
          <div className="portfolio-template-btns" role="group" aria-label="Chọn mẫu giao diện portfolio">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                aria-pressed={data.templateId === tpl.id}
                className={`portfolio-template-btn ${data.templateId === tpl.id ? 'active' : ''}`}
                onClick={() => onChangeTemplate(tpl.id)}
                title={tpl.desc}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="portfolio-color-picker">
          <span className="portfolio-toolbar-label">Màu chủ đạo:</span>
          <div className="portfolio-color-swatches" role="group" aria-label="Chọn màu chủ đạo portfolio">
            {PORTFOLIO_COLOR_PALETTES.map((c) => (
              <button
                key={c.value}
                type="button"
                aria-pressed={data.primaryColor === c.value}
                className={`portfolio-color-swatch ${data.primaryColor === c.value ? 'active' : ''}`}
                style={{ background: c.value, color: c.value }}
                title={c.name}
                onClick={() => onChangeColor(c.value)}
                aria-label={c.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview Render */}
      <div className="portfolio-preview-frame" id="portfolio-preview-area">
        {isPortfolioEmpty ? (
          <div className="portfolio-preview-empty">
            <span aria-hidden="true" style={{ fontSize: '2.5rem' }}>✨</span>
            <h3>Bản xem trước Portfolio trống</h3>
            <p>Hãy điền Thông tin cá nhân và các mục ở biểu mẫu bên cạnh. Nội dung sẽ cập nhật ngay lập tức tại đây.</p>
          </div>
        ) : (
          <>
            {data.templateId === 'minimal' && <MinimalTemplate data={data} />}
            {data.templateId === 'modern' && <ModernTemplate data={data} />}
            {data.templateId === 'creative' && <CreativeTemplate data={data} />}
          </>
        )}
      </div>
    </div>
  )
}
