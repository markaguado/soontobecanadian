'use client'

import { useState } from 'react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function NotifyForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !email.includes('@')) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    // Simulate API call - replace with actual implementation
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="max-w-md mx-auto p-4 rounded-lg bg-green-50 border border-green-200"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-green-700">
          <svg
            className="w-5 h-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="text-sm font-medium">
            You&apos;re subscribed! We&apos;ll notify you when new guides are published.
          </span>
        </div>
      </div>
    )
  }

  return (
    <form
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="flex-1 relative">
        <label htmlFor="notify-email" className="sr-only">
          Email address
        </label>
        <input
          id="notify-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') {
              setStatus('idle')
              setErrorMessage('')
            }
          }}
          placeholder="your@email.com"
          autoComplete="email"
          required
          disabled={status === 'submitting'}
          aria-invalid={status === 'error'}
          aria-describedby={status === 'error' ? 'notify-error' : undefined}
          className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed ${
            status === 'error'
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 bg-white'
          }`}
        />
        {status === 'error' && errorMessage && (
          <p
            id="notify-error"
            className="absolute left-0 top-full mt-1 text-xs text-red-600"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2"
      >
        {status === 'submitting' ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Subscribing...</span>
          </>
        ) : (
          'Notify me'
        )}
      </button>
    </form>
  )
}
