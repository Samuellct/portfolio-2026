# Changelog

Toutes les modifications notables apportées à ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
et ce projet respecte les règles du [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.9.14]

### Ajouté
- Nouveau composant SVG (`src/components/about/CinemaSpotlight.tsx`) pour l'intérêt "Cinéma". Remplace `WaveEmitter.tsx`.
- Nouveau composant SVG (`src/components/about/MountainProfile.tsx`) pour l'intérêt "Sports de montagne". Remplace `ElevationPath.tsx`.

### Modifié
- Refonte du bloc statistiques (`AboutSection.tsx`) : remplacement du grid de cartes par 3 tags flottants, animation GSAP simplifiée (fade-in + stagger au lieu de rotateX + counter).
- Harmonisation des couleurs : Sports de montagne (cyan `#00f0ff`), Home Lab (orange `#e57000`), Cinéma (corail `#e5737d`).
- Mise à jour des titres et descriptions dans les dictionnaires JSON.

### Supprimé
- `WaveEmitter.tsx` — Remplacé par CinemaSpotlight
- `ElevationPath.tsx` — Remplacé par MountainProfile

---

## [4.9.13]

### Modifié
Ajustement de plusieurs couleurs sur tout le site :
- Homepage (`HomePageClient.tsx`) : Hero `#06060e`, About `#081828`, Projects `#1c1008`, Contact `#081c10`
- About page (`about/page.tsx`) : Intro `#050e20`, Stack `#051525`, Education `#0e200e`, Interests `#200a0a`
- Contact page (`contact/page.tsx`) : `#050e20`
- Projects listing (`projects/page.tsx`) : `#0c0c1e`
- Project detail (`projects/[category]/[id]/page.tsx`) : `#080810`
- Globaux (`globals.css`, `tailwind.config.ts`) : `--color-primary` et `primary.DEFAULT` passent de `#030308` à `#06060e`, `--color-primary-light` et `primary.light` de `#080812` à `#0a0a18`, `--bg-color` de `#030308` à `#06060e`

---

## [4.9.12]

### Modifié
- Suppression des 3 composants `<HiddenIcon>` dans `AboutSection.tsx`, `ContactSection.tsx` et `projects/page.tsx`.
- Suppression du violet (`#a855f7`) dans le `linearGradient` de `ElevationPath.tsx`. La teinte du milieu passe de `#a855f7` à `#00c8ff` (cyan-bleu).

### Corrigé
- `min-h-[90vh]` remplacé par `min-h-screen` dans `ContactSection.tsx`. Devrait reduire le gap vertical incohérent entre les sections Projects et Contact sur la homepage.

---

## [4.9.11]

### Modifié
- modification clé i18n `about.title`
- `AboutSection.tsx` : mots-clés "physicien"/"développeur" (+ version en) rendus en Fraunces italic (`fraunces-display-italic text-accent-cyan`) ; détection par normalisation unicode nfd pour gérer les accents
- `AboutSection.tsx` : `leading-[0.9]` -> `leading-[1.05]` sur le `h2` pour dégager le jambage inférieur du 'y' de Fraunces italic en fin de ligne 1 de l'ascendant 'l' en début de ligne 2
- `src/app/[locale]/layout.tsx` : chargement de `Fraunces` via `next/font/google` (`axes: ['opsz']`, `style: ['italic']`, variable CSS `--font-fraunces`)
- `tailwind.config.ts` : ajout de `fraunces: ['var(--font-fraunces)', 'serif']` dans `fontFamily`
- `src/styles/globals.css` : ajout de la classe `.fraunces-display-italic` (`font-family`, `font-style: italic`, `font-weight: 400`, `font-variation-settings: 'opsz' 144`)

---

## [4.9.10]

