# Samuel Lecomte Portfolio V4

A modern portfolio website built with **Next.js 15**, featuring smooth animations, particle effects, and a hidden Easter egg.

## 🚀 Tech Stack

- **Framework:** Next.js 15.1 (App Router)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion 11, GSAP 3.12
- **3D Effects:** Three.js 0.170
- **Smooth Scroll:** Lenis

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── projects/          # Projects list & detail pages
│   │   └── [category]/
│   │       └── [id]/      # Dynamic project pages
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # Context providers
│   └── not-found.tsx      # 404 page
├── components/
│   ├── sections/          # Page sections (Hero, About, etc.)
│   ├── effects/           # Visual effects (WaveBackground, ParticleCollision)
│   ├── navigation/        # NavBar
│   ├── layout/            # MainLayout, Footer
│   ├── landing/           # Landing page with Starfield
│   └── easter-egg/        # Hidden Easter egg components
├── context/               # React contexts
├── lib/                   # Data and utilities
└── styles/                # Global CSS
```

## 🎮 Features

### SEO Optimized
- Dynamic metadata generation for all pages
- Static generation (SSG) for project pages
- Complete sitemap.xml
- Open Graph & Twitter cards

### Animations
- **Landing:** Starfield with hyperspace effect
- **Hero:** Wave particle background (Three.js)
- **Contact:** Particle collision animation
- **Navigation:** Smooth page transitions

### Easter Egg 🥚
Find 3 hidden ✧ icons across the site to unlock a secret terminal experience!

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Environment

No environment variables required for basic functionality.

For the contact form (Formspree):
- The form is pre-configured with the endpoint

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Build

```bash
npm run build
# Output in .next/
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: { DEFAULT: '#030308' },
  accent: {
    cyan: '#00f0ff',
    purple: '#a855f7',
    pink: '#f472b6',
  },
}
```

### Content
Edit `src/lib/content.json` for all text content.

### Projects
Edit `src/lib/projects.ts` to add/modify projects.

## 📝 License

MIT License - Feel free to use this as a template for your own portfolio!

---

Built with ❤️ by Samuel Lecomte
