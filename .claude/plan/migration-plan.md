# Migration Plan: React/Vite → Next.js 15 + TypeScript + MDX Blog

## Goal
Migrate immigration timeline tracker to Next.js 15 with TypeScript, create blog-focused website for organic SEO growth, maintain Vercel + Supabase (zero backend, $0 cost).

## User Decisions
- ✅ **Homepage:** Blog landing page (tracker at /tracker)
- ✅ **Blog:** MDX files in codebase (Git-based, $0 cost)
- ✅ **TypeScript:** Yes, migrate during process
- ✅ **Repository:** New repo, switch Vercel when ready

---

## Architecture Overview

### New Next.js Project Structure
```
canada-immigration-hub/              # New repository
├── app/                             # Next.js 15 App Router
│   ├── layout.tsx                   # Root layout + SEO metadata
│   ├── page.tsx                     # Blog landing page (homepage)
│   │
│   ├── tracker/                     # Immigration timeline tool
│   │   └── page.tsx                 # Current Dashboard migrated
│   │
│   ├── blog/                        # Blog section
│   │   ├── page.tsx                 # Blog listing
│   │   └── [slug]/page.tsx          # Individual blog posts
│   │
│   ├── draws/                       # Future: IRCC draws analytics
│   │   └── page.tsx
│   │
│   └── sitemap.ts                   # Auto-generated sitemap
│
├── components/                      # Migrated React components
│   ├── tracker/                     # Timeline tracker components
│   │   ├── TimelineTable.tsx
│   │   ├── MyTimeline.tsx
│   │   ├── MyComments.tsx
│   │   ├── ProfileModal.tsx
│   │   ├── Filters.tsx
│   │   └── ... (all existing components)
│   │
│   ├── blog/                        # Blog-specific components
│   │   ├── BlogCard.tsx
│   │   ├── BlogPostHeader.tsx
│   │   └── TableOfContents.tsx
│   │
│   └── ui/                          # Shared UI components
│       ├── Modal.tsx
│       └── Button.tsx
│
├── content/                         # MDX blog posts
│   └── blog/
│       ├── express-entry-processing-times-2026.mdx
│       ├── cec-vs-fsw-comparison.mdx
│       └── ... (12-week content calendar)
│
├── lib/                             # Utilities
│   ├── supabase.ts                  # Supabase client
│   ├── api.ts                       # Timeline API functions
│   ├── mdx.ts                       # MDX parsing
│   └── localStorage.ts              # SSR-safe localStorage
│
├── styles/
│   └── globals.css                  # Migrated from App.css
│
├── public/                          # Static assets
│   ├── social-preview.png
│   └── blog/
│
├── next.config.mjs                  # Next.js + MDX config
├── tsconfig.json                    # TypeScript config
└── tailwind.config.ts               # Tailwind config
```

### Tech Stack
- **Framework:** Next.js 15.1.5 (App Router)
- **Language:** TypeScript 5.x
- **Content:** MDX (@next/mdx)
- **Database:** Supabase PostgreSQL (existing)
- **Styling:** TailwindCSS 4 + CSS Variables (migrated)
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics

---

## Migration Phases

## Phase 1: Setup New Next.js Project (2 hours)

### 1.1 Create New Repository
```bash
cd ~/Desktop/Claude\ Code\ -\ Dev/
npx create-next-app@latest canada-immigration-hub

# Selections during setup:
# - TypeScript? Yes
# - ESLint? Yes
# - Tailwind CSS? Yes
# - src/ directory? No (use app/ directly)
# - App Router? Yes
# - Import alias? Yes (@/*)
```

### 1.2 Install Dependencies
```bash
cd canada-immigration-hub

# Core dependencies
npm install @supabase/supabase-js
npm install @vercel/analytics

# MDX support
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install gray-matter reading-time remark-gfm rehype-highlight

# Existing libraries
npm install html2canvas
npm install lucide-react

# Dev dependencies
npm install -D @types/node
```

### 1.3 Configure Next.js for MDX

**File:** `next.config.mjs`
```typescript
import createMDX from '@next/mdx'

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
```

### 1.4 Set Up Environment Variables

**File:** `.env.local`
```bash
# Change VITE_ prefix to NEXT_PUBLIC_
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here  # Server-only
```

---

## Phase 2: Migrate Core Utilities (3 hours)

