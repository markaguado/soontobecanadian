import Link from 'next/link'
import type { Metadata } from 'next'
import CoffeeBanner from '@/components/CoffeeBanner'
import { getTimelineCount } from '@/lib/api'

export const revalidate = 3600 // refresh count every hour

export const metadata: Metadata = {
  title: 'Soon To Be Canadian | Express Entry Timelines & Canada Immigration Guides',
  description: 'Compare 400+ real Express Entry processing timelines from CEC, FSW, and PNP applicants. Free tools, expert guides, and community data for your Canadian PR journey.',
  alternates: {
    canonical: 'https://soontobecanadian.com',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://soontobecanadian.com/#website',
      url: 'https://soontobecanadian.com',
      name: 'Soon To Be Canadian',
      description: 'Express Entry timelines, immigration guides, and community data for Canadian PR applicants.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://soontobecanadian.com/tracker?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://soontobecanadian.com/#organization',
      name: 'Soon To Be Canadian',
      url: 'https://soontobecanadian.com',
      logo: 'https://soontobecanadian.com/logo.png',
      sameAs: [],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How long does Express Entry take in 2025?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Based on 400+ community-submitted timelines, Express Entry processing times vary by stream. CEC applicants typically see eCOPR in 3-6 months from AOR, FSW applicants in 6-12 months. IRCC targets a 6-month processing standard for most applications.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between CEC, FSW, and PNP in Express Entry?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'CEC (Canadian Experience Class) is for those with Canadian work experience. FSW (Federal Skilled Worker) is for skilled workers outside Canada. PNP (Provincial Nominee Program) is for applicants nominated by a Canadian province, which adds 600 CRS points.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens after AOR in Express Entry?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'After Acknowledgement of Receipt (AOR), IRCC begins background checks, eligibility review, and may request biometrics. Typical milestones include a biometrics instruction letter (BIL), medical exam, background check completion, PPR (Passport Request), and finally eCOPR.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I track my Express Entry application status?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can track your application in your IRCC secure account portal. For community benchmarks, use our free tracker to compare your timeline against 400+ real applications and see how you compare by stream, visa office, and application type.',
          },
        },
      ],
    },
  ],
}

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    title: 'Real Processing Times',
    description: 'See actual AOR-to-eCOPR timelines submitted by applicants like you - not IRCC estimates.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Community-Powered',
    description: 'Data shared by 400+ applicants across CEC, FSW, PNP, and more streams.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: 'Filter & Compare',
    description: 'Sort by stream, visa office, application type, and complexity to find your closest match.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    ),
    title: 'Track Your Journey',
    description: 'Submit your own timeline and update it as you hit each milestone on the way to PR.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: 'Expert Guides',
    description: 'Step-by-step immigration guides covering every stage from ITA to PR Card.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Ask the Community',
    description: 'Comment on timelines, ask questions, and learn from others who have been through the process.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Browse Real Timelines',
    description: 'Filter by your stream (CEC, FSW, PNP), visa office, and application type to find timelines that match your situation.',
  },
  {
    number: '02',
    title: 'Compare Processing Times',
    description: 'See how long each stage took - from AOR to biometrics, background check, PPR, and final eCOPR.',
  },
  {
    number: '03',
    title: 'Share Your Timeline',
    description: 'Add your own data to help future applicants. Update it as you progress through each milestone.',
  },
]

const faqs = [
  {
    q: 'How long does Express Entry take in 2025?',
    a: 'Based on 400+ community timelines, CEC applicants typically receive eCOPR in 3-6 months from AOR. FSW and PNP applicants may take 6-12 months. Times vary significantly by visa office, complexity, and whether additional documents are requested.',
  },
  {
    q: 'What is the difference between CEC, FSW, and PNP?',
    a: 'CEC (Canadian Experience Class) requires at least 1 year of skilled work experience in Canada. FSW (Federal Skilled Worker) is for skilled foreign nationals applying from outside Canada. PNP (Provincial Nominee Program) requires a provincial nomination, which adds 600 CRS points and nearly guarantees an ITA.',
  },
  {
    q: 'What happens after I receive my AOR?',
    a: 'After your Acknowledgement of Receipt, IRCC begins processing your application. Typical next steps are: biometrics instruction letter (BIL), medical exam, eligibility review, background check, PPR (Passport Request), and finally your eCOPR and PR Card.',
  },
  {
    q: 'How do I check my Express Entry application status?',
    a: 'Log into your IRCC secure account to see your official application status. Use our community tracker to benchmark your timeline against hundreds of similar applicants and understand what to expect next.',
  },
  {
    q: 'What is a good CRS score for Express Entry?',
    a: 'CRS cutoffs change with each draw. In recent CEC-specific draws, cutoffs have ranged from 490-540. General draws have higher cutoffs. Improving language scores (IELTS/CELPIP), Canadian work experience, and getting a provincial nomination are the fastest ways to boost your score.',
  },
  {
    q: 'Is this site affiliated with IRCC or the Canadian government?',
    a: 'No. Soon To Be Canadian is an independent, community-run platform. All timeline data is user-submitted. This site is not legal advice - always verify information with IRCC directly or consult a Regulated Canadian Immigration Consultant (RCIC).',
  },
]

