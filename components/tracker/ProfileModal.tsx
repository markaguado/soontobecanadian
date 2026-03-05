'use client'

import { useState, useEffect } from 'react'
import type { Timeline, Comment } from '@/lib/types'
import { formatDate, calculateDays, getTimelineComments, postComment, formatRelativeTime } from '@/lib/api'
import { getUserEmail } from '@/lib/localStorage'

interface ProfileModalProps {
  timeline: Timeline
  onClose: () => void
}

export function ProfileModal({ timeline, onClose }: ProfileModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [email, setEmail] = useState(getUserEmail() || '')
  const [showEmailInput, setShowEmailInput] = useState(!getUserEmail())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'timeline' | 'comments'>('timeline')

  useEffect(() => {
    loadComments()
  }, [timeline.id])

  const loadComments = async () => {
    try {
      setLoading(true)
      const data = await getTimelineComments(timeline.id)
      setComments(data)
    } catch (err) {
      console.error('Failed to load comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email')
      return
    }

    if (!commentText.trim()) {
      setError('Comment cannot be empty')
      return
    }

    try {
      setSubmitting(true)
      await postComment(
        timeline.id,
        email,
        commentText,
        replyTo?.id || null
      )

      // Save email to localStorage
      localStorage.setItem('immigrationTimeline_userEmail', email)

      // Reset form
      setCommentText('')
      setReplyTo(null)
      setShowEmailInput(false)

      // Reload comments
      await loadComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = (comment: Comment) => {
    setReplyTo(comment)
    setActiveTab('comments')
    setTimeout(() => {
      document.getElementById('comment-input')?.focus()
    }, 100)
  }

  if (!timeline) {
    return null
  }

  // Calculate processing statistics
  const stats = {
    aorToBil: calculateDays(timeline.aor_date, timeline.bio_req_date),
    aorToEligibility: calculateDays(timeline.aor_date, timeline.eligibility_completion_date),
    aorToBackground: calculateDays(timeline.aor_date, timeline.bg_completion_date),
    aorToDecision: calculateDays(timeline.aor_date, timeline.final_decision_date),
    aorToPpr: calculateDays(timeline.aor_date, timeline.ppr_p1_date),
    aorToP2: calculateDays(timeline.aor_date, timeline.p2_passport_sent_date),
    aorToEcopr: calculateDays(timeline.aor_date, timeline.ecopr_passport_received_date),
    p2ToEcopr: calculateDays(timeline.p2_passport_sent_date, timeline.ecopr_passport_received_date),
    ecorpToPrCard: calculateDays(timeline.ecopr_passport_received_date, timeline.pr_card_received_date),
    totalProcessing: calculateDays(timeline.aor_date, timeline.ecopr_passport_received_date)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-profile" onClick={(e) => e.stopPropagation()}>
        {/* Sticky Header */}
        <div className="profile-sticky-header">
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>

          {/* Header */}
          <div className="profile-header">
          <div className="profile-user-info">
            <h2>{timeline.username || 'Anonymous'}</h2>
            <div className="profile-meta">
              <span className="badge stream">{timeline.stream || 'N/A'}</span>
              <span className={`badge ${timeline.application_type?.toLowerCase()}`}>
                {timeline.application_type || 'N/A'}
              </span>
              {timeline.primary_visa_office && (
                <span className="profile-office">📍 {timeline.primary_visa_office}</span>
              )}
            </div>
          </div>

          {stats.totalProcessing !== '-' && (
            <div className="profile-total-time">
              <span className="total-label">Total Processing Time</span>
              <span className="total-value">{stats.totalProcessing}</span>
              <span className="total-sublabel">AOR to eCOPR</span>
            </div>
          )}
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            📊 Timeline Details
          </button>
          <button
            className={`profile-tab ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            💬 Questions & Comments ({comments.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {activeTab === 'timeline' ? (
            <div className="timeline-details">
              {/* Key Milestones */}
              <div className="milestone-section">
                <h3>Key Milestones</h3>
                <div className="milestone-grid">
                  {[
                    { label: 'ITA Date', value: formatDate(timeline.ita_date) },
                    { label: 'AOR Date', value: formatDate(timeline.aor_date) },
                    { label: 'Biometrics Request', value: formatDate(timeline.bio_req_date) },
                    { label: 'Medical Passed', value: formatDate(timeline.medical_date) },
                    { label: 'Eligibility', value: timeline.eligibility_check || formatDate(timeline.eligibility_completion_date) },
                    { label: 'Background Check', value: timeline.bg_check || formatDate(timeline.bg_completion_date) },
                    { label: 'Final Decision', value: formatDate(timeline.final_decision_date) },
                    { label: 'PPR/P1', value: formatDate(timeline.ppr_p1_date) },
                    { label: 'P2/Passport Sent', value: formatDate(timeline.p2_passport_sent_date) },
                    { label: 'eCOPR/Passport Received', value: formatDate(timeline.ecopr_passport_received_date) },
                    { label: 'PR Card Sent', value: formatDate(timeline.pr_card_sent_date) },
                    { label: 'PR Card Received', value: formatDate(timeline.pr_card_received_date) }
                  ].map((milestone, idx) => (
                    <div key={idx} className="milestone-item">
                      <span className="milestone-label">{milestone.label}</span>
                      <span className="milestone-value">{milestone.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Processing Time Statistics */}
              {(stats.aorToBil !== '-' || stats.aorToEligibility !== '-' || stats.aorToBackground !== '-') && (
                <div className="stats-section">
                  <h3>Processing Time Breakdown</h3>
                  <div className="stats-grid">
                    {stats.aorToBil !== '-' && (
                      <div className="stat-item">
                        <span className="stat-label">AOR → Bio Request</span>
                        <span className="stat-value">{stats.aorToBil}</span>
                      </div>
                    )}
                    {stats.aorToEligibility !== '-' && (
                      <div className="stat-item">
                        <span className="stat-label">AOR → Eligibility</span>
                        <span className="stat-value">{stats.aorToEligibility}</span>
                      </div>
                    )}
                    {stats.aorToBackground !== '-' && (
                      <div className="stat-item">
                        <span className="stat-label">AOR → Background</span>
                        <span className="stat-value">{stats.aorToBackground}</span>
                      </div>
                    )}
                    {stats.aorToDecision !== '-' && (
                      <div className="stat-item">
                        <span className="stat-label">AOR → Final Decision</span>
                        <span className="stat-value">{stats.aorToDecision}</span>
                      </div>
                    )}
                    {stats.aorToPpr !== '-' && (
                      <div className="stat-item">
                        <span className="stat-label">AOR → PPR</span>
                        <span className="stat-value">{stats.aorToPpr}</span>
                      </div>
                    )}
                    {stats.aorToP2 !== '-' && (
                      <div className="stat-item">
                        <span className="stat-label">AOR → P2/Passport Sent</span>
                        <span className="stat-value">{stats.aorToP2}</span>
                      </div>
                    )}
                    {stats.p2ToEcopr !== '-' && (
                      <div className="stat-item">
                        <span className="stat-label">P2 → eCOPR</span>
                        <span className="stat-value">{stats.p2ToEcopr}</span>
                      </div>
                    )}
                    {stats.aorToEcopr !== '-' && (
                      <div className="stat-item stat-highlight">
                        <span className="stat-label">AOR → eCOPR (Total)</span>
                        <span className="stat-value">{stats.aorToEcopr}</span>
                      </div>
                    )}
                    {stats.ecorpToPrCard !== '-' && (
                      <div className="stat-item">
                        <span className="stat-label">eCOPR → PR Card</span>
                        <span className="stat-value">{stats.ecorpToPrCard}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* User Notes */}
              {timeline.notes && (
                <div className="notes-section">
                  <h3>📝 User Notes</h3>
                  <div className="notes-content">
                    {timeline.notes}
                  </div>
                </div>
              )}

              {/* IRCC Updates */}
              {timeline.ircc_last_update && (
                <div className="ircc-updates-section">
                  <h3>🏛️ IRCC Updates</h3>
                  <div className="ircc-content">
                    {timeline.ircc_last_update}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="comments-section">
              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="comment-form">
                <h4>Ask a Question or Leave a Comment</h4>

                {replyTo && (
                  <div className="reply-indicator">
                    <span>↩️ Replying to <strong>{replyTo.commenter_username}</strong></span>
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="cancel-reply"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {showEmailInput && (
                  <>
                    <input
                      type="email"
                      placeholder="Your email (required to comment)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="comment-email-input"
                      required
                    />
                    <div className="email-display-notice">
                      💡 <strong>How your name appears:</strong>
                      {email && email.includes('@') ? (
                        <>
                          {' '}Your comment will show as <strong>&quot;{email.split('@')[0]}&quot;</strong>
                          {'. Have a timeline? Your username will be used instead!'}
                        </>
                      ) : (
                        ' If you have a shared timeline, your username will be displayed. Otherwise, the first part of your email will be used.'
                      )}
                    </div>
                  </>
                )}

                <textarea
                  id="comment-input"
                  placeholder="Ask a question or leave a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="comment-textarea"
                  rows={3}
                  maxLength={2000}
                  required
                />

                <div className="comment-form-actions">
                  <span className="char-count">
                    {commentText.length}/2000
                  </span>
                  <button
                    type="submit"
                    disabled={submitting || !commentText.trim() || !email}
                    className="btn-primary"
                  >
                    {submitting ? 'Posting...' : (replyTo ? 'Post Reply' : 'Post Comment')}
                  </button>
                </div>

                {error && <div className="error-message">{error}</div>}
              </form>

              {/* Comments List */}
              <div className="comments-list">
                {loading ? (
                  <div className="loading-state-inline">
                    <div className="spinner"></div>
                    <p>Loading comments...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="empty-state">
                    <p>💬 No comments yet</p>
                    <p className="empty-state-subtitle">Be the first to ask a question!</p>
                  </div>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="comment">
                      <div className="comment-header">
                        <span className="comment-author">
                          {comment.commenter_username}
                          {comment.is_timeline_owner && (
                            <span className="owner-badge">Timeline Owner</span>
                          )}
                        </span>
                        <span className="comment-time">
                          {formatRelativeTime(comment.created_at)}
                        </span>
                      </div>

                      <div className="comment-body">
                        {comment.comment_text}
                      </div>

                      <div className="comment-actions">
                        <button
                          onClick={() => handleReply(comment)}
                          className="comment-reply-btn"
                        >
                          ↩️ Reply
                        </button>
                      </div>

                      {/* Nested Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="comment-replies">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="comment comment-reply">
                              <div className="comment-header">
                                <span className="comment-author">
                                  {reply.commenter_username}
                                  {reply.is_timeline_owner && (
                                    <span className="owner-badge">Timeline Owner</span>
                                  )}
                                </span>
                                <span className="comment-time">
                                  {formatRelativeTime(reply.created_at)}
                                </span>
                              </div>

                              <div className="comment-body">
                                {reply.comment_text}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
