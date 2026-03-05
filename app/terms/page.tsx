import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Soon To Be Canadian',
  description: 'Terms of Service for Soon To Be Canadian — rules for using the Canadian immigration timeline tracker platform.',
  alternates: { canonical: 'https://soontobecanadian.com/terms' },
  robots: { index: false },
}

const lastUpdated = 'January 1, 2025'

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm">
              By using Soon To Be Canadian (&quot;the Site&quot;), you agree to these Terms of Service.
              If you do not agree, please do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Not Legal or Immigration Advice</h2>
            <p className="text-sm">
              All content on this Site, including timeline data, blog posts, and community
              comments, is for informational purposes only. Nothing on this Site constitutes
              legal advice or official immigration guidance. Always consult a Regulated Canadian
              Immigration Consultant (RCIC) or immigration lawyer for advice specific to your situation.
              For official information, visit{' '}
              <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                canada.ca
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. User-Submitted Content</h2>
            <p className="text-sm">When you submit a timeline or comment, you agree that:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1 text-sm">
              <li>The information you submit is accurate to the best of your knowledge</li>
              <li>You grant us a non-exclusive license to display your submitted data on the platform</li>
              <li>You will not submit false, misleading, or harmful content</li>
              <li>You will not impersonate other individuals</li>
              <li>We reserve the right to remove any submission at our discretion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. No Warranties</h2>
            <p className="text-sm">
              The Site is provided &quot;as is&quot; without warranty of any kind. We do not guarantee
              the accuracy, completeness, or timeliness of any data on the Site. Processing times
              vary by individual application and IRCC workload.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Limitation of Liability</h2>
            <p className="text-sm">
              Soon To Be Canadian shall not be liable for any damages arising from your use of
              the Site or reliance on any information contained herein. Use of this Site is at
              your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. No Affiliation with IRCC</h2>
            <p className="text-sm">
              Soon To Be Canadian is an independent platform and is not affiliated with,
              endorsed by, or connected to Immigration, Refugees and Citizenship Canada (IRCC)
              or the Government of Canada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Changes to Terms</h2>
            <p className="text-sm">
              We reserve the right to update these terms at any time. Continued use of the Site
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact</h2>
            <p className="text-sm">
              Questions about these terms?{' '}
              <Link href="/contact" className="text-indigo-600 hover:underline">Contact us</Link>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Soon To Be Canadian</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
