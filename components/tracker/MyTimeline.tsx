'use client'

import { useState, useRef } from 'react'
import {
  Edit3,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  Mail,
  CheckCircle2,
  FileText,
  Search,
  Scale,
  Award,
  Zap,
  Download
} from 'lucide-react'
import { EditTimelineModal } from './EditTimelineModal'
import { ProfileModal } from './ProfileModal'
import { formatDate, calculateDays } from '@/lib/api'
import { calculateAverages, estimateCompletion, getCurrentStage, calculatePercentile } from '@/lib/timelineAnalytics'
import type { Timeline } from '@/lib/types'
import html2canvas from 'html2canvas'

interface MyTimelineProps {
  timeline: Timeline
  allTimelines: Timeline[]
  onUpdate: () => void
}

export function MyTimeline({ timeline, allTimelines, onUpdate }: MyTimelineProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleEditSuccess = () => {
    setShowEditModal(false)
    if (onUpdate) onUpdate()
  }

  const handleShareImage = async () => {
    if (!cardRef.current) return
    setIsGenerating(true)

    try {
      const wasExpanded = isExpanded
      if (!wasExpanded) setIsExpanded(true)
      await new Promise(resolve => setTimeout(resolve, 100))

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false
      })

      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `my-immigration-timeline-${timeline.username}.png`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        if (!wasExpanded) setIsExpanded(false)
      })
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Calculate analytics
  const averages = calculateAverages(allTimelines, timeline)
  const estimation = estimateCompletion(timeline, averages)
  const stageInfo = getCurrentStage(timeline)
  const percentile = calculatePercentile(timeline, allTimelines)

  // Milestone configuration with icons
  const milestones = [
    {
      key: 'ita_date' as keyof Timeline,
      label: 'ITA',
      fullName: 'Invitation to Apply',
      icon: Mail,
      color: '#8b5cf6',
      fromKey: null
    },
    {
      key: 'aor_date' as keyof Timeline,
      label: 'AOR',
      fullName: 'Acknowledgment of Receipt',
      icon: CheckCircle2,
      color: '#3b82f6',
      fromKey: 'ita_date' as keyof Timeline
    },
    {
      key: 'bio_req_date' as keyof Timeline,
      label: 'Bio Request',
      fullName: 'Biometrics Request',
      icon: FileText,
      color: '#06b6d4',
      fromKey: 'aor_date' as keyof Timeline
    },
    {
      key: 'eligibility_completion_date' as keyof Timeline,
      label: 'Eligibility',
      fullName: 'Eligibility Passed',
      icon: CheckCircle2,
      color: '#10b981',
      fromKey: 'aor_date' as keyof Timeline
    },
    {
      key: 'bg_completion_date' as keyof Timeline,
      label: 'Background',
      fullName: 'Background Check Complete',
      icon: Search,
      color: '#8b5cf6',
      fromKey: 'aor_date' as keyof Timeline
    },
    {
      key: 'final_decision_date' as keyof Timeline,
      label: 'Final Decision',
      fullName: 'Final Decision Made',
      icon: Scale,
      color: '#6366f1',
      fromKey: 'aor_date' as keyof Timeline
    },
    {
      key: 'ppr_p1_date' as keyof Timeline,
      label: 'PPR/P1',
      fullName: 'Portal 1 / Passport Request',
      icon: Mail,
      color: '#f59e0b',
      fromKey: 'aor_date' as keyof Timeline
    },
    {
      key: 'p2_passport_sent_date' as keyof Timeline,
      label: 'P2 Sent',
      fullName: 'Portal 2 Submitted',
      icon: FileText,
      color: '#f59e0b',
      fromKey: 'ppr_p1_date' as keyof Timeline
    },
    {
      key: 'ecopr_passport_received_date' as keyof Timeline,
      label: 'eCOPR',
      fullName: 'eCOPR Received',
      icon: Award,
      color: '#10b981',
      fromKey: 'aor_date' as keyof Timeline,
      highlight: true
    },
    {
      key: 'pr_card_received_date' as keyof Timeline,
      label: 'PR Card',
      fullName: 'PR Card Received',
      icon: Award,
      color: '#eab308',
      fromKey: 'ecopr_passport_received_date' as keyof Timeline,
      highlight: true
    }
  ]

  // Calculate total processing time
  const getTotalDays = () => {
    if (!timeline.aor_date) return null
    if (timeline.ecopr_passport_received_date) {
      return calculateDays(timeline.aor_date, timeline.ecopr_passport_received_date)
    }
    const today = new Date().toISOString().split('T')[0]
    return calculateDays(timeline.aor_date, today)
  }

  const totalDays = getTotalDays()

  // Determine current milestone
  const currentMilestoneIndex = milestones.findIndex(m => !timeline[m.key])
  const completedCount = currentMilestoneIndex === -1 ? milestones.length : currentMilestoneIndex

  return (
    <>
      <div className="my-timeline-enhanced" ref={cardRef}>
        {/* Header */}
        <div className="timeline-header-enhanced">
          <div className="timeline-title-section">
            <div className="title-with-badge">
              <h3>My Immigration Timeline</h3>
              {percentile !== null && (
                <span className="percentile-badge">
                  ⚡ Faster than {percentile}%
                </span>
              )}
            </div>
            <p className="timeline-username">{timeline.username}</p>
            <div className="timeline-meta">
              <span className="meta-item">{timeline.stream}</span>
              <span className="meta-item">{timeline.application_type}</span>
              {timeline.primary_visa_office && (
                <span className="meta-item">{timeline.primary_visa_office}</span>
              )}
            </div>
          </div>

          <div className="timeline-actions">
            <button
              onClick={() => setShowProfileModal(true)}
              className="btn-icon"
              title="View comments & questions"
            >
              <MessageCircle size={18} />
            </button>
            <button
              onClick={handleShareImage}
              className="btn-icon"
              disabled={isGenerating}
              title="Download as image"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="btn-icon"
              title="Edit timeline"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn-icon"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>

        {/* Status Banner */}
        <div className="status-banner">
          <div className="status-banner-content">
            <div className="status-icon">
              {!timeline.ecopr_passport_received_date ? (
                <Clock size={20} className="pulse-icon" />
              ) : (
                <Award size={20} />
              )}
            </div>
            <div className="status-text">
              <div className="status-message">
                {currentMilestoneIndex >= 0 && currentMilestoneIndex < milestones.length
                  ? `Next: ${milestones[currentMilestoneIndex].fullName}`
                  : timeline.ecopr_passport_received_date
                  ? 'Process Complete!'
                  : 'In Progress'}
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="key-stats-grid">
          <div className={`key-stat-card ${!timeline.ecopr_passport_received_date ? 'stat-live' : ''}`}>
            <div className="stat-icon-wrapper">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">
                {timeline.ecopr_passport_received_date ? 'Total Time' : 'Days in Process'}
              </div>
              <div className="stat-value">
                {totalDays || '-'}<span className="stat-unit">d</span>
              </div>
              {!timeline.ecopr_passport_received_date && (
                <div className="stat-sublabel">and counting...</div>
              )}
            </div>
          </div>

          <div className="key-stat-card">
            <div className="stat-icon-wrapper">
              <Target size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Progress</div>
              <div className="stat-value">
                {stageInfo.completionPercentage}<span className="stat-unit">%</span>
              </div>
              <div className="stat-sublabel">
                {completedCount} of {milestones.length} milestones
              </div>
            </div>
          </div>

          {averages.total_count > 0 && (
            <div className="key-stat-card">
              <div className="stat-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-label">Similar Cases</div>
                <div className="stat-value">
                  {averages.total_count}<span className="stat-unit"></span>
                </div>
                <div className="stat-sublabel">
                  {timeline.stream} • {timeline.application_type}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Visual Timeline */}
        {isExpanded && (
          <div className="visual-timeline">
            <div className="timeline-track">
              {milestones.map((milestone, index) => {
                const isCompleted = !!timeline[milestone.key]
                const isCurrent = index === currentMilestoneIndex
                const Icon = milestone.icon

                // Calculate duration from previous milestone
                let duration = null
                if (isCompleted && milestone.fromKey && timeline[milestone.fromKey]) {
                  const days = calculateDays(timeline[milestone.fromKey] as string, timeline[milestone.key] as string)
                  if (days !== '-') {
                    duration = days
                  }
                }

                return (
                  <div key={milestone.key} className="timeline-milestone-wrapper">
                    {index > 0 && (
                      <div className={`timeline-connector ${isCompleted ? 'completed' : ''}`} />
                    )}
                    <div
                      className={`timeline-milestone ${isCompleted ? 'completed' : ''} ${
                        isCurrent ? 'current' : ''
                      } ${milestone.highlight ? 'highlight' : ''}`}
                    >
                      <div
                        className="milestone-icon-circle"
                        style={{ borderColor: isCompleted ? milestone.color : '#d1d5db' }}
                      >
                        <Icon
                          size={18}
                          color={isCompleted ? milestone.color : '#9ca3af'}
                          strokeWidth={2}
                        />
                      </div>
                      <div className="milestone-content">
                        <div className="milestone-row">
                          <div className="milestone-info">
                            <span className="milestone-name">{milestone.label}</span>
                            <span className="milestone-separator">•</span>
                            <span className="milestone-full-name">{milestone.fullName}</span>
                          </div>
                          <div className="milestone-date-wrapper">
                            <span className={`milestone-date ${isCompleted ? 'has-date' : 'no-date'}`}>
                              {isCompleted ? formatDate(timeline[milestone.key] as string) : 'Pending'}
                            </span>
                            {duration && (
                              <span className="milestone-duration">+{duration}</span>
                            )}
                          </div>
                        </div>
                        {isCurrent && (
                          <div className="current-indicator">
                            <Zap size={12} />
                            Next step
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Stage Duration Analytics */}
        {isExpanded && (
          <div className="comparison-section">
            <h4 className="section-title">
              <Clock size={18} />
              Processing Time by Stage
            </h4>
            <div className="stage-durations-grid">
              {timeline.aor_date && timeline.bio_req_date && (
                <div className="duration-card">
                  <div className="duration-label">AOR → Bio Request</div>
                  <div className="duration-value">
                    {calculateDays(timeline.aor_date, timeline.bio_req_date)}
                  </div>
                </div>
              )}
              {timeline.bio_req_date && timeline.eligibility_completion_date && (
                <div className="duration-card">
                  <div className="duration-label">Bio → Eligibility</div>
                  <div className="duration-value">
                    {calculateDays(timeline.bio_req_date, timeline.eligibility_completion_date)}
                  </div>
                </div>
              )}
              {timeline.eligibility_completion_date && timeline.bg_completion_date && (
                <div className="duration-card">
                  <div className="duration-label">Eligibility → Background</div>
                  <div className="duration-value">
                    {calculateDays(timeline.eligibility_completion_date, timeline.bg_completion_date)}
                  </div>
                </div>
              )}
              {timeline.bg_completion_date && timeline.final_decision_date && (
                <div className="duration-card">
                  <div className="duration-label">Background → Decision</div>
                  <div className="duration-value">
                    {calculateDays(timeline.bg_completion_date, timeline.final_decision_date)}
                  </div>
                </div>
              )}
              {timeline.final_decision_date && timeline.ppr_p1_date && (
                <div className="duration-card">
                  <div className="duration-label">Decision → PPR/P1</div>
                  <div className="duration-value">
                    {calculateDays(timeline.final_decision_date, timeline.ppr_p1_date)}
                  </div>
                </div>
              )}
              {timeline.ppr_p1_date && timeline.ecopr_passport_received_date && (
                <div className="duration-card">
                  <div className="duration-label">P1 → eCOPR</div>
                  <div className="duration-value">
                    {calculateDays(timeline.ppr_p1_date, timeline.ecopr_passport_received_date)}
                  </div>
                </div>
              )}
              {timeline.p2_passport_sent_date && timeline.ecopr_passport_received_date && (
                <div className="duration-card">
                  <div className="duration-label">P2 → eCOPR</div>
                  <div className="duration-value">
                    {calculateDays(timeline.p2_passport_sent_date, timeline.ecopr_passport_received_date)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showEditModal && (
        <EditTimelineModal
          timeline={timeline}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          timeline={timeline}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  )
}
