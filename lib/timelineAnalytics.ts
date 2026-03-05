import { calculateDays } from './api'
import type { Timeline } from './types'

/**
 * Calculate average processing times from similar timelines
 */
export const calculateAverages = (timelines: Timeline[], currentTimeline: Timeline) => {
  // Filter for similar timelines
  const similarTimelines = timelines.filter(t =>
    t.stream === currentTimeline.stream &&
    t.application_type === currentTimeline.application_type &&
    t.id !== currentTimeline.id
  )

  const calculateAvg = (fromField: keyof Timeline, toField: keyof Timeline): number | null => {
    const validTimelines = similarTimelines.filter(t => t[fromField] && t[toField])
    if (validTimelines.length === 0) return null

    const totalDays = validTimelines.reduce((sum, t) => {
      const days = calculateDays(t[fromField] as string, t[toField] as string)
      const numDays = days !== '-' ? parseInt(days) : 0
      return sum + numDays
    }, 0)

    return Math.round(totalDays / validTimelines.length)
  }

  return {
    aor_to_bio: calculateAvg('aor_date', 'bio_req_date'),
    aor_to_eligibility: calculateAvg('aor_date', 'eligibility_completion_date'),
    aor_to_background: calculateAvg('aor_date', 'bg_completion_date'),
    aor_to_final: calculateAvg('aor_date', 'final_decision_date'),
    aor_to_p1: calculateAvg('aor_date', 'ppr_p1_date'),
    aor_to_ecopr: calculateAvg('aor_date', 'ecopr_passport_received_date'),
    total_count: similarTimelines.length
  }
}

/**
 * Estimate completion date based on current progress and averages
 */
export const estimateCompletion = (timeline: Timeline, averages: ReturnType<typeof calculateAverages>) => {
  if (!timeline.aor_date || timeline.ecopr_passport_received_date) {
    return null // Already complete or no AOR
  }

  if (!averages.aor_to_ecopr) {
    return null // No data to estimate
  }

  const aorDate = new Date(timeline.aor_date)
  const estimatedCompletionDate = new Date(aorDate)
  estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + averages.aor_to_ecopr)

  const today = new Date()
  const daysRemaining = Math.ceil((estimatedCompletionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return {
    estimatedDate: estimatedCompletionDate.toISOString().split('T')[0],
    daysRemaining: Math.max(0, daysRemaining),
    confidence: averages.total_count >= 10 ? 'high' : averages.total_count >= 5 ? 'medium' : 'low'
  }
}

/**
 * Compare user's time with average and return status
 */
export const compareWithAverage = (userDays: string | number, avgDays: number | null) => {
  if (!userDays || !avgDays) return null

  const userTime = typeof userDays === 'string' ? parseInt(userDays) : userDays
  const difference = userTime - avgDays

  if (difference <= -3) {
    return {
      status: 'faster',
      message: `${Math.abs(difference)}d faster`,
      icon: '⚡',
      color: 'success'
    }
  } else if (difference >= 7) {
    return {
      status: 'slower',
      message: `${difference}d longer`,
      icon: '⏳',
      color: 'warning'
    }
  } else {
    return {
      status: 'normal',
      message: 'On track',
      icon: '✓',
      color: 'normal'
    }
  }
}

/**
 * Get current stage and next expected milestone
 */
export const getCurrentStage = (timeline: Timeline) => {
  const stages = [
    { key: 'ita_date' as keyof Timeline, name: 'ITA Received', next: 'Submit Application', nextKey: 'aor_date' as keyof Timeline },
    { key: 'aor_date' as keyof Timeline, name: 'AOR Received', next: 'Biometrics Request', nextKey: 'bio_req_date' as keyof Timeline },
    { key: 'bio_req_date' as keyof Timeline, name: 'Bio Requested', next: 'Eligibility Review', nextKey: 'eligibility_completion_date' as keyof Timeline },
    { key: 'eligibility_completion_date' as keyof Timeline, name: 'Eligibility Passed', next: 'Background Check', nextKey: 'bg_completion_date' as keyof Timeline },
    { key: 'bg_completion_date' as keyof Timeline, name: 'Background Complete', next: 'Final Decision', nextKey: 'final_decision_date' as keyof Timeline },
    { key: 'final_decision_date' as keyof Timeline, name: 'Final Decision Made', next: 'PPR/Portal 1', nextKey: 'ppr_p1_date' as keyof Timeline },
    { key: 'ppr_p1_date' as keyof Timeline, name: 'Portal 1 Received', next: 'Submit Portal 2', nextKey: 'p2_passport_sent_date' as keyof Timeline },
    { key: 'p2_passport_sent_date' as keyof Timeline, name: 'Portal 2 Submitted', next: 'eCOPR', nextKey: 'ecopr_passport_received_date' as keyof Timeline },
    { key: 'ecopr_passport_received_date' as keyof Timeline, name: 'eCOPR Received', next: 'PR Card', nextKey: 'pr_card_received_date' as keyof Timeline },
    { key: 'pr_card_received_date' as keyof Timeline, name: 'PR Card Received', next: 'Complete!', nextKey: null }
  ]

  // Find the last completed stage
  let currentStageIndex = -1
  for (let i = stages.length - 1; i >= 0; i--) {
    if (timeline[stages[i].key]) {
      currentStageIndex = i
      break
    }
  }

  const currentStage = currentStageIndex >= 0 ? stages[currentStageIndex] : null
  const nextStage = currentStageIndex < stages.length - 1 ? stages[currentStageIndex + 1] : null

  return {
    current: currentStage,
    next: nextStage,
    completionPercentage: Math.round(((currentStageIndex + 1) / stages.length) * 100)
  }
}

/**
 * Calculate percentile ranking
 */
export const calculatePercentile = (timeline: Timeline, timelines: Timeline[]): number | null => {
  if (!timeline.aor_date || !timeline.ecopr_passport_received_date) {
    return null
  }

  const userDaysStr = calculateDays(timeline.aor_date, timeline.ecopr_passport_received_date)
  if (userDaysStr === '-') return null
  const userDays = parseInt(userDaysStr)

  const similarComplete = timelines.filter(t =>
    t.stream === timeline.stream &&
    t.application_type === timeline.application_type &&
    t.aor_date &&
    t.ecopr_passport_received_date &&
    t.id !== timeline.id
  )

  if (similarComplete.length < 5) return null

  const fasterCount = similarComplete.filter(t => {
    const daysStr = calculateDays(t.aor_date!, t.ecopr_passport_received_date!)
    if (daysStr === '-') return false
    const days = parseInt(daysStr)
    return days < userDays
  }).length

  return Math.round((fasterCount / similarComplete.length) * 100)
}
