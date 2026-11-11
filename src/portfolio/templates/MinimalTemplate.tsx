import type { PortfolioData } from '../types'
import { SKILL_CATEGORY_LABELS } from '../types'

export default function MinimalTemplate({ data }: { data: PortfolioData }) {
  const { personalInfo, aboutMe, education, skills, projects, activities, certificates, socialLinks, primaryColor } = data

  const hasSkills = skills && skills.length > 0
  const hasProjects = projects && projects.length > 0
  const hasEducation = education && education.length > 0
  const hasActivities = activities && activities.length > 0
  const hasCertificates = certificates && certificates.length > 0
  const hasSocial = Object.values(socialLinks || {}).some(Boolean)

  return (
    <div className="portfolio-tpl-minimal" style={{ '--pf-primary': primaryColor } as React.CSSProperties}>
      {/* Header */}
      <header className="pf-min-header">
        {personalInfo.avatarUrl && (
          <img className="pf-min-avatar" src={personalInfo.avatarUrl} alt={personalInfo.fullName} />
        )}
        <div className="pf-min-header-text">
          <h1 className="pf-min-name">{personalInfo.fullName || 'Họ và tên'}</h1>
          {personalInfo.title && <p className="pf-min-title">{personalInfo.title}</p>}
          <div className="pf-min-contact-row">
            {personalInfo.school && <span>🏫 {personalInfo.school}</span>}
            {personalInfo.email && <span>✉ {personalInfo.email}</span>}
            {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          </div>
        </div>
      </header>

      {personalInfo.headline && (
        <blockquote className="pf-min-headline">
          "{personalInfo.headline}"
        </blockquote>
      )}

      {/* About */}
      {aboutMe && (
        <section className="pf-min-section">
          <h2 className="pf-min-section-title">Giới thiệu</h2>
          <p className="pf-min-about">{aboutMe}</p>
        </section>
      )}

      {/* Education */}
      {hasEducation && (
        <section className="pf-min-section">
          <h2 className="pf-min-section-title">Học vấn</h2>
          <div className="pf-min-list">
            {education.map((edu) => (
              <div key={edu.id} className="pf-min-item">
                <div className="pf-min-item-head">
                  <strong className="pf-min-item-title">{edu.school}</strong>
                  <span className="pf-min-item-date">
                    {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : edu.isCurrent ? '— Hiện tại' : ''}
                  </span>
                </div>
                {edu.major && <p className="pf-min-item-sub">{edu.major} {edu.gpa && `• GPA: ${edu.gpa}`}</p>}
                {edu.description && <p className="pf-min-item-desc">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {hasSkills && (
        <section className="pf-min-section">
          <h2 className="pf-min-section-title">Kỹ năng</h2>
          {(['chuyen-mon', 'ky-nang-mem', 'ngoai-ngu'] as const).map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat)
            if (catSkills.length === 0) return null
            return (
              <div key={cat} className="pf-min-skill-group">
                <span className="pf-min-skill-cat">{SKILL_CATEGORY_LABELS[cat]}:</span>
                <span className="pf-min-skill-tags">
                  {catSkills.map((s) => (
                    <span key={s.id} className="pf-min-skill-tag">{s.name} <small>({s.level})</small></span>
                  ))}
                </span>
              </div>
            )
          })}
        </section>
      )}

      {/* Projects */}
      {hasProjects && (
        <section className="pf-min-section">
          <h2 className="pf-min-section-title">Dự án</h2>
          <div className="pf-min-list">
            {projects.map((proj) => (
              <div key={proj.id} className="pf-min-item">
                <div className="pf-min-item-head">
                  <strong className="pf-min-item-title">{proj.title}</strong>
                  {(proj.startDate || proj.endDate) && (
                    <span className="pf-min-item-date">{proj.startDate} {proj.endDate ? `— ${proj.endDate}` : ''}</span>
                  )}
                </div>
                {proj.role && <p className="pf-min-item-sub">Vai trò: {proj.role}</p>}
                {proj.imageUrl && (
                  <img className="pf-tpl-project-img" src={proj.imageUrl} alt={`Minh họa ${proj.title}`} />
                )}
                {proj.description && <p className="pf-min-item-desc">{proj.description}</p>}
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="pf-min-tech-row">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="pf-min-tech-pill">{t}</span>
                    ))}
                  </div>
                )}
                <div className="pf-min-links">
                  {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}
                  {proj.demoUrl && <a href={proj.demoUrl} target="_blank" rel="noreferrer">Demo ↗</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Activities */}
      {hasActivities && (
        <section className="pf-min-section">
          <h2 className="pf-min-section-title">Hoạt động & Sự kiện</h2>
          <div className="pf-min-list">
            {activities.map((act) => (
              <div key={act.id} className="pf-min-item">
                <div className="pf-min-item-head">
                  <strong className="pf-min-item-title">{act.title}</strong>
                  {act.startDate && (
                    <span className="pf-min-item-date">
                      {act.startDate}{act.endDate && act.endDate !== act.startDate ? ` — ${act.endDate}` : ''}
                    </span>
                  )}
                </div>
                {(act.role || act.organization) && (
                  <p className="pf-min-item-sub">{[act.role, act.organization].filter(Boolean).join(' • ')}</p>
                )}
                {act.description && <p className="pf-min-item-desc">{act.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certificates */}
      {hasCertificates && (
        <section className="pf-min-section">
          <h2 className="pf-min-section-title">Chứng chỉ & Giải thưởng</h2>
          <div className="pf-min-list">
            {certificates.map((cert) => (
              <div key={cert.id} className="pf-min-item">
                <div className="pf-min-item-head">
                  <strong className="pf-min-item-title">{cert.title}</strong>
                  {cert.issueDate && <span className="pf-min-item-date">{cert.issueDate}</span>}
                </div>
                {cert.issuer && <p className="pf-min-item-sub">Cấp bởi: {cert.issuer}</p>}
                {cert.imageUrl && (
                  <img className="pf-tpl-cert-img" src={cert.imageUrl} alt={`Chứng chỉ ${cert.title}`} />
                )}
                {cert.credentialUrl && (
                  <a className="pf-min-link" href={cert.credentialUrl} target="_blank" rel="noreferrer">
                    Xem xác minh ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social */}
      {hasSocial && (
        <footer className="pf-min-footer">
          {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noreferrer">GitHub</a>}
          {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noreferrer">Facebook</a>}
          {socialLinks.website && <a href={socialLinks.website} target="_blank" rel="noreferrer">Website</a>}
        </footer>
      )}
    </div>
  )
}