### Modifié
- `HeroSection.tsx` : greeting `h1` - Unbounded weight 900 (`font-black`), uppercase, `letter-spacing: -0.03em`, `font-size: clamp(1.5rem, 9vw, 8rem)`, `line-height: 0.92` - cohérent avec le mockup Hero-C
- `HeroSection.tsx` : layout left-aligned - `max-w-7xl mx-auto` retiré, padding `px-6 md:px-12 lg:px-20`
- `HeroSection.tsx` : gradient WaveBackground `from-primary/50` -> `from-primary/25`
- `HeroSection.tsx` : description `text-white/50` -> `text-white/60`, suppression `text-justify`
- `HeroSection.tsx` : suppression de `{t('titleAlt')}` dans le subtitle
- `HeroSection.tsx` : CTA principal `href="/about"` -> `href="/projects"`
- `HeroSection.tsx` : boutons CTA responsive (`px-6 py-3` mobile, `px-8 py-4` md+, `text-xs` mobile)
- `HeroSection.tsx` : CTAs empilés et centrés sur mobile (`flex-col items-center`), côte à côte sur desktop (`md:flex-row`)
- `HeroSection.tsx` : greeting FR mobile (`< md`) - affiche `greetingMobile` ("Samuel") au lieu de "Samuel Lecomte" pour éviter le débordement ; génération de chars factorisée via `makeChars()`

### Ajouté
- `HeroSection.tsx` : indicateur "Disponible / Open to work" intégré dans le flux du contenu, juste au-dessus du greeting (badge avec point vert `animate-pulse-slow` + bordure verte)
- `HeroSection.tsx` : CTA secondaire "Télécharger mon CV" / "Download my CV" -> `/Resume.pdf`
- `messages/fr.json` + `messages/en.json` : clés `hero.ctaSecondary`, `hero.available`, `hero.greetingMobile`

### Supprimé
- `HeroSection.tsx` : texte "Portfolio 2026"

---

## [4.9.9]

### Modifié
- `layout.tsx` : remplacement de la police de corps par `Syne` (`--font-syne`), ajout de `Unbounded` comme police display accent (`--font-unbounded`), ajout de `Space_Mono` (weights 400/700) comme police monospace (`--font-mono`)
- `tailwind.config.ts` : `font-body` pointe désormais sur `var(--font-syne)`, ajout de `font-display-accent` (`var(--font-unbounded)`) pour HeroSection, ajout de `font-mono` (`var(--font-mono)`)

---

## [4.9.8]

### Modifié
- Ajustement de plusieurs textes i18n
- `HomePageClient.tsx` : suppression de `BlogSection` (import + rendu JSX), suppression entrée `blog` dans `sectionColors`, couleur de fond ContactSection `#05050f` > `#050f08`
- `Landing.tsx` : suppression du bouton "Entrer" et du gestionnaire `handleEnterClick`, suppression du `state showContent` et du `<motion.p>` subtitle, ajout transition automatique - `useEffect` déclenche `onEnter()` après 1,5 s d'exposition

### Supprimé
- Rendu de `BlogSection` sur la homepage (composant conservé dans `src/components/sections/`)

---

## [4.9.7]

### Ajouté
- `src/lib/constants.ts` - `BASE_URL` et `buildAlternates()` centralisés, importés par les 5 layouts et le sitemap

### Modifié
- Langue par défaut changée de `en` à `fr` (`src/i18n/routing.ts`, `public/_redirects`)
- `src/app/page.tsx` : `redirect('/en')` > `redirect('/${routing.defaultLocale}')` (dynamique)
- `src/app/not-found.tsx` : `href="/en"` et `lang="en"` > dynamiques via `routing.defaultLocale`
- 5 layouts (`[locale]/layout.tsx`, `about`, `contact`, `projects`, `projects/[category]/[id]`) : alternates hreflang hardcodés > `buildAlternates()` partagé
- `ProjectsSection.tsx` : tri par date utilise la locale courante au lieu de `en` hardcodé

