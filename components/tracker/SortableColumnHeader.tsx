interface SortableColumnHeaderProps {
  label: string
  sortKey: string
  currentSort: { key: string | null; direction: 'asc' | 'desc' | null }
  onSort: (key: string | null, direction: 'asc' | 'desc' | null) => void
}

export function SortableColumnHeader({ label, sortKey, currentSort, onSort }: SortableColumnHeaderProps) {
  const isActive = currentSort.key === sortKey
  const direction = isActive ? currentSort.direction : null

  const handleClick = () => {
    if (!isActive) {
      // First click - sort ascending
      onSort(sortKey, 'asc')
    } else if (direction === 'asc') {
      // Second click - sort descending
      onSort(sortKey, 'desc')
    } else {
      // Third click - remove sort (back to default)
      onSort(null, null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const getAriaLabel = () => {
    if (!isActive) {
      return `${label}. Click to sort ascending`
    } else if (direction === 'asc') {
      return `${label}. Currently sorted ascending. Click to sort descending`
    } else {
      return `${label}. Currently sorted descending. Click to remove sorting`
    }
  }

  const getTitle = () => {
    if (!isActive) return `Click to sort ${label} ascending`
    if (direction === 'asc') return `Click to sort ${label} descending`
    return `Click to remove ${label} sorting`
  }

  return (
    <th
      className="sortable-header"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={getAriaLabel()}
      aria-sort={!isActive ? 'none' : direction === 'asc' ? 'ascending' : 'descending'}
      title={getTitle()}
    >
      <div className="sortable-header-content">
        <span>{label}</span>
        <span className="sort-indicator" aria-hidden="true">
          {!isActive && <span className="sort-icon-inactive">⇅</span>}
          {isActive && direction === 'asc' && <span className="sort-icon-asc">↑</span>}
          {isActive && direction === 'desc' && <span className="sort-icon-desc">↓</span>}
        </span>
      </div>
    </th>
  )
}
