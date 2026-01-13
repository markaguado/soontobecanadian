'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { X } from 'lucide-react'
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
    const newFilters: FilterState = {
      stream: updates.stream ?? selectedStream,
      visa_office: updates.visa_office ?? selectedVisaOffice,
      type: updates.type ?? selectedType,
      complexity: updates.complexity ?? selectedComplexity,
      completion_status: updates.completion_status ?? selectedCompletionStatus
    }
    onFilterChange(newFilters)
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

  const activeCount = [selectedStream, selectedVisaOffice, selectedType, selectedComplexity, selectedCompletionStatus]
    .filter(Boolean).length

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filter Timelines</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Clear {activeCount} {activeCount === 1 ? 'filter' : 'filters'}
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Stream Filter */}
        <div className="space-y-2">
          <Label htmlFor="stream-filter">Stream</Label>
          <Select value={selectedStream} onValueChange={(value) => {
            setSelectedStream(value)
            updateFilters({ stream: value })
          }}>
            <SelectTrigger id="stream-filter">
              <SelectValue placeholder="All Streams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Streams</SelectItem>
              {streams.map(stream => (
                <SelectItem key={stream} value={stream}>
                  {stream}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Visa Office Filter */}
        <div className="space-y-2">
          <Label htmlFor="visa-office-filter">Visa Office</Label>
          <Select value={selectedVisaOffice} onValueChange={(value) => {
            setSelectedVisaOffice(value)
            updateFilters({ visa_office: value })
          }}>
            <SelectTrigger id="visa-office-filter">
              <SelectValue placeholder="All Visa Offices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Visa Offices</SelectItem>
              {visaOffices.map(office => (
                <SelectItem key={office} value={office}>
                  {office}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="type-filter">Application Type</Label>
          <Select value={selectedType} onValueChange={(value) => {
            setSelectedType(value)
            updateFilters({ type: value })
          }}>
            <SelectTrigger id="type-filter">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="Inland">Inland</SelectItem>
              <SelectItem value="Outland">Outland</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Complexity Filter */}
        <div className="space-y-2">
          <Label htmlFor="complexity-filter">Complexity</Label>
          <Select value={selectedComplexity} onValueChange={(value) => {
            setSelectedComplexity(value)
            updateFilters({ complexity: value })
          }}>
            <SelectTrigger id="complexity-filter">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Complexity</SelectItem>
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="Family">Family</SelectItem>
              <SelectItem value="Foreign Exp">With Foreign Exp</SelectItem>
              <SelectItem value="No Foreign Exp">No Foreign Exp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select value={selectedCompletionStatus} onValueChange={(value) => {
            setSelectedCompletionStatus(value)
            updateFilters({ completion_status: value })
          }}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="active">Active (No eCOPR)</SelectItem>
              <SelectItem value="ecopr">eCOPR Received</SelectItem>
              <SelectItem value="pr-card">PR Card Received</SelectItem>
              <SelectItem value="updated-today">📍 Updated Today</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
