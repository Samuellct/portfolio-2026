# Portfolio website

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-%2338B2AC?logo=tailwindcss&logoColor=white) ![React](https://img.shields.io/badge/react-19-61DAFB?logo=react) ![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflareworkers&logoColor=white)

---

## Overview

My personal portfolio: my path through physics and the projects I build, in French and English. Built with Next.js 16 (App Router) and deployed on Cloudflare Workers.

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
- GSAP scroll-driven sections, Framer Motion for the menu, the listing and the entry animations, Lenis smooth scrolling
- `prefers-reduced-motion` respected everywhere

## Installation

```bash
git clone https://github.com/Samuellct/portfolio-2026.git
cd portfolio-2026
npm install
npm run dev
```

`npm run preview` builds the Worker with OpenNext and runs it locally in the Workers runtime.

## Tests

End-to-end tests run locally with Playwright (Chromium) against the OpenNext preview, at two widths: desktop 1440 px and mobile 390 px. They are not part of CI.

```bash
npx playwright install chromium   # once
npm run test:e2e
```

The command starts `npm run preview` on port 8787, or reuses a preview that is already running. The HTML report lands in `playwright-report/`.

What the suite covers (`e2e/`):

- `smoke.spec.ts`: the home, About, projects, contact and two project pages answer 200 with the right `lang`, no horizontal overflow and no console error; an unknown page answers 404 with `noindex`.
- `no-js.spec.ts`: with JavaScript disabled, each page keeps at least the number of visible text blocks measured on 2026-10-14. A second test per page expects every block to be visible. It is marked as an expected failure until the page is fixed, then the marker comes off and the floor goes up.
- `about-ratchet.spec.ts`: on desktop, content revealed on the About page never fades back when scrolling up.
- `reduced-motion.spec.ts`: turning on reduced motion while About or the projects listing is open removes the pins and the parallax and shows every animated part in its final state.
- `about-experience.spec.ts`: the other work experiences on About open from the keyboard, keep the focus and hide nothing already revealed.
- `about-stack.spec.ts`: every toolkit tag shown on About has its brand colour, none the grey fallback.

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
e2e/               # Playwright end-to-end tests
```

## Customization

- Edit `messages/fr.json` and `messages/en.json` for UI text
- Edit `src/lib/projects/data.ts` to add or change projects
- Edit `src/lib/theme.ts` and `tailwind.config.ts` for colours and fonts

## Deployment

The site runs on Cloudflare Workers. `wrangler.jsonc` defines the Worker entry (`.open-next/worker.js`), the static assets directory, the `nodejs_compat` flag and the `IMAGES` binding.

Workers Builds builds and deploys every push to `main`. A GitHub Actions workflow checks types, lint and the build, then `semantic-release` computes the version from the Conventional Commits and publishes the tag, the GitHub release and the `CHANGELOG.md` entry.

Manual deployment:

```bash
npm run deploy
```

## Version history

Versions follow the Conventional Commits through `semantic-release`; `CHANGELOG.md` lists them. The latest roadmap, V6 (versions 5.0.1 to 5.9.1, October 2026), made the Worker reliable under load (no more CPU limit errors), showed content before hydration, cut the project page JavaScript by about a quarter (231 to 178 kB gzipped), set French typography, redrew the navigation, actions, contact page and project listing, reviewed every project page, and added the end-to-end suite. A summary sits above version 5.9.1 in `CHANGELOG.md`.

## License

- **Code**: distributed under the [MIT License](./LICENSE).
- **Content and design**: all rights reserved. This covers text, images and branding. No reproduction or use without explicit authorization.