### 2.1 Supabase Client

**File:** `lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**Migration:** Copy from `frontend/src/lib/supabase.js` and convert to TypeScript

### 2.2 API Functions

**File:** `lib/api.ts`
**Source:** `frontend/src/utils/api.js` (386 lines)

**Changes needed:**
- Convert to TypeScript
- Add type definitions for Timeline, Comment types
- Change `import.meta.env` → `process.env`
- Add error handling improvements

**Example conversion:**
```typescript
// Before (JavaScript)
export const getTimelines = async () => {
  const { data, error } = await supabase
    .from('timelines')
    .select('*')
  return data || []
}

// After (TypeScript)
export interface Timeline {
  id: number
  username: string
  email?: string
  ita_date?: string
  aor_date?: string
  // ... all fields
}

export const getTimelines = async (): Promise<Timeline[]> => {
  const { data, error } = await supabase
    .from('timelines')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
```

### 2.3 LocalStorage Utilities (SSR-Safe)

**File:** `lib/localStorage.ts`
**Source:** `frontend/src/utils/localStorage.js`

**Critical change:** Wrap all localStorage access in checks:

```typescript
// SSR-safe localStorage wrapper
export const getUserEmail = (): string | null => {
  if (typeof window === 'undefined') return null

  try {
    const userData = localStorage.getItem('immigration_timeline_user')
    if (!userData) return null
    return JSON.parse(userData).email || null
  } catch (error) {
    console.error('Error reading localStorage:', error)
    return null
  }
}
```

### 2.4 Other Utilities

**Files to migrate:**
- `lib/dateValidation.ts` ← `frontend/src/utils/dateValidation.js`
- `lib/updateTracker.ts` ← `frontend/src/utils/updateTracker.js`
- `lib/timelineAnalytics.ts` ← `frontend/src/utils/timelineAnalytics.js`
- `lib/admin.ts` ← `frontend/src/utils/admin.js`

**Changes:** Convert to TypeScript, no logic changes needed

---

## Phase 3: Migrate Tracker Components (8 hours)

### 3.1 Component Migration Strategy

**All components require:**
1. Add `'use client'` directive at top (interactive components)
2. Convert `.jsx` → `.tsx`
3. Add TypeScript types for props
4. Update imports to use `@/` alias
5. Test functionality

### 3.2 Priority Component Migration Order

#### Batch 1: Core Components (2 hours)
**Components:**
- `TimelineTable.tsx` ← `frontend/src/components/TimelineTable.jsx`
- `Filters.tsx` ← `frontend/src/components/Filters.jsx`
- `SearchBar.tsx` ← `frontend/src/components/SearchBar.jsx`
- `Analytics.tsx` ← `frontend/src/components/Analytics.jsx`

**Example:**
```typescript
// components/tracker/TimelineTable.tsx
'use client'

import { useState, useMemo } from 'react'
import { ClaimModal } from './ClaimModal'
import { EditTimelineModal } from './EditTimelineModal'
import type { Timeline } from '@/lib/types'

interface TimelineTableProps {
  timelines: Timeline[]
  onTimelineUpdated?: () => void
}

export function TimelineTable({ timelines, onTimelineUpdated }: TimelineTableProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  // ... rest of component (95% same logic)
}
```

#### Batch 2: Modal Components (3 hours)
**Components:**
- `ProfileModal.tsx` ← `frontend/src/components/ProfileModal.jsx`
- `ClaimModal.tsx` ← `frontend/src/components/ClaimModal.jsx`
- `EditTimelineModal.tsx` ← `frontend/src/components/EditTimelineModal.jsx`
- `CreateTimelineModal.tsx` ← `frontend/src/components/CreateTimelineModal.jsx`
- `CommentsModal.tsx` ← `frontend/src/components/CommentsModal.jsx`
- `ReclaimModal.tsx` ← `frontend/src/components/ReclaimModal.jsx`
- `HowToUseModal.tsx` ← `frontend/src/components/HowToUseModal.jsx`

#### Batch 3: Feature Components (2 hours)
**Components:**
- `MyTimeline.tsx` ← `frontend/src/components/MyTimeline.jsx`
- `MyComments.tsx` ← `frontend/src/components/MyComments.jsx`
- `AdminPanel.tsx` ← `frontend/src/components/AdminPanel.jsx`
- `SortableColumnHeader.tsx` ← `frontend/src/components/SortableColumnHeader.jsx`

#### Batch 4: Small Components (1 hour)
- `ErrorBoundary.tsx` ← Convert to TypeScript

### 3.3 Create Tracker Page

**File:** `app/tracker/page.tsx`
**Source:** `frontend/src/pages/Dashboard.jsx`

**Key changes:**
```typescript
// app/tracker/page.tsx
import { Suspense } from 'react'
import { TrackerClient } from './TrackerClient'
import { getTimelines } from '@/lib/api'

// This is a Server Component - fetches data server-side
export default async function TrackerPage() {
  // Optional: Fetch initial data server-side for SEO
  // const initialTimelines = await getTimelines()

  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <TrackerClient />
      </Suspense>
    </div>
  )
}

