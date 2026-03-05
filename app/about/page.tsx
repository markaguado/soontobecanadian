import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | Soon To Be Canadian',
  description: 'Soon To Be Canadian is an independent, community-powered platform helping Express Entry applicants track and compare their Canadian immigration timelines.',
  alternates: { canonical: 'https://soontobecanadian.com/about' },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
            🇨🇦 <span>Soon To Be Canadian</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tracker" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Tracker</Link>
            <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Guides</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Soon To Be Canadian</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
          <p className="text-lg">
            Soon To Be Canadian is an independent, community-powered platform built to help
            Canadian immigration applicants navigate the Express Entry process with real data —
            not guesswork.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Our Mission</h2>
          <p>
            The Canadian immigration process can feel opaque and anxiety-inducing. IRCC publishes
            general processing time targets, but every application is different. We believe
            applicants deserve access to real, granular data from people who have been through
            the exact same process.
          </p>
          <p>
            Our tracker collects and displays community-submitted timelines — every milestone
            from ITA to eCOPR — so you can see what to expect based on your stream, visa office,
            and application type.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What We Offer</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Timeline Tracker:</strong> Browse 400+ real Express Entry timelines filtered by CEC, FSW, PNP, and more.</li>
            <li><strong>Community Data:</strong> Submit and update your own timeline to help future applicants.</li>
            <li><strong>Immigration Guides:</strong> Step-by-step articles covering every stage of the Canadian PR process.</li>
            <li><strong>Analytics:</strong> Aggregated processing time statistics by stream and visa office.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Important Disclaimer</h2>
          <p>
            Soon To Be Canadian is <strong>not affiliated with IRCC (Immigration, Refugees and
            Citizenship Canada)</strong> or the Government of Canada. All timeline data is
            user-submitted and may not reflect official processing times. This site does not
            provide legal advice. For official information, visit{' '}
            <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              canada.ca
            </a>. For immigration advice, consult a Regulated Canadian Immigration Consultant (RCIC).
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Contact Us</h2>
          <p>
            Have questions, feedback, or want to report an issue?{' '}
            <Link href="/contact" className="text-indigo-600 hover:underline">Get in touch</Link>.
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Soon To Be Canadian</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
            <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
