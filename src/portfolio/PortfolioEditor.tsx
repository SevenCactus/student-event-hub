import { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'
import type {
  PortfolioData,
  PortfolioErrors,
  EducationItem,
  ProjectItem,
  ActivityItem,
  CertificateItem,
  SkillCategory,
  SkillLevel,
} from './types'
import { SKILL_CATEGORY_LABELS, SKILL_LEVELS } from './types'
import { processImageFile } from './imageUtils'

type EventItemReadOnly = {
  id: string
  title: string
  date: string
  status: string
}

type Props = {
  data: PortfolioData
  errors: PortfolioErrors
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void
  events?: EventItemReadOnly[]
}

const SECTIONS = [
  { id: 'personal', errorPrefix: 'personalInfo.', title: 'Thông tin cá nhân', icon: '👤', desc: 'Ảnh, họ tên, liên hệ và câu giới thiệu' },
  { id: 'about', errorPrefix: 'aboutMe', title: 'Giới thiệu bản thân', icon: '📝', desc: 'Tóm tắt câu chuyện và định hướng' },
  { id: 'education', errorPrefix: 'education.', title: 'Học vấn & Đào tạo', icon: '🎓', desc: 'Trường lớp, chuyên ngành và GPA' },
  { id: 'skills', errorPrefix: 'skills.', title: 'Kỹ năng sinh viên', icon: '⚡', desc: 'Chuyên môn, kỹ năng mềm & ngoại ngữ' },
  { id: 'projects', errorPrefix: 'projects.', title: 'Dự án nổi bật', icon: '🚀', desc: 'Sản phẩm, code, demo & vai trò' },
  { id: 'activities', errorPrefix: 'activities.', title: 'Hoạt động & Sự kiện', icon: '🤝', desc: 'Hoạt động phong trào hoặc sự kiện LEEP' },
  { id: 'certificates', errorPrefix: 'certificates.', title: 'Chứng chỉ & Giải thưởng', icon: '🏆', desc: 'Chứng nhận năng lực chuyên môn' },
  { id: 'social', errorPrefix: 'socialLinks.', title: 'Liên kết mạng xã hội', icon: '🌐', desc: 'LinkedIn, GitHub, Facebook, Website' },
]

export default function PortfolioEditor({ data, errors, onChange, events = [] }: Props) {
  const [activeSection, setActiveSection] = useState<string>('personal')
  const [skillInput, setSkillInput] = useState<{ [key in SkillCategory]: string }>({
    'chuyen-mon': '',
    'ky-nang-mem': '',
    'ngoai-ngu': '',
  })
  const [skillLevelChoice, setSkillLevelChoice] = useState<{ [key in SkillCategory]: SkillLevel }>({
    'chuyen-mon': 'Thành thạo',
    'ky-nang-mem': 'Thành thạo',
    'ngoai-ngu': 'Khá',
  })
  const [techInputs, setTechInputs] = useState<Record<string, string>>({})
  const [imageErrors, setImageErrors] = useState<Record<string, string>>({})
  const [showEventSelector, setShowEventSelector] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleSection = (id: string) => {
    setActiveSection((curr) => (curr === id ? '' : id))
  }

  const sectionHasError = (prefix: string) =>
    Object.keys(errors).some((key) => key.startsWith(prefix))

  // Avatar upload handler with inline error
  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const res = await processImageFile(file, 320)
    if (!res.ok) {
      setImageErrors((prev) => ({ ...prev, avatar: res.error }))
      return
    }
    setImageErrors((prev) => {
      const next = { ...prev }
      delete next.avatar
      return next
    })
    onChange((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, avatarUrl: res.dataUrl },
    }))
  }

  // Project image upload
  const handleProjectImageUpload = async (projId: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const errKey = `project.${projId}`
    const res = await processImageFile(file, 640)
    if (!res.ok) {
      setImageErrors((prev) => ({ ...prev, [errKey]: res.error }))
      return
    }
    setImageErrors((prev) => {
      const next = { ...prev }
      delete next[errKey]
      return next
    })
    updateProject(projId, 'imageUrl', res.dataUrl)
  }

  // Certificate image upload
  const handleCertificateImageUpload = async (certId: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const errKey = `cert.${certId}`
    const res = await processImageFile(file, 640)
    if (!res.ok) {
      setImageErrors((prev) => ({ ...prev, [errKey]: res.error }))
      return
    }
    setImageErrors((prev) => {
      const next = { ...prev }
      delete next[errKey]
      return next
    })
    updateCertificate(certId, 'imageUrl', res.dataUrl)
  }

  // Personal Info update helper
  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    onChange((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }

  // Reordering helpers
  const reorder = <T,>(list: T[], index: number, direction: 'up' | 'down'): T[] => {
    const newList = [...list]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newList.length) return list
    const temp = newList[index]
    newList[index] = newList[targetIndex]
    newList[targetIndex] = temp
    return newList
  }

  // Education handlers
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      school: '',
      major: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      gpa: '',
      description: '',
    }
    onChange((prev) => ({
      ...prev,
      education: [...prev.education, newItem],
    }))
  }

  const updateEducation = (id: string, field: keyof EducationItem, value: string | boolean) => {
    onChange((prev) => ({
      ...prev,
      education: prev.education.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const removeEducation = (id: string) => {
    onChange((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }))
  }

  // Skills handlers
  const addSkill = (category: SkillCategory) => {
    const text = skillInput[category].trim()
    if (!text) return
    const newItem = {
      id: `skill-${Date.now()}`,
      name: text,
      category,
      level: skillLevelChoice[category],
    }
    onChange((prev) => ({
      ...prev,
      skills: [...prev.skills, newItem],
    }))
    setSkillInput((prev) => ({ ...prev, [category]: '' }))
  }

  const removeSkill = (id: string) => {
    onChange((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item.id !== id),
    }))
  }

  // Projects handlers
  const addProject = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      technologies: [],
      githubUrl: '',
      demoUrl: '',
      imageUrl: '',
    }
    onChange((prev) => ({
      ...prev,
      projects: [...prev.projects, newItem],
    }))
  }

  const updateProject = (id: string, field: keyof ProjectItem, value: string | string[]) => {
    onChange((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const addProjectTech = (proj: ProjectItem) => {
    const raw = (techInputs[proj.id] || '').trim()
    if (!raw) return
    const parts = raw
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p && !proj.technologies.includes(p))
    if (parts.length > 0) {
      updateProject(proj.id, 'technologies', [...proj.technologies, ...parts])
    }
    setTechInputs((prev) => ({ ...prev, [proj.id]: '' }))
  }

  const removeProjectTech = (proj: ProjectItem, techToRemove: string) => {
    updateProject(
      proj.id,
      'technologies',
      proj.technologies.filter((t) => t !== techToRemove)
    )
  }

  const removeProject = (id: string) => {
    onChange((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }))
  }

  // Activities handlers
  const addActivity = () => {
    const newItem: ActivityItem = {
      id: `act-${Date.now()}`,
      title: '',
      role: '',
      organization: '',
      startDate: '',
      endDate: '',
      description: '',
    }
    onChange((prev) => ({
      ...prev,
      activities: [...prev.activities, newItem],
    }))
  }

  const importEventToActivity = (ev: EventItemReadOnly) => {
    if (data.activities.some((a) => a.fromEventId === ev.id)) return
    const monthFormatted = ev.date ? ev.date.slice(0, 7) : ''
    const newItem: ActivityItem = {
      id: `act-event-${Date.now()}`,
      title: ev.title,
      role: 'Thành viên tham dự',
      organization: 'Hệ thống sự kiện LEEP',
      startDate: monthFormatted,
      endDate: monthFormatted,
      description: `Đã tham gia sự kiện "${ev.title}" (Ngày: ${ev.date} • Trạng thái: ${ev.status}).`,
      fromEventId: ev.id,
    }
    onChange((prev) => ({
      ...prev,
      activities: [...prev.activities, newItem],
    }))
    setShowEventSelector(false)
  }

  const updateActivity = (id: string, field: keyof ActivityItem, value: string) => {
    onChange((prev) => ({
      ...prev,
      activities: prev.activities.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const removeActivity = (id: string) => {
    onChange((prev) => ({
      ...prev,
      activities: prev.activities.filter((item) => item.id !== id),
    }))
  }

  // Certificates handlers
  const addCertificate = () => {
    const newItem: CertificateItem = {
      id: `cert-${Date.now()}`,
      title: '',
      issuer: '',
      issueDate: '',
      credentialUrl: '',
      imageUrl: '',
    }
    onChange((prev) => ({
      ...prev,
      certificates: [...prev.certificates, newItem],
    }))
  }

  const updateCertificate = (id: string, field: keyof CertificateItem, value: string) => {
    onChange((prev) => ({
      ...prev,
      certificates: prev.certificates.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const removeCertificate = (id: string) => {
    onChange((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((item) => item.id !== id),
    }))
  }

  // Social Links helper
  const updateSocialLink = (network: keyof typeof data.socialLinks, value: string) => {
    onChange((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [network]: value },
    }))
  }

  const headlineLength = (data.personalInfo.headline || '').length

  return (
    <div className="portfolio-editor-wrap">
      {/* Stepper Quick Navigation */}
      <nav className="portfolio-stepper" aria-label="Các phần của hồ sơ">
        {SECTIONS.map((sec, idx) => {
          const isActive = activeSection === sec.id
          const hasError = sectionHasError(sec.errorPrefix)
          return (
            <button
              key={sec.id}
              type="button"
              className={`portfolio-step-pill ${isActive ? 'active' : ''}`}
              onClick={() => setActiveSection(sec.id)}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="portfolio-step-badge">{idx + 1}</span>
              <span>{sec.title}</span>
              {hasError && <span style={{ color: '#ef4444' }} aria-label="Có lỗi nhập liệu">•</span>}
            </button>
          )
        })}
      </nav>

      {/* 1. THÔNG TIN CÁ NHÂN */}
      <div className={`portfolio-section-card ${activeSection === 'personal' ? 'expanded' : ''} ${sectionHasError('personalInfo.') ? 'has-error' : ''}`}>
        <button
          type="button"
          className="portfolio-section-header"
          aria-expanded={activeSection === 'personal'}
          onClick={() => toggleSection('personal')}
        >
          <div className="portfolio-section-title-wrap">
            <div className="portfolio-section-icon" aria-hidden="true">👤</div>
            <div>
              <h2 className="portfolio-section-title">1. Thông tin cá nhân</h2>
              <p className="portfolio-section-desc">Ảnh chân dung, họ tên, ngành học và thông tin liên hệ chính</p>
            </div>
          </div>
          <span className="portfolio-chevron" aria-hidden="true">▼</span>
        </button>

        {activeSection === 'personal' && (
          <div className="portfolio-section-body">
            {/* Avatar Uploader */}
            <div className="portfolio-avatar-uploader">
              <div className="portfolio-avatar-preview">
                {data.personalInfo.avatarUrl ? (
                  <img src={data.personalInfo.avatarUrl} alt="Ảnh đại diện đã tải lên" />
                ) : (
                  <span aria-hidden="true">📷</span>
                )}
              </div>
              <div className="portfolio-avatar-actions">
                <input
                  id="p-avatar-input"
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleAvatarUpload}
                />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="portfolio-icon-btn"
                    style={{ padding: '6px 12px' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Tải ảnh đại diện
                  </button>
                  {data.personalInfo.avatarUrl && (
                    <button
                      type="button"
                      className="portfolio-icon-btn portfolio-delete-btn"
                      onClick={() => updatePersonalInfo('avatarUrl', '')}
                    >
                      Xóa ảnh
                    </button>
                  )}
                </div>
                <small className="portfolio-avatar-help">Hỗ trợ JPG, PNG, WEBP (tối đa 2MB). Tự động thu nhỏ vừa vặn.</small>
                {imageErrors.avatar && (
                  <p className="portfolio-error-text" role="alert">⚠️ {imageErrors.avatar}</p>
                )}
              </div>
            </div>

            <div className="portfolio-form-grid two-col">
              <div className="portfolio-form-group">
                <label className="portfolio-label" htmlFor="p-name">
                  <span>Họ và tên <span className="required-mark">*</span></span>
                </label>
                <input
                  id="p-name"
                  className={`portfolio-input ${errors['personalInfo.fullName'] ? 'error' : ''}`}
                  value={data.personalInfo.fullName}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  aria-invalid={Boolean(errors['personalInfo.fullName'])}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                />
                {errors['personalInfo.fullName'] && (
                  <p className="portfolio-error-text" role="alert">⚠️ {errors['personalInfo.fullName']}</p>
                )}
              </div>

              <div className="portfolio-form-group">
                <label className="portfolio-label" htmlFor="p-title">
                  <span>Chức danh / Ngành học</span>
                </label>
                <input
                  id="p-title"
                  className="portfolio-input"
                  value={data.personalInfo.title}
                  placeholder="Ví dụ: Sinh viên Ngôn ngữ & CNTT"
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                />
              </div>

              <div className="portfolio-form-group">
                <label className="portfolio-label" htmlFor="p-school">
                  <span>Trường đại học / Cơ sở đào tạo</span>
                </label>
                <input
                  id="p-school"
                  className="portfolio-input"
                  value={data.personalInfo.school}
                  placeholder="Ví dụ: Đại học Quốc gia TP.HCM"
                  onChange={(e) => updatePersonalInfo('school', e.target.value)}
                />
              </div>

              <div className="portfolio-form-group">
                <label className="portfolio-label" htmlFor="p-email">
                  <span>Địa chỉ email <span className="required-mark">*</span></span>
                </label>
                <input
                  id="p-email"
                  type="email"
                  className={`portfolio-input ${errors['personalInfo.email'] ? 'error' : ''}`}
                  value={data.personalInfo.email}
                  placeholder="name@student.edu.vn"
                  aria-invalid={Boolean(errors['personalInfo.email'])}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                />
                {errors['personalInfo.email'] && (
                  <p className="portfolio-error-text" role="alert">⚠️ {errors['personalInfo.email']}</p>
                )}
              </div>

              <div className="portfolio-form-group">
                <label className="portfolio-label" htmlFor="p-phone">
                  <span>Số điện thoại (tùy chọn)</span>
                </label>
                <input
                  id="p-phone"
                  className={`portfolio-input ${errors['personalInfo.phone'] ? 'error' : ''}`}
                  value={data.personalInfo.phone || ''}
                  placeholder="0901234567"
                  aria-invalid={Boolean(errors['personalInfo.phone'])}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                />
                {errors['personalInfo.phone'] && (
                  <p className="portfolio-error-text" role="alert">⚠️ {errors['personalInfo.phone']}</p>
                )}
              </div>

              <div className="portfolio-form-group">
                <label className="portfolio-label" htmlFor="p-location">
                  <span>Địa điểm</span>
                </label>
                <input
                  id="p-location"
                  className="portfolio-input"
                  value={data.personalInfo.location || ''}
                  placeholder="TP. Hồ Chí Minh, Việt Nam"
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                />
              </div>
            </div>

            <div className="portfolio-form-group">
              <label className="portfolio-label" htmlFor="p-headline">
                <span>Câu giới thiệu ngắn (tối đa 300 ký tự)</span>
                <span className={`portfolio-char-counter ${headlineLength > 280 ? (headlineLength > 300 ? 'limit-exceeded' : 'limit-near') : ''}`}>
                  {headlineLength}/300
                </span>
              </label>
              <textarea
                id="p-headline"
                rows={2}
                className={`portfolio-textarea ${errors['personalInfo.headline'] ? 'error' : ''}`}
                value={data.personalInfo.headline || ''}
                placeholder="Một câu đúc kết đam mê, thế mạnh hoặc mục tiêu nghề nghiệp của bạn..."
                aria-invalid={Boolean(errors['personalInfo.headline'])}
                onChange={(e) => updatePersonalInfo('headline', e.target.value)}
              />
              {errors['personalInfo.headline'] && (
                <p className="portfolio-error-text" role="alert">⚠️ {errors['personalInfo.headline']}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. GIỚI THIỆU BẢN THÂN (ABOUT ME) */}
      <div className={`portfolio-section-card ${activeSection === 'about' ? 'expanded' : ''}`}>
        <button
          type="button"
          className="portfolio-section-header"
          aria-expanded={activeSection === 'about'}
          onClick={() => toggleSection('about')}
        >
          <div className="portfolio-section-title-wrap">
            <div className="portfolio-section-icon" aria-hidden="true">📝</div>
            <div>
              <h2 className="portfolio-section-title">2. Giới thiệu bản thân (About Me)</h2>
              <p className="portfolio-section-desc">Mô tả chi tiết câu chuyện, mục tiêu và cá tính sinh viên của bạn</p>
            </div>
          </div>
          <span className="portfolio-chevron" aria-hidden="true">▼</span>
        </button>

        {activeSection === 'about' && (
          <div className="portfolio-section-body">
            <div className="portfolio-form-group">
              <label className="portfolio-label" htmlFor="p-about">
                <span>Giới thiệu chi tiết</span>
              </label>
              <textarea
                id="p-about"
                rows={5}
                className="portfolio-textarea"
                value={data.aboutMe}
                placeholder="Chia sẻ về sở thích, hành trình học tập, phong cách làm việc nhóm hoặc những gì truyền cảm hứng cho bạn..."
                onChange={(e) => onChange((prev) => ({ ...prev, aboutMe: e.target.value }))}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. HỌC VẤN */}
      <div className={`portfolio-section-card ${activeSection === 'education' ? 'expanded' : ''} ${sectionHasError('education.') ? 'has-error' : ''}`}>
        <button
          type="button"
          className="portfolio-section-header"
          aria-expanded={activeSection === 'education'}
          onClick={() => toggleSection('education')}
        >
          <div className="portfolio-section-title-wrap">
            <div className="portfolio-section-icon" aria-hidden="true">🎓</div>
            <div>
              <h2 className="portfolio-section-title">3. Học vấn & Đào tạo ({data.education.length})</h2>
              <p className="portfolio-section-desc">Các bậc học, chuyên ngành, thời gian và điểm tích lũy</p>
            </div>
          </div>
          <span className="portfolio-chevron" aria-hidden="true">▼</span>
        </button>

        {activeSection === 'education' && (
          <div className="portfolio-section-body">
            <div className="portfolio-items-list">
              {data.education.length === 0 && (
                <p className="portfolio-empty-hint">Chưa có thông tin học vấn nào. Nhấn nút bên dưới để thêm.</p>
              )}
              {data.education.map((edu, idx) => (
                <div key={edu.id} className="portfolio-sub-card">
                  <div className="portfolio-sub-card-header">
                    <span className="portfolio-sub-card-index">Học vấn #{idx + 1}</span>
                    <div className="portfolio-reorder-group">
                      <button
                        type="button"
                        className="portfolio-icon-btn"
                        aria-label={`Di chuyển mục học vấn ${idx + 1} lên`}
                        title="Di chuyển lên"
                        disabled={idx === 0}
                        onClick={() => onChange((prev) => ({ ...prev, education: reorder(prev.education, idx, 'up') }))}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className="portfolio-icon-btn"
                        aria-label={`Di chuyển mục học vấn ${idx + 1} xuống`}
                        title="Di chuyển xuống"
                        disabled={idx === data.education.length - 1}
                        onClick={() => onChange((prev) => ({ ...prev, education: reorder(prev.education, idx, 'down') }))}
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        className="portfolio-icon-btn portfolio-delete-btn"
                        aria-label={`Xóa mục học vấn ${idx + 1}`}
                        onClick={() => removeEducation(edu.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div className="portfolio-form-grid two-col">
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`edu-school-${edu.id}`}>
                        <span>Trường / Viện đào tạo <span className="required-mark">*</span></span>
                      </label>
                      <input
                        id={`edu-school-${edu.id}`}
                        className={`portfolio-input ${errors[`education.${idx}.school`] ? 'error' : ''}`}
                        value={edu.school}
                        placeholder="Đại học Quốc gia..."
                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      />
                      {errors[`education.${idx}.school`] && (
                        <p className="portfolio-error-text" role="alert">⚠️ {errors[`education.${idx}.school`]}</p>
                      )}
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`edu-major-${edu.id}`}>Ngành học / Chuyên ngành</label>
                      <input
                        id={`edu-major-${edu.id}`}
                        className="portfolio-input"
                        value={edu.major}
                        placeholder="Công nghệ Thông tin..."
                        onChange={(e) => updateEducation(edu.id, 'major', e.target.value)}
                      />
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`edu-start-${edu.id}`}>Thời gian bắt đầu</label>
                      <input
                        id={`edu-start-${edu.id}`}
                        type="month"
                        className="portfolio-input"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`edu-end-${edu.id}`}>Thời gian kết thúc</label>
                      <input
                        id={`edu-end-${edu.id}`}
                        type="month"
                        className={`portfolio-input ${errors[`education.${idx}.endDate`] ? 'error' : ''}`}
                        value={edu.endDate}
                        disabled={edu.isCurrent}
                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', marginTop: '4px' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(edu.isCurrent)}
                          onChange={(e) => updateEducation(edu.id, 'isCurrent', e.target.checked)}
                        />
                        Đang theo học tại đây
                      </label>
                      {errors[`education.${idx}.endDate`] && (
                        <p className="portfolio-error-text" role="alert">⚠️ {errors[`education.${idx}.endDate`]}</p>
                      )}
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`edu-gpa-${edu.id}`}>Điểm trung bình (GPA - không bắt buộc)</label>
                      <input
                        id={`edu-gpa-${edu.id}`}
                        className="portfolio-input"
                        value={edu.gpa || ''}
                        placeholder="Ví dụ: 3.6/4.0 hoặc 8.5/10"
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      />
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`edu-desc-${edu.id}`}>Mô tả thêm / Hoạt động tại trường</label>
                      <input
                        id={`edu-desc-${edu.id}`}
                        className="portfolio-input"
                        value={edu.description || ''}
                        placeholder="Học bổng, tham gia CLB sinh viên..."
                        onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className="portfolio-add-item-btn" onClick={addEducation}>
                + Thêm mục học vấn
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. KỸ NĂNG */}
      <div className={`portfolio-section-card ${activeSection === 'skills' ? 'expanded' : ''}`}>
        <button
          type="button"
          className="portfolio-section-header"
          aria-expanded={activeSection === 'skills'}
          onClick={() => toggleSection('skills')}
        >
          <div className="portfolio-section-title-wrap">
            <div className="portfolio-section-icon" aria-hidden="true">⚡</div>
            <div>
              <h2 className="portfolio-section-title">4. Kỹ năng ({data.skills.length})</h2>
              <p className="portfolio-section-desc">Phân loại theo chuyên môn, kỹ năng mềm và ngoại ngữ</p>
            </div>
          </div>
          <span className="portfolio-chevron" aria-hidden="true">▼</span>
        </button>

        {activeSection === 'skills' && (
          <div className="portfolio-section-body">
            {(['chuyen-mon', 'ky-nang-mem', 'ngoai-ngu'] as SkillCategory[]).map((cat) => {
              const categorySkills = data.skills.filter((s) => s.category === cat)
              return (
                <div key={cat} className="portfolio-skills-category-block">
                  <h3 className="portfolio-skills-category-title">
                    <span>{SKILL_CATEGORY_LABELS[cat]}</span>
                    <small style={{ color: '#64748b', fontWeight: 500 }}>{categorySkills.length} thẻ</small>
                  </h3>

                  <div className="portfolio-skill-tags-wrap">
                    {categorySkills.length === 0 ? (
                      <span style={{ fontSize: '0.84rem', color: '#94a3b8', fontStyle: 'italic' }}>Chưa có kỹ năng nào trong nhóm này.</span>
                    ) : (
                      categorySkills.map((sk) => (
                        <span key={sk.id} className="portfolio-skill-tag">
                          <span>{sk.name}</span>
                          <span className="portfolio-skill-level-badge">{sk.level}</span>
                          <button
                            type="button"
                            className="portfolio-tag-remove-btn"
                            aria-label={`Xóa kỹ năng ${sk.name}`}
                            onClick={() => removeSkill(sk.id)}
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  <div className="portfolio-skill-input-row">
                    <input
                      aria-label={`Nhập tên ${SKILL_CATEGORY_LABELS[cat]}`}
                      className="portfolio-input"
                      placeholder={`Thêm thẻ ${SKILL_CATEGORY_LABELS[cat]}... (VD: ${cat === 'chuyen-mon' ? 'React, Python, Figma' : cat === 'ky-nang-mem' ? 'Thuyết trình, Làm việc nhóm' : 'IELTS 7.0, Tiếng Nhật N3'})`}
                      value={skillInput[cat]}
                      onChange={(e) => setSkillInput((prev) => ({ ...prev, [cat]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSkill(cat)
                        }
                      }}
                    />
                    <select
                      aria-label={`Mức độ ${SKILL_CATEGORY_LABELS[cat]}`}
                      className="portfolio-select"
                      value={skillLevelChoice[cat]}
                      onChange={(e) => setSkillLevelChoice((prev) => ({ ...prev, [cat]: e.target.value as SkillLevel }))}
                    >
                      {SKILL_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="portfolio-icon-btn"
                      style={{ padding: '8px 16px', background: '#111e38', color: '#ffffff', border: 'none' }}
                      onClick={() => addSkill(cat)}
                    >
                      + Thêm thẻ
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 5. DỰ ÁN */}
      <div className={`portfolio-section-card ${activeSection === 'projects' ? 'expanded' : ''} ${sectionHasError('projects.') ? 'has-error' : ''}`}>
        <button
          type="button"
          className="portfolio-section-header"
          aria-expanded={activeSection === 'projects'}
          onClick={() => toggleSection('projects')}
        >
          <div className="portfolio-section-title-wrap">
            <div className="portfolio-section-icon" aria-hidden="true">🚀</div>
            <div>
              <h2 className="portfolio-section-title">5. Dự án nổi bật ({data.projects.length})</h2>
              <p className="portfolio-section-desc">Các sản phẩm, bài tập lớn, nghiên cứu khoa học hoặc dự án thực tế</p>
            </div>
          </div>
          <span className="portfolio-chevron" aria-hidden="true">▼</span>
        </button>

        {activeSection === 'projects' && (
          <div className="portfolio-section-body">
            <div className="portfolio-items-list">
              {data.projects.length === 0 && (
                <p className="portfolio-empty-hint">Chưa có dự án nào. Nhấn nút bên dưới để thêm dự án đầu tiên.</p>
              )}
              {data.projects.map((proj, idx) => (
                <div key={proj.id} className="portfolio-sub-card">
                  <div className="portfolio-sub-card-header">
                    <span className="portfolio-sub-card-index">Dự án #{idx + 1}: {proj.title || '(Chưa đặt tên)'}</span>
                    <div className="portfolio-reorder-group">
                      <button
                        type="button"
                        className="portfolio-icon-btn"
                        aria-label={`Di chuyển dự án ${idx + 1} lên`}
                        title="Di chuyển lên"
                        disabled={idx === 0}
                        onClick={() => onChange((prev) => ({ ...prev, projects: reorder(prev.projects, idx, 'up') }))}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className="portfolio-icon-btn"
                        aria-label={`Di chuyển dự án ${idx + 1} xuống`}
                        title="Di chuyển xuống"
                        disabled={idx === data.projects.length - 1}
                        onClick={() => onChange((prev) => ({ ...prev, projects: reorder(prev.projects, idx, 'down') }))}
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        className="portfolio-icon-btn portfolio-delete-btn"
                        aria-label={`Xóa dự án ${idx + 1}`}
                        onClick={() => removeProject(proj.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div className="portfolio-form-grid two-col">
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`proj-title-${proj.id}`}>
                        <span>Tên dự án <span className="required-mark">*</span></span>
                      </label>
                      <input
                        id={`proj-title-${proj.id}`}
                        className={`portfolio-input ${errors[`projects.${idx}.title`] ? 'error' : ''}`}
                        value={proj.title}
                        placeholder="Website Portfolio cá nhân..."
                        onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                      />
                      {errors[`projects.${idx}.title`] && (
                        <p className="portfolio-error-text" role="alert">⚠️ {errors[`projects.${idx}.title`]}</p>
                      )}
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`proj-role-${proj.id}`}>Vai trò trong dự án</label>
                      <input
                        id={`proj-role-${proj.id}`}
                        className="portfolio-input"
                        value={proj.role}
                        placeholder="Frontend Developer / Trưởng nhóm..."
                        onChange={(e) => updateProject(proj.id, 'role', e.target.value)}
                      />
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`proj-start-${proj.id}`}>Thời gian bắt đầu</label>
                      <input
                        id={`proj-start-${proj.id}`}
                        type="month"
                        className="portfolio-input"
                        value={proj.startDate}
                        onChange={(e) => updateProject(proj.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`proj-end-${proj.id}`}>Thời gian kết thúc</label>
                      <input
                        id={`proj-end-${proj.id}`}
                        type="month"
                        className={`portfolio-input ${errors[`projects.${idx}.endDate`] ? 'error' : ''}`}
                        value={proj.endDate}
                        onChange={(e) => updateProject(proj.id, 'endDate', e.target.value)}
                      />
                      {errors[`projects.${idx}.endDate`] && (
                        <p className="portfolio-error-text" role="alert">⚠️ {errors[`projects.${idx}.endDate`]}</p>
                      )}
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`proj-gh-${proj.id}`}>Link kho mã nguồn (GitHub)</label>
                      <input
                        id={`proj-gh-${proj.id}`}
                        className={`portfolio-input ${errors[`projects.${idx}.githubUrl`] ? 'error' : ''}`}
                        value={proj.githubUrl || ''}
                        placeholder="https://github.com/..."
                        onChange={(e) => updateProject(proj.id, 'githubUrl', e.target.value)}
                      />
                      {errors[`projects.${idx}.githubUrl`] && (
                        <p className="portfolio-error-text" role="alert">⚠️ {errors[`projects.${idx}.githubUrl`]}</p>
                      )}
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`proj-demo-${proj.id}`}>Link Demo / Sản phẩm trực tuyến</label>
                      <input
                        id={`proj-demo-${proj.id}`}
                        className={`portfolio-input ${errors[`projects.${idx}.demoUrl`] ? 'error' : ''}`}
                        value={proj.demoUrl || ''}
                        placeholder="https://myproject.com"
                        onChange={(e) => updateProject(proj.id, 'demoUrl', e.target.value)}
                      />
                      {errors[`projects.${idx}.demoUrl`] && (
                        <p className="portfolio-error-text" role="alert">⚠️ {errors[`projects.${idx}.demoUrl`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="portfolio-form-group">
                    <label className="portfolio-label" htmlFor={`proj-tech-${proj.id}`}>Công nghệ & Kỹ năng áp dụng</label>
                    {proj.technologies.length > 0 && (
                      <div className="portfolio-skill-tags-wrap" style={{ marginBottom: '6px' }}>
                        {proj.technologies.map((tech) => (
                          <span key={tech} className="portfolio-skill-tag">
                            <span>{tech}</span>
                            <button
                              type="button"
                              className="portfolio-tag-remove-btn"
                              aria-label={`Xóa công nghệ ${tech}`}
                              onClick={() => removeProjectTech(proj, tech)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="portfolio-skill-input-row">
                      <input
                        id={`proj-tech-${proj.id}`}
                        className="portfolio-input"
                        value={techInputs[proj.id] || ''}
                        placeholder="Nhập công nghệ (VD: React) rồi nhấn Enter hoặc dấu phẩy..."
                        onChange={(e) => setTechInputs((prev) => ({ ...prev, [proj.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault()
                            addProjectTech(proj)
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="portfolio-icon-btn"
                        style={{ padding: '8px 14px', background: '#111e38', color: '#fff', border: 'none' }}
                        onClick={() => addProjectTech(proj)}
                      >
                        + Thêm
                      </button>
                    </div>
                  </div>

                  {/* Project Image Upload */}
                  <div className="portfolio-form-group">
                    <label className="portfolio-label" htmlFor={`proj-img-${proj.id}`}>Ảnh minh họa dự án (tùy chọn)</label>
                    <div className="portfolio-media-row">
                      {proj.imageUrl && (
                        <img className="portfolio-media-thumb" src={proj.imageUrl} alt={`Minh họa ${proj.title}`} />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <label htmlFor={`proj-img-${proj.id}`} className="portfolio-icon-btn" style={{ padding: '6px 12px' }}>
                            📷 {proj.imageUrl ? 'Đổi ảnh' : 'Tải ảnh minh họa'}
                          </label>
                          <input
                            id={`proj-img-${proj.id}`}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            style={{ display: 'none' }}
                            onChange={(e) => handleProjectImageUpload(proj.id, e)}
                          />
                          {proj.imageUrl && (
                            <button
                              type="button"
                              className="portfolio-icon-btn portfolio-delete-btn"
                              onClick={() => updateProject(proj.id, 'imageUrl', '')}
                            >
                              Xóa ảnh
                            </button>
                          )}
                        </div>
                        <small className="portfolio-avatar-help">JPG, PNG, WEBP tối đa 2MB.</small>
                        {imageErrors[`project.${proj.id}`] && (
                          <p className="portfolio-error-text" role="alert">⚠️ {imageErrors[`project.${proj.id}`]}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="portfolio-form-group">
                    <label className="portfolio-label" htmlFor={`proj-desc-${proj.id}`}>Mô tả tính năng và kết quả đạt được</label>
                    <textarea
                      id={`proj-desc-${proj.id}`}
                      rows={3}
                      className="portfolio-textarea"
                      value={proj.description}
                      placeholder="Mô tả bài toán dự án giải quyết, đóng góp của bạn và các điểm nổi bật..."
                      onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <button type="button" className="portfolio-add-item-btn" onClick={addProject}>
                + Thêm dự án mới
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. HOẠT ĐỘNG & SỰ KIỆN */}
      <div className={`portfolio-section-card ${activeSection === 'activities' ? 'expanded' : ''} ${sectionHasError('activities.') ? 'has-error' : ''}`}>
        <button
          type="button"
          className="portfolio-section-header"
          aria-expanded={activeSection === 'activities'}
          onClick={() => toggleSection('activities')}
        >
          <div className="portfolio-section-title-wrap">
            <div className="portfolio-section-icon" aria-hidden="true">🤝</div>
            <div>
              <h2 className="portfolio-section-title">6. Hoạt động & Sự kiện đã tham gia ({data.activities.length})</h2>
              <p className="portfolio-section-desc">Workshop, seminar, hoạt động tình nguyện hoặc chọn từ sự kiện LEEP</p>
            </div>
          </div>
          <span className="portfolio-chevron" aria-hidden="true">▼</span>
        </button>

        {activeSection === 'activities' && (
          <div className="portfolio-section-body">
            {events.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <button
                  type="button"
                  className="portfolio-icon-btn"
                  style={{ padding: '8px 14px', background: '#f1f5f9', fontWeight: 600 }}
                  aria-expanded={showEventSelector}
                  onClick={() => setShowEventSelector(!showEventSelector)}
                >
                  ⚡ Chọn nhanh từ sự kiện LEEP có sẵn ({events.length} sự kiện)
                </button>

                {showEventSelector && (
                  <div className="portfolio-event-picker-dropdown">
                    <p style={{ margin: '0 0 6px', fontSize: '0.8rem', color: '#64748b' }}>
                      Nhấp vào sự kiện bạn muốn đưa vào hồ sơ (chỉ đọc từ danh sách sự kiện):
                    </p>
                    {events.map((ev) => {
                      const alreadyAdded = data.activities.some((a) => a.fromEventId === ev.id)
                      return (
                        <button
                          key={ev.id}
                          type="button"
                          disabled={alreadyAdded}
                          className="portfolio-event-picker-item"
                          onClick={() => importEventToActivity(ev)}
                        >
                          <div style={{ textAlign: 'left' }}>
                            <strong>{ev.title}</strong>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Ngày: {ev.date} • {ev.status}</div>
                          </div>
                          <span style={{ fontSize: '0.85rem', color: alreadyAdded ? '#16a34a' : '#2563eb', fontWeight: 600 }}>
                            {alreadyAdded ? '✓ Đã thêm' : '+ Đưa vào hồ sơ'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="portfolio-items-list">
              {data.activities.length === 0 && (
                <p className="portfolio-empty-hint">Chưa có hoạt động nào. Bạn có thể thêm thủ công hoặc chọn từ sự kiện LEEP phía trên.</p>
              )}
              {data.activities.map((act, idx) => (
                <div key={act.id} className="portfolio-sub-card">
                  <div className="portfolio-sub-card-header">
                    <span className="portfolio-sub-card-index">Hoạt động #{idx + 1}</span>
                    <div className="portfolio-reorder-group">
                      <button
                        type="button"
                        className="portfolio-icon-btn"
                        aria-label={`Di chuyển hoạt động ${idx + 1} lên`}
                        title="Di chuyển lên"
                        disabled={idx === 0}
                        onClick={() => onChange((prev) => ({ ...prev, activities: reorder(prev.activities, idx, 'up') }))}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className="portfolio-icon-btn"
                        aria-label={`Di chuyển hoạt động ${idx + 1} xuống`}
                        title="Di chuyển xuống"
                        disabled={idx === data.activities.length - 1}
                        onClick={() => onChange((prev) => ({ ...prev, activities: reorder(prev.activities, idx, 'down') }))}
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        className="portfolio-icon-btn portfolio-delete-btn"
                        aria-label={`Xóa hoạt động ${idx + 1}`}
                        onClick={() => removeActivity(act.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div className="portfolio-form-grid two-col">
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`act-title-${act.id}`}>
                        <span>Tên hoạt động / Sự kiện <span className="required-mark">*</span></span>
                      </label>
                      <input
                        id={`act-title-${act.id}`}
                        className={`portfolio-input ${errors[`activities.${idx}.title`] ? 'error' : ''}`}
                        value={act.title}
                        placeholder="Hackathon: Build Your Portfolio..."
                        onChange={(e) => updateActivity(act.id, 'title', e.target.value)}
                      />
                      {errors[`activities.${idx}.title`] && (
                        <p className="portfolio-error-text" role="alert">⚠️ {errors[`activities.${idx}.title`]}</p>
                      )}
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`act-role-${act.id}`}>Vai trò</label>
                      <input
                        id={`act-role-${act.id}`}
                        className="portfolio-input"
                        value={act.role}
                        placeholder="Thành viên tham dự / Ban tổ chức..."
                        onChange={(e) => updateActivity(act.id, 'role', e.target.value)}
                      />
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`act-org-${act.id}`}>Đơn vị tổ chức / Câu lạc bộ</label>
                      <input
                        id={`act-org-${act.id}`}
                        className="portfolio-input"
                        value={act.organization || ''}
                        placeholder="CLB Công nghệ LEEP..."
                        onChange={(e) => updateActivity(act.id, 'organization', e.target.value)}
                      />
                    </div>
                    <div className="portfolio-form-grid two-col">
                      <div className="portfolio-form-group">
                        <label className="portfolio-label" htmlFor={`act-start-${act.id}`}>Từ tháng</label>
                        <input
                          id={`act-start-${act.id}`}
                          type="month"
                          className="portfolio-input"
                          value={act.startDate}
                          onChange={(e) => updateActivity(act.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="portfolio-form-group">
                        <label className="portfolio-label" htmlFor={`act-end-${act.id}`}>Đến tháng</label>
                        <input
                          id={`act-end-${act.id}`}
                          type="month"
                          className={`portfolio-input ${errors[`activities.${idx}.endDate`] ? 'error' : ''}`}
                          value={act.endDate || ''}
                          onChange={(e) => updateActivity(act.id, 'endDate', e.target.value)}
                        />
                        {errors[`activities.${idx}.endDate`] && (
                          <p className="portfolio-error-text" role="alert">⚠️ {errors[`activities.${idx}.endDate`]}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="portfolio-form-group">
                    <label className="portfolio-label" htmlFor={`act-desc-${act.id}`}>Chi tiết hoạt động</label>
                    <textarea
                      id={`act-desc-${act.id}`}
                      rows={2}
                      className="portfolio-textarea"
                      value={act.description || ''}
                      placeholder="Mô tả ngắn gọn về hoạt động hoặc giải thưởng nếu có..."
                      onChange={(e) => updateActivity(act.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <button type="button" className="portfolio-add-item-btn" onClick={addActivity}>
                + Thêm hoạt động thủ công
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 7. CHỨNG CHỈ & GIẢI THƯỞNG */}
      <div className={`portfolio-section-card ${activeSection === 'certificates' ? 'expanded' : ''} ${sectionHasError('certificates.') ? 'has-error' : ''}`}>
        <button
          type="button"
          className="portfolio-section-header"
          aria-expanded={activeSection === 'certificates'}
          onClick={() => toggleSection('certificates')}
        >
          <div className="portfolio-section-title-wrap">
            <div className="portfolio-section-icon" aria-hidden="true">🏆</div>
            <div>
              <h2 className="portfolio-section-title">7. Chứng chỉ & Giải thưởng ({data.certificates.length})</h2>
              <p className="portfolio-section-desc">Chứng chỉ quốc tế, giải thưởng học thuật, cuộc thi nghiên cứu</p>
            </div>
          </div>
          <span className="portfolio-chevron" aria-hidden="true">▼</span>
        </button>

        {activeSection === 'certificates' && (
          <div className="portfolio-section-body">
            <div className="portfolio-items-list">
              {data.certificates.length === 0 && (
                <p className="portfolio-empty-hint">Chưa có chứng chỉ hay giải thưởng nào. Nhấn nút bên dưới để thêm.</p>
              )}
              {data.certificates.map((cert, idx) => (
                <div key={cert.id} className="portfolio-sub-card">
                  <div className="portfolio-sub-card-header">
                    <span className="portfolio-sub-card-index">Chứng nhận #{idx + 1}</span>
                    <div className="portfolio-reorder-group">
                      <button
                        type="button"
                        className="portfolio-icon-btn"
                        aria-label={`Di chuyển chứng chỉ ${idx + 1} lên`}
                        title="Di chuyển lên"
                        disabled={idx === 0}
                        onClick={() => onChange((prev) => ({ ...prev, certificates: reorder(prev.certificates, idx, 'up') }))}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className="portfolio-icon-btn"
                        aria-label={`Di chuyển chứng chỉ ${idx + 1} xuống`}
                        title="Di chuyển xuống"
                        disabled={idx === data.certificates.length - 1}
                        onClick={() => onChange((prev) => ({ ...prev, certificates: reorder(prev.certificates, idx, 'down') }))}
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        className="portfolio-icon-btn portfolio-delete-btn"
                        aria-label={`Xóa chứng chỉ ${idx + 1}`}
                        onClick={() => removeCertificate(cert.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div className="portfolio-form-grid two-col">
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`cert-title-${cert.id}`}>
                        <span>Tên chứng chỉ / Giải thưởng <span className="required-mark">*</span></span>
                      </label>
                      <input
                        id={`cert-title-${cert.id}`}
                        className={`portfolio-input ${errors[`certificates.${idx}.title`] ? 'error' : ''}`}
                        value={cert.title}
                        placeholder="IELTS 7.0 / Học bổng Khuyến khích..."
                        onChange={(e) => updateCertificate(cert.id, 'title', e.target.value)}
                      />
                      {errors[`certificates.${idx}.title`] && (
                        <p className="portfolio-error-text" role="alert">⚠️ {errors[`certificates.${idx}.title`]}</p>
                      )}
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`cert-issuer-${cert.id}`}>Đơn vị cấp</label>
                      <input
                        id={`cert-issuer-${cert.id}`}
                        className="portfolio-input"
                        value={cert.issuer}
                        placeholder="IDP / freeCodeCamp / Nhà trường..."
                        onChange={(e) => updateCertificate(cert.id, 'issuer', e.target.value)}
                      />
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`cert-date-${cert.id}`}>Thời gian nhận</label>
                      <input
                        id={`cert-date-${cert.id}`}
                        type="month"
                        className="portfolio-input"
                        value={cert.issueDate}
                        onChange={(e) => updateCertificate(cert.id, 'issueDate', e.target.value)}
                      />
                    </div>
                    <div className="portfolio-form-group">
                      <label className="portfolio-label" htmlFor={`cert-url-${cert.id}`}>Đường dẫn xác minh (URL)</label>
                      <input
                        id={`cert-url-${cert.id}`}
                        className={`portfolio-input ${errors[`certificates.${idx}.credentialUrl`] ? 'error' : ''}`}
                        value={cert.credentialUrl || ''}
                        placeholder="https://..."
                        onChange={(e) => updateCertificate(cert.id, 'credentialUrl', e.target.value)}
                      />
                      {errors[`certificates.${idx}.credentialUrl`] && (
                        <p className="portfolio-error-text" role="alert">⚠️ {errors[`certificates.${idx}.credentialUrl`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Certificate Image Upload */}
                  <div className="portfolio-form-group">
                    <label className="portfolio-label" htmlFor={`cert-img-${cert.id}`}>Ảnh chụp chứng chỉ / bằng khen (tùy chọn)</label>
                    <div className="portfolio-media-row">
                      {cert.imageUrl && (
                        <img className="portfolio-media-thumb" src={cert.imageUrl} alt={`Ảnh chứng chỉ ${cert.title}`} />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <label htmlFor={`cert-img-${cert.id}`} className="portfolio-icon-btn" style={{ padding: '6px 12px' }}>
                            🖼️ {cert.imageUrl ? 'Đổi ảnh' : 'Tải ảnh chứng chỉ'}
                          </label>
                          <input
                            id={`cert-img-${cert.id}`}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            style={{ display: 'none' }}
                            onChange={(e) => handleCertificateImageUpload(cert.id, e)}
                          />
                          {cert.imageUrl && (
                            <button
                              type="button"
                              className="portfolio-icon-btn portfolio-delete-btn"
                              onClick={() => updateCertificate(cert.id, 'imageUrl', '')}
                            >
                              Xóa ảnh
                            </button>
                          )}
                        </div>
                        <small className="portfolio-avatar-help">JPG, PNG, WEBP tối đa 2MB.</small>
                        {imageErrors[`cert.${cert.id}`] && (
                          <p className="portfolio-error-text" role="alert">⚠️ {imageErrors[`cert.${cert.id}`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className="portfolio-add-item-btn" onClick={addCertificate}>
                + Thêm chứng chỉ / giải thưởng
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 8. LIÊN KẾT MẠNG XÃ HỘI */}
      <div className={`portfolio-section-card ${activeSection === 'social' ? 'expanded' : ''} ${sectionHasError('socialLinks.') ? 'has-error' : ''}`}>
        <button
          type="button"
          className="portfolio-section-header"
          aria-expanded={activeSection === 'social'}
          onClick={() => toggleSection('social')}
        >
          <div className="portfolio-section-title-wrap">
            <div className="portfolio-section-icon" aria-hidden="true">🌐</div>
            <div>
              <h2 className="portfolio-section-title">8. Liên kết mạng xã hội & Kênh cá nhân</h2>
              <p className="portfolio-section-desc">Kết nối LinkedIn, GitHub, Facebook và website riêng</p>
            </div>
          </div>
          <span className="portfolio-chevron" aria-hidden="true">▼</span>
        </button>

        {activeSection === 'social' && (
          <div className="portfolio-section-body">
            <div className="portfolio-form-grid two-col">
              <div className="portfolio-form-group">
                <label className="portfolio-label" htmlFor="soc-linkedin">LinkedIn</label>
                <input
                  id="soc-linkedin"
                  className={`portfolio-input ${errors['socialLinks.linkedin'] ? 'error' : ''}`}
                  value={data.socialLinks.linkedin || ''}
                  placeholder="https://linkedin.com/in/..."
                  onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                />
                {errors['socialLinks.linkedin'] && (
                  <p className="portfolio-error-text" role="alert">⚠️ {errors['socialLinks.linkedin']}</p>
                )}
              </div>

              <div className="portfolio-form-group">
                <label className="portfolio-label" htmlFor="soc-github">GitHub</label>
                <input
                  id="soc-github"
                  className={`portfolio-input ${errors['socialLinks.github'] ? 'error' : ''}`}
                  value={data.socialLinks.github || ''}
                  placeholder="https://github.com/..."
                  onChange={(e) => updateSocialLink('github', e.target.value)}
                />
                {errors['socialLinks.github'] && (
                  <p className="portfolio-error-text" role="alert">⚠️ {errors['socialLinks.github']}</p>
                )}
              </div>

              <div className="portfolio-form-group">
                <label className="portfolio-label" htmlFor="soc-facebook">Facebook</label>
                <input
                  id="soc-facebook"
                  className={`portfolio-input ${errors['socialLinks.facebook'] ? 'error' : ''}`}
                  value={data.socialLinks.facebook || ''}
                  placeholder="https://facebook.com/..."
                  onChange={(e) => updateSocialLink('facebook', e.target.value)}
                />
                {errors['socialLinks.facebook'] && (
                  <p className="portfolio-error-text" role="alert">⚠️ {errors['socialLinks.facebook']}</p>
                )}
              </div>

              <div className="portfolio-form-group">
                <label className="portfolio-label" htmlFor="soc-website">Website cá nhân / Blog</label>
                <input
                  id="soc-website"
                  className={`portfolio-input ${errors['socialLinks.website'] ? 'error' : ''}`}
                  value={data.socialLinks.website || ''}
                  placeholder="https://mywebsite.com"
                  onChange={(e) => updateSocialLink('website', e.target.value)}
                />
                {errors['socialLinks.website'] && (
                  <p className="portfolio-error-text" role="alert">⚠️ {errors['socialLinks.website']}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