// Metadata for SEO
export const metadata = {
  title: 'Immigration Timeline Tracker | Compare Real Express Entry Processing Times',
  description: 'Compare 400+ real Canadian Express Entry timelines...',
}
```

**File:** `app/tracker/TrackerClient.tsx`
```typescript
'use client'

import { useState, useEffect } from 'react'
import { getTimelines } from '@/lib/api'
import { TimelineTable } from '@/components/tracker/TimelineTable'
import { Filters } from '@/components/tracker/Filters'
// ... all the Dashboard.jsx logic moves here
```

**Why split Server/Client:**
- Server Component handles SEO metadata
- Client Component handles interactivity
- Best of both worlds

---

## Phase 4: Create Blog System (6 hours)

### 4.1 MDX Content Structure

**Create:** `content/blog/` directory

**Example post:** `content/blog/express-entry-processing-times-2026.mdx`
```mdx
---
title: "Express Entry Processing Times 2026: What 400+ Real Timelines Reveal"
description: "Analysis of 400+ real Express Entry timelines showing CEC, FSW, and PNP processing times by visa office."
publishedAt: "2026-01-15"
updatedAt: "2026-01-15"
author: "Your Name"
keywords: ["express entry", "processing times", "2026", "CEC", "FSW", "PNP"]
category: "Processing Times"
featured: true
ogImage: "/blog/processing-times-2026.png"
---

# Express Entry Processing Times 2026: Data-Driven Analysis

Based on analysis of **400+ real timelines** submitted by Express Entry applicants...

## Key Findings

- Average AOR to eCOPR: **137 days** (4.5 months)
- CEC fastest: **128 days average**
- FSW: **142 days average**
- PNP: **156 days average**

<TimelineChart /> {/* React component embedded in MDX! */}

[View all timelines](/tracker)
```

### 4.2 MDX Parser Utility

**File:** `lib/mdx.ts`
```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const contentDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  author: string
  keywords: string[]
  category: string
  featured?: boolean
  ogImage?: string
  readingTime: string
  content: string
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const files = fs.readdirSync(contentDirectory)

  const posts = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace('.mdx', '')
      const filePath = path.join(contentDirectory, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContent)

      return {
        slug,
        content,
        title: data.title,
        description: data.description,
        publishedAt: data.publishedAt,
        updatedAt: data.updatedAt,
        author: data.author,
        keywords: data.keywords || [],
        category: data.category || 'General',
        featured: data.featured || false,
        ogImage: data.ogImage,
        readingTime: readingTime(content).text,
      }
    })
    .sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

  return posts
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(contentDirectory, `${slug}.mdx`)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)

    return {
      slug,
      content,
      title: data.title,
      description: data.description,
      publishedAt: data.publishedAt,
      updatedAt: data.updatedAt,
      author: data.author,
      keywords: data.keywords || [],
      category: data.category || 'General',
      featured: data.featured || false,
      ogImage: data.ogImage,
      readingTime: readingTime(content).text,
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

export async function getAllSlugs(): Promise<string[]> {
  const files = fs.readdirSync(contentDirectory)
  return files
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace('.mdx', ''))
}
```

### 4.3 Blog Listing Page

**File:** `app/blog/page.tsx`
```typescript
import { getBlogPosts } from '@/lib/mdx'
import { BlogCard } from '@/components/blog/BlogCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Canada Immigration Blog | Express Entry Guides & Processing Times',
  description: 'Expert guides, data-driven analysis, and real insights about Canadian Express Entry, processing times, and immigration timelines.',
  keywords: ['canada immigration blog', 'express entry guide', 'processing times', 'CEC', 'FSW', 'PNP'],
  openGraph: {
    title: 'Canada Immigration Blog',
    description: 'Expert guides and data-driven analysis for Express Entry applicants',
    url: 'https://your-domain.com/blog',
    type: 'website',
  },
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  const featuredPosts = posts.filter(p => p.featured).slice(0, 3)
  const recentPosts = posts.slice(0, 12)

  return (
    <div className="blog-container">
      <header className="blog-header">
        <h1>Canada Immigration Blog</h1>
        <p>Data-driven insights from 400+ real Express Entry timelines</p>
      </header>

      {/* Featured Posts */}
      <section className="featured-posts">
        <h2>Featured Articles</h2>
        <div className="featured-grid">
          {featuredPosts.map(post => (
            <BlogCard key={post.slug} post={post} featured />
          ))}
        </div>
      </section>

      {/* All Posts */}
      <section className="all-posts">
        <h2>Latest Posts</h2>
        <div className="posts-grid">
          {recentPosts.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}
```

### 4.4 Blog Post Page (Dynamic)

**File:** `app/blog/[slug]/page.tsx`
```typescript
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPost, getAllSlugs } from '@/lib/mdx'
import type { Metadata } from 'next'