### Supprimé
- `(locale || 'en') as Locale` redondant dans le layout projet détail

---

## [4.9.6]

### Ajouté
- Namespace `metadata` dans `messages/en.json` et `messages/fr.json`
- `generateMetadata()` dynamique dans `[locale]/layout.tsx` avec titres, descriptions et OG traduits
- `buildJsonLd()` locale-aware : `inLanguage`, `jobTitle`, `description` dynamiques
- Alternates hreflang (`en`, `fr`, `x-default`) sur toutes les pages (layout racine + 3 sous-pages + projet détail)
- `og:locale` dynamique (`en_US` / `fr_FR`) sur toutes les pages
- Sitemap multilingue : URLs préfixées par locale avec alternates hreflang pour chaque entrée

### Modifié
- `[locale]/layout.tsx` : `export const metadata` > `generateMetadata()` async + JSON-LD dynamique
- `[locale]/about/layout.tsx`, `[locale]/contact/layout.tsx`, `[locale]/projects/layout.tsx` : metadata statique > `generateMetadata()` + hreflang
- `[locale]/projects/[category]/[id]/layout.tsx` : ajout `alternates` et `og:locale`
- `sitemap.ts` : réécriture complète (locale × pages + alternates)

---

## [4.9.5]

### Ajouté
- Type `BilingualText` et helper `getLocalizedField()` dans `projects.ts`
- Traduction fr des 8 projets
- Traduction fr de `messages/fr.json`

### Modifié
- Interface `ProjectData` : champs textuels acceptent `BilingualText | string`
- Interface `CategoryData` : suppression de `title` et `description` (gérés par `messages/*.json`)
- `ProjectsSection.tsx` : ajout `useLocale()` + `getLocalizedField()` pour titres et images
- `projects/page.tsx` : localisation des titres, descriptions, périodes et labels de catégories
- `projects/[category]/[id]/page.tsx` : localisation de tous les champs textuels du détail projet
- `projects/[category]/[id]/layout.tsx` : metadata SEO localisées via `getLocalizedField()`

---

## [4.9.4]

### Ajouté
- Composant `LanguageSwitcher` pour basculer entre FR et EN
- Sélecteur de langue dans la barre de navigation (visible en permanence)
- Sélecteur de langue dans le menu hamburger
- Clé `menu.switchLang` dans `messages/en.json` et `messages/fr.json`

---

## [4.9.3]

### Modifié
- Migration de 17 composants de `content.json` vers `useTranslations`
- Constantes module-level (`stats`, `navLinks`, `externalLinks`, `education`, `interests`) déplacées dans les composants
- `loading.tsx` et `not-found.tsx` convertis en Client Components (`'use client'`)

### Supprimé
- `src/lib/content.json` remplacé par `messages/en.json` et `messages/fr.json`

---

## [4.9.2]

### Modifié
- pages déplacées ds `src/app/[locale]/`
- Root layout simplifié en pass-through, locale layout avec `<html lang={locale}>`
- `NextIntlClientProvider` intégré dans le locale layout
- `generateStaticParams` ajouté pour les locales `['en', 'fr']`
- `locales × projets` pour les routes dynamiques `[category]/[id]`
- Hooks `usePathname`, `useRouter`, `Link` migrés de `next/navigation` vers `@/i18n/navigation` dans 5 fichiers
- Redirection racine `/` > `/en` via `redirect()` Next.js
- Page 404 racine (hors `[locale]`) avec styles inline

---

## [4.9.1]

### Ajouté
- Installation et configuration de `next-intl`
  - i18n : `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`
  - Fichiers de messages : `messages/en.json` et `messages/fr.json`
  - Plugin `createNextIntlPlugin` intégré dans `next.config.ts`
  - Redirection racine `/` > `/en` via `public/_redirects` (pr Cloudflare Pages)

---

## [4.9.0] - 2026-03-03

