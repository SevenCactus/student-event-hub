import type { PortfolioData } from './types'

export const PORTFOLIO_STORAGE_KEY = 'LEEP_STUDENT_PORTFOLIO_V1'

export const defaultInitialPortfolio: PortfolioData = {
  id: 'portfolio-default',
  personalInfo: {
    avatarUrl: '',
    fullName: 'Seven Nguyễn',
    title: 'Sinh viên Ngôn ngữ & Công nghệ Thông tin',
    school: 'Đại học Quốc gia',
    email: 'seven.student@example.com',
    phone: '0901234567',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    headline: 'Sinh viên đam mê kết hợp ngôn ngữ học số và trí tuệ nhân tạo, hướng tới các giải pháp công nghệ phục vụ cộng đồng sinh viên.',
  },
  aboutMe: 'Xin chào! Mình là sinh viên ngành Ngôn ngữ & CNTT. Mình yêu thích việc học code, ứng dụng AI vào học tập và tìm kiếm các cơ hội nâng cao năng lực thông qua các dự án thực tế và hoạt động nhóm.',
  education: [
    {
      id: 'edu-1',
      school: 'Đại học Quốc gia',
      major: 'Công nghệ Thông tin & Ngôn ngữ Ứng dụng',
      startDate: '2023-09',
      endDate: '2027-06',
      isCurrent: true,
      gpa: '3.6/4.0',
      description: 'Tham gia CLB Tin học sinh viên và các workshop chuyên ngành English for IT.',
    },
  ],
  skills: [
    { id: 'skill-1', name: 'React & TypeScript', category: 'chuyen-mon', level: 'Thành thạo' },
    { id: 'skill-2', name: 'Python & AI Prompting', category: 'chuyen-mon', level: 'Khá' },
    { id: 'skill-3', name: 'Làm việc nhóm & Giao tiếp', category: 'ky-nang-mem', level: 'Xuất sắc' },
    { id: 'skill-4', name: 'Quản lý thời gian', category: 'ky-nang-mem', level: 'Thành thạo' },
    { id: 'skill-5', name: 'Tiếng Anh chuyên ngành CNTT (IELTS 7.0)', category: 'ngoai-ngu', level: 'Xuất sắc' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Website Portfolio cá nhân',
      role: 'Frontend Developer',
      startDate: '2026-08',
      endDate: '2026-10',
      description: 'Trang web giới thiệu năng lực bản thân, dự án, kỹ năng và thông tin liên hệ được thiết kế theo phong cách hiện đại.',
      technologies: ['React', 'TypeScript', 'Vite', 'CSS3'],
      githubUrl: 'https://github.com/example/portfolio',
      demoUrl: 'https://portfolio-demo.example.com',
    },
    {
      id: 'proj-2',
      title: 'AI Assistant for Students',
      role: 'Full-stack & AI Developer',
      startDate: '2026-06',
      endDate: '2026-09',
      description: 'Ứng dụng hỗ trợ học tập, lên kế hoạch và ôn tập hiệu quả bằng cách tích hợp mô hình ngôn ngữ lớn.',
      technologies: ['Python', 'FastAPI', 'React', 'OpenAI API'],
      githubUrl: 'https://github.com/example/student-ai',
      demoUrl: 'https://student-ai.example.com',
    },
    {
      id: 'proj-3',
      title: 'Case study: English for IT',
      role: 'Researcher & Author',
      startDate: '2026-03',
      endDate: '2026-05',
      description: 'Nghiên cứu về các phương pháp tiếp cận tiếng Anh chuyên ngành công nghệ thông tin cho sinh viên mới nhập môn.',
      technologies: ['Research', 'Technical Writing', 'Data Analysis'],
    },
  ],
  activities: [
    {
      id: 'act-1',
      title: 'Hackathon: Build Your Portfolio',
      role: 'Thành viên tham dự',
      organization: 'CLB Công nghệ Omni-Freshmen',
      startDate: '2026-10',
      endDate: '2026-10',
      description: 'Phát triển dự án hồ sơ cá nhân và tranh tài thiết kế giao diện tối ưu cho sinh viên.',
    },
    {
      id: 'act-2',
      title: 'Workshop: English for IT',
      role: 'Tình nguyện viên hỗ trợ',
      organization: 'Khoa Ngoại ngữ & CNTT',
      startDate: '2026-09',
      endDate: '2026-09',
      description: 'Hỗ trợ tổ chức seminar về kỹ năng giao tiếp tiếng Anh trong môi trường phần mềm quốc tế.',
    },
  ],
  certificates: [
    {
      id: 'cert-1',
      title: 'IELTS Academic 7.0',
      issuer: 'IDP Education',
      issueDate: '2025-11',
      credentialUrl: 'https://idp.com/verify',
    },
    {
      id: 'cert-2',
      title: 'Responsive Web Design Certification',
      issuer: 'freeCodeCamp',
      issueDate: '2026-02',
      credentialUrl: 'https://freecodecamp.org/certification/verify',
    },
  ],
  socialLinks: {
    linkedin: 'https://linkedin.com/in/student-example',
    github: 'https://github.com/student-example',
    facebook: 'https://facebook.com/student.example',
    website: 'https://seven-portfolio.example.com',
  },
  templateId: 'modern',
  primaryColor: '#111e38',
  updatedAt: new Date().toISOString(),
}

export function loadSavedPortfolio(): PortfolioData {
  try {
    const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY)
    if (!raw) {
      return defaultInitialPortfolio
    }
    const parsed = JSON.parse(raw) as Partial<PortfolioData>
    // Ensure all required fields exist for backward compatibility
    return {
      ...defaultInitialPortfolio,
      ...parsed,
      personalInfo: {
        ...defaultInitialPortfolio.personalInfo,
        ...(parsed.personalInfo || {}),
      },
      education: Array.isArray(parsed.education) ? parsed.education : defaultInitialPortfolio.education,
      skills: Array.isArray(parsed.skills) ? parsed.skills : defaultInitialPortfolio.skills,
      projects: Array.isArray(parsed.projects) ? parsed.projects : defaultInitialPortfolio.projects,
      activities: Array.isArray(parsed.activities) ? parsed.activities : defaultInitialPortfolio.activities,
      certificates: Array.isArray(parsed.certificates) ? parsed.certificates : defaultInitialPortfolio.certificates,
      socialLinks: {
        ...defaultInitialPortfolio.socialLinks,
        ...(parsed.socialLinks || {}),
      },
      templateId: parsed.templateId || 'modern',
      primaryColor: parsed.primaryColor || '#111e38',
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    }
  } catch (err) {
    console.error('Lỗi khi đọc portfolio từ localStorage:', err)
    return defaultInitialPortfolio
  }
}

export function savePortfolioToStorage(data: PortfolioData): boolean {
  try {
    const payload: PortfolioData = {
      ...data,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(payload))
    return true
  } catch (err) {
    console.error('Lỗi khi lưu portfolio vào localStorage:', err)
    return false
  }
}

export function clearPortfolioStorage(): boolean {
  try {
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY)
    return true
  } catch (err) {
    console.error('Lỗi khi xóa portfolio khỏi localStorage:', err)
    return false
  }
}

