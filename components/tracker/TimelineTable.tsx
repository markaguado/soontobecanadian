'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { SortableColumnHeader } from './SortableColumnHeader'
import { ClaimModal } from './ClaimModal'
import { EditTimelineModal } from './EditTimelineModal'
import { CommentsModal } from './CommentsModal'
import { ProfileModal } from './ProfileModal'
import { AdminPanel } from './AdminPanel'
import { formatDate, calculateDays } from '@/lib/api'
import { canEditTimeline, getClaimedTimelineIds } from '@/lib/localStorage'
import { isAdmin } from '@/lib/admin'
import type { Timeline } from '@/lib/types'

const ROWS_PER_PAGE = 100

interface TimelineTableProps {
  timelines: Timeline[]
  onTimelineUpdated?: () => void
}

export function TimelineTable({ timelines, onTimelineUpdated }: TimelineTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' | null }>({
    key: 'ita_date',
    direction: 'asc'
  })
  const [currentPage, setCurrentPage] = useState(1)

  // Modal states
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(null)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await isAdmin()
      setIsAdminUser(admin)
    }
    checkAdmin()
  }, [])

  // Reset to page 1 when timelines change (from filtering or search)
  useEffect(() => {
    setCurrentPage(1)
  }, [timelines])

  // Memoize claimed IDs
  const claimedIds = useMemo(() => getClaimedTimelineIds(), [])

  const unclaimedTimelines = useMemo(() =>
    timelines.filter(timeline => {
      const isClaimed = canEditTimeline(timeline) || claimedIds.includes(timeline.id)
      return !isClaimed
    }),
    [timelines, claimedIds]
  )

  // Memoize sorting
  const sortedTimelines = useMemo(() => [...unclaimedTimelines].sort((a, b) => {
    if (!sortConfig.key) {
      // Default: sort by ITA date ascending
      const dateA = a.ita_date ? new Date(a.ita_date) : new Date('9999-12-31')
      const dateB = b.ita_date ? new Date(b.ita_date) : new Date('9999-12-31')
      return dateA.getTime() - dateB.getTime()
    }

    // Special handling for total_days (AOR to eCOPR)
    if (sortConfig.key === 'total_days') {
      const aDays = calculateDays(a.aor_date, a.ecopr_passport_received_date)
      const bDays = calculateDays(b.aor_date, b.ecopr_passport_received_date)

      const aNum = aDays !== '-' ? parseInt(aDays) : null
      const bNum = bDays !== '-' ? parseInt(bDays) : null

      if (!aNum && !bNum) return 0
      if (!aNum) return 1
      if (!bNum) return -1

      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum
    }

    // Special handling for aor_to_bil_days (numeric)
    if (sortConfig.key === 'aor_to_bil_days') {
      const aNum = a.aor_to_bil_days || null
      const bNum = b.aor_to_bil_days || null

      if (!aNum && !bNum) return 0
      if (!aNum) return 1
      if (!bNum) return -1

      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum
    }

    const aValue = a[sortConfig.key as keyof Timeline]
    const bValue = b[sortConfig.key as keyof Timeline]

    // Handle null/undefined values
    if (!aValue && !bValue) return 0
    if (!aValue) return 1
    if (!bValue) return -1

    // Date comparison
    const aDate = new Date(aValue as string)
    const bDate = new Date(bValue as string)

    if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
      return sortConfig.direction === 'asc'
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime()
    }

    return 0
  }), [unclaimedTimelines, sortConfig])

  // Memoize row calculations
  const processedTimelines = useMemo(() => {
    return sortedTimelines.map(timeline => {
      const isEditable = canEditTimeline(timeline)
      const isClaimed = claimedIds.includes(timeline.id)
      const hasEcopr = !!timeline.ecopr_passport_received_date
      const hasPRCard = !!timeline.pr_card_received_date
      const eligibilityComplete = timeline.eligibility_check === 'Completed' || !!timeline.eligibility_completion_date
      const backgroundComplete = timeline.bg_check === 'Completed' || !!timeline.bg_completion_date
      const bothChecksComplete = eligibilityComplete && backgroundComplete && !hasEcopr
      const isRecentlyUpdated = !!(timeline.last_updated_by_user &&
        new Date().getTime() - new Date(timeline.last_updated_by_user).getTime() < 7 * 24 * 60 * 60 * 1000)

      // Check if updated today using the same logic as filter
      const updatedToday = timeline.last_updated_by_user ? (() => {
        const date = new Date(timeline.last_updated_by_user)
        const today = new Date()
        return (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
        )
      })() : false

      return {
        ...timeline,
        _computed: {
          isEditable,
          isClaimed,
          hasEcopr,
          hasPRCard,
          eligibilityComplete,
          backgroundComplete,
          bothChecksComplete,
          isRecentlyUpdated,
          updatedToday
        }
      }
    })
  }, [sortedTimelines, claimedIds])

  // Paginate the processed timelines
  const paginatedTimelines = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE
    return processedTimelines.slice(start, start + ROWS_PER_PAGE)
  }, [processedTimelines, currentPage])

  const totalPages = Math.ceil(processedTimelines.length / ROWS_PER_PAGE)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    const wrapper = wrapperRef.current
    if (!el || !wrapper) return

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el
      wrapper.classList.toggle('scrolled-left', scrollLeft > 10)
      wrapper.classList.toggle('scrolled-right', scrollLeft >= scrollWidth - clientWidth - 10)
    }

    el.addEventListener('scroll', update, { passive: true })
    update()
    return () => el.removeEventListener('scroll', update)
  }, [paginatedTimelines])

  const handleSort = (key: string | null, direction: 'asc' | 'desc' | null) => {
    setSortConfig({ key, direction })
    setCurrentPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Modal handlers
  const handleClaimClick = (id: number) => {
    setSelectedId(id)
    setShowClaimModal(true)
  }

  const handleEditClick = (timeline: Timeline) => {
    setSelectedTimeline(timeline)
    setShowEditModal(true)
  }

  const handleCommentsClick = (timeline: Timeline) => {
    setSelectedTimeline(timeline)
    setShowCommentsModal(true)
  }

  const handleProfileClick = (timeline: Timeline) => {
    setSelectedTimeline(timeline)
    setShowProfileModal(true)
  }

  const handleClaimSuccess = () => {
    setShowClaimModal(false)
    if (onTimelineUpdated) {
      onTimelineUpdated()
    }
  }

  const handleEditSuccess = () => {
    setShowEditModal(false)
    if (onTimelineUpdated) {
      onTimelineUpdated()
    }
  }

  const handleAdminClick = (timeline: Timeline) => {
    setSelectedTimeline(timeline)
    setShowAdminPanel(true)
  }

  const handleAdminAction = () => {
    setShowAdminPanel(false)
    if (onTimelineUpdated) {
      onTimelineUpdated()
    }
  }

  if (!timelines || timelines.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <h3 className="empty-state-heading">No timelines found</h3>
        <p className="empty-state-text">Try adjusting or clearing your filters to see more results.</p>
      </div>
    )
  }

  return (
    <div ref={wrapperRef} className="table-scroll-wrapper">
    <div ref={scrollRef} className="table-container">
      <table className="timelines-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Stream</th>
            <th>Type</th>
            <th>Complexity</th>
            <th>Visa Office</th>
            <SortableColumnHeader
              label="ITA Date"
              sortKey="ita_date"
              currentSort={sortConfig}
              onSort={handleSort}
            />
            <SortableColumnHeader
              label="AOR Date"
              sortKey="aor_date"
              currentSort={sortConfig}
              onSort={handleSort}
            />
            <SortableColumnHeader
              label="AOR→BIL"
              sortKey="aor_to_bil_days"
              currentSort={sortConfig}
              onSort={handleSort}
            />
            <th>Bio Req</th>
            <th>Medical</th>
            <SortableColumnHeader
              label="Eligibility"
              sortKey="eligibility_completion_date"
              currentSort={sortConfig}
              onSort={handleSort}
            />
            <SortableColumnHeader
              label="Background"
              sortKey="bg_completion_date"
              currentSort={sortConfig}
              onSort={handleSort}
            />
            <SortableColumnHeader
              label="Final Decision"
              sortKey="final_decision_date"
              currentSort={sortConfig}
              onSort={handleSort}
            />
            <SortableColumnHeader
              label="PPR/P1"
              sortKey="ppr_p1_date"
              currentSort={sortConfig}
              onSort={handleSort}
            />
            <SortableColumnHeader
              label="P2/Passport Sent"
              sortKey="p2_passport_sent_date"
              currentSort={sortConfig}
              onSort={handleSort}
            />
            <SortableColumnHeader
              label="eCOPR/Passport Recv"
              sortKey="ecopr_passport_received_date"
              currentSort={sortConfig}
              onSort={handleSort}
            />
            <th>PR Card Sent</th>
            <th>PR Card Recv</th>
            <SortableColumnHeader
              label="AOR→eCOPR"
              sortKey="total_days"
              currentSort={sortConfig}
              onSort={handleSort}
            />
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTimelines.map((timeline) => {
            const {
              isEditable,
              isClaimed,
              hasEcopr,
              hasPRCard,
              bothChecksComplete,
              isRecentlyUpdated,
              updatedToday
            } = timeline._computed

            return (
              <tr key={timeline.id} className={`${hasEcopr ? 'has-ecopr' : ''} ${hasPRCard ? 'has-pr-card' : ''} ${updatedToday ? 'updated-today' : ''}`}>
                <td>
                  <div className="username-cell">
                    <div className="username-row">
                      <button
                        className="username-link"
                        onClick={() => handleProfileClick(timeline)}
                        title="View profile and timeline details"
                      >
                        {timeline.username || '-'}
                      </button>
                      {isRecentlyUpdated && <span className="new-update-dot" title="Updated recently">🔴</span>}
                    </div>
                    {hasPRCard && <span className="completion-badge pr-card">🎉 PR Card</span>}
                    {!hasPRCard && hasEcopr && <span className="completion-badge ecopr">✅ eCOPR</span>}
                    {!hasPRCard && !hasEcopr && bothChecksComplete && (
                      <span className="completion-badge hang-in-there">💪 Hang in there!</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="badge stream">
                    {timeline.stream || '-'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${timeline.application_type?.toLowerCase()}`}>
                    {timeline.application_type || '-'}
                  </span>
                </td>
                <td>
                  <div className="complexity-cell">
                    {timeline.complexity ? (
                      <>
                        <span className="complexity-type">
                          {timeline.complexity.includes('Single') ? 'Single' : 'Family'}
                        </span>
                        <span className="complexity-exp">
                          {timeline.complexity.includes('With Foreign Exp') ? 'Foreign Exp' : 'No Foreign Exp'}
                        </span>
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </td>
                <td>
                  <div className="visa-office-cell">
                    <span className="primary-office">{timeline.primary_visa_office || '-'}</span>
                    {timeline.secondary_visa_office && (
                      <span className="secondary-office-badge">+{timeline.secondary_visa_office}</span>
                    )}
                  </div>
                </td>
                <td>{formatDate(timeline.ita_date)}</td>
                <td>{formatDate(timeline.aor_date)}</td>
                <td className="days-column">
                  {timeline.aor_to_bil_days ? `${timeline.aor_to_bil_days}d` : '-'}
                </td>
                <td>{formatDate(timeline.bio_req_date)}</td>
                <td>
                  <div className="check-cell">
                    {timeline.medical_date ? (
                      <>
                        <span className="check-status completed">✓ Passed</span>
                        <span className="check-date">{formatDate(timeline.medical_date)}</span>
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </td>
                <td>
                  <div className="check-cell">
                    {timeline.eligibility_check ? (
                      <>
                        <span className={`check-status ${timeline.eligibility_check.toLowerCase() === 'completed' ? 'completed' : timeline.eligibility_check.toLowerCase() === 'in process' ? 'in-process' : ''}`}>
                          {timeline.eligibility_check === 'Completed' && '✓ '}
                          {timeline.eligibility_check === 'In Process' && '⏳ '}
                          {timeline.eligibility_check}
                        </span>
                        {timeline.eligibility_completion_date && (
                          <span className="check-date">{formatDate(timeline.eligibility_completion_date)}</span>
                        )}
                      </>
                    ) : timeline.eligibility_completion_date ? (
                      <>
                        <span className="check-status completed">✓ Completed</span>
                        <span className="check-date">{formatDate(timeline.eligibility_completion_date)}</span>
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </td>
                <td>
                  <div className="check-cell">
                    {timeline.bg_check ? (
                      <>
                        <span className={`check-status ${timeline.bg_check.toLowerCase() === 'completed' ? 'completed' : timeline.bg_check.toLowerCase() === 'in process' ? 'in-process' : ''}`}>
                          {timeline.bg_check === 'Completed' && '✓ '}
                          {timeline.bg_check === 'In Process' && '⏳ '}
                          {timeline.bg_check}
                        </span>
                        {timeline.bg_completion_date && (
                          <span className="check-date">{formatDate(timeline.bg_completion_date)}</span>
                        )}
                      </>
                    ) : timeline.bg_completion_date ? (
                      <>
                        <span className="check-status completed">✓ Completed</span>
                        <span className="check-date">{formatDate(timeline.bg_completion_date)}</span>
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </td>
                <td>{formatDate(timeline.final_decision_date)}</td>
                <td>{formatDate(timeline.ppr_p1_date)}</td>
                <td>{formatDate(timeline.p2_passport_sent_date)}</td>
                <td>{formatDate(timeline.ecopr_passport_received_date)}</td>
                <td>{formatDate(timeline.pr_card_sent_date)}</td>
                <td>{formatDate(timeline.pr_card_received_date)}</td>
                <td className="days-column total-days">
                  <strong>
                    {calculateDays(timeline.aor_date, timeline.ecopr_passport_received_date)}
                  </strong>
                </td>
                <td>
                  {timeline.ircc_last_update || timeline.notes ? (
                    <button
                      onClick={() => handleCommentsClick(timeline)}
                      className="btn-comments"
                      title="View IRCC updates and notes"
                    >
                      💬
                    </button>
                  ) : (
                    <span className="no-comments-icon">-</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {isEditable || isClaimed ? (
                      <button
                        onClick={() => handleEditClick(timeline)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                    ) : timeline.email ? (
                      <button className="btn-claim" disabled>
                        ✓ Claimed
                      </button>
                    ) : (
                      <button
                        onClick={() => handleClaimClick(timeline.id)}
                        className="btn-claim"
                      >
                        Claim
                      </button>
                    )}
                    {isAdminUser && (
                      <button
                        onClick={() => handleAdminClick(timeline)}
                        className="btn-admin"
                        title="Admin Controls"
                      >
                        🛡️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn pagination-nav"
          >
            ← Previous
          </button>

          <div className="pagination-pages">
            <button
              onClick={() => handlePageChange(1)}
              className={`pagination-page-btn ${currentPage === 1 ? 'active' : ''}`}
            >
              1
            </button>

            {currentPage > 3 && <span className="pagination-ellipsis">...</span>}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                return page > 1 && page < totalPages && Math.abs(page - currentPage) <= 1
              })
              .map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`pagination-page-btn ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}

            {currentPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}

            {totalPages > 1 && (
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`pagination-page-btn ${currentPage === totalPages ? 'active' : ''}`}
              >
                {totalPages}
              </button>
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="pagination-btn pagination-nav"
          >
            Next →
          </button>

          <span className="pagination-info">
            {processedTimelines.length > 0 && (
              <>
                Showing {((currentPage - 1) * ROWS_PER_PAGE) + 1}-{Math.min(currentPage * ROWS_PER_PAGE, processedTimelines.length)} of {processedTimelines.length}
              </>
            )}
          </span>
        </div>
      )}

      {/* Modals */}
      {showClaimModal && selectedId && (
        <ClaimModal
          timelineId={selectedId}
          onClose={() => setShowClaimModal(false)}
          onSuccess={handleClaimSuccess}
        />
      )}

      {showEditModal && selectedTimeline && (
        <EditTimelineModal
          timeline={selectedTimeline}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {showCommentsModal && selectedTimeline && (
        <CommentsModal
          timeline={selectedTimeline}
          onClose={() => setShowCommentsModal(false)}
        />
      )}

      {showProfileModal && selectedTimeline && (
        <ProfileModal
          timeline={selectedTimeline}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showAdminPanel && selectedTimeline && (
        <div className="modal-overlay" onClick={() => setShowAdminPanel(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <AdminPanel
              timeline={selectedTimeline}
              onDelete={handleAdminAction}
              onClose={() => setShowAdminPanel(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
