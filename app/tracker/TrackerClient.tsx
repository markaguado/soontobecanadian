'use client'

import { useEffect, useState } from 'react'
import { getTimelines } from '@/lib/api'
import type { Timeline, FilterState } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus, Filter as FilterIcon } from 'lucide-react'
import { Filters } from '@/components/tracker/Filters'
import { TimelineTable } from '@/components/tracker/TimelineTable'

export default function TrackerClient() {
  const [timelines, setTimelines] = useState<Timeline[]>([])
  const [filteredTimelines, setFilteredTimelines] = useState<Timeline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    stream: '',
    visa_office: '',
    type: '',
    complexity: '',
    completion_status: ''
  })
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    fetchTimelines()
  }, [])

  const fetchTimelines = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTimelines()
      setTimelines(data)
      setFilteredTimelines(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load timelines')
      console.error('Error fetching timelines:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSearch = (
    timelinesList: Timeline[],
    currentFilters: FilterState,
    currentSearch: string
  ): Timeline[] => {
    if (!Array.isArray(timelinesList)) return []

    let filtered = timelinesList

    // Apply dropdown filters
    if (currentFilters.stream) {
      filtered = filtered.filter(t => t.stream === currentFilters.stream)
    }

    if (currentFilters.visa_office) {
      filtered = filtered.filter(t => t.primary_visa_office === currentFilters.visa_office)
    }

    if (currentFilters.type) {
      filtered = filtered.filter(t => t.application_type === currentFilters.type)
    }

    if (currentFilters.complexity) {
      filtered = filtered.filter(t => {
        if (!t.complexity) return false
        return t.complexity.includes(currentFilters.complexity)
      })
    }

    if (currentFilters.completion_status) {
      filtered = filtered.filter(t => {
        const hasEcopr = !!t.ecopr_passport_received_date
        const hasPRCard = !!t.pr_card_received_date

        switch (currentFilters.completion_status) {
          case 'active':
            return !hasEcopr && !hasPRCard
          case 'ecopr':
            return hasEcopr
          case 'pr-card':
            return hasPRCard
          default:
            return true
        }
      })
    }

    // Apply search
    if (currentSearch && currentSearch.trim()) {
      const searchLower = currentSearch.toLowerCase().trim()
      filtered = filtered.filter(t =>
        t.username?.toLowerCase().includes(searchLower) ||
        t.stream?.toLowerCase().includes(searchLower) ||
        t.primary_visa_office?.toLowerCase().includes(searchLower) ||
        t.secondary_visa_office?.toLowerCase().includes(searchLower) ||
        t.application_type?.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    const filtered = applyFiltersAndSearch(timelines, newFilters, searchTerm)
    setFilteredTimelines(filtered)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = applyFiltersAndSearch(timelines, filters, term)
    setFilteredTimelines(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading immigration timelines...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Data</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchTimelines} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                🇨🇦 Immigration Timeline Tracker
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Compare {timelines.length}+ real Express Entry processing timelines
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Share Timeline
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by username, stream, or visa office..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="default"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon className="mr-2 h-4 w-4" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-3">
              Found <strong>{filteredTimelines.length}</strong> timeline{filteredTimelines.length !== 1 ? 's' : ''} matching &quot;{searchTerm}&quot;
            </p>
          )}
        </Card>

        {/* Filters */}
        {showFilters && (
          <Filters
            timelines={timelines}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Showing {filteredTimelines.length} timeline{filteredTimelines.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {/* Timeline Table */}
        <TimelineTable
          timelines={filteredTimelines}
          onTimelineUpdated={fetchTimelines}
        />
      </main>
    </div>
  )
}
