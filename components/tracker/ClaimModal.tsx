'use client'

import { useState } from 'react'
import { getUserEmail, saveUserData } from '@/lib/localStorage'
import { claimTimeline } from '@/lib/api'

interface ClaimModalProps {
  timelineId: number
  onClose: () => void
  onSuccess: () => void
}

export function ClaimModal({ timelineId, onClose, onSuccess }: ClaimModalProps) {
  const [email, setEmail] = useState(getUserEmail() || '')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [claimed, setClaimed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('')

    try {
      const result = await claimTimeline(timelineId, email)
      setStatus(result.message)
      setClaimed(true)

      // Save to localStorage for persistent session
      saveUserData(email, timelineId, result.username)

      // Close modal and refresh after success
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 2000)
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Failed to claim timeline'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2>Claim Your Timeline</h2>
        <p className="modal-description">
          Enter your email to claim this timeline. One email per username.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || claimed}
            />
          </div>

          <p className="privacy-notice-text">
            By claiming this timeline, you agree that your email may be used for app updates and new features.
          </p>

          <button type="submit" disabled={loading || claimed} className="btn-primary">
            {loading ? 'Claiming...' : claimed ? 'Claimed!' : 'Claim Timeline'}
          </button>
        </form>

        {status && (
          <div className={`status ${status.includes('❌') ? 'error' : 'success'}`}>
            {status}
          </div>
        )}

        {!claimed && (
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
