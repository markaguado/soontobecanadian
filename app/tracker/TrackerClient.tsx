'use client'

import { useEffect, useState } from 'react'
import { getTimelines } from '@/lib/api'
import type { Timeline, FilterState } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, Plus } from 'lucide-react'

export default function TrackerClient() {
  const [timelines, setTimelines] = useState<Timeline[]>([])
  const [filteredTimelines, setFilteredTimelines] = useState<Timeline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

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

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredTimelines(timelines)
      return
    }

    const searchLower = term.toLowerCase()
    const filtered = timelines.filter(t =>
      t.username?.toLowerCase().includes(searchLower) ||
      t.stream?.toLowerCase().includes(searchLower) ||
      t.primary_visa_office?.toLowerCase().includes(searchLower) ||
      t.application_type?.toLowerCase().includes(searchLower)
    )
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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">🇨🇦 Immigration Timeline Tracker</h1>
              <p className="text-muted-foreground mt-1">
                Compare {timelines.length}+ real Express Entry processing timelines
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Share Timeline
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by username, stream, or visa office..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredTimelines.length} timeline{filteredTimelines.length !== 1 ? 's' : ''} matching "{searchTerm}"
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {filteredTimelines.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No timelines found. Try adjusting your search.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Showing {filteredTimelines.length} timeline{filteredTimelines.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {/* Timeline Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTimelines.slice(0, 12).map((timeline) => (
                <Card key={timeline.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{timeline.username}</CardTitle>
                    <CardDescription>
                      <div className="flex gap-2 mt-2">
                        {timeline.stream && (
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {timeline.stream}
                          </span>
                        )}
                        {timeline.application_type && (
                          <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                            {timeline.application_type}
                          </span>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      {timeline.ita_date && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">ITA:</dt>
                          <dd className="font-medium">{timeline.ita_date}</dd>
                        </div>
                      )}
                      {timeline.aor_date && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">AOR:</dt>
                          <dd className="font-medium">{timeline.aor_date}</dd>
                        </div>
                      )}
                      {timeline.ecopr_passport_received_date && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">eCOPR:</dt>
                          <dd className="font-medium text-green-600">{timeline.ecopr_passport_received_date}</dd>
                        </div>
                      )}
                      {timeline.primary_visa_office && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Office:</dt>
                          <dd className="font-medium">{timeline.primary_visa_office}</dd>
                        </div>
                      )}
                    </dl>

                    <Button variant="outline" className="w-full mt-4" size="sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTimelines.length > 12 && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">
                  Showing 12 of {filteredTimelines.length} timelines
                </p>
                <Button variant="outline">
                  Load More
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
