# Portfolio website

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white) ![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)

---

## Overview

A modern portfolio presenting my academic journey through physics and my technical projects. Built with Next.js 15 and modern web technologies, featuring scroll-driven animations, WebGL particle effects, and a responsive design optimized for all devices.

This project is inspired by [lohitkolluri's Portfolio template](https://github.com/lohitkolluri/Portfolio).

> **Live website:** https://www.samuel-lecomte.fr/

## Features

**Performance**
- Server Components for static content with selective client-side hydration
- Deployed on Cloudflare's global edge network for low-latency access
- Dynamic sitemap generation for SEO
- Image optimization with Next.js Image component (lazy loading)

**Animations**
- Three.js particle wave background with mobile optimization
- GSAP scroll-triggered animations
- Page transitions with clip-path effects
- Starfield with *hyperspace* effect on landing

**Content**
- Detailed project pages with Markdown support
- Categorized projects by type (academic, personal, professional)

## Installation

Clone the repository:
```bash
git clone https://github.com/Samuellct/portfolio-2026.git
```

Navigate to the project directory:
```bash
cd portfolio-2026
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The project runs on standard Next.js development workflow. The `wrangler.jsonc` file is used only for Cloudflare Pages deployment configuration and is not required for local development.

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
├── context/       # React Context providers
├── lib/           # Data
└── styles/        # Global CSS
```

## Customization

- Edit `src/lib/content.json` for text content
- Edit `src/lib/projects.ts` to add projects
- Edit `tailwind.config.ts` for color scheme

## Deployment

```bash
npm run build
```

Deploy the `.next` folder to any Node.js hosting platform.

## License

MIT License - See [LICENSE](./LICENSE) for details.
