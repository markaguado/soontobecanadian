// Database Types for Immigration Timeline Tracker

export interface Timeline {
  id: number
  email?: string | null
  email_verified: boolean
  verification_token?: string | null
  verification_token_expires?: string | null
  username: string

  // Key Dates
  ita_date?: string | null
  aor_date?: string | null
  bio_req_date?: string | null
  medical_date?: string | null
  eligibility_check?: string | null
  eligibility_completion_date?: string | null
  bg_check?: string | null
  bg_completion_date?: string | null
  final_decision_date?: string | null
  ppr_p1_date?: string | null
  p2_passport_sent_date?: string | null
  ecopr_passport_received_date?: string | null
  pr_card_sent_date?: string | null
  pr_card_received_date?: string | null

  // Details
  stream?: string | null
  application_type?: string | null
  complexity?: string | null
  primary_visa_office?: string | null
  secondary_visa_office?: string | null
  country?: string | null

  // Content
  notes?: string | null
  ircc_last_update?: string | null

  // Metadata
  last_updated_by_user?: string | null
  created_at: string
  updated_at: string
  data_source?: string | null

  // Computed fields (for UI)
  _computed?: {
    isEditable?: boolean
    isClaimed?: boolean
    hasEcopr?: boolean
    hasPRCard?: boolean
    eligibilityComplete?: boolean
    backgroundComplete?: boolean
    bothChecksComplete?: boolean
    isRecentlyUpdated?: boolean
    updatedToday?: boolean
    todaysUpdates?: string[]
  }
}

export interface Comment {
  id: number
  timeline_id: number
  commenter_email: string
  commenter_username: string
  comment_text: string
  parent_comment_id?: number | null
  is_timeline_owner: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
  replies?: Comment[]
  timeline?: Timeline
  reply_count?: number
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  author: string
  keywords: string[]
  category: string
  featured?: boolean
  ogImage?: string
  readingTime: string
  content: string
}

export interface UserData {
  email: string | null
  claimedTimelines: number[]
  username: string | null
}

export interface FilterState {
  stream: string
  visa_office: string
  type: string
  complexity: string
  completion_status: string
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}
