export type SkillCategory = 'chuyen-mon' | 'ky-nang-mem' | 'ngoai-ngu'
export type SkillLevel = 'Cơ bản' | 'Khá' | 'Thành thạo' | 'Xuất sắc'

export type SkillItem = {
  id: string
  name: string
  category: SkillCategory
  level: SkillLevel
}

export type EducationItem = {
  id: string
  school: string
  major: string
  startDate: string
  endDate: string
  isCurrent?: boolean
  gpa?: string
  description?: string
}

export type ProjectItem = {
  id: string
  title: string
  role: string
  startDate: string
  endDate: string
  description: string
  technologies: string[]
  githubUrl?: string
  demoUrl?: string
  imageUrl?: string
}

export type ActivityItem = {
  id: string
  title: string
  role: string
  organization?: string
  startDate: string
  endDate?: string
  description?: string
  fromEventId?: string
}

export type CertificateItem = {
  id: string
  title: string
  issuer: string
  issueDate: string
  credentialUrl?: string
  imageUrl?: string
}

export type SocialLinks = {
  linkedin?: string
  github?: string
  facebook?: string
  website?: string
}

export type PersonalInfo = {
  avatarUrl?: string
  fullName: string
  title: string
  school: string
  email: string
  phone?: string
  location?: string
  headline?: string
}

export type PortfolioTemplateId = 'minimal' | 'modern' | 'creative'

export type PortfolioData = {
  id: string
  personalInfo: PersonalInfo
  aboutMe: string
  education: EducationItem[]
  skills: SkillItem[]
  projects: ProjectItem[]
  activities: ActivityItem[]
  certificates: CertificateItem[]
  socialLinks: SocialLinks
  templateId: PortfolioTemplateId
  primaryColor: string
  updatedAt: string
}

export type PortfolioErrors = {
  [key: string]: string
}

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  'chuyen-mon': 'Kỹ năng chuyên môn',
  'ky-nang-mem': 'Kỹ năng mềm',
  'ngoai-ngu': 'Ngoại ngữ',
}

export const SKILL_LEVELS: SkillLevel[] = ['Cơ bản', 'Khá', 'Thành thạo', 'Xuất sắc']

export const PORTFOLIO_COLOR_PALETTES = [
  { name: 'Xanh Navy (Mặc định)', value: '#111e38' },
  { name: 'Xanh Lam Hiện Đại', value: '#1d4ed8' },
  { name: 'Xanh Mòng Két', value: '#0f766e' },
  { name: 'Tím Đậm Công Nghệ', value: '#581c87' },
  { name: 'Cam Năng Động', value: '#c2410c' },
  { name: 'Xám Than Lịch Lãm', value: '#1f2937' },
]

