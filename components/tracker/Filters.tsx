'use client'

import { useState, useEffect } from 'react'
import type { Timeline, FilterState } from '@/lib/types'

interface FiltersProps {
  timelines: Timeline[]
  onFilterChange: (filters: FilterState) => void
}

export function Filters({ timelines, onFilterChange }: FiltersProps) {
  const [streams, setStreams] = useState<string[]>([])
  const [visaOffices, setVisaOffices] = useState<string[]>([])
  const [selectedStream, setSelectedStream] = useState('')
  const [selectedVisaOffice, setSelectedVisaOffice] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedComplexity, setSelectedComplexity] = useState('')
  const [selectedCompletionStatus, setSelectedCompletionStatus] = useState('')

  // Extract unique values from timelines
  useEffect(() => {
    if (timelines && timelines.length > 0) {
      const uniqueStreams = [...new Set(timelines.map(t => t.stream).filter(Boolean))].sort()
      const uniqueOffices = [...new Set(timelines.map(t => t.primary_visa_office).filter(Boolean))].sort()

      setStreams(uniqueStreams as string[])
      setVisaOffices(uniqueOffices as string[])
    }
  }, [timelines])

  const updateFilters = (updates: Partial<FilterState>) => {
    onFilterChange({
      stream: updates.stream ?? selectedStream,
      visa_office: updates.visa_office ?? selectedVisaOffice,
      type: updates.type ?? selectedType,
      complexity: updates.complexity ?? selectedComplexity,
      completion_status: updates.completion_status ?? selectedCompletionStatus
    })
  }

  const handleReset = () => {
    setSelectedStream('')
    setSelectedVisaOffice('')
    setSelectedType('')
    setSelectedComplexity('')
    setSelectedCompletionStatus('')
    onFilterChange({
      stream: '',
      visa_office: '',
      type: '',
      complexity: '',
      completion_status: ''
    })
  }

  const hasActiveFilters = selectedStream || selectedVisaOffice || selectedType ||
                          selectedComplexity || selectedCompletionStatus

  return (
    <div className="filters" role="group" aria-label="Filter immigration timelines">
      <div className="filter-group">
        <label htmlFor="stream-filter">Stream</label>
        <select
          id="stream-filter"
          value={selectedStream}
          onChange={(e) => {
            setSelectedStream(e.target.value)
            updateFilters({ stream: e.target.value })
          }}
          aria-label="Filter timelines by immigration stream"
        >
          <option value="">All Streams</option>
          {streams.map(stream => (
            <option key={stream} value={stream}>
              {stream}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="visa-office-filter">Visa Office</label>
        <select
          id="visa-office-filter"
          value={selectedVisaOffice}
          onChange={(e) => {
            setSelectedVisaOffice(e.target.value)
            updateFilters({ visa_office: e.target.value })
          }}
          aria-label="Filter timelines by visa processing office"
        >
          <option value="">All Visa Offices</option>
          {visaOffices.map(office => (
            <option key={office} value={office}>
              {office}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="type-filter">Application Type</label>
        <select
          id="type-filter"
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value)
            updateFilters({ type: e.target.value })
          }}
          aria-label="Filter by application type"
        >
          <option value="">All Types</option>
          <option value="Inland">Inland</option>
          <option value="Outland">Outland</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="complexity-filter">Complexity</label>
        <select
          id="complexity-filter"
          value={selectedComplexity}
          onChange={(e) => {
            setSelectedComplexity(e.target.value)
            updateFilters({ complexity: e.target.value })
          }}
          aria-label="Filter by application complexity"
        >
          <option value="">All Complexity</option>
          <option value="Single">Single</option>
          <option value="Family">Family</option>
          <option value="Foreign Exp">With Foreign Exp</option>
          <option value="No Foreign Exp">No Foreign Exp</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="completion-filter">Status</label>
        <select
          id="completion-filter"
          value={selectedCompletionStatus}
          onChange={(e) => {
            setSelectedCompletionStatus(e.target.value)
            updateFilters({ completion_status: e.target.value })
          }}
          aria-label="Filter by completion status"
        >
          <option value="">All</option>
          <option value="active">Active (No eCOPR)</option>
          <option value="ecopr">eCOPR Received</option>
          <option value="pr-card">PR Card Received</option>
          <option value="updated-today">📍 Updated Today</option>
          <option value="updated-7days">🕐 Updated Last 7 Days</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="btn-reset"
          aria-label="Clear all active filters"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}
