import type { PortfolioData } from '../types'
import { SKILL_CATEGORY_LABELS } from '../types'

export default function CreativeTemplate({ data }: { data: PortfolioData }) {
  const { personalInfo, aboutMe, education, skills, projects, activities, certificates, socialLinks, primaryColor } = data

  const hasSkills = skills && skills.length > 0
  const hasProjects = projects && projects.length > 0
  const hasEducation = education && education.length > 0
  const hasActivities = activities && activities.length > 0
  const hasCertificates = certificates && certificates.length > 0
  const hasSocial = Object.values(socialLinks || {}).some(Boolean)

  return (
    <div className="portfolio-tpl-creative" style={{ '--pf-primary': primaryColor } as React.CSSProperties}>
      {/* Accent Hero Banner */}
      <div className="pf-cre-hero">
        <div className="pf-cre-hero-accent" />
        <div className="pf-cre-hero-body">
          {personalInfo.avatarUrl ? (
            <img className="pf-cre-avatar" src={personalInfo.avatarUrl} alt={personalInfo.fullName} />
          ) : (
            <div className="pf-cre-avatar-placeholder">✦</div>
          )}
          <div className="pf-cre-hero-text">
            <p className="pf-cre-eyebrow">PORTFOLIO SINH VIÊN</p>
            <h1 className="pf-cre-name">{personalInfo.fullName || 'Họ và tên'}</h1>
            {personalInfo.title && <p className="pf-cre-title">{personalInfo.title}</p>}
          </div>
        </div>
        {personalInfo.headline && (
          <div className="pf-cre-headline-strip">
            <span className="pf-cre-quote-mark">❝</span>
            <p>{personalInfo.headline}</p>
          </div>
        )}
        <div className="pf-cre-contact-bar">
          {personalInfo.school && <span>🏫 {personalInfo.school}</span>}
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
        </div>
      </div>

      {/* About */}
      {aboutMe && (
        <section className="pf-cre-section">
          <div className="pf-cre-section-label">
            <span className="pf-cre-accent-dot" />
            <h2>Câu chuyện của tôi</h2>
          </div>
          <p className="pf-cre-body-text">{aboutMe}</p>
        </section>
      )}

      {/* Education */}
      {hasEducation && (
        <section className="pf-cre-section">
          <div className="pf-cre-section-label">
            <span className="pf-cre-accent-dot" />
            <h2>Hành trình học vấn</h2>
          </div>
          <div className="pf-cre-cards-row">
            {education.map((edu) => (
              <div key={edu.id} className="pf-cre-edu-card">
                <div className="pf-cre-edu-card-top">
                  <span className="pf-cre-edu-icon">🎓</span>
                  <span className="pf-cre-edu-date">
                    {edu.startDate} — {edu.isCurrent ? 'Hiện tại' : edu.endDate || '?'}
                  </span>
                </div>
                <h3>{edu.school}</h3>
                {edu.major && <p className="pf-cre-edu-major">{edu.major}</p>}
                {edu.gpa && <span className="pf-cre-gpa-badge">GPA: {edu.gpa}</span>}
                {edu.description && <p className="pf-cre-edu-desc">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {hasSkills && (
        <section className="pf-cre-section">
          <div className="pf-cre-section-label">
            <span className="pf-cre-accent-dot" />
            <h2>Bộ kỹ năng</h2>
          </div>
          <div className="pf-cre-skills-grid">
            {(['chuyen-mon', 'ky-nang-mem', 'ngoai-ngu'] as const).map((cat) => {
              const catSkills = skills.filter((s) => s.category === cat)
              if (catSkills.length === 0) return null
              return (
                <div key={cat} className="pf-cre-skill-block">
                  <h4 className="pf-cre-skill-cat">{SKILL_CATEGORY_LABELS[cat]}</h4>
                  <div className="pf-cre-skill-items">
                    {catSkills.map((s) => (
                      <div key={s.id} className="pf-cre-skill-chip">
                        <span className="pf-cre-skill-name">{s.name}</span>
                        <span className={`pf-cre-skill-level pf-cre-lvl-${s.level === 'Xuất sắc' ? '4' : s.level === 'Thành thạo' ? '3' : s.level === 'Khá' ? '2' : '1'}`}>
                          {s.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Projects */}
      {hasProjects && (
        <section className="pf-cre-section">
          <div className="pf-cre-section-label">
            <span className="pf-cre-accent-dot" />
            <h2>Dự án & Sản phẩm</h2>
          </div>
          <div className="pf-cre-projects-list">
            {projects.map((proj, idx) => (
              <div key={proj.id} className="pf-cre-project-row">
                <div className="pf-cre-project-num">{String(idx + 1).padStart(2, '0')}</div>
                <div className="pf-cre-project-body">
                  <h3>{proj.title}</h3>
                  {proj.role && <span className="pf-cre-project-role">{proj.role}</span>}
                  {(proj.startDate || proj.endDate) && (
                    <span className="pf-cre-project-date">{proj.startDate} {proj.endDate ? `— ${proj.endDate}` : ''}</span>
                  )}
                  {proj.imageUrl && (
                    <img className="pf-tpl-project-img" src={proj.imageUrl} alt={`Minh họa ${proj.title}`} />
                  )}
                  {proj.description && <p>{proj.description}</p>}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="pf-cre-tech-tags">
                      {proj.technologies.map((t, i) => <span key={i} className="pf-cre-tech-tag">{t}</span>)}
                    </div>
                  )}
                  <div className="pf-cre-project-links">
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}
                    {proj.demoUrl && <a href={proj.demoUrl} target="_blank" rel="noreferrer">Demo ↗</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Activities */}
      {hasActivities && (
        <section className="pf-cre-section">
          <div className="pf-cre-section-label">
            <span className="pf-cre-accent-dot" />
            <h2>Hoạt động phong trào</h2>
          </div>
          {activities.map((act) => (
            <div key={act.id} className="pf-cre-activity-item">
              <strong>{act.title}</strong>
              {(act.role || act.organization) && (
                <span className="pf-cre-act-sub">{[act.role, act.organization].filter(Boolean).join(' — ')}</span>
              )}
              {act.startDate && (
                <span className="pf-cre-act-date">
                  {act.startDate}{act.endDate && act.endDate !== act.startDate ? ` — ${act.endDate}` : ''}
                </span>
              )}
              {act.description && <p>{act.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Certificates */}
      {hasCertificates && (
        <section className="pf-cre-section">
          <div className="pf-cre-section-label">
            <span className="pf-cre-accent-dot" />
            <h2>Thành tựu đạt được</h2>
          </div>
          <div className="pf-cre-certs-row">
            {certificates.map((cert) => (
              <div key={cert.id} className="pf-cre-cert-card">
                <span className="pf-cre-cert-icon">🏅</span>
                <div>
                  <h4>{cert.title}</h4>
                  {cert.issuer && <p>{cert.issuer}</p>}
                  {cert.issueDate && <small>{cert.issueDate}</small>}
                  {cert.imageUrl && (
                    <img className="pf-tpl-cert-img" src={cert.imageUrl} alt={`Chứng chỉ ${cert.title}`} />
                  )}
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer">Xác minh ↗</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Footer */}
      {hasSocial && (
        <footer className="pf-cre-footer">
          <span className="pf-cre-footer-label">✦ Kết nối</span>
          <div className="pf-cre-footer-links">
            {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noreferrer">GitHub</a>}
            {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noreferrer">Facebook</a>}
            {socialLinks.website && <a href={socialLinks.website} target="_blank" rel="noreferrer">Website</a>}
          </div>
        </footer>
      )}
    </div>
  )
}