function CheckIcon() {
  return (
    <svg
      className="text-green-600 shrink-0"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg
      className="shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export default async function HomePage() {
  const timelineCount = await getTimelineCount()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:font-medium"
        >
          Skip to main content
        </a>

        {/* Navigation */}
        <header>
          <nav className="border-b border-gray-100 bg-white/95 backdrop-blur sticky top-0 z-50" aria-label="Main navigation">
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
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block"
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

        <main id="main-content">
          {/* Hero */}
          <section
            className="bg-gradient-to-b from-indigo-50 via-white to-white pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 text-center"
            aria-labelledby="hero-heading"
          >
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <span aria-hidden="true">🇨🇦</span>
                <span>Community-powered immigration data</span>
              </div>
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight tracking-tight"
              >
                Your Path to{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Canadian PR
                </span>
                , Tracked
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
                Compare real Express Entry processing timelines from hundreds of applicants.
                See exactly how long each stage takes - not government estimates, real data.
              </p>
              <p className="text-sm text-gray-500 mb-8 sm:mb-10">
                Covering CEC, FSW, FST, PNP and more &middot; Updated daily by applicants like you
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 sm:mb-12">
                <Link
                  href="/tracker"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Explore Timelines
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
                <Link
                  href="/blog"
                  className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-200 rounded-lg font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition-all text-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Read Immigration Guides
                </Link>
              </div>

              {/* Trust badges */}
              <ul
                className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-600"
                aria-label="Key benefits"
              >
                <li className="flex items-center gap-1.5">
                  <CheckIcon />
                  <span>{timelineCount.toLocaleString()}+ real timelines</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckIcon />
                  <span>100% free, no sign-up required</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckIcon />
                  <span>Not affiliated with IRCC</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Stats strip */}
          <section
            className="border-y border-gray-100 bg-gray-50 py-8 sm:py-10 px-4 sm:px-6"
            aria-labelledby="stats-heading"
          >
            <h2 id="stats-heading" className="sr-only">Platform Statistics</h2>
            <dl className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              <div>
                <dt className="text-sm text-gray-500 order-2">Real Timelines</dt>
                <dd className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-1">{timelineCount.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Immigration Guides</dt>
                <dd className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-1">12+</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">EE Streams Tracked</dt>
                <dd className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-1">6</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Free to Use</dt>
                <dd className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-1">100%</dd>
              </div>
            </dl>
          </section>

          {/* Features */}
          <section
            className="py-16 sm:py-20 px-4 sm:px-6"
            aria-labelledby="features-heading"
          >
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 sm:mb-14">
                <h2
                  id="features-heading"
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight"
                >
                  Everything you need to navigate Express Entry
                </h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                  Built by immigrants, for immigrants. All the data and tools to understand your application.
                </p>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 list-none">
                {features.map((feature) => (
                  <li
                    key={feature.title}
                    className="p-6 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all bg-white"
                  >
                    <div
                      className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4"
                      aria-hidden="true"
                    >
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* How it works */}
          <section
            className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50"
            aria-labelledby="how-it-works-heading"
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 sm:mb-14">
                <h2
                  id="how-it-works-heading"
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight"
                >
                  How it works
                </h2>
                <p className="text-lg text-gray-500">Start comparing timelines in seconds - no account needed.</p>
              </div>
              <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 list-none">
                {steps.map((step, index) => (
                  <li key={step.number} className="text-center">
                    <div
                      className="w-14 h-14 bg-indigo-600 text-white font-bold text-lg rounded-full flex items-center justify-center mx-auto mb-4"
                      aria-hidden="true"
                    >
                      {step.number}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                      <span className="sr-only">Step {index + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                  </li>
                ))}
              </ol>
              <div className="text-center mt-10 sm:mt-12">
                <Link
                  href="/tracker"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all inline-block hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Open the Tracker
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section
            className="py-16 sm:py-20 px-4 sm:px-6"
            aria-labelledby="faq-heading"
          >
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12 sm:mb-14">
                <h2
                  id="faq-heading"
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight"
                >
                  Frequently asked questions
                </h2>
                <p className="text-lg text-gray-500">
                  Common questions about Express Entry and Canadian immigration.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="group border border-gray-200 rounded-xl overflow-hidden bg-white"
                  >
                    <summary className="flex items-center justify-between gap-4 p-4 sm:p-5 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition-colors list-none [&::-webkit-details-marker]:hidden">
                      <span>{faq.q}</span>
                      <ChevronIcon />
                    </summary>
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA banner */}
          <section
            className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-indigo-600 to-indigo-700"
            aria-labelledby="cta-heading"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2
                id="cta-heading"
                className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight"
              >
                Ready to track your immigration journey?
              </h2>
              <p className="text-indigo-100 text-lg mb-8">
                Compare your timeline against hundreds of real applicants. Free, always.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/tracker"
                  className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                >
                  View Timeline Tracker
                </Link>
                <Link
                  href="/blog"
                  className="px-8 py-4 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-400 transition-all border border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-indigo-600"
                >
                  Read the Guides
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white py-10 sm:py-12 px-4 sm:px-6">
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
    </>
  )
}
