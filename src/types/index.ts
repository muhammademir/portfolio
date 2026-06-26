export interface Project {
  id: string
  title: string
  description: string
  tech_stack: string[]
  category: 'web' | 'iot' | 'design' | 'mobile' | 'uiux'
  image_url?: string
  github_url?: string
  case_study_url?: string
  demo_url?: string
  created_at: string
}

export interface Experience {
  id: string
  title: string
  company: string
  type: 'internship' | 'freelance' | 'fulltime'
  location: string
  start_date: string
  end_date?: string
  is_current: boolean
  description: string
  tech_stack: string[]
  created_at: string
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  year: string
  image_url?: string
  pdf_url?: string
  created_at: string
}