### Modifié
- Centralisation des textes préparation du support FR/EN
  - `loading.tsx` : utilise désormais `content.common.loading`
  - `contact/page.tsx` : "Send another message", "E-mail", "GitHub", "LinkedIn" centralisés
  - `projects/page.tsx` : message d'état vide centralisé
  - `ScrollIndicator.tsx` : utilise désormais `content.hero.scrollHint`

---

## [4.8.3]

### Ajouté
- Pipeline CI/CD avec GitHub Actions (TypeScript, ESLint, audit sécurité, build)

---

## [4.8.2]

### Corrigé
- Mismatch de version `@next/swc` (15.5.7 vs 15.5.11)
- `twitter-image.tsx` affiche "Portfolio 2025" au lieu de 2026

### Modifié
- Portée du chargement CSS KaTeX : actuellement global, à restreindre à `MarkdownRenderer`

### Supprimé
- Import `HiddenIcon` inutilisé dans `HeroSection.tsx`
- Fonction `typeText` inutilisée dans `Terminal.tsx`

---

## [4.8.1]

### Ajouté
- Nouveau projet : analyse de données L3
- Bouton "Skip to content" pour l'accessibilité
- Guide de déploiement Cloudflare Pages
- Configuration `pages_build_output_dir` pour Cloudflare Pages

### Modifié
- Migration de l'hébergement : Vercel --> Cloudflare Pages
- Update vers Next.js 15.5.11 et Wrangler
- Conversion des images au format WebP
- Remplacement des balises `<img>` par le composant `<Image>` de Next.js
- MàJ du lien LinkedIn

### Corrigé
- Menu hamburger non visible sur mobile - [#3](https://github.com/Samuellct/portfolio-2026/issues/3)
- Import KaTeX retiré du CSS global - [#4](https://github.com/Samuellct/portfolio-2026/issues/4)
- `useMemo` cassé - [#5](https://github.com/Samuellct/portfolio-2026/issues/5)
- Suppression de code hérité, ajout de `aria-hidden="true"` - [#8](https://github.com/Samuellct/portfolio-2026/issues/8)
- Année incorrecte dans le pied de page
- Corrections typo
- bug fix configuration du déploiement Cloudflare
- Suppression d'un warning de licence

---

## [4.8.0] - 2026-01-30

### Ajouté
- Système de visibilité des projets via le champ `featured` (masquage des projets incomplets)

### Modifié
- MàJ complète du contenu des projets
- MàJ des liens GitHub des projets
- MàJ de la section "Interests"
- Couleurs et styles du composant `techStats` revus
- Calcul des barres de compétences "About" basé sur le nombre total de projets
- Couleurs de survol des tuiles projets

### Corrigé
- Corrections diverses du rendu LaTeX
- Corrections des commentaires internes de `techStats`
- Couleur de texte incorrecte sur le projet Proxmox

### Supprimé
- Fichier Markdown obsolète supprimé

---

## [4.7.3]

### Ajouté
- Documentation README initiale

---

## [4.7.2]

### Corrigé
- Correction de fichiers publics cassés (assets introuvables au chargement)

---

## [4.7.1]

### Ajouté
- Intégration du formulaire de contact via Formspree
- Métadonnées JSON-LD pour le référencement SEO

### Modifié
- Amélioration du rendu côté serveur (SSR)
- Optimisations d'affichage sur mobile
- MàJ des clés de `content.json`

### Corrigé
- Nettoyage ESLint

---

## [4.7.0] - 2026-01-09

Refonte complète du portfolio avec Next.js 15 et React 19.

### Ajouté
- Rework du portfolio sur Next.js 15 (App Router, React 19, TypeScript)
- Refonte du design de la page projet individuelle

### Corrigé
- Bug d'affichage de la landing page
- Correctifs de la section projets sur la page d'accueil
- Correction du contenu de `content.json`

---

*Les versions antérieures à 4.7.0 ne sont pas documentées.*
