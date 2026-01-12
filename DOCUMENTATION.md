# Technical Documentation — Portfolio V4.8

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [File Structure](#file-structure)
3. [Adding a New Project](#adding-a-new-project)
4. [Adding a New Page](#adding-a-new-page)
5. [Content Management](#content-management)
6. [Technologies](#technologies)

---

## Project Architecture

This portfolio follows Next.js 15 App Router conventions with a hybrid rendering approach:

- **Server Components**: Static pages and layouts for optimal SEO and performance
- **Client Components**: Interactive sections with animations (GSAP, Framer Motion, Three.js)

### Key Architectural Decisions

| Pattern | Implementation |
|---------|----------------|
| Rendering | Hybrid SSR/CSR with Server Components as default |
| State Management | React Context API (no external state library) |
| Animations | GSAP for scroll-driven, Framer Motion for component transitions |
| Styling | Tailwind CSS with custom design tokens |
| Content | Centralized JSON for i18n-ready text management |

---

## File Structure

```
portfolio-v4/
├── public/
│   ├── favicon.png
│   ├── Resume.pdf
│   ├── robots.txt
│   └── images/
│       └── [project-images].jpg
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, metadata, providers)
│   │   ├── page.tsx                # Homepage (Server Component)
│   │   ├── sitemap.ts              # Dynamic sitemap generation
│   │   ├── loading.tsx             # Global loading state
│   │   ├── not-found.tsx           # 404 page
│   │   ├── providers.tsx           # Client-side context providers
│   │   │
│   │   ├── about/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx            # About page with scroll animations
│   │   │
│   │   ├── contact/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx            # Contact form
│   │   │
│   │   └── projects/
│   │       ├── layout.tsx
│   │       ├── page.tsx            # Projects grid with filters
│   │       └── [category]/
│   │           └── [id]/
│   │               ├── layout.tsx
│   │               └── page.tsx    # Project detail page
│   │
│   ├── components/
│   │   ├── home/
│   │   │   └── HomePageClient.tsx  # Homepage client wrapper
│   │   │
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── BlogSection.tsx
│   │   │   └── ContactSection.tsx
│   │   │
│   │   ├── effects/
│   │   │   ├── WaveBackground.tsx      # Three.js particle background
│   │   │   └── ParticleCollision.tsx   # Canvas collision animation
│   │   │
│   │   ├── navigation/
│   │   │   ├── NavBar.tsx
│   │   │   └── TransitionLink.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── landing/
│   │   │   ├── Landing.tsx
│   │   │   └── Starfield.tsx
│   │   │
│   │   ├── about/
│   │   │   ├── ElevationPath.tsx
│   │   │   ├── NetworkGraph.tsx
│   │   │   ├── WaveEmitter.tsx
│   │   │   └── ScrollIndicator.tsx
│   │   │
│   │   ├── ui/
│   │   │   └── MarkdownRenderer.tsx
│   │   │
│   │   └── easter-egg/
│   │       ├── EasterEggManager.tsx
│   │       ├── HiddenIcon.tsx
│   │       ├── Terminal.tsx
│   │       ├── GlitchShutdown.tsx
│   │       ├── Fireworks.tsx
│   │       └── RestoredOverlay.tsx
│   │
│   ├── context/
│   │   ├── SiteContext.tsx
│   │   ├── SmoothScrollContext.tsx
│   │   ├── TransitionContext.tsx
│   │   └── EasterEggContext.tsx
│   │
│   ├── lib/
│   │   ├── content.json        # All UI text (i18n-ready)
│   │   ├── projects.ts         # Project data and types
│   │   └── techStats.ts        # Technology statistics extraction
│   │
│   └── styles/
│       └── globals.css         # Global styles and CSS variables
│
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── vercel.json
```

---

## Adding a New Project

### Step 1: Add Project Image

Place the image in `/public/images/` with a descriptive filename:
```
/public/images/my-project.jpg
```

### Step 2: Add Project Data

Edit `/src/lib/projects.ts` and add an entry under the appropriate category:

```typescript
'my-project-id': {
  id: 'my-project-id',
  title: 'Project Title',
  description: 'Brief description for cards (~100 chars)',
  subtitle: 'Extended subtitle for detail page',
  detailedDescription: `
## Overview
Markdown content for the full project description.

## Key Features
- Feature 1
- Feature 2
`,
  technologies: ['Python', 'Docker', 'React'],
  domains: ['Machine Learning', 'Web Development'],
  keywords: ['seo', 'keyword', 'list'],
  category: 'personal',  // 'personal' | 'academic' | 'internship'
  status: 'completed',   // 'completed' | 'in-progress' | 'planned'
  period: '2024 - 2025',
  location: 'Personal project',
  image: '/images/my-project.jpg',
  imageAlt: 'Descriptive alt text for accessibility',
  imageCredit: 'Credit Author',           // Optional
  imageCreditUrl: 'https://source.url',   // Optional
  gitHubUrl: 'https://github.com/...',    // Optional
  featured: true,                          // Optional: show on homepage
  dateCreated: '2024-06-15',
},
```

### Step 3: Add Technology Colors (if new)

If using new technologies, add their colors in `/src/lib/techStats.ts`:

```typescript
export const techColors: Record<string, string> = {
  'NewFramework': '#ff5500',
  // ...
}
```

### Step 4: Verify

```bash
npm run dev
```

Visit:
- `/projects` — Project should appear in grid
- `/projects/{category}/{id}` — Detail page

---

## Adding a New Page

### Step 1: Create Route Directory

```
src/app/new-page/
├── layout.tsx    # Optional: page-specific layout
└── page.tsx      # Required: page content
```

### Step 2: Create Page Component

```tsx
// src/app/new-page/page.tsx
import content from '@/lib/content.json'

export default function NewPage() {
  return (
    <main className="min-h-screen px-6 md:px-12 lg:px-16 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl mb-8">
          Page Title
        </h1>
        <p className="text-white/70">
          Page content...
        </p>
      </div>
    </main>
  )
}
```

### Step 3: Add Content Strings

Add text to `/src/lib/content.json`:

```json
{
  "newPage": {
    "sectionLabel": "005 — New Page",
    "title": "Page Title",
    "description": "Description..."
  }
}
```

### Step 4: Add Navigation Link (Optional)

Edit `/src/components/navigation/NavBar.tsx` to include the new route.

---

## Content Management

All user-facing text is centralized in `/src/lib/content.json` for easy editing and future i18n support.

### Structure

```json
{
  "nav": { ... },        // Navigation labels
  "hero": { ... },       // Homepage hero section
  "about": { ... },      // About page content
  "projects": { ... },   // Projects section labels
  "blog": { ... },       // Blog section
  "contact": { ... },    // Contact section and form
  "footer": { ... },     // Footer text
  "common": { ... }      // Shared strings (loading, errors, etc.)
}
```

### Usage in Components

```tsx
import content from '@/lib/content.json'

function MyComponent() {
  return <h1>{content.hero.title}</h1>
}
```

---

## Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| Framer Motion | 11.x | Component animations |
| GSAP | 3.x | Scroll-driven animations |
| Three.js | 0.170.x | 3D particle effects |
| Lenis | 1.x | Smooth scrolling |

### Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

---

*Documentation for Portfolio V4.8 — January 2025*
