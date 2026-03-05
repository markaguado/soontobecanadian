import { Suspense } from 'react'
import type { Metadata } from 'next'
import TrackerClient from './TrackerClient'

export const metadata: Metadata = {
  title: 'Immigration Timeline Tracker | Compare Real Express Entry Processing Times',
  description: 'Compare 400+ real Canadian Express Entry timelines from CEC, FSW, and PNP applicants. Track processing times from AOR to eCOPR. Free Canada PR timeline tracker.',
  keywords: [
    'express entry timeline',
    'express entry processing time',
    'canada pr processing time',
    'express entry tracker',
    'CEC processing time',
    'FSW processing time',
    'PNP processing time',
    'AOR to eCOPR',
    'canada immigration tracker',
    'express entry 2025',
    'ircc processing time',
  ],

  openGraph: {
    title: 'Immigration Timeline Tracker | Real Express Entry Processing Times',
    description: 'Compare 400+ real timelines from Express Entry applicants',
    url: 'https://soontobecanadian.com/tracker',
    type: 'website',
  },
}

export default function TrackerPage() {
  return (
    <Suspense fallback={<TrackerLoading />}>
      <TrackerClient />
    </Suspense>
  )
}

function TrackerLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">Loading immigration timelines...</p>
      </div>
    </div>
  )
}
