/**
 * Date Validation Utility
 * Ensures timeline dates follow logical chronological order
 */

/**
 * Validate that timeline dates are in logical order
 */
export const validateTimelineDates = (formData: Record<string, any>): string[] => {
  const errors: string[] = []

  // Helper function to check if date1 is after or equal to date2
  const isAfterOrEqual = (date1?: string | null, date2?: string | null): boolean => {
    if (!date1 || !date2) return true // Skip if either is empty
    return new Date(date1) >= new Date(date2)
  }

  // Helper function to check if date is in the future
  const isFutureDate = (dateStr?: string | null): boolean => {
    if (!dateStr) return false
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today
    return date > today
  }

  // 0. Check for future dates
  const milestoneFields = [
    { field: 'ita_date', label: 'ITA' },
    { field: 'aor_date', label: 'AOR' },
    { field: 'bio_req_date', label: 'Biometrics Request' },
    { field: 'medical_date', label: 'Medical' },
    { field: 'eligibility_completion_date', label: 'Eligibility Completion' },
    { field: 'bg_completion_date', label: 'Background Completion' },
    { field: 'final_decision_date', label: 'Final Decision' },
    { field: 'ppr_p1_date', label: 'PPR/P1' },
    { field: 'p2_passport_sent_date', label: 'P2/Passport Sent' },
    { field: 'ecopr_passport_received_date', label: 'eCOPR/Passport Received' },
    { field: 'pr_card_sent_date', label: 'PR Card Sent' },
    { field: 'pr_card_received_date', label: 'PR Card Received' }
  ]

  milestoneFields.forEach(({ field, label }) => {
    if (formData[field] && isFutureDate(formData[field])) {
      errors.push(`${label} date cannot be in the future`)
    }
  })

  // 1. AOR must be after ITA
  if (formData.ita_date && formData.aor_date && !isAfterOrEqual(formData.aor_date, formData.ita_date)) {
    errors.push('AOR date cannot be before ITA date')
  }

  // 2. All these milestones must be after AOR
  const afterAOR = [
    { field: 'bio_req_date', label: 'Biometrics Request' },
    { field: 'medical_date', label: 'Medical' },
    { field: 'eligibility_completion_date', label: 'Eligibility Completion' },
    { field: 'bg_completion_date', label: 'Background Completion' },
    { field: 'final_decision_date', label: 'Final Decision' },
    { field: 'ppr_p1_date', label: 'PPR/P1' },
    { field: 'ecopr_passport_received_date', label: 'eCOPR/Passport Received' }
  ]

  if (formData.aor_date) {
    afterAOR.forEach(({ field, label }) => {
      if (formData[field] && !isAfterOrEqual(formData[field], formData.aor_date)) {
        errors.push(`${label} date cannot be before AOR date`)
      }
    })
  }

  // 3. P2 must be after PPR/P1
  if (formData.ppr_p1_date && formData.p2_passport_sent_date &&
      !isAfterOrEqual(formData.p2_passport_sent_date, formData.ppr_p1_date)) {
    errors.push('P2/Passport Sent date cannot be before PPR/P1 date')
  }

  // 4. PR Card must be after eCOPR
  if (formData.ecopr_passport_received_date && formData.pr_card_received_date &&
      !isAfterOrEqual(formData.pr_card_received_date, formData.ecopr_passport_received_date)) {
    errors.push('PR Card Received date cannot be before eCOPR/Passport Received date')
  }

  // 5. PR Card Sent should be after eCOPR
  if (formData.ecopr_passport_received_date && formData.pr_card_sent_date &&
      !isAfterOrEqual(formData.pr_card_sent_date, formData.ecopr_passport_received_date)) {
    errors.push('PR Card Sent date cannot be before eCOPR/Passport Received date')
  }

  return errors
}
