'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'coffee_banner_dismissed_at'
const REAPPEAR_AFTER_DAYS = 10

export default function CoffeeBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissedAt = localStorage.getItem(STORAGE_KEY)
    if (!dismissedAt) {
      setVisible(true)
      return
    }
    const daysSince = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24)
    if (daysSince >= REAPPEAR_AFTER_DAYS) setVisible(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-amber-800 min-w-0">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
          <span className="truncate">
            Like this tool? Help keep it free and ad-light —{' '}
            <a
              href="https://buymeacoffee.com/mrkdev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2 hover:text-amber-900 transition-colors"
            >
              buy me a coffee →
            </a>
          </span>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss banner"
          className="shrink-0 text-amber-600 hover:text-amber-900 transition-colors p-0.5 rounded"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
