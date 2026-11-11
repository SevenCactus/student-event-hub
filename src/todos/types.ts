export type TodoTag = 'Học tập' | 'Portfolio' | 'Tiếng Anh' | 'Nhóm' | 'Sự kiện' | 'Khác'

export const TODO_TAG_COLORS: Record<TodoTag, string> = {
  'Học tập': '#f97316',
  'Portfolio': '#ef4444',
  'Tiếng Anh': '#3b82f6',
  'Nhóm': '#10b981',
  'Sự kiện': '#8b5cf6',
  'Khác': '#64748b',
}

export type TodoItem = {
  id: string
  label: string
  meta: string // e.g. "Hôm nay • 2h" or "Hạn: 18:00"
  tag: TodoTag
  done: boolean
  dueDate?: string // YYYY-MM-DD or ISO string
  dueTime?: string // HH:mm
  duration?: string // e.g. "45 phút", "2h"
  createdAt: string
}

export type TodoFilter = 'all' | 'pending' | 'completed'

