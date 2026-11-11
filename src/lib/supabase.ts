import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bvuaeytpelizyzfzilta.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
)

// Supabase client instance
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'placeholder-anon-key'
)

export type DbEvent = {
  id: string
  user_id?: string | null
  title: string
  date: string
  status: 'Đang diễn ra' | 'Chuẩn bị' | 'Sắp tới'
  progress: number
  people: number
  color: 'orange' | 'blue' | 'purple' | 'green' | 'red' | 'cyan'
  created_at?: string
}

export type DbTask = {
  id: string
  user_id?: string | null
  label: string
  meta: string
  tag: string
  done: boolean
  created_at?: string
}

export type DbPortfolio = {
  id: string
  user_id?: string | null
  title: string
  description: string
  status: string
  github_url?: string | null
  demo_url?: string | null
  created_at?: string
}

export type DbGuide = {
  id: string
  icon: string
  title: string
  text: string
  color: string
  tag: string
  tips: string[]
  sort_order?: number
}
