import { Suspense } from 'react'
import type { Metadata } from 'next'
import TrackerClient from './TrackerClient'

export const metadata: Metadata = {
  title: 'Immigration Timeline Tracker | Compare Real Express Entry Processing Times',
  description: 'Compare 400+ real Canadian Express Entry timelines from CEC, FSW, and PNP applicants. Track processing times from AOR to eCOPR. Free Canada PR timeline tracker.',
  keywords: ['express entry timeline', 'canada pr processing time', 'immigration tracker', 'CEC timeline', 'FSW timeline', 'PNP timeline'],

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading immigration timelines...</p>
      </div>
    </div>
  )
}
