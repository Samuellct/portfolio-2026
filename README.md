# Samuel Lecomte — Portfolio

A modern portfolio website showcasing research projects in particle physics and data engineering.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white) ![Three.js](https://img.shields.io/badge/Three.js-0.170-black?logo=three.js)

---

## Overview

This portfolio presents my academic journey through particle physics and my technical projects. Built with Next.js 15 and modern web technologies, it features smooth scroll-driven animations, WebGL particle effects, and a responsive design optimized for all devices.

## Features

**Performance**
- Server Components for static content with selective client-side hydration
- Dynamic sitemap generation for SEO
- Image optimization with Next.js Image component

**Animations**
- Three.js particle wave background with mobile optimization
- GSAP scroll-triggered animations
- Page transitions with clip-path effects
- Starfield with hyperspace effect on landing

**Accessibility**
- Reduced motion support
- Keyboard navigation
- Semantic HTML structure

## Installation

```bash
git clone https://github.com/Samuellct/portfolio.git
cd portfolio
npm install
npm run dev
```

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
├── context/       # React Context providers
├── lib/           # Data and utilities
└── styles/        # Global CSS
```

See [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed architecture documentation.

## Configuration

**Environment Variables** (optional)
```env
NEXT_PUBLIC_SITE_URL=https://www.samuel-lecomte.fr
```

**Customization**
- Edit `src/lib/content.json` for text content
- Edit `src/lib/projects.ts` to add projects
- Edit `tailwind.config.ts` for color scheme

## Deployment

```bash
npm run build
```

Deploy the `.next` folder to Vercel, Netlify, or any Node.js hosting platform.

## License

MIT License — See [LICENSE](./LICENSE) for details.

---

Built by Samuel Lecomte
