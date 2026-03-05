'use client'

import { useState } from 'react'
import { getUserEmail, saveUserData } from '@/lib/localStorage'
import { createTimeline } from '@/lib/api'
import type { Timeline } from '@/lib/types'

interface CreateTimelineModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function CreateTimelineModal({ onClose, onSuccess }: CreateTimelineModalProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)

  const [formData, setFormData] = useState({
    // Required fields
    email: getUserEmail() || '',
    username: '',
    stream: '',
    application_type: '',
    ita_date: '',
    aor_date: '',

    // Optional fields
    primary_visa_office: '',
    secondary_visa_office: '',
    complexity: '',
    bio_req_date: '',
    medical_date: '',
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

  const canadianVisaOffices = [
    'Ottawa', 'Sydney', 'Etobicoke', 'Montreal', 'Vancouver', 'Edmonton',
    'Calgary', 'Mississauga', 'Toronto', 'Winnipeg', 'Hamilton', 'London',
    'Kitchener', 'Victoria',
    'New Delhi', 'Manila', 'Beijing', 'Shanghai', 'Hong Kong', 'Paris',
    'London (UK)', 'Abu Dhabi', 'Dubai', 'Lagos', 'Accra', 'Nairobi',
    'Mexico City', 'Bogota', 'Lima', 'Singapore', 'Bangkok', 'Tokyo',
    'Seoul', 'Sydney (Australia)', 'Moscow', 'Warsaw', 'Vienna', 'Berlin',
    'Rome', 'Madrid', 'Ankara', 'Tel Aviv', 'Cairo', 'Pretoria', 'Islamabad',
    'Colombo', 'Dhaka', 'Kathmandu'
  ].sort()

  const today = new Date().toISOString().split('T')[0]

  const dateFields: { key: keyof typeof formData; label: string }[] = [
    { key: 'ita_date', label: 'ITA Date' },
    { key: 'aor_date', label: 'AOR Date' },
    { key: 'bio_req_date', label: 'Biometrics Request Date' },
    { key: 'medical_date', label: 'Medical Date' },
    { key: 'eligibility_completion_date', label: 'Eligibility Completion' },
    { key: 'bg_completion_date', label: 'Background Completion' },
    { key: 'final_decision_date', label: 'Final Decision Date' },
    { key: 'ppr_p1_date', label: 'PPR/P1 Date' },
    { key: 'p2_passport_sent_date', label: 'P2/Passport Sent Date' },
    { key: 'ecopr_passport_received_date', label: 'eCOPR/Passport Received' },
  ]

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('')

    try {
      // Validate required fields
      if (!formData.email || !formData.username || !formData.stream ||
          !formData.application_type || !formData.ita_date || !formData.aor_date) {
        throw new Error('Please fill in all required fields')
      }

      // Validate no future dates
      for (const { key, label } of dateFields) {
        const val = formData[key]
        if (val && val > today) {
          throw new Error(`${label} cannot be a future date`)
        }
      }

      // Validate privacy agreement
      if (!agreedToPrivacy) {
        throw new Error('Please agree to the privacy terms to continue')
      }

      // Clean data - convert empty strings to null
      const cleanData: Record<string, string | null | number | boolean> = {}
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'email') return // Handle separately
        cleanData[key] = value === '' ? null : value
      })

      // Calculate AOR to BIL days if bio_req_date exists
      if (formData.bio_req_date && formData.aor_date) {
        const aorDate = new Date(formData.aor_date)
        const bioDate = new Date(formData.bio_req_date)
        const days = Math.floor((bioDate.getTime() - aorDate.getTime()) / (1000 * 60 * 60 * 24))
        cleanData.aor_to_bil_days = days >= 0 ? days : null
      }

      // Add email and metadata
      cleanData.email = formData.email
      cleanData.email_verified = true
      cleanData.data_source = 'user_submission'

      const result = await createTimeline(cleanData as Partial<Timeline>)

      // Save to localStorage
      saveUserData(formData.email, result.timeline.id, formData.username)

      setStatus('✅ Timeline created successfully!')

      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Error creating timeline:', error)
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Failed to create timeline'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large modal-create" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-sticky-header">
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
          <h2>Create Your Timeline</h2>
          <p className="modal-description">
            Share your Express Entry timeline to help others
          </p>
        </div>

        <div className="modal-form-content">
        <form onSubmit={handleSubmit} className="edit-form">
          <h3 className="form-section-title">Basic Information (Required)</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="email">Your Email *</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                id="username"
                type="text"
                placeholder="Choose a display name"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="stream">Stream *</label>
              <select
                id="stream"
                value={formData.stream}
                onChange={(e) => handleChange('stream', e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select Stream</option>
                <option value="CEC">CEC</option>
                <option value="CEC - French">CEC - French</option>
                <option value="CEC - Healthcare">CEC - Healthcare</option>
                <option value="CEC - Education">CEC - Education</option>
                <option value="CEC - Trade">CEC - Trade</option>
                <option value="FSW">FSW</option>
                <option value="FSW - Healthcare">FSW - Healthcare</option>
                <option value="FSW - French">FSW - French</option>
                <option value="FST">FST</option>
                <option value="PNP">PNP</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="application_type">Application Type *</label>
              <select
                id="application_type"
                value={formData.application_type}
                onChange={(e) => handleChange('application_type', e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select Type</option>
                <option value="Inland">Inland</option>
                <option value="Outland">Outland</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ita_date">ITA Date *</label>
              <input
                id="ita_date"
                type="date"
                value={formData.ita_date}
                max={today}
                onChange={(e) => handleChange('ita_date', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="aor_date">AOR Date *</label>
              <input
                id="aor_date"
                type="date"
                value={formData.aor_date}
                max={today}
                onChange={(e) => handleChange('aor_date', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="primary_visa_office">Primary Visa Office</label>
              <input
                id="primary_visa_office"
                type="text"
                list="visa-offices-datalist"
                value={formData.primary_visa_office}
                onChange={(e) => handleChange('primary_visa_office', e.target.value)}
                disabled={loading}
                placeholder="e.g., Ottawa, Sydney, New Delhi"
              />
              <datalist id="visa-offices-datalist">
                {canadianVisaOffices.map(office => (
                  <option key={office} value={office} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label htmlFor="secondary_visa_office">Secondary Visa Office</label>
              <input
                id="secondary_visa_office"
                type="text"
                list="visa-offices-datalist"
                value={formData.secondary_visa_office}
                onChange={(e) => handleChange('secondary_visa_office', e.target.value)}
                disabled={loading}
                placeholder="Optional"
              />
            </div>

            <div className="form-group">
              <label htmlFor="complexity">Complexity</label>
              <select
                id="complexity"
                value={formData.complexity}
                onChange={(e) => handleChange('complexity', e.target.value)}
                disabled={loading}
              >
                <option value="">Select Complexity</option>
                <option value="Single - No Foreign Exp">Single - No Foreign Exp</option>
                <option value="Single - With Foreign Exp">Single - With Foreign Exp</option>
                <option value="With Partner/Family - No Foreign Exp">With Partner/Family - No Foreign Exp</option>
                <option value="With Partner/Family - With Foreign Exp">With Partner/Family - With Foreign Exp</option>
              </select>
            </div>
          </div>

          <h3 className="form-section-title">Processing Milestones (Optional)</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="bio_req_date">Biometrics Request Date</label>
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
              <label htmlFor="medical_date">Medical Date</label>
              <input
                id="medical_date"
                type="date"
                value={formData.medical_date}
                max={today}
                onChange={(e) => handleChange('medical_date', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="eligibility_check">Eligibility Status</label>
              <select
                id="eligibility_check"
                value={formData.eligibility_check}
                onChange={(e) => handleChange('eligibility_check', e.target.value)}
                disabled={loading}
              >
                <option value="">Not Started</option>
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
              <label htmlFor="bg_check">Background Check Status</label>
              <select
                id="bg_check"
                value={formData.bg_check}
                onChange={(e) => handleChange('bg_check', e.target.value)}
                disabled={loading}
              >
                <option value="">Not Started</option>
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

            <div className="form-group">
              <label htmlFor="final_decision_date">Final Decision Date</label>
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
              <label htmlFor="p2_passport_sent_date">P2/Passport Sent Date</label>
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
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Add any notes about your timeline..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="privacy-consent">
            <label className="privacy-checkbox">
              <input
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                disabled={loading}
              />
              <span>
                I understand my email will be collected and may be used for app updates,
                new features, and occasional communications.
              </span>
            </label>
          </div>

          {status && (
            <div className={`status ${status.includes('❌') ? 'error' : 'success'}`}>
              {status}
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Timeline'}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost" disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
