'use client'

import { useState } from 'react'
import { softDeleteTimeline, permanentlyDeleteTimeline } from '@/lib/admin'
import type { Timeline } from '@/lib/types'

interface AdminPanelProps {
  timeline: Timeline
  onDelete: () => void
  onClose: () => void
}

export function AdminPanel({ timeline, onDelete, onClose }: AdminPanelProps) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSoftDelete = async () => {
    setLoading(true)
    try {
      await softDeleteTimeline(timeline.id)
      alert('✅ Timeline hidden successfully (soft delete)')
      if (onDelete) onDelete()
      onClose()
    } catch (error) {
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to delete'}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePermanentDelete = async () => {
    setLoading(true)
    try {
      await permanentlyDeleteTimeline(timeline.id)
      alert('✅ Timeline permanently deleted')
      if (onDelete) onDelete()
      onClose()
    } catch (error) {
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to delete'}`)
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <span className="admin-badge">ADMIN</span>
        <button onClick={onClose} className="admin-close">×</button>
      </div>

      {!showConfirm ? (
        <div className="admin-actions">
          <button
            onClick={handleSoftDelete}
            className="btn-admin-soft-delete"
            disabled={loading}
          >
            🗑️ Hide Timeline (Soft Delete)
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="btn-admin-permanent-delete"
            disabled={loading}
          >
            ⚠️ Permanently Delete
          </button>

          <p className="admin-note">
            <strong>Soft Delete:</strong> Hides from public view but keeps data (reversible)
          </p>
        </div>
      ) : (
        <div className="admin-confirm">
          <h4>⚠️ Confirm Permanent Deletion</h4>
          <p>This will <strong>permanently delete</strong> timeline for:</p>
          <p className="confirm-username"><strong>{timeline.username}</strong></p>
          <p className="warning-text">
            This action <strong>CANNOT be undone!</strong> All data will be lost forever.
          </p>

          <div className="confirm-actions">
            <button
              onClick={handlePermanentDelete}
              className="btn-danger"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Yes, Permanently Delete'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
