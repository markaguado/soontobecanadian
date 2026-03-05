'use client'

import { calculateDays } from '@/lib/api'
import {
  ClipboardList,
  CheckCircle,
  Search,
  Scale,
  Award,
  Mail,
  FileText,
  Sparkles,
  Clock,
  BarChart3
} from 'lucide-react'
import type { Timeline } from '@/lib/types'

const iconMap = {
  'bio': ClipboardList,
  'check': CheckCircle,
  'search': Search,
  'scale': Scale,
  'award': Award,
  'mail': Mail,
  'file': FileText,
  'sparkles': Sparkles,
  'clock': Clock,
  'chart': BarChart3
}

interface AnalyticsProps {
  timelines: Timeline[]
}

export function Analytics({ timelines }: AnalyticsProps) {
  // Safety check
  if (!timelines || !Array.isArray(timelines) || timelines.length === 0) {
    return (
      <div className="analytics-empty">
        <p>No data available for the selected filters. Try adjusting your filters to see processing time averages.</p>
      </div>
    )
  }

  // Calculate average for a specific milestone
  const calculateAverage = (fromField: keyof Timeline, toField: keyof Timeline) => {
    const validTimelines = timelines.filter(t => t[fromField] && t[toField])

    if (validTimelines.length === 0) return null

    const totalDays = validTimelines.reduce((sum, t) => {
      const days = calculateDays(t[fromField] as string, t[toField] as string)
      const numDays = days !== '-' ? parseInt(days) : 0
      return sum + numDays
    }, 0)

    return Math.round(totalDays / validTimelines.length)
  }

  // Calculate min and max
  const calculateMinMax = (fromField: keyof Timeline, toField: keyof Timeline) => {
    const validTimelines = timelines.filter(t => t[fromField] && t[toField])

    if (validTimelines.length === 0) return { min: null, max: null, count: 0 }

    const allDays = validTimelines.map(t => {
      const days = calculateDays(t[fromField] as string, t[toField] as string)
      return days !== '-' ? parseInt(days) : 0
    }).filter(d => d > 0)

    if (allDays.length === 0) return { min: null, max: null, count: 0 }

    return {
      min: Math.min(...allDays),
      max: Math.max(...allDays),
      count: validTimelines.length
    }
  }

  // Key milestones to track
  const milestones = [
    // From AOR
    {
      from: 'aor_date' as keyof Timeline,
      to: 'bio_req_date' as keyof Timeline,
      label: 'AOR → Bio',
      icon: 'bio' as const,
      category: 'From AOR'
    },
    {
      from: 'aor_date' as keyof Timeline,
      to: 'eligibility_completion_date' as keyof Timeline,
      label: 'AOR → Eligibility',
      icon: 'check' as const,
      category: 'From AOR'
    },
    {
      from: 'aor_date' as keyof Timeline,
      to: 'bg_completion_date' as keyof Timeline,
      label: 'AOR → Background',
      icon: 'search' as const,
      category: 'From AOR'
    },
    {
      from: 'aor_date' as keyof Timeline,
      to: 'final_decision_date' as keyof Timeline,
      label: 'AOR → Final Decision',
      icon: 'scale' as const,
      category: 'From AOR'
    },
    {
      from: 'aor_date' as keyof Timeline,
      to: 'ecopr_passport_received_date' as keyof Timeline,
      label: 'AOR → eCOPR',
      icon: 'award' as const,
      highlight: true,
      category: 'From AOR'
    },
    // Between Stages
    {
      from: 'final_decision_date' as keyof Timeline,
      to: 'ppr_p1_date' as keyof Timeline,
      label: 'Final Decision → P1',
      icon: 'mail' as const,
      category: 'Between Stages'
    },
    {
      from: 'ppr_p1_date' as keyof Timeline,
      to: 'p2_passport_sent_date' as keyof Timeline,
      label: 'P1 → P2',
      icon: 'file' as const,
      category: 'Between Stages'
    },
    {
      from: 'p2_passport_sent_date' as keyof Timeline,
      to: 'ecopr_passport_received_date' as keyof Timeline,
      label: 'P2 → eCOPR',
      icon: 'sparkles' as const,
      category: 'Between Stages'
    },
    {
      from: 'ppr_p1_date' as keyof Timeline,
      to: 'ecopr_passport_received_date' as keyof Timeline,
      label: 'P1 → eCOPR',
      icon: 'clock' as const,
      category: 'Between Stages'
    }
  ]

  const stats = milestones.map(milestone => {
    const avg = calculateAverage(milestone.from, milestone.to)
    const { min, max, count } = calculateMinMax(milestone.from, milestone.to)

    return {
      ...milestone,
      avg,
      min,
      max,
      count
    }
  }).filter(stat => stat.avg !== null)

  // Group stats by category
  const fromAOR = stats.filter(s => s.category === 'From AOR')
  const betweenStages = stats.filter(s => s.category === 'Between Stages')

  if (stats.length === 0) {
    return (
      <div className="analytics-empty">
        <p>No data available for the selected filters. Try adjusting your filters to see processing time averages.</p>
      </div>
    )
  }

  const StatCard = ({ stat, index }: { stat: typeof stats[0], index: number }) => {
    const IconComponent = iconMap[stat.icon]

    return (
      <div
        key={index}
        className={`analytics-card ${stat.highlight ? 'analytics-highlight' : ''}`}
      >
        <div className="analytics-icon">
          {IconComponent && <IconComponent size={24} strokeWidth={2} />}
        </div>
        <div className="analytics-content">
          <div className="analytics-label">{stat.label}</div>
          <div className="analytics-avg">{stat.avg ?? '-'}d</div>
          {stat.min !== null && stat.max !== null && (
            <div className="analytics-range">
              <span className="range-min">Min: {stat.min}d</span>
              <span className="range-separator">•</span>
              <span className="range-max">Max: {stat.max}d</span>
            </div>
          )}
          <div className="analytics-count">{stat.count ?? 0} samples</div>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-section">
      <div className="analytics-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={24} strokeWidth={2} style={{ color: 'var(--color-primary)' }} />
          Processing Time Averages
        </h3>
        <p className="analytics-subtitle">
          Based on <strong>{timelines.length}</strong> matching timeline{timelines.length !== 1 ? 's' : ''}
        </p>
      </div>

      {fromAOR.length > 0 && (
        <>
          <h4 className="analytics-category-title">From Acknowledgement of Receipt/AOR (Start to eCOPR)</h4>
          <div className="analytics-grid">
            {fromAOR.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </>
      )}

      {betweenStages.length > 0 && (
        <>
          <h4 className="analytics-category-title">Between Stages (Incremental)</h4>
          <div className="analytics-grid">
            {betweenStages.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
