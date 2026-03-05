'use client'

import type { Timeline } from '@/lib/types'
import { formatDate } from '@/lib/api'

interface CommentsModalProps {
  timeline: Timeline
  onClose: () => void
}

export function CommentsModal({ timeline, onClose }: CommentsModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-comments" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2>IRCC Updates - {timeline.username}</h2>
        <p className="modal-description">
          Latest updates and comments from IRCC
        </p>

        <div className="comments-content" style={{ marginBottom: '1.5rem' }}>
          {timeline.ircc_last_update ? (
            <div style={{
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#6b7280' }}>
                IRCC Last Update:
              </h3>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {timeline.ircc_last_update}
              </div>
            </div>
          ) : (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#9ca3af',
              background: '#f9fafb',
              borderRadius: '8px'
            }}>
              <p>No IRCC updates available for this timeline yet.</p>
            </div>
          )}

          {timeline.notes && (
            <div style={{
              padding: '1rem',
              background: '#eff6ff',
              borderRadius: '8px',
              border: '1px solid #dbeafe'
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1e40af' }}>
                User Notes:
              </h3>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {timeline.notes}
              </div>
            </div>
          )}
        </div>

        <div style={{
          padding: '1rem',
          background: '#fafafa',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 500, color: '#6b7280' }}>Stream:</span>
              <span style={{ fontWeight: 600 }}>{timeline.stream || '-'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 500, color: '#6b7280' }}>Type:</span>
              <span style={{ fontWeight: 600 }}>{timeline.application_type || '-'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 500, color: '#6b7280' }}>Visa Office:</span>
              <span style={{ fontWeight: 600 }}>
                {timeline.primary_visa_office || '-'}
                {timeline.secondary_visa_office && ` → ${timeline.secondary_visa_office}`}
              </span>
            </div>
            {timeline.last_updated_by_user && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500, color: '#6b7280' }}>Last Updated:</span>
                <span style={{ fontWeight: 600 }}>
                  {formatDate(timeline.last_updated_by_user)}
                </span>
              </div>
            )}
          </div>
        </div>

        <button onClick={onClose} className="btn-primary">
          Close
        </button>
      </div>
    </div>
  )
}