// Generate static params at build time
export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map(slug => ({ slug }))
}

// Dynamic metadata per post
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) return {}

  return {
    title: `${post.title} | Canada Immigration Blog`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],

    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://your-domain.com/blog/${params.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      images: [{ url: post.ogImage || '/social-preview.png' }],
    },

    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug)

  if (!post) notFound()

  return (
    <article className="blog-post">
      <header>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
          <span>{post.readingTime}</span>
          <span>{post.category}</span>
        </div>
      </header>

      <MDXRemote source={post.content} />

      <footer>
        <a href="/tracker">View Timeline Tracker →</a>
      </footer>
    </article>
  )
}
```

### 4.5 Homepage (Blog Landing)

**File:** `app/page.tsx`
```typescript
import { getBlogPosts } from '@/lib/mdx'
import { BlogCard } from '@/components/blog/BlogCard'
import Link from 'next/link'

export const metadata = {
  title: 'Canada Immigration Hub | Express Entry Timelines & Expert Guides',
  description: 'Compare 400+ real Express Entry timelines, read expert guides, and track Canada PR processing times. Free tools for CEC, FSW, and PNP applicants.',
}

export default async function HomePage() {
  const posts = await getBlogPosts()
  const latestPosts = posts.slice(0, 6)

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <h1>Navigate Your Canadian Immigration Journey</h1>
        <p>Real timeline data + expert guides for Express Entry applicants</p>
        <div className="hero-cta">
          <Link href="/tracker" className="btn-primary">
            View Timeline Tracker
          </Link>
          <Link href="/blog" className="btn-secondary">
            Read Expert Guides
          </Link>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="latest-posts">
        <h2>Latest Insights</h2>
        <div className="posts-grid">
          {latestPosts.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        <Link href="/blog" className="view-all">
          View All Articles →
        </Link>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat">
          <h3>400+</h3>
          <p>Real Timelines</p>
        </div>
        <div className="stat">
          <h3>12+</h3>
          <p>Expert Guides</p>
        </div>
        <div className="stat">
          <h3>100%</h3>
          <p>Free to Use</p>
        </div>
      </section>
    </div>
  )
}
```

---

## Phase 4: Styling Migration (2 hours)

### 4.1 Migrate Global CSS

**File:** `styles/globals.css`
**Source:** `frontend/src/App.css` (4,470 lines)

**Changes needed:**
1. Copy all CSS content
2. Verify CSS variables work
3. Add any Next.js-specific resets
4. Import in `app/layout.tsx`

**Import in layout:**
```typescript
// app/layout.tsx
import '@/styles/globals.css'
```

### 4.2 TailwindCSS Config

**File:** `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      // Keep your existing custom colors/spacing
    },
  },
  plugins: [],
}

