# Portfolio website

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-%2338B2AC?logo=tailwindcss&logoColor=white) ![React](https://img.shields.io/badge/react-19-61DAFB?logo=react) ![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflareworkers&logoColor=white)

---

## Overview

My personal portfolio: my path through physics and the projects I build, in French and English. Built with Next.js 15 (App Router) and deployed on Cloudflare Workers.

> **Live website:** https://www.samuel-lecomte.fr/

## Features

**Rendering and deployment**
- Server Components for static content, client components only where there is interaction
- Cloudflare Workers through `@opennextjs/cloudflare`, with on-the-fly image resizing by the Cloudflare Images binding
- Localized sitemap, hreflang alternates and JSON-LD

**Content**
- Bilingual site (`fr` by default, `en`) with `next-intl`; the root URL negotiates the language from `Accept-Language`
- Project pages with optional sections, results shown as measurements, figures and Markdown with KaTeX
- Projects filtered by category and searchable by technology

**Motion**
- Hero night sky drawn in raw WebGL, in a single draw call
- GSAP scroll-triggered sections, Framer Motion page transitions, Lenis smooth scrolling
- `prefers-reduced-motion` respected everywhere

## Installation

```bash
git clone https://github.com/Samuellct/portfolio-2026.git
cd portfolio-2026
npm install
npm run dev
```

`npm run preview` builds the Worker with OpenNext and runs it locally in the Workers runtime.

## Project structure

```
src/
├── app/           # App Router pages, all under [locale]/
├── components/    # React components
├── context/       # Smooth scroll and page transition providers
├── hooks/         # Shared hooks
├── i18n/          # next-intl routing and request config
├── lib/           # Project data, technologies, theme tokens
└── styles/        # Global CSS
messages/          # UI text, one JSON file per language
```

## Customization

- Edit `messages/fr.json` and `messages/en.json` for UI text
- Edit `src/lib/projects.ts` to add or change projects
- Edit `src/lib/theme.ts` and `tailwind.config.ts` for colours and fonts

## Deployment

The site runs on Cloudflare Workers. `wrangler.jsonc` defines the Worker entry (`.open-next/worker.js`), the static assets directory, the `nodejs_compat` flag and the `IMAGES` binding.

Workers Builds builds and deploys every push to `main`. A GitHub Actions workflow checks types, lint and the build, then `semantic-release` computes the version from the Conventional Commits and publishes the tag, the GitHub release and the `CHANGELOG.md` entry.

Manual deployment:

```bash
npm run deploy
```

## License

- **Code**: distributed under the [MIT License](./LICENSE).
- **Content and design**: all rights reserved. This covers text, images and branding. No reproduction or use without explicit authorization.
