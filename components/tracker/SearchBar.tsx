'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  onSearch: (value: string) => void
  resultCount?: number
  placeholder?: string
}

export function SearchBar({ onSearch, resultCount, placeholder = "Search by username, visa office, or stream..." }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className="search-bar" role="search">
      <label htmlFor="timeline-search" className="visually-hidden">
        Search immigration timelines by username, visa office, or stream
      </label>
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} strokeWidth={2} aria-hidden="true" />
        <input
          id="timeline-search"
          type="search"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          aria-describedby={searchTerm ? "search-results-status" : undefined}
          aria-label="Search timelines"
        />
        {searchTerm && (
          <button
            className="search-clear"
            onClick={handleClear}
            aria-label={`Clear search "${searchTerm}"`}
            title="Clear search"
          >
            <X size={18} strokeWidth={2} />
          </button>
        )}
      </div>
      {searchTerm && (
        <div
          id="search-results-status"
          className="search-results-text"
          role="status"
          aria-live="polite"
        >
          Searching for: <strong>{searchTerm}</strong>
          {resultCount !== undefined && (
            <span> - {resultCount} result{resultCount !== 1 ? 's' : ''} found</span>
          )}
        </div>
      )}
    </div>
  )
}
