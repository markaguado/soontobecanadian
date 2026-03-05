'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import CoffeeBanner from '@/components/CoffeeBanner'
import { getTimelines } from '@/lib/api'
import type { Timeline, FilterState } from '@/lib/types'
import { Filters } from '@/components/tracker/Filters'
import { SearchBar } from '@/components/tracker/SearchBar'
import { TimelineTable } from '@/components/tracker/TimelineTable'
import { Analytics } from '@/components/tracker/Analytics'
import { CreateTimelineModal } from '@/components/tracker/CreateTimelineModal'
import { HowToUseModal } from '@/components/tracker/HowToUseModal'
import { ReclaimModal } from '@/components/tracker/ReclaimModal'
import { MyTimeline } from '@/components/tracker/MyTimeline'
import { MyComments } from '@/components/tracker/MyComments'
import { getClaimedTimelineIds, canEditTimeline } from '@/lib/localStorage'
import { isToday } from '@/lib/updateTracker'

export default function TrackerClient() {
  const [timelines, setTimelines] = useState<Timeline[]>([])
  const [myTimelines, setMyTimelines] = useState<Timeline[]>([])
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
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showHowToModal, setShowHowToModal] = useState(false)
  const [showReclaimModal, setShowReclaimModal] = useState(false)

  useEffect(() => {
    fetchTimelines()
  }, [])

  const fetchTimelines = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTimelines()

      // Separate claimed timelines
      const claimedIds = getClaimedTimelineIds()
      const claimed = data.filter(t => canEditTimeline(t) || claimedIds.includes(t.id))
      const unclaimed = data.filter(t => !(canEditTimeline(t) || claimedIds.includes(t.id)))

      setMyTimelines(claimed)
      setTimelines(unclaimed)
      setFilteredTimelines(unclaimed)
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
          case 'updated-today':
            return isToday(t.last_updated_by_user)
          case 'updated-7days':
            return t.last_updated_by_user
              ? new Date().getTime() - new Date(t.last_updated_by_user).getTime() < 7 * 24 * 60 * 60 * 1000
              : false
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
      <div className="min-h-screen bg-gray-50">
        <TrackerNav onShareClick={() => setShowCreateModal(true)} />
        <div className="dashboard">
          <div className="loading-state">
            <div className="spinner"></div>
            <div>
              <p className="loading-title">Loading timelines</p>
              <p className="loading-subtitle">Fetching community immigration data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TrackerNav onShareClick={() => setShowCreateModal(true)} />
        <div className="dashboard">
          <div className="error-state">
            <h2>❌ Error Loading Data</h2>
            <p>{error}</p>
            <button onClick={fetchTimelines} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TrackerNav onShareClick={() => setShowCreateModal(true)} />
      <CoffeeBanner />
      <main>
        <div className="dashboard">
          <div className="dashboard-header">
            <h1>Canadian Express Entry Timelines</h1>
            <p className="subtitle">
              Real immigration processing timelines shared by applicants
            </p>
            <div className="header-buttons-row">
              <button onClick={() => setShowHowToModal(true)} className="btn-how-to">
                ❓ How to Use
              </button>
              <a
                href="https://buymeacoffee.com/mrkdev"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-coffee-header"
                aria-label="Support this project on Buy Me a Coffee"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
                <span>Buy Me a Coffee</span>
              </a>
            </div>
          </div>

      {myTimelines.length > 0 && (
        <div className="my-timeline-section">
          {myTimelines.map(timeline => (
            <MyTimeline
              key={timeline.id}
              timeline={timeline}
              allTimelines={[...myTimelines, ...timelines]}
              onUpdate={fetchTimelines}
            />
          ))}
        </div>
      )}

      <div className="filters-section">
        <h2>Filter Timelines</h2>
        <Filters
          timelines={timelines}
          onFilterChange={handleFilterChange}
        />

        {filteredTimelines.length > 0 && (
          <div className="analytics-wrapper">
            <Analytics timelines={filteredTimelines} />
          </div>
        )}
      </div>

      <div className="table-section">
        <div className="table-header">
          <h2>Immigration Timelines</h2>
          <div className="table-actions">
            {myTimelines.length === 0 && (
              <button onClick={() => setShowReclaimModal(true)} className="btn-access-timeline-small">
                🔑 Access My Timeline
              </button>
            )}
            <button onClick={() => setShowCreateModal(true)} className="btn-create-timeline-small">
              + Share Your Timeline
            </button>
          </div>
        </div>

        <div className="search-filter-section">
          <SearchBar
            onSearch={handleSearch}
            resultCount={filteredTimelines.length}
            placeholder="Search by username, stream, or visa office..."
          />
        </div>

        <div className="timeline-tip-banner">
          <span className="tip-icon">💡</span>
          <span className="tip-text">
            <strong>Tip:</strong> Tap any <strong>username</strong> to view their full timeline, see detailed stats, and ask questions or leave comments!
          </span>
        </div>

        <TimelineTable
          timelines={filteredTimelines}
          onTimelineUpdated={fetchTimelines}
        />
      </div>

        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="sm:col-span-2">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-3">
                <span aria-hidden="true">🇨🇦</span>
                <span>Soon To Be Canadian</span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                An independent, community-run platform for Canadian immigration applicants.
                Not affiliated with IRCC or the Government of Canada.
              </p>
              <a
                href="https://buymeacoffee.com/mrkdev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-900 text-sm font-semibold rounded-lg transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
                Buy me a coffee
              </a>
            </div>
            <nav aria-label="Tools navigation">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Tools</h3>
              <ul className="space-y-2 text-sm text-gray-500 list-none">
                <li><Link href="/tracker" className="hover:text-indigo-600 transition-colors">Timeline Tracker</Link></li>
                <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Immigration Guides</Link></li>
              </ul>
            </nav>
            <nav aria-label="Company navigation">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Company</h3>
              <ul className="space-y-2 text-sm text-gray-500 list-none">
                <li><Link href="/about" className="hover:text-indigo-600 transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </nav>
          </div>
          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Soon To Be Canadian. All rights reserved.</p>
            <p className="text-center sm:text-right">
              Immigration information only — not legal advice. Always consult a Regulated Canadian Immigration Consultant (RCIC).
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showCreateModal && (
        <CreateTimelineModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchTimelines}
        />
      )}

      {showHowToModal && (
        <HowToUseModal
          onClose={() => setShowHowToModal(false)}
        />
      )}

      {showReclaimModal && (
        <ReclaimModal
          onClose={() => setShowReclaimModal(false)}
          onSuccess={fetchTimelines}
        />
      )}

      {/* Floating Comments Button */}
      <MyComments />
    </div>
  )
}

function TrackerNav({ onShareClick }: { onShareClick: () => void }) {
  return (
    <header>
      <nav
        className="border-b border-gray-100 bg-white/95 backdrop-blur sticky top-0 z-50"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900"
            aria-label="Soon To Be Canadian - Home"
          >
            <span aria-hidden="true">🇨🇦</span>
            <span>Soon To Be Canadian</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/tracker"
              className="text-sm font-medium text-indigo-600 hidden sm:block"
              aria-current="page"
            >
              Timeline Tracker
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block"
            >
              Guides
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block"
            >
              About
            </Link>
            <button
              onClick={onShareClick}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Share Timeline
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
