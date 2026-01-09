# 📁 Documentation Portfolio V4.5

## Table des matières

1. [Arborescence des fichiers](#arborescence-des-fichiers)
2. [Description des fichiers](#description-des-fichiers)
3. [Guide : Ajouter ou modifier un projet](#guide--ajouter-ou-modifier-un-projet)
4. [Guide : Ajouter une nouvelle page](#guide--ajouter-une-nouvelle-page)

---

## Arborescence des fichiers

```
portfolio-v4/
├── 📄 Configuration
│   ├── package.json              # Dépendances npm et scripts
│   ├── tsconfig.json             # Configuration TypeScript
│   ├── tailwind.config.ts        # Configuration Tailwind CSS (couleurs, fonts)
│   ├── next.config.ts            # Configuration Next.js
│   ├── postcss.config.mjs        # Configuration PostCSS
│   ├── eslint.config.mjs         # Configuration ESLint
│   └── README.md                 # Documentation du projet
│
├── 📁 public/                    # Fichiers statiques (servis directement)
│   ├── favicon.png               # Icône du site
│   ├── Resume.pdf                # CV téléchargeable
│   ├── robots.txt                # Instructions pour les crawlers
│   ├── sitemap.xml               # Plan du site pour SEO
│   └── images/                   # Images des projets
│       ├── proxmox.png
│       ├── quantum_cpu.jpg
│       ├── muon_lifetime.png
│       └── ...
│
└── 📁 src/                       # Code source
    │
    ├── 📁 app/                   # Pages (App Router Next.js 15)
    │   ├── layout.tsx            # Layout racine (HTML, fonts, metadata)
    │   ├── page.tsx              # Page d'accueil (/)
    │   ├── loading.tsx           # Écran de chargement global
    │   ├── not-found.tsx         # Page 404
    │   ├── providers.tsx         # Providers React (contextes)
    │   │
    │   ├── 📁 about/             # Route /about
    │   │   ├── layout.tsx        # Layout spécifique About
    │   │   └── page.tsx          # Page About (V4.4 - scroll animations)
    │   │
    │   ├── 📁 contact/           # Route /contact
    │   │   ├── layout.tsx        # Layout spécifique Contact
    │   │   └── page.tsx          # Formulaire de contact
    │   │
    │   └── 📁 projects/          # Route /projects
    │       ├── layout.tsx        # Layout spécifique Projects
    │       ├── page.tsx          # Liste des projets
    │       └── 📁 [category]/    # Route dynamique /projects/:category
    │           └── 📁 [id]/      # Route dynamique /projects/:category/:id
    │               ├── layout.tsx
    │               └── page.tsx  # Page détail d'un projet
    │
    ├── 📁 components/            # Composants React réutilisables
    │   │
    │   ├── 📁 about/             # Composants spécifiques à la page About
    │   │   ├── ElevationPath.tsx # SVG animé profil d'élévation (trail running)
    │   │   ├── NetworkGraph.tsx  # SVG animé réseau homelab
    │   │   ├── ScrollIndicator.tsx # Indicateur de scroll (souris + chevron)
    │   │   └── WaveEmitter.tsx   # SVG animé ondes (science communication)
    │   │
    │   ├── 📁 easter-egg/        # Composants de l'easter egg
    │   │   ├── EasterEggManager.tsx # Gestionnaire principal
    │   │   ├── HiddenIcon.tsx    # Icône cachée déclencheur
    │   │   ├── Terminal.tsx      # Terminal interactif
    │   │   ├── GlitchShutdown.tsx # Animation glitch
    │   │   ├── Fireworks.tsx     # Animation feu d'artifice
    │   │   └── RestoredOverlay.tsx # Overlay de restauration
    │   │
    │   ├── 📁 effects/           # Effets visuels
    │   │   ├── ParticleCollision.tsx # Animation collision de particules
    │   │   ├── WaveBackground.tsx    # Fond ondulé animé
    │   │   └── PageTransition.tsx    # Transition clipPath entre les pages
    │   │
    │   ├── 📁 landing/           # Page d'entrée (splash screen)
    │   │   ├── Landing.tsx       # Composant principal landing
    │   │   └── Starfield.tsx     # Champ d'étoiles animé
    │   │
    │   ├── 📁 layout/            # Composants de mise en page
    │   │   ├── MainLayout.tsx    # Layout principal avec NavBar + Footer
    │   │   └── Footer.tsx        # Pied de page
    │   │
    │   ├── 📁 navigation/        # Navigation
    │   │   └── NavBar.tsx        # Barre de navigation + menu hamburger
    │   │
    │   └── 📁 sections/          # Sections de la page d'accueil
    │       ├── HeroSection.tsx   # Section héro (présentation)
    │       ├── AboutSection.tsx  # Aperçu About
    │       ├── ProjectsSection.tsx # Aperçu Projects
    │       ├── BlogSection.tsx   # Section Blog (coming soon)
    │       └── ContactSection.tsx # Aperçu Contact
    │
    ├── 📁 context/               # Contextes React (état global)
    │   ├── SiteContext.tsx       # État général du site
    │   ├── SmoothScrollContext.tsx # Gestion du smooth scroll
    │   └── EasterEggContext.tsx  # État de l'easter egg
    │
    ├── 📁 lib/                   # Utilitaires et données
    │   ├── content.json          # Tous les textes du site (i18n ready)
    │   ├── projects.ts           # Données des projets + catégories
    │   └── techStats.ts          # Extraction et stats des technologies
    │
    └── 📁 styles/                # Styles globaux
        └── globals.css           # CSS global + variables Tailwind
```

---

## Description des fichiers

### 📄 Configuration (racine)

| Fichier | Rôle |
|---------|------|
| `package.json` | Dépendances npm, scripts (`dev`, `build`, `start`) |
| `tsconfig.json` | Configuration TypeScript (paths aliases `@/`) |
| `tailwind.config.ts` | Couleurs custom (`accent-cyan`, `accent-purple`), fonts |
| `next.config.ts` | Configuration Next.js (images, redirects) |
| `postcss.config.mjs` | Configuration PostCSS pour Tailwind |
| `eslint.config.mjs` | Règles de linting |

### 📁 src/app/ (Pages)

| Fichier | Route | Rôle |
|---------|-------|------|
| `layout.tsx` | Global | Layout racine : `<html>`, fonts, metadata SEO |
| `page.tsx` | `/` | Page d'accueil avec sections (Hero, About, Projects, Blog, Contact) |
| `loading.tsx` | Global | Spinner de chargement pendant les transitions |
| `not-found.tsx` | `/404` | Page d'erreur 404 |
| `providers.tsx` | Global | Wrapper des contextes React |
| `about/page.tsx` | `/about` | Page About complète avec animations GSAP scroll-driven |
| `contact/page.tsx` | `/contact` | Formulaire de contact |
| `projects/page.tsx` | `/projects` | Grille de tous les projets avec filtres par catégorie |
| `projects/[category]/[id]/page.tsx` | `/projects/:cat/:id` | Page détail d'un projet |

### 📁 src/components/

| Dossier | Composants | Rôle |
|---------|------------|------|
| `about/` | `ElevationPath`, `NetworkGraph`, `WaveEmitter`, `ScrollIndicator` | SVG animés et indicateurs pour la page About |
| `easter-egg/` | `Terminal`, `GlitchShutdown`, `Fireworks`, etc. | Easter egg caché (terminal interactif) |
| `effects/` | `ParticleCollision`, `WaveBackground`, `PageTransition` | Effets visuels de fond et transitions de page |
| `landing/` | `Landing`, `Starfield` | Splash screen d'entrée |
| `layout/` | `MainLayout`, `Footer` | Structure de page |
| `navigation/` | `NavBar` | Navigation principale + menu hamburger |
| `sections/` | `HeroSection`, `AboutSection`, etc. | Sections de la page d'accueil |

### 📁 src/lib/ (Données)

| Fichier | Rôle |
|---------|------|
| `content.json` | **Tous les textes du site** (labels, titres, descriptions). Modifier ici pour changer un texte. |
| `projects.ts` | **Données des projets** : titre, description, technologies, images. C'est ici qu'on ajoute des projets. |
| `techStats.ts` | Extraction automatique des technologies depuis les projets, calcul des stats pour la section Stack. |

### 📁 src/context/ (État global)

| Fichier | Rôle |
|---------|------|
| `SiteContext.tsx` | État général (landing visible, section active) |
| `SmoothScrollContext.tsx` | Gestion du smooth scroll avec Lenis |
| `EasterEggContext.tsx` | État de l'easter egg (activé, étape courante) |

---

## Guide : Ajouter ou modifier un projet

### Étape 1 : Ajouter l'image

Placer l'image dans `/public/images/` avec un nom descriptif (ex: `mon-projet.jpg`).

### Étape 2 : Ajouter les données du projet

Ouvrir `/src/lib/projects.ts` et ajouter une entrée dans `projectsData` sous la bonne catégorie :

```typescript
// Dans projectsData -> 'personal' | 'academic' | 'internship'
'mon-nouveau-projet': {
  id: 'mon-nouveau-projet',                    // Identifiant unique (URL slug)
  title: 'Mon Nouveau Projet',                 // Titre affiché
  description: 'Description courte pour la carte.',  // ~100 caractères
  subtitle: 'Sous-titre optionnel',            // Affiché sur la page détail
  detailedDescription: `
## Section 1
Texte détaillé en **Markdown**.

## Section 2
- Point 1
- Point 2
`,
  technologies: ['Python', 'Docker', 'React'], // Technologies RÉELLES utilisées
  domains: ['Machine Learning', 'Data Science'], // Domaines (non techniques)
  keywords: ['keyword1', 'keyword2'],          // SEO uniquement (non affiché)
  category: 'personal',                        // 'personal' | 'academic' | 'internship'
  status: 'completed',                         // 'completed' | 'in-progress' | 'planned'
  period: '2024 - 2025',                       // Période du projet
  location: 'Personal project',                // Lieu/contexte
  image: '/images/mon-projet.jpg',             // Chemin de l'image
  imageCredit: 'Auteur de l\'image',           // Crédit image (optionnel)
  imageCreditUrl: 'https://...',               // Lien vers la source (optionnel)
  gitlabUrl: 'https://gitlab.com/...',         // Lien GitLab/GitHub (optionnel)
  featured: true,                              // Mettre en avant sur l'accueil
  difficulty: 'intermediate',                  // 'beginner' | 'intermediate' | 'advanced'
  dateCreated: '2024-06-15',                   // Date de création (format YYYY-MM-DD)
},
```

### Étape 3 : Vérifier les technologies

Les technologies listées dans `technologies` seront automatiquement :
- Comptées dans les stats de la page About (section Stack)
- Affichées sur la page du projet avec leurs couleurs

Pour ajouter une nouvelle technologie avec sa couleur, modifier `/src/lib/techStats.ts` :

```typescript
export const techColors: Record<string, string> = {
  // Ajouter ici
  'NouveauFramework': '#ff5500',
}
```

### Étape 4 : Vérifier le rendu

```bash
npm run dev
```

Visiter :
- `/projects` → Le projet devrait apparaître dans la grille
- `/projects/{category}/{id}` → Page détail du projet

### Structure des catégories

| Catégorie | ID | Couleur accent |
|-----------|-----|----------------|
| Personal | `personal` | Cyan `#00f0ff` |
| Academic | `academic` | Violet `#a855f7` |
| Research | `internship` | Vert `#10b981` |

---

## Guide : Ajouter une nouvelle page

### Étape 1 : Créer le dossier de route

Dans `/src/app/`, créer un dossier avec le nom de la route :

```
src/app/
└── nouvelle-page/
    ├── layout.tsx    # Optionnel : layout spécifique
    └── page.tsx      # Obligatoire : contenu de la page
```

### Étape 2 : Créer le fichier `page.tsx`

```tsx
// src/app/nouvelle-page/page.tsx
import content from '@/lib/content.json'

export default function NouvellePage() {
  return (
    <main className="min-h-screen px-6 md:px-12 lg:px-16 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl mb-8">
          Ma Nouvelle Page
        </h1>
        <p className="text-white/70">
          Contenu de la page...
        </p>
      </div>
    </main>
  )
}
```

### Étape 3 : Optionnel - Layout spécifique

Si la page nécessite un layout différent (sans NavBar, etc.) :

```tsx
// src/app/nouvelle-page/layout.tsx
export default function NouvellePageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-primary min-h-screen">
      {children}
    </div>
  )
}
```

### Étape 4 : Ajouter les textes dans `content.json`

```json
{
  "nouvellePage": {
    "sectionLabel": "005 — Nouvelle Page",
    "title": "Titre de la page",
    "description": "Description..."
  }
}
```

### Étape 5 : Ajouter le lien dans la navigation

Modifier `/src/components/navigation/NavBar.tsx` pour ajouter le lien.

---

## Commandes utiles

```bash
# Développement
npm run dev          # Serveur de développement (localhost:3000)

# Production
npm run build        # Build de production
npm run start        # Serveur de production

# Qualité
npm run lint         # Vérification ESLint
```

---

## Technologies utilisées

| Technologie | Version | Rôle |
|-------------|---------|------|
| Next.js | 15.5.9 | Framework React (App Router) |
| React | 19.0.3 | Bibliothèque UI |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 4.x | Styles utilitaires |
| Framer Motion | 12.x | Animations React |
| GSAP | 3.x | Animations scroll-driven |
| Lucide React | 0.513.x | Icônes |
| React Icons | 5.5.x | Icônes supplémentaires |

---

*Documentation générée pour Portfolio V4.5 — Janvier 2025*
