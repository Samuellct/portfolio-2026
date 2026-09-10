# Changelog

Toutes les modifications notables apportées à ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
et ce projet respecte les règles du [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.9.27] - 2026-09-06

### Vérifié

- **Clôture de la Roadmap V5** - Revue finale sur l'ensemble du site après les 10 phases précédentes (métadonnées SEO, parité FR/EN, fiches projets, statuts, JellyUX, Delivr, couleurs de catégorie, labels de section, accent tertiaire, dette technique) : build et lint verts, 15 fiches de projets visibles confirmées sur `/projects` en EN et FR (les 4 fiches masquées `ising-model`/`weather-station`/`muon-lifetime`/`arduino-anemometer` toujours intactes), section Blog toujours en "Coming Soon", console navigateur propre sur `/`, `/about`, `/projects` et `/contact`. Aucune régression trouvée, aucun code ni contenu modifié au-delà d'une correction de décompte obsolète dans `TODO_V5.md` lui-même.
- Le registre de traçabilité de `TODO_V5.md` recense 23 items, tous avec un statut final renseigné (fait, reporté, écarté ou rejeté). Deux points restent ouverts pour une suite éventuelle, hors périmètre de cette Roadmap : la fiche Work Log/App_android (dépôt privé, aucune image disponible) et le regroupement des appels `gsap.registerPlugin`.

---

## [4.9.26] - 2026-09-06

### Corrigé

- **Commentaire de debug retiré** - `{/* test nouvelle deco */}` supprimé de `src/app/twitter-image.tsx`, sans autre changement.
- **Documentation `CLAUDE.md` resynchronisée** - Section Styling corrigée : polices (`font-body` était documenté comme Inter, en réalité Syne ; ajout des polices non documentées `display-accent`/Unbounded et `fraunces`/Fraunces) et couleur `primary` (documentée à `#030308`, en réalité `#06060e` avec ses variantes `light`/`dark`). Ajout d'une précision sur `react-icons` : conservé volontairement aux côtés de `lucide-react` pour les logos de marque (Docker, Nextcloud, Proxmox, Jellyfin) que ce dernier ne fournit pas, ce n'est pas une dépendance redondante à retirer.
- Note : le regroupement des appels `gsap.registerPlugin` (sous-étape 10.2 de `TODO_V5.md`) n'a pas été traité dans cette phase, à la demande de l'utilisateur.

---

## [4.9.25] - 2026-09-05

### Ajouté

- **Accent tertiaire réservé** - Nouveau token `accent-amber` (`#d9713a`, "orange LED sourd") dans `tailwind.config.ts`, sans modification des accents existants (cyan/violet/rose). Utilisé dans `ParticleCollision.tsx` (effet de la page Contact) comme un 4e palier rare de trajectoire (environ 1 track sur 50, soit ~1 collision sur 3-4 en moyenne), aux côtés des 3 paliers cyan/violet/vert existants déjà réutilisés de la palette de catégories. Teinte choisie après test de 6 candidats directement sur le fond réel de l'effet en fonctionnement. Le badge "Open to work" du hero, qui utilise un vert sémantique distinct pour signaler la disponibilité, n'a pas été touché.

---

## [4.9.24] - 2026-09-05

### Corrigé

