'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { saveUserData } from '@/lib/localStorage'

interface ReclaimModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function ReclaimModal({ onClose, onSuccess }: ReclaimModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('')

    try {
      // Find timelines owned by this email
      const { data: timelines, error } = await supabase
        .from('timelines')
        .select('*')
        .eq('email', email)
        .eq('email_verified', true)

      if (error) throw error

      if (!timelines || timelines.length === 0) {
        throw new Error('No timeline found with this email. Make sure you use the same email you claimed with.')
      }

      // Restore all timelines to localStorage
      timelines.forEach(timeline => {
        saveUserData(email, timeline.id, timeline.username)
      })

      setStatus(`✅ Successfully restored ${timelines.length} timeline(s)! Redirecting...`)

      setTimeout(() => {
        if (onSuccess) onSuccess()
        onClose()
        window.location.reload() // Reload to show "My Timeline"
      }, 2000)

    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Failed to restore timeline'}`)
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

        <h2>Access Your Timeline</h2>
        <p className="modal-description">
          Enter your email to restore access to your timeline on this device/browser.
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
              disabled={loading}
            />
            <p className="field-hint">
              Use the same email you originally claimed your timeline with
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Checking...' : 'Restore My Timeline'}
          </button>
        </form>

        {status && (
          <div className={`status ${status.includes('❌') ? 'error' : 'success'}`}>
            {status}
          </div>
        )}

        <button onClick={onClose} className="btn-ghost" disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  )
}
