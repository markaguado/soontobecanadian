import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Soon To Be Canadian
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Your Canadian immigration journey, tracked and guided
        </p>

        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          Compare 400+ real Express Entry timelines, read expert guides, and connect with other applicants navigating their path to Canadian permanent residency.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tracker"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Timeline Tracker
          </Link>

          <Link
            href="/blog"
            className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Read Expert Guides
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">400+</div>
            <div className="text-gray-600">Real Timelines</div>
          </div>

          <div className="p-6">
            <div className="text-4xl font-bold text-purple-600 mb-2">12+</div>
            <div className="text-gray-600">Expert Guides</div>
          </div>

          <div className="p-6">
            <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-gray-600">Free to Use</div>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>🇨🇦 Built by the community, for the community</p>
        </div>
      </main>
    </div>
  )
}