- **Renumérotation du label Contact** - `contact.sectionLabel` repassé de "04 · Contact" à "03 · Contact" (`messages/en.json`/`fr.json`). L'entrée 4.9.23 avait renuméroté Contact à "04" en anticipation du retour du Blog ; l'utilisateur a signalé que la section Blog est déjà masquée sur le site actuel (probablement par un interrupteur dans le code, `BlogSection.tsx` n'étant importé nulle part), donc la question de la conserver ne se pose pas encore et aucun créneau ne doit lui être réservé dans la numérotation visible. Séquence finale : About (01), Projects (02), Contact (03).

---

## [4.9.23] - 2026-09-05

### Modifié

- **Nomenclature des labels de section** - Remplacement du format "001 — About" (tiret cadratin, numérotation sur 3 chiffres incohérente d'une page à l'autre) par "01 · About" (point médian, numérotation sur 2 chiffres) sur les 7 occurrences de `sectionLabel` (`messages/en.json`/`fr.json`). Format choisi après test de 8 candidats en conditions réelles (taille et tracking exacts du composant `.section-label`).
- Constat noté en cours de phase, sans action associée : `BlogSection.tsx` n'est actuellement importé nulle part (ni dans `HomePageClient.tsx` ni ailleurs) - le Blog n'est pas rendu sur la homepage aujourd'hui. *(Voir 4.9.24 : la correction de numérotation initialement appliquée sur cette base a été revue.)*

---

## [4.9.22] - 2026-09-05

### Modifié

- **Consolidation des couleurs de catégorie** - `CategoryData` (`src/lib/projects.ts`) reçoit un nouveau champ `mutedColor`, qui centralise la teinte sombre de fond au survol (`#1a4a5c`/`#3d2a5c`/`#1a4a3d` pour personal/academic/internship). `ProjectsSection.tsx` lit désormais cette valeur via `getCategoryById` au lieu d'une map locale dupliquée. Aucune valeur ni aucun rendu changés : vérifié par lecture directe de `getComputedStyle` sur les 3 catégories (couleurs identiques au pixel près, opacité 100 %), en plus de la comparaison visuelle.

---

## [4.9.21] - 2026-09-05

### Ajouté

- **Fiche Delivr** - Nouvelle entrée `personal` (`src/lib/projects.ts`) : application Android qui scanne la feuille de livraison papier d'une tournée de petits-déjeuners, en extrait les numéros de cottages par OCR hors ligne (Google ML Kit), les trie et guide la tournée cottage par cottage. Kotlin/Jetpack Compose/Room, CI/CD réelle. Image `public/images/delivr.png` : composite des deux captures d'écran réelles du projet (écran d'accueil + mode livraison), assemblées côte à côte sur un fond sombre assorti à la palette du site.

### Reporté

- **Fiche Work Log (`App_android`)** - Nom réel du projet identifié (`app_name` = "Work Log", package `com.interim.hours`) : suivi d'heures et de rémunération pour l'intérim (missions/agences multiples, indemnités IFM/ICCP, heures supplémentaires par paliers, primes de nuit). Fiche non créée pour l'instant : le dépôt GitHub associé est privé, et aucune image (icône ou capture) n'existe dans le dépôt.

---

## [4.9.20] - 2026-09-05

### Ajouté

- **Fiche JellyUX** - Nouvelle entrée `personal` traitant JellyUX comme une famille de 3 plugins Jellyfin (`src/lib/projects.ts`) : présentation générale de l'intention, puis une sous-section Markdown par plugin (Homepage v2.9.0, Keep or Remove v1.0.2, Easy Notif v0.5.0) avec son propre lien GitHub. Bouton GitHub de la sidebar pointant vers l'organisation `https://github.com/JellyUX`. Image `public/images/jellyux.png` (capture d'écran réelle du plugin Homepage). Comblait un angle mort du portfolio : c'était le travail le plus mature (dépôts publiés, releases sémantiques, CI/CD) et il était totalement absent.

---

## [4.9.19] - 2026-09-05

### Modifié

- **Fiche TimePredict démasquée et réécrite** - `visible: false` retiré : le projet décrivait encore l'ancien pipeline notebook (UTCI/VPD, Meteostat/Open-Meteo/OpenWeatherMap) abandonné depuis la reconstruction du projet. Nouvelle description centrée sur l'état réel constaté sur le dépôt (`TimePredict/claude/`, dernier commit 2026-08-28) : 12 des 18 étapes de la roadmap terminées, composants validés sur données réelles avec métriques chiffrées (courbe vitesse-pente sur 26 301 segments GPS, modèle de niveau à 25,4 % d'erreur contre 37,0 % pour Riegel, module météo WBGT exact à 0,00°C près), moteur de prédiction pas encore assemblé. `technologies` et `domains` mis à jour pour refléter la stack réelle (rasterio, osmnx, geopandas, pvlib, thermofeel). Ajout du lien GitHub (`https://github.com/Samuellct/TimePredict`).

---

## [4.9.18] - 2026-09-05

### Ajouté

- **Statut de projet "Paused"** - Nouvelle valeur `paused` pour `ProjectData['status']` (`src/lib/projects.ts`), avec sa clé de traduction (`projects.status.paused`, EN/FR) et son badge dédié (gris/blanc discret, distinct du badge cyan "In Progress") dans la grille `/projects` et sur les pages de détail. Introduite pour des projets fonctionnels mais dont le développement est actuellement à l'arrêt, sans être ni "in-progress" ni réellement "completed".

### Modifié

- **Fiche AlpineRoute** - Statut passé à `paused` ; description mise à jour pour refléter que le projet ne tourne qu'en local (déploiement public non résolu pour l'instant) et en est à sa deuxième itération majeure. Ajout de `MapLibreGL`, `Leaflet`, `Recharts`, `TerraDraw` à la liste des technologies (stack frontend réelle du projet).
- **Fiche HEP-GUI** - Statut passé à `completed` ; ajout d'une phrase de clôture précisant qu'il s'agissait d'une preuve de concept dont le développement n'est pas poursuivi.
- **Fiche Accred** - Mise à jour pour refléter le test réel effectué au Festival de Cannes 2026 (déploiement privé), au lieu d'un test futur hypothétique.

---

## [4.9.17] - 2026-09-05

### Modifié

- **Parité FR/EN du profil** - Alignement du contenu EN sur la version FR (référence) dans `messages/en.json` : `about.full.intro` reprend maintenant les deux diplômes (Master Physique Fondamentale, DU Data Science) et le positionnement recherche/ingénierie logicielle, `about.full.goals` cite explicitement R&D/Data Engineering/DevOps, `about.education.master2.degree` aligné sur "Fundamental Physics and Applications". `about.interests.science.description` (FR) complété avec le festival de Deauville pour correspondre à l'EN.
- **Humanisation** - Reformulation de `about.full.experience` (EN et FR) pour retirer le remplissage générique ("handle terabytes of data", "collaborate within international research teams") au profit d'une formulation plus concrète et personnelle, sans changer les faits.
- **Corrections ponctuelles** - Espace double retiré dans `contact.page.description` (FR) ; ellipsis de troncature retirée du hover `about.stats.languagesHover` (EN et FR).

---

## [4.9.16] - 2026-09-05

### Modifié

- **Métadonnées SEO** - Réécriture des 13 clés `metadata.*` "description-style" (`home`, `about`, `contact`, `projects`, `jsonLd`) dans `messages/en.json` et `messages/fr.json`. Chaque page a désormais une formulation distincte (identité pour `home`, parcours/formation pour `about`, appel à l'action pour `contact`, panorama des projets pour `projects`, données structurées factuelles pour `jsonLd`), au lieu de variantes quasi identiques de la même phrase ("Showcasing research projects, data analysis work, and technical skills...").

---

## [4.9.15] - 2026-06-20

### Ajouté

- **Nouveau projet** — Ajout d'un projet dans la liste des projets.

### Modifié

- **Correction de texte** — Correction de contenu textuel sur le site.

---

## [4.9.14] - 2026-04-08

### Ajouté

- **CinemaSpotlight** — Nouveau composant SVG animé (`src/components/about/CinemaSpotlight.tsx`) pour l'intérêt "Cinéma". Projecteur avec bobines rotatives, faisceau corail, particules de poussière, silhouettes de public, palme/étoile, labels de festivals. Remplace `WaveEmitter.tsx`.
- **MountainProfile** — Nouveau composant SVG animé (`src/components/about/MountainProfile.tsx`) pour l'intérêt "Sports de montagne". Silhouette montagne détaillée, route d'escalade avec paramétrisation en longueur d'arc, 5 points d'ancrage, grimpeur, drapeau sommet. Remplace `ElevationPath.tsx`.

### Modifié

- **AboutSection stats — Floating Tags** — Refonte du bloc statistiques (`AboutSection.tsx`) : remplacement du grid de cartes par 3 tags flottants positionnés en absolu. Nombres en Fraunces italic avec gradient blanc→cyan, labels en petites capitales. Animation GSAP simplifiée (fade-in + stagger au lieu de rotateX + counter).
- **Intérêts — Schéma 3 "Contrast Play"** — Harmonisation des couleurs : Sports de montagne (cyan `#00f0ff`), Home Lab (orange `#e57000`), Cinéma (corail `#e5737d`). Suppression de `text-accent-purple` dans la section intérêts.
- **i18n intérêts** — Mise à jour des titres et descriptions : "Trail Running" → "Mountain Sports" / "Sports de montagne", "Science Communication" → "Cinema" / "Cinéma". Nouvelles descriptions adaptées.

### Supprimé

- `WaveEmitter.tsx` — Remplacé par CinemaSpotlight
- `ElevationPath.tsx` — Remplacé par MountainProfile

---

## [4.9.13] - 2026-04-07

### Modifié

- **Colorimétrie — palette B-révisée** — Remplacement de toutes les couleurs de fond de section par la palette "Warm-cool contrast" sans violet. Les teintes violettes/purple des fonds sont supprimées au profit de bleus profonds, bruns chauds et verts sombres.
  - Homepage (`HomePageClient.tsx`) : Hero `#06060e`, About `#081828`, Projects `#1c1008`, Contact `#081c10`
  - About page (`about/page.tsx`) : Intro `#050e20`, Stack `#051525`, Education `#0e200e`, Interests `#200a0a`
  - Contact page (`contact/page.tsx`) : `#050e20`
  - Projects listing (`projects/page.tsx`) : `#0c0c1e`
  - Project detail (`projects/[category]/[id]/page.tsx`) : `#080810` (ajout d'un fond explicite, auparavant hérité du body)
  - Globaux (`globals.css`, `tailwind.config.ts`) : `--color-primary` et `primary.DEFAULT` passent de `#030308` à `#06060e`, `--color-primary-light` et `primary.light` de `#080812` à `#0a0a18`, `--bg-color` de `#030308` à `#06060e`

---

## [4.9.12] - 2026-04-07

### Corrigé (build)

- **tsconfig.json** — Exclusion de `tailwind.config.improved.ts` de la compilation TypeScript. Ce fichier de design importait un module `./design-system/tokens` inexistant, cassant le build via `**/*.ts`.

### Modifié

- **Easter egg — retrait des déclencheurs** — Suppression des 3 composants `<HiddenIcon>` dans `AboutSection.tsx`, `ContactSection.tsx` et `projects/page.tsx`. L'infrastructure Easter Egg (providers, contexte, overlays) est conservée intacte pour ne pas perturber l'arbre de providers et le système de transitions.
- **ElevationPath — gradient SVG** — Suppression du violet (`#a855f7`) dans le `linearGradient` de `ElevationPath.tsx`. La teinte du milieu passe de `#a855f7` à `#00c8ff` (cyan-bleu). Le gradient résultant cyan → cyan-bleu → emerald est cohérent avec le schéma "Contrast Play" (Schéma 3) retenu pour les centres d'intérêt de la page About.

### Corrigé

- **Espacement ContactSection** — `min-h-[90vh]` remplacé par `min-h-screen` dans `ContactSection.tsx`. Élimine le gap vertical incohérent entre les sections Projects et Contact sur la homepage.

---

## [4.9.11] - 2026-04-03

### Modifié

**AboutSection — typographie h2**
- `messages/fr.json` : `about.title` → `"De physicien à ... développeur"`
- `messages/en.json` : `about.title` → `"From physicist to ... developer"`
- `AboutSection.tsx` : mots-clés "physicien"/"développeur" (FR) et "physicist"/"developer" (EN) rendus en Fraunces italic (`fraunces-display-italic text-accent-cyan`) ; mots connecteurs conservés en Bebas Neue (`font-display tracking-wide`) ; détection par normalisation NFD pour gérer les accents
- `AboutSection.tsx` : `leading-[0.9]` → `leading-[1.05]` sur le `h2` pour dégager le jambage inférieur du 'y' de Fraunces italic en fin de ligne 1 de l'ascendant 'l' en début de ligne 2
- `AboutSection.tsx` : animation de comptage GSAP conservée (changement de plan vs rapport initial)

**Typographie — ajout Fraunces**
- `src/app/[locale]/layout.tsx` : chargement de `Fraunces` via `next/font/google` (`axes: ['opsz']`, `style: ['italic']`, variable CSS `--font-fraunces`)
- `tailwind.config.ts` : ajout de `fraunces: ['var(--font-fraunces)', 'serif']` dans `fontFamily`
- `src/styles/globals.css` : ajout de la classe `.fraunces-display-italic` (`font-family`, `font-style: italic`, `font-weight: 400`, `font-variation-settings: 'opsz' 144`)

### Ajouté

**Design assets**
- `rapports markdown/Etude_typographie_sections.md` : étude complète des polices du site, analyse du problème Unbounded 900, 5 directions exploratoires, matrice de recommandation
- `design-directions/typography/section-typography-mockup.html` : mockup HTML dark theme — 4 candidats (Unbounded 200, Unbounded 400, Fraunces italic, Caveat Bold) + état de référence, version FR et EN pour chaque option

---

## [4.9.10] - 2026-04-03

### Modifié

**HeroSection**
- `HeroSection.tsx` : greeting `h1` — Unbounded weight 900 (`font-black`), uppercase, `letter-spacing: -0.03em`, `font-size: clamp(1.5rem, 9vw, 8rem)`, `line-height: 0.92` — cohérent avec le mockup Hero-C
- `HeroSection.tsx` : layout left-aligned — `max-w-7xl mx-auto` retiré, padding `px-6 md:px-12 lg:px-20`
- `HeroSection.tsx` : gradient WaveBackground `from-primary/50` → `from-primary/25`
- `HeroSection.tsx` : description `text-white/50` → `text-white/60`, suppression `text-justify`
- `HeroSection.tsx` : suppression de `{t('titleAlt')}` dans le subtitle
- `HeroSection.tsx` : CTA principal `href="/about"` → `href="/projects"`
- `HeroSection.tsx` : boutons CTA responsive (`px-6 py-3` mobile, `px-8 py-4` md+, `text-xs` mobile)
- `HeroSection.tsx` : CTAs empilés et centrés sur mobile (`flex-col items-center`), côte à côte sur desktop (`md:flex-row`)
- `HeroSection.tsx` : badge "Disponible" — bordure `border-green-500/20` → `border-green-400/40` (plus visible)
- `HeroSection.tsx` : greeting FR mobile (`< md`) — affiche `greetingMobile` ("Samuel") au lieu de "Samuel Lecomte" pour éviter le débordement ; génération de chars factorisée via `makeChars()`

### Ajouté

**HeroSection**
- `HeroSection.tsx` : indicateur "Disponible / Open to work" intégré dans le flux du contenu, juste au-dessus du greeting (badge avec point vert `animate-pulse-slow` + bordure verte)
- `HeroSection.tsx` : CTA secondaire "Télécharger mon CV" / "Download my CV" → `/Resume.pdf`
- `messages/fr.json` + `messages/en.json` : clés `hero.ctaSecondary`, `hero.available`, `hero.greetingMobile`

### Supprimé

**HeroSection**
- `HeroSection.tsx` : texte décoratif "Portfolio 2026"
- `HeroSection.tsx` : `overflow-hidden whitespace-nowrap` retirés puis `whitespace-nowrap` restauré avec sizing adapté

---

## [4.9.9] - 2026-04-03

### Modifié

**Typographie**
- `layout.tsx` : remplacement de `Inter` par `Syne` comme police de corps (`--font-syne`)
- `layout.tsx` : ajout de `Unbounded` comme police display accent (`--font-unbounded`)
- `layout.tsx` : ajout de `Space_Mono` (weights 400/700) comme police monospace (`--font-mono`)
- `layout.tsx` : `<html>` className étendu avec les variables `--font-unbounded` et `--font-mono`
- `tailwind.config.ts` : `font-body` pointe désormais sur `var(--font-syne)` (était `var(--font-inter)`)
- `tailwind.config.ts` : ajout de `font-display-accent` (`var(--font-unbounded)`) pour usage dans HeroSection
- `tailwind.config.ts` : ajout de `font-mono` (`var(--font-mono)`) — remplace le stack Tailwind par défaut (qui incluait `Courier New`)

---

## [4.9.8] - 2026-04-03

### Modifié
- Ajustement de plusieurs textes i18n
- `HomePageClient.tsx` : suppression de `BlogSection` (import + rendu JSX), suppression entrée `blog` dans `sectionColors`, couleur de fond ContactSection `#05050f` > `#050f08`
- `Landing.tsx` : suppression du bouton "Entrer" et du gestionnaire `handleEnterClick`, suppression du `state showContent` et du `<motion.p>` subtitle, ajout transition automatique — `useEffect` déclenche `onEnter()` après 1,5 s d'exposition

### Supprimé
- Rendu de `BlogSection` sur la homepage (composant conservé dans `src/components/sections/`)

---

## [4.9.7] - 2026-03-04

### Ajouté
- `src/lib/constants.ts` — `BASE_URL` et `buildAlternates()` centralisés, importés par les 5 layouts et le sitemap

### Modifié
- Langue par défaut changée de `en` à `fr` (`src/i18n/routing.ts`, `public/_redirects`)
- `src/app/page.tsx` : `redirect('/en')` > `redirect('/${routing.defaultLocale}')` (dynamique)
- `src/app/not-found.tsx` : `href="/en"` et `lang="en"` > dynamiques via `routing.defaultLocale`
- 5 layouts (`[locale]/layout.tsx`, `about`, `contact`, `projects`, `projects/[category]/[id]`) : alternates hreflang hardcodés > `buildAlternates()` partagé
- `src/app/sitemap.ts` : `BASE_URL` et `buildAlternates` importés depuis `constants.ts` (suppression doublons)
- `ProjectsSection.tsx` : tri par date utilise la locale courante au lieu de `'en'` hardcodé

### Supprimé
- 6 déclarations locales de `const BASE_URL` (remplacées par import unique)
- `(locale || 'en') as Locale` redondant dans le layout projet détail

---

## [4.9.6] - 2026-03-04

### Ajouté
- Namespace `metadata` dans `messages/en.json` et `messages/fr.json` (~20 clés SEO)
- `generateMetadata()` dynamique dans `[locale]/layout.tsx` avec titres, descriptions et OG traduits
- `buildJsonLd()` locale-aware : `inLanguage`, `jobTitle`, `description` dynamiques
- Alternates hreflang (`en`, `fr`, `x-default`) sur toutes les pages (layout racine + 3 sous-pages + projet détail)
- `og:locale` dynamique (`en_US` / `fr_FR`) sur toutes les pages
- Sitemap multilingue : URLs préfixées par locale avec alternates hreflang pour chaque entrée
- Section `Internationalization (i18n)` dans `CLAUDE.md`

### Modifié
- `[locale]/layout.tsx` : `export const metadata` > `generateMetadata()` async + JSON-LD dynamique
- `[locale]/about/layout.tsx` : metadata statique > `generateMetadata()` + hreflang
- `[locale]/contact/layout.tsx` : metadata statique > `generateMetadata()` + hreflang
- `[locale]/projects/layout.tsx` : metadata statique > `generateMetadata()` + hreflang
- `[locale]/projects/[category]/[id]/layout.tsx` : ajout `alternates` et `og:locale`
- `sitemap.ts` : réécriture complète (locale × pages + alternates)
- `CLAUDE.md` : mise à jour références data layer et content editing

---

## [4.9.5] - 2026-03-04

### Ajouté
- Type `BilingualText` et helper `getLocalizedField()` dans `projects.ts`
- Traduction française complète des 8 projets visibles (titre, description, sous-titre, description détaillée, période, lieu, alt image)
- Traduction française de `messages/fr.json` (~190 clés UI)

### Modifié
- Interface `ProjectData` : champs textuels acceptent `BilingualText | string`
- Interface `CategoryData` : suppression de `title` et `description` (gérés par `messages/*.json`)
- `ProjectsSection.tsx` : ajout `useLocale()` + `getLocalizedField()` pour titres et images
- `projects/page.tsx` : localisation des titres, descriptions, périodes et labels de catégories
- `projects/[category]/[id]/page.tsx` : localisation de tous les champs textuels du détail projet
- `projects/[category]/[id]/layout.tsx` : metadata SEO localisées via `getLocalizedField()`

---

## [4.9.4] - 2026-03-03

### Ajouté
- Composant `LanguageSwitcher` pour basculer entre FR et EN
- Sélecteur de langue dans la barre de navigation (visible en permanence)
- Sélecteur de langue dans le menu hamburger
- Clé `menu.switchLang` dans `messages/en.json` et `messages/fr.json`

---

## [4.9.3] - 2026-03-03

### Modifié
- Migration de 17 composants de `content.json` vers `useTranslations` (next-intl)
- Constantes module-level (`stats`, `navLinks`, `externalLinks`, `education`, `interests`) déplacées dans les composants
- `loading.tsx` et `not-found.tsx` convertis en Client Components (`'use client'`)

### Supprimé
- `src/lib/content.json` — remplacé par `messages/en.json` et `messages/fr.json`

---

## [4.9.2] - 2026-03-03

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

## [4.9.1] - 2026-03-03

### Ajouté
- Installation et configuration de `next-intl` pour le support multilingue FR/EN (étape 02/07)
  - Infrastructure i18n : `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`
  - Fichiers de messages : `messages/en.json` et `messages/fr.json` (copie de `content.json`, placeholder)
  - Plugin `createNextIntlPlugin` intégré dans `next.config.ts`
  - Redirection racine `/` > `/en` via `public/_redirects` (Cloudflare Pages)

---

## [4.9.0] - 2026-03-03

### Modifié
- Centralisation des textes en dur en préparation du support multilingue FR/EN (étape 01/07)
  - `loading.tsx` : utilise désormais `content.common.loading` au lieu de "Loading" en dur
  - `contact/page.tsx` : "Send another message", "E-mail", "GitHub", "LinkedIn" centralisés dans `content.json`
  - `projects/page.tsx` : message d'état vide centralisé dans `content.json`
  - `ScrollIndicator.tsx` : utilise désormais `content.hero.scrollHint` au lieu de "Scroll" en dur
- Ajout de 5 clés dans `content.json` : `contact.page.form.sendAnother`, `contact.page.directContact.{emailLabel,githubLabel,linkedinLabel}`, `projects.emptyState`

---

## [4.8.3] - 2026-03-02

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

## [4.8.1] - 2026-02-05

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
- Menu hamburger non visible sur mobile — [#3](https://github.com/Samuellct/portfolio-2026/issues/3)
- Import KaTeX retiré du CSS global — [#4](https://github.com/Samuellct/portfolio-2026/issues/4)
- `useMemo` cassé — [#5](https://github.com/Samuellct/portfolio-2026/issues/5)
- Suppression de code hérité, ajout de `aria-hidden="true"` — [#8](https://github.com/Samuellct/portfolio-2026/issues/8)
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

## [4.7.3] - 2026-01-26

### Ajouté
- Documentation README initiale

---

## [4.7.2] - 2026-01-13

### Corrigé
- Correction de fichiers publics cassés (assets introuvables au chargement)

---

## [4.7.1] - 2026-01-12

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
