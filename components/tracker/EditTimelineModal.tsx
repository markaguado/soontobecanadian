'use client'

import { useState, useEffect } from 'react'
import type { Timeline } from '@/lib/types'
import { updateTimeline } from '@/lib/api'
import { getUserEmail } from '@/lib/localStorage'

interface EditTimelineModalProps {
  timeline: Timeline
  onClose: () => void
  onSuccess: () => void
}

export function EditTimelineModal({ timeline, onClose, onSuccess }: EditTimelineModalProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [formData, setFormData] = useState({
    stream: '',
    application_type: '',
    primary_visa_office: '',
    secondary_visa_office: '',
    bio_req_date: '',
    eligibility_check: '',
    eligibility_completion_date: '',
    bg_check: '',
    bg_completion_date: '',
    final_decision_date: '',
    ppr_p1_date: '',
    p2_passport_sent_date: '',
    ecopr_passport_received_date: '',
    pr_card_sent_date: '',
    pr_card_received_date: '',
    ircc_last_update: '',
    notes: ''
  })

  useEffect(() => {
    if (timeline) {
      setFormData({
        stream: timeline.stream || '',
        application_type: timeline.application_type || '',
        primary_visa_office: timeline.primary_visa_office || '',
        secondary_visa_office: timeline.secondary_visa_office || '',
        bio_req_date: timeline.bio_req_date || '',
        eligibility_check: timeline.eligibility_check || '',
        eligibility_completion_date: timeline.eligibility_completion_date || '',
        bg_check: timeline.bg_check || '',
        bg_completion_date: timeline.bg_completion_date || '',
        final_decision_date: timeline.final_decision_date || '',
        ppr_p1_date: timeline.ppr_p1_date || '',
        p2_passport_sent_date: timeline.p2_passport_sent_date || '',
        ecopr_passport_received_date: timeline.ecopr_passport_received_date || '',
        pr_card_sent_date: timeline.pr_card_sent_date || '',
        pr_card_received_date: timeline.pr_card_received_date || '',
        ircc_last_update: timeline.ircc_last_update || '',
        notes: timeline.notes || ''
      })
    }
  }, [timeline])

  const today = new Date().toISOString().split('T')[0]

  const dateFields: { key: keyof typeof formData; label: string }[] = [
    { key: 'bio_req_date', label: 'Biometrics Request' },
    { key: 'eligibility_completion_date', label: 'Eligibility Completion' },
    { key: 'bg_completion_date', label: 'Background Completion' },
    { key: 'final_decision_date', label: 'Final Decision' },
    { key: 'ppr_p1_date', label: 'PPR/P1 Date' },
    { key: 'p2_passport_sent_date', label: 'P2/Passport Sent' },
    { key: 'ecopr_passport_received_date', label: 'eCOPR/Passport Received' },
    { key: 'pr_card_sent_date', label: 'PR Card Sent' },
    { key: 'pr_card_received_date', label: 'PR Card Received' },
  ]

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('')

    try {
      const email = getUserEmail()
      if (!email) {
        throw new Error('Email not found. Please claim the timeline first.')
      }

      // Validate no future dates
      for (const { key, label } of dateFields) {
        const val = formData[key]
        if (val && val > today) {
          throw new Error(`${label} cannot be a future date`)
        }
      }

      // Clean data - convert empty strings to null
      const cleanData: Record<string, string | null | number> = {}
      Object.entries(formData).forEach(([key, value]) => {
        cleanData[key] = value === '' ? null : value
      })

      // Recalculate AOR to BIL days if both dates exist
      if (formData.bio_req_date && timeline.aor_date) {
        const aorDate = new Date(timeline.aor_date)
        const bioDate = new Date(formData.bio_req_date)
        const days = Math.floor((bioDate.getTime() - aorDate.getTime()) / (1000 * 60 * 60 * 24))
        cleanData.aor_to_bil_days = days >= 0 ? days : null
      } else if (!formData.bio_req_date) {
        cleanData.aor_to_bil_days = null
      }

      const result = await updateTimeline(timeline.id, email, cleanData as Partial<Timeline>)
      setStatus(result.message)

      // Close modal and refresh after success
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Failed to update timeline'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-profile" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-sticky-header">
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
          <h2>Edit Timeline - {timeline.username}</h2>
          <p className="modal-description">
            Update your timeline information. All fields are optional.
          </p>
        </div>

        <div className="modal-body">
        <form onSubmit={handleSubmit}>
          {/* Stream & Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="stream">Stream</label>
              <select
                id="stream"
                value={formData.stream}
                onChange={(e) => handleChange('stream', e.target.value)}
                disabled={loading}
              >
                <option value="">Select Stream</option>
                <option value="CEC">CEC</option>
                <option value="FSW">FSW</option>
                <option value="FST">FST</option>
                <option value="PNP">PNP</option>
                <option value="CEC - French">CEC - French</option>
                <option value="FSW - French">FSW - French</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="application_type">Application Type</label>
              <select
                id="application_type"
                value={formData.application_type}
                onChange={(e) => handleChange('application_type', e.target.value)}
                disabled={loading}
              >
                <option value="">Select Type</option>
                <option value="Inland">Inland</option>
                <option value="Outland">Outland</option>
              </select>
            </div>
          </div>

          {/* Visa Offices */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="primary_visa_office">Primary Visa Office</label>
              <input
                id="primary_visa_office"
                type="text"
                list="visa-offices-list"
                value={formData.primary_visa_office}
                onChange={(e) => handleChange('primary_visa_office', e.target.value)}
                disabled={loading}
                placeholder="e.g., Ottawa, Sydney"
              />
              <datalist id="visa-offices-list">
                {['Ottawa', 'Sydney', 'Etobicoke', 'Montreal', 'Vancouver', 'Edmonton', 'Calgary', 'Mississauga', 'Toronto', 'Winnipeg', 'New Delhi', 'Manila', 'Beijing', 'Shanghai', 'Hong Kong', 'Paris', 'London (UK)', 'Abu Dhabi', 'Dubai'].map(office => (
                  <option key={office} value={office} />
                ))}
              </datalist>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="secondary_visa_office">Secondary Visa Office</label>
              <input
                id="secondary_visa_office"
                type="text"
                list="visa-offices-list"
                value={formData.secondary_visa_office}
                onChange={(e) => handleChange('secondary_visa_office', e.target.value)}
                disabled={loading}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Key Dates */}
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '1rem' }}>
            Key Dates
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="bio_req_date">Biometrics Request</label>
              <input
                id="bio_req_date"
                type="date"
                value={formData.bio_req_date}
                max={today}
                onChange={(e) => handleChange('bio_req_date', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="final_decision_date">Final Decision</label>
              <input
                id="final_decision_date"
                type="date"
                value={formData.final_decision_date}
                max={today}
                onChange={(e) => handleChange('final_decision_date', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ppr_p1_date">PPR/P1 Date</label>
              <input
                id="ppr_p1_date"
                type="date"
                value={formData.ppr_p1_date}
                max={today}
                onChange={(e) => handleChange('ppr_p1_date', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="p2_passport_sent_date">P2/Passport Sent</label>
              <input
                id="p2_passport_sent_date"
                type="date"
                value={formData.p2_passport_sent_date}
                max={today}
                onChange={(e) => handleChange('p2_passport_sent_date', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ecopr_passport_received_date">eCOPR/Passport Received</label>
              <input
                id="ecopr_passport_received_date"
                type="date"
                value={formData.ecopr_passport_received_date}
                max={today}
                onChange={(e) => handleChange('ecopr_passport_received_date', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="pr_card_received_date">PR Card Received</label>
              <input
                id="pr_card_received_date"
                type="date"
                value={formData.pr_card_received_date}
                max={today}
                onChange={(e) => handleChange('pr_card_received_date', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Check Statuses */}
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '1rem' }}>
            Check Statuses
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="eligibility_check">Eligibility Status</label>
              <select
                id="eligibility_check"
                value={formData.eligibility_check}
                onChange={(e) => handleChange('eligibility_check', e.target.value)}
                disabled={loading}
              >
                <option value="">Select Status</option>
                <option value="In Process">In Process</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="eligibility_completion_date">Eligibility Completion</label>
              <input
                id="eligibility_completion_date"
                type="date"
                value={formData.eligibility_completion_date}
                max={today}
                onChange={(e) => handleChange('eligibility_completion_date', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bg_check">Background Status</label>
              <select
                id="bg_check"
                value={formData.bg_check}
                onChange={(e) => handleChange('bg_check', e.target.value)}
                disabled={loading}
              >
                <option value="">Select Status</option>
                <option value="In Process">In Process</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bg_completion_date">Background Completion</label>
              <input
                id="bg_completion_date"
                type="date"
                value={formData.bg_completion_date}
                max={today}
                onChange={(e) => handleChange('bg_completion_date', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Notes */}
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '1rem' }}>
            Additional Information
          </h3>

          <div className="form-group">
            <label htmlFor="ircc_last_update">IRCC Last Update</label>
            <textarea
              id="ircc_last_update"
              value={formData.ircc_last_update}
              onChange={(e) => handleChange('ircc_last_update', e.target.value)}
              disabled={loading}
              placeholder="Last update from IRCC..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Personal Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              disabled={loading}
              placeholder="Your notes about the application process..."
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Updating...' : 'Update Timeline'}
          </button>

          {status && (
            <div className={`status ${status.includes('❌') ? 'error' : 'success'}`}>
              {status}
            </div>
          )}

          <button type="button" onClick={onClose} className="btn-ghost" disabled={loading}>
            Cancel
          </button>
        </form>
        </div>
      </div>
    </div>
  )
}
