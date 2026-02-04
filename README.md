# Portfolio website

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white) ![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)

---

## Overview

A modern portfolio presenting my academic journey through physics and my technical projects. Built with Next.js 15 and modern web technologies, featuring scroll-driven animations, WebGL particle effects, and a responsive design optimized for all devices.

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

## Project structure

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

This project is deployed on Cloudflare Pages using the `@cloudflare/next-on-pages` adapter, which converts Next.js App Router applications to run on Cloudflare Workers.

### Quick deploy via git integration

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - Framework preset: **Next.js**
   - Build command: `npx @cloudflare/next-on-pages@1`
   - Build output: `.vercel/output/static`
3. Deploy on push to main branch

<details>
<summary><b>Detailed deployment configuration</b></summary>

### Build configuration

The `wrangler.jsonc` file contains the necessary configuration for Cloudflare Pages:

```json
{
  "name": "portfolio-2026",
  "compatibility_flags": ["nodejs_compat"],
  "compatibility_date": "2024-09-23",
  "pages_build_output_dir": ".vercel/output/static"
}
```

**Important config options:**
- `nodejs_compat`: Enables Node.js runtime APIs (buffer, async_hooks, etc.) required by Next.js
- `compatibility_date`: Determines which version of the Workers runtime to use
- `pages_build_output_dir`: Specifies the build output directory for Cloudflare Pages

### Manual deployment via Wrangler CLI

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy .vercel/output/static
```

### Technical requirements

The `wrangler.jsonc` configuration file with `pages_build_output_dir` is required for Cloudflare Pages to properly read the configuration. Without this key, the file is considered invalid for Pages deployments, and compatibility flags will not be applied at runtime.

The `nodejs_compat` flag is essential for Next.js applications as they rely on Node.js built-in modules. Without this flag, the deployment will succeed but the application will fail at runtime with Node.js compatibility errors.

For more information, refer to the [Cloudflare Pages Next.js documentation](https://developers.cloudflare.com/pages/framework-guides/nextjs/).

</details>

## License

- **Code** : Distributed under the [MIT License](./LICENSE).
- **Content & Design** : All rights reserved. This includes text, images, and branding elements. No reproduction or use of these assets is permitted without explicit authorization.
