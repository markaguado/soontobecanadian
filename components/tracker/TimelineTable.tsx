'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Edit,
  UserPlus,
} from 'lucide-react'
import type { Timeline, SortConfig } from '@/lib/types'
import { formatDate, calculateDays } from '@/lib/api'
import { canEditTimeline } from '@/lib/localStorage'

interface TimelineTableProps {
  timelines: Timeline[]
  onTimelineUpdated?: () => void
}

const ROWS_PER_PAGE = 50

export function TimelineTable({ timelines, onTimelineUpdated }: TimelineTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'ita_date', direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)

  // Sorting logic
  const sortedTimelines = useMemo(() => {
    if (!sortConfig.key) return timelines

    return [...timelines].sort((a, b) => {
      // Handle null/undefined values
      const aValue = a[sortConfig.key as keyof Timeline]
      const bValue = b[sortConfig.key as keyof Timeline]

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

      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return 0
    })
  }, [timelines, sortConfig])

  // Pagination
  const paginatedTimelines = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE
    return sortedTimelines.slice(start, start + ROWS_PER_PAGE)
  }, [sortedTimelines, currentPage])

  const totalPages = Math.ceil(sortedTimelines.length / ROWS_PER_PAGE)

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
    setCurrentPage(1)
  }

  const SortButton = ({ column, label }: { column: string; label: string }) => {
    const isActive = sortConfig.key === column
    const Icon = !isActive ? ArrowUpDown : sortConfig.direction === 'asc' ? ArrowUp : ArrowDown

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleSort(column)}
        className={`font-semibold ${isActive ? 'text-primary' : ''}`}
      >
        {label}
        <Icon className="ml-2 h-4 w-4" />
      </Button>
    )
  }

  if (!timelines || timelines.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No timelines found. Try adjusting your filters.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortButton column="username" label="Username" />
                </TableHead>
                <TableHead>Stream</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Visa Office</TableHead>
                <TableHead>
                  <SortButton column="ita_date" label="ITA Date" />
                </TableHead>
                <TableHead>
                  <SortButton column="aor_date" label="AOR Date" />
                </TableHead>
                <TableHead>Bio Req</TableHead>
                <TableHead>Medical</TableHead>
                <TableHead>
                  <SortButton column="eligibility_completion_date" label="Eligibility" />
                </TableHead>
                <TableHead>
                  <SortButton column="bg_completion_date" label="Background" />
                </TableHead>
                <TableHead>
                  <SortButton column="final_decision_date" label="Final Decision" />
                </TableHead>
                <TableHead>
                  <SortButton column="ppr_p1_date" label="PPR/P1" />
                </TableHead>
                <TableHead>
                  <SortButton column="ecopr_passport_received_date" label="eCOPR" />
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTimelines.map((timeline) => {
                const isEditable = canEditTimeline(timeline)
                const hasEcopr = !!timeline.ecopr_passport_received_date
                const hasPRCard = !!timeline.pr_card_received_date

                return (
                  <TableRow
                    key={timeline.id}
                    className={`${hasEcopr ? 'bg-green-50/50' : ''} ${hasPRCard ? 'bg-yellow-50/50' : ''}`}
                  >
                    <TableCell className="font-medium">
                      <button
                        onClick={() => console.log('Open profile', timeline.id)}
                        className="text-primary hover:underline font-semibold"
                      >
                        {timeline.username}
                      </button>
                      {hasPRCard && (
                        <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                          🎉 PR Card
                        </Badge>
                      )}
                      {!hasPRCard && hasEcopr && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                          ✅ eCOPR
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {timeline.stream && (
                        <Badge variant="outline">{timeline.stream}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {timeline.application_type && (
                        <Badge
                          variant="outline"
                          className={timeline.application_type === 'Inland' ? 'border-blue-300' : 'border-purple-300'}
                        >
                          {timeline.application_type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {timeline.primary_visa_office || '-'}
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(timeline.ita_date)}</TableCell>
                    <TableCell className="text-sm">{formatDate(timeline.aor_date)}</TableCell>
                    <TableCell className="text-sm">{formatDate(timeline.bio_req_date)}</TableCell>
                    <TableCell className="text-sm">{formatDate(timeline.medical_date)}</TableCell>
                    <TableCell className="text-sm">
                      {formatDate(timeline.eligibility_completion_date)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(timeline.bg_completion_date)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(timeline.final_decision_date)}
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(timeline.ppr_p1_date)}</TableCell>
                    <TableCell className="text-sm font-semibold text-green-600">
                      {formatDate(timeline.ecopr_passport_received_date)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {isEditable ? (
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <UserPlus className="h-4 w-4 mr-1" />
                            Claim
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ROWS_PER_PAGE) + 1}-{Math.min(currentPage * ROWS_PER_PAGE, sortedTimelines.length)} of {sortedTimelines.length} timelines
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
