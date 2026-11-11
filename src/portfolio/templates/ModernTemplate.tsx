import type { PortfolioData } from '../types'
import { SKILL_CATEGORY_LABELS } from '../types'

export default function ModernTemplate({ data }: { data: PortfolioData }) {
  const { personalInfo, aboutMe, education, skills, projects, activities, certificates, socialLinks, primaryColor } = data

  const hasSkills = skills && skills.length > 0
  const hasProjects = projects && projects.length > 0
  const hasEducation = education && education.length > 0
  const hasActivities = activities && activities.length > 0
  const hasCertificates = certificates && certificates.length > 0
  const hasSocial = Object.values(socialLinks || {}).some(Boolean)

  return (
    <div className="portfolio-tpl-modern" style={{ '--pf-primary': primaryColor } as React.CSSProperties}>
      {/* Hero Card */}
      <div className="pf-mod-hero">
        <div className="pf-mod-hero-main">
          {personalInfo.avatarUrl ? (
            <img className="pf-mod-avatar" src={personalInfo.avatarUrl} alt={personalInfo.fullName} />
          ) : (
            <div className="pf-mod-avatar-placeholder">
              {personalInfo.fullName ? personalInfo.fullName.charAt(0).toUpperCase() : 'S'}
            </div>
          )}
          <div className="pf-mod-hero-info">
            <span className="pf-mod-badge">SINH VIÊN LEEP</span>
            <h1 className="pf-mod-name">{personalInfo.fullName || 'Họ và tên'}</h1>
            {personalInfo.title && <p className="pf-mod-title">{personalInfo.title}</p>}
            {personalInfo.headline && <p className="pf-mod-headline">{personalInfo.headline}</p>}
          </div>
        </div>

        {/* Contact Pills */}
        <div className="pf-mod-contact-grid">
          {personalInfo.school && <div className="pf-mod-contact-pill"><span>🏫</span> {personalInfo.school}</div>}
          {personalInfo.email && <div className="pf-mod-contact-pill"><span>✉</span> {personalInfo.email}</div>}
          {personalInfo.phone && <div className="pf-mod-contact-pill"><span>📞</span> {personalInfo.phone}</div>}
          {personalInfo.location && <div className="pf-mod-contact-pill"><span>📍</span> {personalInfo.location}</div>}
        </div>
      </div>

      {/* About */}
      {aboutMe && (
        <section className="pf-mod-card">
          <div className="pf-mod-card-header">
            <span className="pf-mod-card-icon">💡</span>
            <h2>Giới thiệu bản thân</h2>
          </div>
          <p className="pf-mod-about-text">{aboutMe}</p>
        </section>
      )}

      {/* Skills Grid */}
      {hasSkills && (
        <section className="pf-mod-card">
          <div className="pf-mod-card-header">
            <span className="pf-mod-card-icon">⚡</span>
            <h2>Kỹ năng năng lực</h2>
          </div>
          <div className="pf-mod-skills-container">
            {(['chuyen-mon', 'ky-nang-mem', 'ngoai-ngu'] as const).map((cat) => {
              const catSkills = skills.filter((s) => s.category === cat)
              if (catSkills.length === 0) return null
              return (
                <div key={cat} className="pf-mod-skill-cat-box">
                  <h3 className="pf-mod-skill-cat-title">{SKILL_CATEGORY_LABELS[cat]}</h3>
                  <div className="pf-mod-skill-badges">
                    {catSkills.map((s) => (
                      <span key={s.id} className="pf-mod-skill-badge">
                        <strong>{s.name}</strong>
                        <small>{s.level}</small>
                      </span>
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
        <section className="pf-mod-card">
          <div className="pf-mod-card-header">
            <span className="pf-mod-card-icon">🚀</span>
            <h2>Dự án nổi bật</h2>
          </div>
          <div className="pf-mod-projects-grid">
            {projects.map((proj) => (
              <div key={proj.id} className="pf-mod-project-card">
                <div className="pf-mod-project-head">
                  <h3>{proj.title}</h3>
                  {proj.role && <span className="pf-mod-project-role">{proj.role}</span>}
                </div>
                {(proj.startDate || proj.endDate) && (
                  <span className="pf-mod-date-text">
                    Thời gian: {proj.startDate} {proj.endDate ? `— ${proj.endDate}` : ''}
                  </span>
                )}
                {proj.imageUrl && (
                  <img className="pf-tpl-project-img" src={proj.imageUrl} alt={`Minh họa ${proj.title}`} />
                )}
                {proj.description && <p className="pf-mod-project-desc">{proj.description}</p>}
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="pf-mod-tech-wrap">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="pf-mod-tech-tag">{t}</span>
                    ))}
                  </div>
                )}
                <div className="pf-mod-card-links">
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="pf-mod-btn-link">
                      Source Code ↗
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="pf-mod-btn-link primary">
                      Trải nghiệm Demo ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {hasEducation && (
        <section className="pf-mod-card">
          <div className="pf-mod-card-header">
            <span className="pf-mod-card-icon">🎓</span>
            <h2>Học vấn & Bằng cấp</h2>
          </div>
          <div className="pf-mod-timeline">
            {education.map((edu) => (
              <div key={edu.id} className="pf-mod-timeline-item">
                <div className="pf-mod-timeline-dot" />
                <div className="pf-mod-timeline-content">
                  <div className="pf-mod-timeline-head">
                    <h3>{edu.school}</h3>
                    <span className="pf-mod-timeline-date">
                      {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : edu.isCurrent ? '— Hiện tại' : ''}
                    </span>
                  </div>
                  {edu.major && (
                    <p className="pf-mod-timeline-sub">
                      <strong>{edu.major}</strong> {edu.gpa && <span>(GPA: {edu.gpa})</span>}
                    </p>
                  )}
                  {edu.description && <p className="pf-mod-timeline-desc">{edu.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Activities */}
      {hasActivities && (
        <section className="pf-mod-card">
          <div className="pf-mod-card-header">
            <span className="pf-mod-card-icon">🤝</span>
            <h2>Hoạt động & Sự kiện</h2>
          </div>
          <div className="pf-mod-timeline">
            {activities.map((act) => (
              <div key={act.id} className="pf-mod-timeline-item">
                <div className="pf-mod-timeline-dot" />
                <div className="pf-mod-timeline-content">
                  <div className="pf-mod-timeline-head">
                    <h3>{act.title}</h3>
                    {act.startDate && (
                      <span className="pf-mod-timeline-date">
                        {act.startDate}{act.endDate && act.endDate !== act.startDate ? ` — ${act.endDate}` : ''}
                      </span>
                    )}
                  </div>
                  {(act.role || act.organization) && (
                    <p className="pf-mod-timeline-sub">
                      {[act.role, act.organization].filter(Boolean).join(' • ')}
                    </p>
                  )}
                  {act.description && <p className="pf-mod-timeline-desc">{act.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certificates */}
      {hasCertificates && (
        <section className="pf-mod-card">
          <div className="pf-mod-card-header">
            <span className="pf-mod-card-icon">🏆</span>
            <h2>Chứng chỉ & Giải thưởng</h2>
          </div>
          <div className="pf-mod-certs-grid">
            {certificates.map((cert) => (
              <div key={cert.id} className="pf-mod-cert-box">
                <div style={{ flex: 1 }}>
                  <h4>{cert.title}</h4>
                  {cert.issuer && <p>{cert.issuer} {cert.issueDate && `• ${cert.issueDate}`}</p>}
                  {cert.imageUrl && (
                    <img className="pf-tpl-cert-img" src={cert.imageUrl} alt={`Chứng chỉ ${cert.title}`} />
                  )}
                </div>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="pf-mod-cert-link">
                    Chứng nhận ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Links Footer */}
      {hasSocial && (
        <footer className="pf-mod-footer">
          <p className="pf-mod-footer-label">KẾT NỐI VỚI TÔI</p>
          <div className="pf-mod-social-pills">
            {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noreferrer">GitHub</a>}
            {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noreferrer">Facebook</a>}
            {socialLinks.website && <a href={socialLinks.website} target="_blank" rel="noreferrer">Trang cá nhân</a>}
          </div>
        </footer>
      )}
    </div>
  )
}

