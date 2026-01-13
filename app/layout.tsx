import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://soontobecanadian.com'),
  title: {
    default: 'Soon To Be Canadian | Express Entry Timelines & Immigration Guides',
    template: '%s | Soon To Be Canadian',
  },
  description: 'Compare 400+ real Express Entry timelines, read expert guides, and track your Canadian immigration journey. Free tools for CEC, FSW, and PNP applicants.',
  keywords: ['canada immigration', 'express entry', 'processing times', 'CEC', 'FSW', 'PNP', 'canadian pr', 'immigration timeline'],
  authors: [{ name: 'Soon To Be Canadian' }],

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://soontobecanadian.com',
    siteName: 'Soon To Be Canadian',
    title: 'Soon To Be Canadian | Express Entry Timelines & Immigration Guides',
    description: 'Compare 400+ real Express Entry timelines and read expert immigration guides',
    images: [
      {
        url: '/social-preview.png',
        width: 1200,
        height: 630,
        alt: 'Soon To Be Canadian - Immigration Timeline Tracker',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Soon To Be Canadian | Express Entry Timelines & Immigration Guides',
    description: 'Compare 400+ real Express Entry timelines and read expert immigration guides',
    images: ['/social-preview.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
