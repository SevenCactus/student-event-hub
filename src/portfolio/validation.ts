import type { PortfolioData, PortfolioErrors } from './types'

export function isValidUrl(url: string): boolean {
  if (!url || !url.trim()) return true
  try {
    const parsed = new URL(url.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function isValidEmail(email: string): boolean {
  if (!email || !email.trim()) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.trim())
}

export function isValidPhone(phone: string): boolean {
  if (!phone || !phone.trim()) return true
  const re = /^[0-9+()\-.\s]{7,20}$/
  return re.test(phone.trim())
}

export function validatePortfolio(data: PortfolioData): PortfolioErrors {
  const errors: PortfolioErrors = {}

  // 1. Personal Info
  if (!data.personalInfo.fullName || !data.personalInfo.fullName.trim()) {
    errors['personalInfo.fullName'] = 'Họ và tên là bắt buộc.'
  }

  if (!data.personalInfo.email || !data.personalInfo.email.trim()) {
    errors['personalInfo.email'] = 'Địa chỉ email là bắt buộc.'
  } else if (!isValidEmail(data.personalInfo.email)) {
    errors['personalInfo.email'] = 'Địa chỉ email không đúng định dạng (ví dụ: ban@example.com).'
  }

  if (data.personalInfo.phone && !isValidPhone(data.personalInfo.phone)) {
    errors['personalInfo.phone'] = 'Số điện thoại không hợp lệ (chỉ chứa chữ số và các ký tự +, -).'
  }

  if (data.personalInfo.headline && data.personalInfo.headline.length > 300) {
    errors['personalInfo.headline'] = `Câu giới thiệu ngắn vượt quá 300 ký tự (hiện tại: ${data.personalInfo.headline.length} ký tự).`
  }

  // 2. Education
  data.education.forEach((edu, idx) => {
    if (!edu.school || !edu.school.trim()) {
      errors[`education.${idx}.school`] = 'Vui lòng nhập tên trường học / cơ sở đào tạo.'
    }
    if (edu.startDate && edu.endDate && !edu.isCurrent) {
      if (edu.startDate > edu.endDate) {
        errors[`education.${idx}.endDate`] = 'Thời gian kết thúc không thể trước thời gian bắt đầu.'
      }
    }
  })

  // 3. Projects
  data.projects.forEach((proj, idx) => {
    if (!proj.title || !proj.title.trim()) {
      errors[`projects.${idx}.title`] = 'Vui lòng nhập tên dự án.'
    }
    if (proj.githubUrl && !isValidUrl(proj.githubUrl)) {
      errors[`projects.${idx}.githubUrl`] = 'Đường dẫn GitHub không hợp lệ (cần bắt đầu bằng http:// hoặc https://).'
    }
    if (proj.demoUrl && !isValidUrl(proj.demoUrl)) {
      errors[`projects.${idx}.demoUrl`] = 'Đường dẫn Demo không hợp lệ (cần bắt đầu bằng http:// hoặc https://).'
    }
    if (proj.startDate && proj.endDate && proj.startDate > proj.endDate) {
      errors[`projects.${idx}.endDate`] = 'Thời gian kết thúc dự án không thể trước thời gian bắt đầu.'
    }
  })

  // 4. Activities
  data.activities.forEach((act, idx) => {
    if (!act.title || !act.title.trim()) {
      errors[`activities.${idx}.title`] = 'Vui lòng nhập tên hoạt động / sự kiện.'
    }
    if (act.startDate && act.endDate && act.startDate > act.endDate) {
      errors[`activities.${idx}.endDate`] = 'Thời gian kết thúc không thể trước thời gian bắt đầu.'
    }
  })

  // 5. Certificates
  data.certificates.forEach((cert, idx) => {
    if (!cert.title || !cert.title.trim()) {
      errors[`certificates.${idx}.title`] = 'Vui lòng nhập tên chứng chỉ / giải thưởng.'
    }
    if (cert.credentialUrl && !isValidUrl(cert.credentialUrl)) {
      errors[`certificates.${idx}.credentialUrl`] = 'Đường dẫn liên kết chứng chỉ không hợp lệ.'
    }
  })

  // 6. Social Links
  if (data.socialLinks.linkedin && !isValidUrl(data.socialLinks.linkedin)) {
    errors['socialLinks.linkedin'] = 'Đường dẫn LinkedIn không hợp lệ.'
  }
  if (data.socialLinks.github && !isValidUrl(data.socialLinks.github)) {
    errors['socialLinks.github'] = 'Đường dẫn GitHub không hợp lệ.'
  }
  if (data.socialLinks.facebook && !isValidUrl(data.socialLinks.facebook)) {
    errors['socialLinks.facebook'] = 'Đường dẫn Facebook không hợp lệ.'
  }
  if (data.socialLinks.website && !isValidUrl(data.socialLinks.website)) {
    errors['socialLinks.website'] = 'Đường dẫn website cá nhân không hợp lệ.'
  }

  return errors
}

