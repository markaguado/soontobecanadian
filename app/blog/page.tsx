import type { Metadata } from 'next'
import Link from 'next/link'
import NotifyForm from './NotifyForm'
import CoffeeBanner from '@/components/CoffeeBanner'

export const metadata: Metadata = {
  title: 'Canadian Immigration Guides | Soon To Be Canadian',
  description: 'Expert guides covering Express Entry processing times, CRS scores, AOR to eCOPR timelines, biometrics, PR card tracking, and every step of the Canadian PR journey.',
  alternates: { canonical: 'https://soontobecanadian.com/blog' },
  keywords: [
    'express entry guide',
    'canada immigration guide',
    'express entry processing time 2025',
    'AOR to eCOPR',
    'CRS score guide',
    'canadian PR process',
    'ircc processing time',
    'express entry draws 2025',
  ],
}

const upcomingPosts = [
  {
    slug: 'express-entry-processing-times-2025',
    title: 'Express Entry Processing Times 2025: Real Data from 400+ Applications',
    excerpt:
      'We analyzed hundreds of community-submitted timelines to give you the most accurate picture of how long Express Entry actually takes in 2025 - broken down by stream, visa office, and application type.',
    category: 'Processing Times',
    readTime: '8 min read',
  },
  {
    slug: 'aor-to-ecopr-every-step-explained',
    title: 'AOR to eCOPR: Understanding Every Step of the Canadian PR Process',
    excerpt:
      'A complete walkthrough of every milestone in your Express Entry journey - from Acknowledgement of Receipt all the way to your eCOPR and PR card arrival.',
    category: 'Process Guide',
    readTime: '10 min read',
  },
  {
    slug: 'cec-vs-fsw-vs-pnp',
    title: 'CEC vs FSW vs PNP: Which Express Entry Stream Is Right for You?',
    excerpt:
      'The three main Express Entry pathways have very different processing times and requirements. Here\'s how to figure out which one fits your situation - and what the data says about each.',
    category: 'Streams',
    readTime: '7 min read',
  },
  {
    slug: 'what-happens-after-ita',
    title: 'What Happens After You Get Your ITA: A Step-by-Step Guide',
    excerpt:
      'Got an Invitation to Apply? Here\'s exactly what you need to do next, what documents to gather, and what timeline to expect from submission to final decision.',
    category: 'Process Guide',
    readTime: '9 min read',
  },
  {
    slug: 'express-entry-draws-2025',
    title: 'Express Entry Draws 2025: CRS Scores, Frequency, and What to Expect',
    excerpt:
      'A data-driven look at draw patterns throughout 2025 - minimum CRS scores by round type, draw frequency, and how to position yourself for the next invitation round.',
    category: 'Draws & CRS',
    readTime: '6 min read',
  },
  {
    slug: 'biometrics-canadian-immigration',
    title: 'Biometrics for Canadian Immigration: What, When, and How Long It Takes',
    excerpt:
      'Everything you need to know about the biometrics step - when it\'s required, where to go, and how long you\'ll wait before your application moves forward.',
    category: 'Process Guide',
    readTime: '5 min read',
  },
  {
    slug: 'pr-card-timeline-tracking',
    title: 'Canadian PR Card: Timeline, Tracking, and What to Do If It\'s Late',
    excerpt:
      'Once you get your eCOPR, your PR card is next. Here\'s how long it typically takes, how to track it, and what steps to take if it\'s been longer than expected.',
    category: 'After Approval',
    readTime: '5 min read',
  },
  {
    slug: 'how-to-track-express-entry-application',
    title: 'How to Track Your Express Entry Application: Tools, Portals, and Community Data',
    excerpt:
      'From the IRCC portal to community trackers like ours, here\'s every tool available to monitor your application status and understand where you are in the queue.',
    category: 'Tools',
    readTime: '4 min read',
  },
]

const categoryColors: Record<string, string> = {
  'Processing Times': 'bg-indigo-50 text-indigo-700',
  'Process Guide': 'bg-blue-50 text-blue-700',
  'Streams': 'bg-purple-50 text-purple-700',
  'Draws & CRS': 'bg-emerald-50 text-emerald-700',
  'After Approval': 'bg-amber-50 text-amber-700',
  'Tools': 'bg-gray-100 text-gray-700',
}

function InfoIcon() {
  return (
    <svg
      className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Navigation - consistent with homepage */}
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
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block"
              >
                Timeline Tracker
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium text-indigo-600 hidden sm:block"
                aria-current="page"
              >
                Guides
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block"
              >
                About
              </Link>
              <Link
                href="/tracker"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                View Tracker
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <CoffeeBanner />

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Page Header */}
        <section aria-labelledby="page-heading" className="mb-10 sm:mb-12">
          <h1
            id="page-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Immigration Guides
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Practical, data-backed guides covering every stage of the Canadian PR process - written
            for Express Entry applicants, by people who have been through it.
          </p>
        </section>

        {/* Info Banner */}
        <div
          className="mb-8 sm:mb-10 p-4 rounded-xl border border-indigo-100 bg-indigo-50 flex items-start gap-3"
          role="status"
          aria-live="polite"
        >
          <InfoIcon />
          <p className="text-sm text-indigo-800">
            <strong>Guides are launching soon.</strong> We&apos;re writing each article with real timeline data from our community. Subscribe below to get notified when new guides go live.
          </p>
        </div>

        {/* Articles Grid */}
        <section aria-labelledby="articles-heading" className="mb-12 sm:mb-16">
          <h2 id="articles-heading" className="sr-only">Upcoming Guides</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 list-none">
            {upcomingPosts.map((post, index) => (
              <li key={post.slug}>
                <article
                  className="group relative flex flex-col h-full p-5 sm:p-6 rounded-xl border border-gray-200 bg-white hover:border-indigo-200 hover:shadow-lg transition-all duration-200"
                >
                  {index === 0 && (
                    <span className="absolute top-4 right-4 text-xs font-semibold bg-indigo-600 text-white px-2.5 py-1 rounded-full">
                      Coming First
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-700'}`}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">{post.readTime}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-gray-400">
                    <ClockIcon />
                    <span>Coming soon</span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        {/* Newsletter CTA */}
        <section
          aria-labelledby="newsletter-heading"
          className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 sm:p-8 text-center"
        >
          <h2
            id="newsletter-heading"
            className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
          >
            Get notified when guides launch
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            We&apos;ll email you when new immigration guides go live. No spam - just practical content for your PR journey.
          </p>
          <NotifyForm />
          <p className="text-xs text-gray-400 mt-4">No spam. Unsubscribe anytime.</p>
        </section>
      </main>

      {/* Footer - consistent with homepage */}
      <footer className="border-t border-gray-100 bg-white py-10 sm:py-12 px-4 sm:px-6 mt-12 sm:mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 sm:mb-10">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-3">
                <span aria-hidden="true">🇨🇦</span>
                <span>Soon To Be Canadian</span>
              </div>
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
                <li>
                  <Link href="/tracker" className="hover:text-indigo-600 transition-colors">
                    Timeline Tracker
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-indigo-600 transition-colors">
                    Immigration Guides
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Company navigation">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Company</h3>
              <ul className="space-y-2 text-sm text-gray-500 list-none">
                <li>
                  <Link href="/about" className="hover:text-indigo-600 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-indigo-600 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-indigo-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-indigo-600 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Soon To Be Canadian. All rights reserved.</p>
            <p className="text-center sm:text-right">
              Immigration information only - not legal advice. Always consult a Regulated Canadian Immigration Consultant (RCIC).
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