export default config
```

---

## Phase 5: SEO Implementation (3 hours)

### 5.1 Root Layout with Metadata

**File:** `app/layout.tsx`
```typescript
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'),
  title: {
    default: 'Canada Immigration Hub | Express Entry Timelines & Guides',
    template: '%s | Canada Immigration Hub',
  },
  description: 'Compare 400+ real Express Entry timelines, read expert guides...',
  keywords: ['canada immigration', 'express entry', 'processing times', 'CEC', 'FSW', 'PNP'],
  authors: [{ name: 'Your Name' }],

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'Canada Immigration Hub',
    images: [{ url: '/social-preview.png', width: 1200, height: 630 }],
  },

  twitter: {
    card: 'summary_large_image',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
```

### 5.2 Sitemap Generation

**File:** `app/sitemap.ts`
```typescript
import { getBlogPosts } from '@/lib/mdx'

export default async function sitemap() {
  const posts = await getBlogPosts()

  const blogUrls = posts.map(post => ({
    url: `https://your-domain.com/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://your-domain.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://your-domain.com/tracker',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://your-domain.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogUrls,
  ]
}
```

### 5.3 Robots.txt

**File:** `app/robots.ts`
```typescript
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/verify'],
    },
    sitemap: 'https://your-domain.com/sitemap.xml',
  }
}
```

---

## Phase 6: Deployment Strategy (2 hours)

### 6.1 Vercel Deployment

**Steps:**
1. Push new Next.js repo to GitHub
2. Go to Vercel Dashboard
3. Click "Add New Project"
4. Import `canada-immigration-hub` repository
5. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY` (server-only, non-public)
6. Deploy

**Build Settings (auto-detected):**
- Framework: Next.js
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`

### 6.2 Domain Strategy

**Option 1: New Domain**
- Buy new domain: `soontobecanadian.com`
- Point to new Next.js Vercel project
- Keep old domain running until migration complete

**Option 2: Same Domain**
- Deploy Next.js to `your-domain-git-main.vercel.app` (preview)
- Test thoroughly
- Switch production domain when ready
- Old React app goes offline

**Recommendation:** Test on preview URL first, then switch domain when confident.

### 6.3 Rollback Strategy

**Keep old React app accessible:**
1. Don't delete old Vercel project immediately
2. Can revert by switching domain back
3. Keep old repo for 30 days after migration
4. Export all Supabase data as backup

---

## TypeScript Migration Guidelines

### Component Conversion Pattern

**Before (JavaScript):**
```jsx
// frontend/src/components/TimelineTable.jsx
export const TimelineTable = ({ timelines, onTimelineUpdated }) => {
  const [selectedId, setSelectedId] = useState(null)
  // ...
}
```

**After (TypeScript):**
```typescript
// components/tracker/TimelineTable.tsx
'use client'

import type { Timeline } from '@/lib/types'

interface TimelineTableProps {
  timelines: Timeline[]
  onTimelineUpdated?: () => void
}

export function TimelineTable({
  timelines,
  onTimelineUpdated
}: TimelineTableProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  // ...
}
```

### Create Type Definitions

**File:** `lib/types.ts`
```typescript
export interface Timeline {
  id: number
  email?: string
  email_verified: boolean
  username: string

  // Dates
  ita_date?: string
  aor_date?: string
  bio_req_date?: string
  medical_date?: string
  eligibility_completion_date?: string
  bg_completion_date?: string
  final_decision_date?: string
  ppr_p1_date?: string
  p2_passport_sent_date?: string
  ecopr_passport_received_date?: string
  pr_card_sent_date?: string
  pr_card_received_date?: string

  // Details
  stream?: string
  application_type?: string
  complexity?: string
  primary_visa_office?: string
  secondary_visa_office?: string
  country?: string

  // Meta
  notes?: string
  ircc_last_update?: string
  last_updated_by_user?: string
  created_at: string
  updated_at: string
}

export interface Comment {
  id: number
  timeline_id: number
  commenter_email: string
  commenter_username: string
  comment_text: string
  parent_comment_id?: number
  is_timeline_owner: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
  replies?: Comment[]
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  content: string
  // ... (see Phase 4.2)
}
```

---

## Critical Files to Migrate

### Priority 1 (Core Functionality)
1. `lib/supabase.ts` ← `frontend/src/lib/supabase.js`
2. `lib/api.ts` ← `frontend/src/utils/api.js` (386 lines)
3. `lib/localStorage.ts` ← `frontend/src/utils/localStorage.js`
4. `components/tracker/TimelineTable.tsx` ← `frontend/src/components/TimelineTable.jsx`
5. `app/tracker/page.tsx` ← `frontend/src/pages/Dashboard.jsx`

### Priority 2 (User Features)
6. `components/tracker/MyTimeline.tsx` ← `frontend/src/components/MyTimeline.jsx`
7. `components/tracker/MyComments.tsx` ← `frontend/src/components/MyComments.jsx`
8. `components/tracker/ProfileModal.tsx` ← `frontend/src/components/ProfileModal.jsx`
9. All modal components (6 files)

### Priority 3 (UI Components)
10. `components/tracker/Filters.tsx` ← `frontend/src/components/Filters.jsx`
11. `components/tracker/SearchBar.tsx` ← `frontend/src/components/SearchBar.jsx`
12. `components/tracker/Analytics.tsx` ← `frontend/src/components/Analytics.jsx`
13. Remaining utilities (dateValidation, updateTracker, admin)

### Priority 4 (Blog System)
14. `lib/mdx.ts` (new file)
15. `app/blog/page.tsx` (new file)
16. `app/blog/[slug]/page.tsx` (new file)
17. `components/blog/BlogCard.tsx` (new file)

### Priority 5 (SEO & Polish)
18. `app/sitemap.ts` (new file)
19. `app/robots.ts` (new file)
20. `styles/globals.css` ← `frontend/src/App.css`

---

## Testing Checklist

### After Each Phase
- [ ] Timeline tracker loads and displays data
- [ ] Filters work (stream, visa office, type)
- [ ] Search functionality works
- [ ] Can claim timeline with email
- [ ] Can edit timeline
- [ ] Can create new timeline
- [ ] Comments system works
- [ ] Floating comments button shows notifications
- [ ] ProfileModal opens with tabs
- [ ] MyTimeline section displays correctly
- [ ] Mobile responsive (test on phone)
- [ ] No console errors
- [ ] localStorage persists across sessions

### Blog-Specific Tests
- [ ] Blog listing page loads
- [ ] Blog posts render from MDX
- [ ] Metadata appears in `<head>` correctly
- [ ] Social preview cards work (test with Twitter Card Validator)
- [ ] Sitemap.xml generates correctly
- [ ] Internal links work (/tracker from blog posts)
- [ ] Reading time calculation works
- [ ] Code syntax highlighting (if using code blocks)

### SEO Tests
- [ ] Run Lighthouse (target: 90+ SEO score)
- [ ] Google Search Console verification
- [ ] Submit sitemap to Google
- [ ] Test structured data with Google Rich Results Test
- [ ] Verify OG images with Facebook Debugger
- [ ] Check Core Web Vitals

---

## Timeline Estimate

### Week 1: Setup & Core Migration (16 hours)
- **Day 1-2:** Setup Next.js project, install dependencies, configure MDX (4h)
- **Day 3-4:** Migrate utilities (supabase, api, localStorage) to TypeScript (4h)
- **Day 5-6:** Migrate core tracker components (TimelineTable, Filters, SearchBar) (6h)
- **Day 7:** Create /tracker page, test core functionality (2h)

### Week 2: Components & Blog Foundation (14 hours)
- **Day 1-2:** Migrate modal components (ProfileModal, ClaimModal, EditModal, etc.) (6h)
- **Day 3-4:** Migrate MyTimeline, MyComments, AdminPanel (4h)
- **Day 5:** Set up MDX infrastructure (lib/mdx.ts, blog pages) (2h)
- **Day 6-7:** Write first 2 MDX blog posts from content calendar (2h)

### Week 3: Blog Polish & SEO (12 hours)
- **Day 1-2:** Create blog listing page with styling (3h)
- **Day 3-4:** Implement dynamic metadata, OG images (3h)
- **Day 5:** Create sitemap.ts, robots.ts, JSON-LD (2h)
- **Day 6:** Homepage design and implementation (2h)
- **Day 7:** Navigation, footer, layout components (2h)

### Week 4: Testing & Deployment (8 hours)
- **Day 1-2:** Full testing (all tracker features, blog, mobile) (4h)
- **Day 3:** Deploy to Vercel, configure domain (2h)
- **Day 4:** Post-deployment testing, Google Search Console setup (2h)

**Total: ~50 hours (10-12 hours/week for 4 weeks)**

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| localStorage breaks SSR | High | Wrap in `typeof window !== 'undefined'` checks |
| Supabase client errors | High | Test both server/client usage patterns early |
| Comment system breaks | Medium | Migrate MyComments component carefully, test notifications |
| CSS conflicts | Medium | Test styling early, use CSS modules if needed |
| TypeScript learning curve | Low | Use `any` types initially, refine incrementally |
| Lost SEO ranking during migration | Low | Deploy to new domain OR test preview thoroughly before switching |
| Data loss | High | Export Supabase data before migration, keep backups |

---

## Post-Migration Optimization (Future)

### Phase 5: Advanced Features (Optional)
1. **API Routes for Security**
   - Move sensitive operations to `/api/claim`, `/api/comment`
   - Hide service role keys server-side

2. **Individual Timeline Pages**
   - `/timeline/[id]` for each timeline
   - Dynamic OG images per timeline
   - Better social sharing

3. **ISR (Incremental Static Regeneration)**
   - Regenerate blog pages on new content
   - Cache timeline data with revalidation

4. **Performance Optimizations**
   - Image optimization with next/image
   - Font optimization
   - Lazy loading for modals

5. **IRCC Draws Analytics**
   - `/draws` page with historical data
   - Charts and predictions
   - Integration with timeline tracker

---

## Recommended First Steps (This Week)

### Day 1-2: Repository Setup
1. Create new GitHub repo: `canada-immigration-hub`
2. Run `npx create-next-app@latest` with TypeScript
3. Install all dependencies
4. Configure `next.config.mjs` for MDX
5. Set up `.env.local` with Supabase credentials
6. Push to GitHub
7. Deploy to Vercel (preview only)

### Day 3-4: Quick Win - First Blog Post
1. Create `content/blog/` directory
2. Create `lib/mdx.ts` parser
3. Write first blog post in MDX (from your 12-week calendar)
4. Create `app/blog/[slug]/page.tsx`
5. Test blog post loads with proper SEO metadata
6. **Ship it!** You'll have a working blog before full migration

### Day 5-7: Start Component Migration
1. Migrate `lib/api.ts` (core utilities)
2. Migrate `TimelineTable.tsx` (most critical component)
3. Create basic `/tracker` page
4. Test timeline loading works

**Strategy:** Parallel development - work on blog while migrating tracker incrementally.

---

## Success Metrics

### Week 4 (Launch)
- ✅ New Next.js site deployed to Vercel
- ✅ All tracker features working (claim, edit, comment, search, filter)
- ✅ 4 blog posts published (Week 3-6 from content calendar)
- ✅ Lighthouse SEO score: 90+
- ✅ Sitemap submitted to Google Search Console
- ✅ Mobile responsive

### Month 2
- ✅ 8 blog posts total
- ✅ First keyword ranking in top 50 (Google Search Console)
- ✅ 500+ visitors from organic search
- ✅ Blog → Tracker conversion tracking

### Month 3
- ✅ 12 blog posts (complete content calendar)
- ✅ 5+ keywords in top 10
- ✅ 1,500+ organic visitors/month
- ✅ IRCC draws analytics page launched

---

## Questions for Clarification

Before starting implementation, confirm:

1. **Domain name:** Use existing domain or buy new one? (e.g., `canadaimmigrationhub.com`)
2. **Brand name:** Keep "Immigration Timeline Tracker" or rebrand to "Canada Immigration Hub"?
3. **Content calendar start:** Which blog post from your 12-week plan should be written first?
4. **Launch timeline:** Aim for 4-week migration or faster/slower?

---

## Final Recommendation

**Start with incremental migration:**

### Week 1: Blog Foundation (Don't wait for full migration!)
1. Create Next.js project
2. Set up MDX
3. Write + publish first 2 blog posts
4. Deploy blog-only version
5. Start getting SEO benefits immediately

### Week 2-3: Migrate Tracker
1. Move components incrementally
2. Test each feature as you go
3. Keep old React app running during migration

### Week 4: Switch Production
1. Full testing
2. Switch Vercel domain to Next.js app
3. Monitor for issues
4. Archive old React app

**This approach:**
- ✅ Gets blog live in 1 week (start SEO immediately)
- ✅ Reduces migration risk (incremental)
- ✅ Maintains old app as backup
- ✅ Allows testing in production before full switch

**Ready to start Phase 1?**
