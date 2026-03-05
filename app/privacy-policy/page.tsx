import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Soon To Be Canadian',
  description: 'Privacy Policy for Soon To Be Canadian — how we collect, use, and protect your data.',
  alternates: { canonical: 'https://soontobecanadian.com/privacy-policy' },
  robots: { index: false },
}

const lastUpdated = 'January 1, 2025'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
            🇨🇦 <span>Soon To Be Canadian</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>When you submit a timeline or comment on our platform, we collect:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1 text-sm">
              <li>Email address (used to identify your submission and send optional updates)</li>
              <li>Username (your chosen display name)</li>
              <li>Immigration timeline data (dates and milestones you choose to share)</li>
              <li>Comments you post publicly</li>
            </ul>
            <p className="mt-3 text-sm">
              We also collect standard analytics data (page views, device type, referral source)
              via Vercel Analytics. This data is anonymized and does not identify individual users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>To display your timeline and comments on the platform</li>
              <li>To allow you to edit or delete your own data</li>
              <li>To send occasional product updates (only if you opt in)</li>
              <li>To improve the platform based on usage patterns</li>
            </ul>
            <p className="mt-3 text-sm">We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Advertising</h2>
            <p className="text-sm">
              This site uses Google AdSense to display advertisements. Google may use cookies
              to serve ads based on your prior visits to this website and other sites. You can
              opt out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                Google Ads Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies</h2>
            <p className="text-sm">
              We use localStorage (not cookies) to remember your claimed timelines on your device.
              Google AdSense may set cookies for ad personalization. You can disable cookies in
              your browser settings at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Retention and Deletion</h2>
            <p className="text-sm">
              Your submitted timeline and email are stored as long as the submission exists on the platform.
              To request deletion of your data, email{' '}
              <a href="mailto:privacy@soontobecanadian.com" className="text-indigo-600 hover:underline">
                privacy@soontobecanadian.com
              </a>{' '}
              with your username and the email used to submit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Third-Party Services</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><strong>Supabase</strong> — database hosting (data stored in Supabase infrastructure)</li>
              <li><strong>Vercel</strong> — website hosting and analytics</li>
              <li><strong>Google AdSense</strong> — advertising (see Section 3)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Changes to This Policy</h2>
            <p className="text-sm">
              We may update this policy periodically. Continued use of the site after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact</h2>
            <p className="text-sm">
              For privacy-related questions, contact{' '}
              <a href="mailto:privacy@soontobecanadian.com" className="text-indigo-600 hover:underline">
                privacy@soontobecanadian.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Soon To Be Canadian</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
            <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
