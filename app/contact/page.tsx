import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact | Soon To Be Canadian',
  description: 'Get in touch with the Soon To Be Canadian team. Report issues, submit feedback, or ask questions about our Canadian immigration timeline tracker.',
  alternates: { canonical: 'https://soontobecanadian.com/contact' },
}

export default function ContactPage() {
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

      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-500 mb-10 text-lg">
          Have feedback, found a bug, or want to get in touch? We&apos;d love to hear from you.
        </p>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900 mb-1">General Inquiries</h2>
            <p className="text-sm text-gray-500 mb-3">Questions about the site, features, or partnerships.</p>
            <a href="mailto:hello@soontobecanadian.com" className="text-indigo-600 hover:underline text-sm font-medium">
              hello@soontobecanadian.com
            </a>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900 mb-1">Report an Issue</h2>
            <p className="text-sm text-gray-500 mb-3">Found incorrect data, a bug, or a timeline that needs to be removed?</p>
            <a href="mailto:support@soontobecanadian.com" className="text-indigo-600 hover:underline text-sm font-medium">
              support@soontobecanadian.com
            </a>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900 mb-1">Data Removal Request</h2>
            <p className="text-sm text-gray-500 mb-3">
              If you submitted a timeline and would like it removed, email us with your username
              and the email address used when submitting.
            </p>
            <a href="mailto:privacy@soontobecanadian.com" className="text-indigo-600 hover:underline text-sm font-medium">
              privacy@soontobecanadian.com
            </a>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-10">
          We are not affiliated with IRCC or the Government of Canada and cannot assist with
          immigration applications. For official immigration assistance, visit{' '}
          <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
            canada.ca
          </a>.
        </p>
      </main>

      <footer className="border-t border-gray-100 py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Soon To Be Canadian</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
            <Link href="/about" className="hover:text-gray-600">About</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
