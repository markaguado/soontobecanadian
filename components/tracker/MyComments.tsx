'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, ArrowRight, Reply } from 'lucide-react'
import { getUserComments, formatRelativeTime } from '@/lib/api'
import { getUserEmail, getLastViewedCommentsTime, markCommentsAsViewed } from '@/lib/localStorage'
import { ProfileModal } from './ProfileModal'
import type { Comment } from '@/lib/types'

export function MyComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTimeline, setSelectedTimeline] = useState<any>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const userEmail = getUserEmail()

  useEffect(() => {
    if (userEmail) {
      loadUserComments()
    }
  }, [userEmail])

  // Mark all comments as viewed when drawer opens
  useEffect(() => {
    if (isOpen && comments.length > 0) {
      comments.forEach(comment => {
        markCommentsAsViewed(comment.timeline_id)
      })
      setTimeout(() => {
        loadUserComments()
      }, 100)
    }
  }, [isOpen])

  const loadUserComments = async () => {
    try {
      setLoading(true)
      if (!userEmail) return
      const data = await getUserComments(userEmail)
      setComments(data)
    } catch (error) {
      console.error('Failed to load user comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewTimeline = (comment: Comment) => {
    setSelectedTimeline(comment.timeline)
    setShowProfileModal(true)
    setIsOpen(false)
    markCommentsAsViewed(comment.timeline_id)
  }

  // Count total unread replies
  const unreadCount = comments.reduce((total, comment) => {
    const lastViewed = getLastViewedCommentsTime(comment.timeline_id)
    if (!lastViewed) return total + (comment.reply_count || 0)

    const newReplies = (comment.replies || []).filter(reply => {
      return new Date(reply.created_at) > lastViewed
    }).length

    return total + newReplies
  }, 0)

  if (!userEmail || comments.length === 0) {
    return null
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="floating-comments-button"
        onClick={() => setIsOpen(!isOpen)}
        title="My Comments"
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="floating-badge">{unreadCount}</span>
        )}
      </button>

      {/* Drawer/Modal */}
      {isOpen && (
        <>
          <div className="comments-drawer-overlay" onClick={() => setIsOpen(false)} />
          <div className="comments-drawer">
            <div className="comments-drawer-header">
              <div className="header-left">
                <MessageCircle size={20} />
                <h3>My Comments</h3>
                {unreadCount > 0 && (
                  <span className="unread-badge-small">{unreadCount}</span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-close-drawer"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="my-comments-list">
              {loading ? (
                <div className="loading-state-inline">
                  <div className="spinner"></div>
                  <p>Loading your comments...</p>
                </div>
              ) : (
                comments.map((comment) => {
                  const lastViewed = getLastViewedCommentsTime(comment.timeline_id)
                  const hasNewReplies = lastViewed && (comment.replies || []).some(reply =>
                    new Date(reply.created_at) > lastViewed
                  )

                  return (
                    <div key={comment.id} className="my-comment-card">
                      <div className="comment-header-info">
                        <span className="commented-on">
                          Commented on <strong>{comment.timeline?.username || 'Unknown'}</strong>&apos;s timeline
                        </span>
                        <span className="comment-time">
                          {formatRelativeTime(comment.created_at)}
                        </span>
                      </div>

                      <div className="comment-text-preview">
                        &quot;{comment.comment_text}&quot;
                      </div>

                      <div className="comment-footer">
                        <div className="reply-info">
                          {(comment.reply_count || 0) > 0 ? (
                            <>
                              <Reply size={14} />
                              <span className={hasNewReplies ? 'has-new-replies' : ''}>
                                {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
                                {hasNewReplies && ' • NEW'}
                              </span>
                            </>
                          ) : (
                            <span className="no-replies">No replies yet</span>
                          )}
                        </div>

                        <button
                          onClick={() => handleViewTimeline(comment)}
                          className="btn-view-timeline"
                        >
                          View Timeline <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}

      {showProfileModal && selectedTimeline && (
        <ProfileModal
          timeline={selectedTimeline}
          onClose={() => {
            setShowProfileModal(false)
            loadUserComments()
          }}
        />
      )}
    </>
  )
}
