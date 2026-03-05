/**
 * Update Tracker Utility
 * Tracks what fields changed in the last update
 */

/**
 * Check if a date is today
 */
export const isToday = (dateString?: string | null): boolean => {
  if (!dateString) return false

  const date = new Date(dateString)
  const today = new Date()

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

/**
 * Get list of fields that were updated today
 */
export const getTodaysUpdates = (timeline: Record<string, any>) => {
  if (!timeline.last_updated_by_user) return []
  if (!isToday(timeline.last_updated_by_user)) return []

  const updates: Array<{field: string, label: string, value: any, type: string}> = []
  const dateFields = [
    { key: 'bio_req_date', label: 'Biometrics Request' },
    { key: 'medical_date', label: 'Medical' },
    { key: 'eligibility_completion_date', label: 'Eligibility' },
    { key: 'bg_completion_date', label: 'Background Check' },
    { key: 'final_decision_date', label: 'Final Decision' },
    { key: 'ppr_p1_date', label: 'PPR/P1' },
    { key: 'p2_passport_sent_date', label: 'P2/Passport Sent' },
    { key: 'ecopr_passport_received_date', label: 'eCOPR' },
    { key: 'pr_card_sent_date', label: 'PR Card Sent' },
    { key: 'pr_card_received_date', label: 'PR Card Received' }
  ]

  const statusFields = [
    { key: 'eligibility_check', label: 'Eligibility Status' },
    { key: 'bg_check', label: 'Background Status' }
  ]

  // Check date fields
  dateFields.forEach(field => {
    if (timeline[field.key]) {
      const fieldDate = new Date(timeline[field.key])
      const updateDate = new Date(timeline.last_updated_by_user)
      const daysDiff = Math.abs(updateDate.getTime() - fieldDate.getTime()) / (1000 * 60 * 60 * 24)

      if (daysDiff <= 3) {
        updates.push({
          field: field.key,
          label: field.label,
          value: timeline[field.key],
          type: 'date'
        })
      }
    }
  })

  // Check status fields
  statusFields.forEach(field => {
    if (timeline[field.key] === 'Completed') {
      updates.push({
        field: field.key,
        label: field.label,
        value: 'Completed',
        type: 'status'
      })
    }
  })

  return updates
}

/**
 * Format today's updates for display
 */
export const formatTodaysUpdates = (updates: Array<{label: string}>): string | null => {
  if (updates.length === 0) return null
  return updates.map(u => u.label).join(', ')
}
