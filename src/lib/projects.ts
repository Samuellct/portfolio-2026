import type { TechName } from './technologies'
import { CATEGORY } from './theme'

export type BilingualText = { en: string; fr: string }
export type Locale = 'en' | 'fr'

export function getLocalizedField(
  field: BilingualText | string | undefined,
  locale: Locale
): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[locale] || field.en
}

// sessionStorage key: the listing's active filter, read back by a project page (UX-13)
export const PROJECTS_FILTER_KEY = 'projects-filter'

// Measures are written with a decimal point; French reads a decimal comma.
export function formatMeasure(text: string, locale: Locale): string {
  return locale === 'fr' ? text.replace(/(\d)\.(\d)/g, '$1,$2') : text
}

export interface ProjectData {
  id: string
  title: BilingualText | string
  description: BilingualText | string
  subtitle?: BilingualText | string
  // Legacy free-form narrative, still the source for fiches not yet migrated to
  // `sections` (AUDIT-017, Phases 7-8). Once a fiche has `sections`, this field
  // is no longer rendered.
  detailedDescription?: BilingualText | string
  technologies: TechName[]
  domains: string[]
  keywords: string[]
  category: 'personal' | 'academic' | 'internship'
  status: 'completed' | 'in-progress' | 'planned' | 'paused'
  period: BilingualText | string
  location: BilingualText | string
  image: string
  imageAlt: BilingualText | string
  imageCredit?: string
  imageCreditUrl?: string
  gitHubUrl?: string
  featured?: boolean
  visible?: boolean // default: true
  textColor?: 'white' | 'black' // default: white
  dateCreated: string

  // Structured fiche fields (AUDIT-018). All optional: the 19 entries are
  // migrated fiche by fiche in Phases 7-8. `image` and `gitHubUrl` above stay
  // as derived shortcuts during the migration.
  kind?: 'research' | 'webapp' | 'mobile' | 'desktop' | 'library' | 'infra' | 'analysis'
  // The first entry is the fiche's lead image. `frame: 'figure'` (charts,
  // diagrams) is shown whole at its native ratio and needs `width`/`height`
  // (the file's pixel size); every other frame keeps the 16:9 crop (A15).
  media?: Array<{
    src: string
    alt: BilingualText
    caption?: BilingualText
    credit?: { name: string; url?: string }
    frame: 'figure' | 'interface' | 'photo'
    width?: number
    height?: number
    role: 'hero' | 'result' | 'interface' | 'architecture' | 'context'
  }>
  // Measured results. Numbers are written with a decimal point and localised
  // at render time (`formatMeasure`). `uncertainty` and `baseline` are only
  // filled from values the fiche already states (AUDIT-089/090).
  results?: Array<{
    label: BilingualText
    value: string
    unit?: string
    uncertainty?: string
    baseline?: { value: string; label: BilingualText }
    note?: BilingualText
  }>
  limits?: BilingualText
  links?: Array<{ type: 'code' | 'demo' | 'docs' | 'report' | 'release'; url: string; label?: BilingualText | string }>
  sourceOfSkills?: 'academic' | 'internship' | 'personal'

  // Named optional narrative sections (AUDIT-017). When present, these replace
  // `detailedDescription` in the fiche render. "Résultats" and "Limites" (the
  // last two sections of the template) are sourced from `results[]` and
  // `limits` above rather than duplicated here.
  sections?: {
    context?: BilingualText
    problem?: BilingualText
    approach?: BilingualText
    whatIBuilt?: BilingualText
  }

  // Structured research metadata (AUDIT-067), for `kind: 'research'` fiches.
  research?: { lab: BilingualText; collaboration?: string }
}

export interface CategoryData {
  id: string
  color: string
  accentColor: string
  mutedColor: string
}

export const projectCategories: CategoryData[] = [
  {
    id: 'personal',
    color: 'from-blue-500 to-cyan-500',
    accentColor: CATEGORY.personal.accent,
    mutedColor: CATEGORY.personal.muted,
  },
  {
    id: 'academic',
    color: 'from-purple-500 to-violet-500',
    accentColor: CATEGORY.academic.accent,
    mutedColor: CATEGORY.academic.muted,
  },
  {
    id: 'internship',
    color: 'from-green-500 to-emerald-500',
    accentColor: CATEGORY.internship.accent,
    mutedColor: CATEGORY.internship.muted,
  },
]

export const projectsData: Record<string, Record<string, ProjectData>> = {
  personal: {
    'home-server': {
      id: 'home-server',
      title: { en: 'Proxmox Home Server', fr: 'Serveur domestique Proxmox' },
      description: {
        en: 'Building a home server to learn virtualization, NAS administration and self-hosting.',
        fr: 'Construction d\'un serveur domestique pour apprendre la virtualisation, l\'administration NAS et l\'auto-hébergement.',
      },
      subtitle: {
        en: 'Proxmox, TrueNAS and Jellyfin on an old PC',
        fr: 'Proxmox, TrueNAS et Jellyfin sur un ancien PC',
      },
      sections: {
        context: {
          en: `I started this project to learn the basics of server administration and virtualization. Instead of buying a ready-made NAS (network-attached storage), I repurposed an old PC (AMD A8-7650K, 32GB DDR3 RAM, 400 GB SSD for system files) to build a "Proof of Concept" system. The goal is to test how different services work together before investing in more expensive hardware.`,
          fr: `J'ai lancé ce projet afin d'apprendre les bases de l'administration de serveurs et de la virtualisation. Au lieu d'acheter un NAS (serveur de stockage en réseau) prêt à l'emploi, j'ai réutilisé un ancien PC (AMD A8-7650K, 32 Go de RAM DDR3, SSD de 400 Go pour les fichiers système) afin de construire un système "Proof of Concept". L'objectif est de tester le fonctionnement conjoint de différents services avant d'investir dans du matériel plus coûteux.`,
        },
        whatIBuilt: {
          en: `I started by installing **Proxmox VE** as the main OS.
- **Storage:** I installed **TrueNAS** on a Proxmox VM (virtual machine) and connected a 500GB drive to it, then a second 2TB drive in a separate pool. This is mainly to get used to the TrueNAS / ZFS interface. In the future, I plan to install between 15 and 20TB of storage in a RAID-Z1 configuration (a ZFS layout that survives the loss of one disk).
- **Cloud & Media:** I installed **Nextcloud** and **Jellyfin** on TrueNAS, one app is dedicated to file sharing (like Google Drive) and the other to streaming movies. The Jellyfin plugins I maintain for it are described on the [JellyUX](/en/projects/personal/jellyux) page.
- **Network:** I implemented **Nginx Proxy Manager** to manage reverse proxy logic and connect my services (Nextcloud, Jellyfin) to subdomains of my personal domain so that I can access them from anywhere.`,
          fr: `J'ai commencé par installer **Proxmox VE** comme OS principal.
- **Stockage :** j'ai installé **TrueNAS** sur une machine virtuelle Proxmox et j'y ai connecté un disque dur de 500 Go, puis un second de 2 To dans un pool séparé. Cela m'a principalement permis de me familiariser avec l'interface TrueNAS / ZFS. À l'avenir, je prévois d'installer entre 15 et 20 To de stockage dans une configuration RAID-Z1 (une organisation ZFS qui survit à la perte d'un disque).
- **Cloud et médias :** j'ai installé **Nextcloud** et **Jellyfin** sur TrueNAS, l'une des applications étant dédiée au partage de fichiers (comme Google Drive) et l'autre au streaming de films. Les plugins Jellyfin que je maintiens pour ce serveur sont présentés sur la fiche [JellyUX](/fr/projects/personal/jellyux).
- **Réseau :** j'ai mis en place **Nginx Proxy Manager** pour gérer la logique de reverse proxy et connecter mes services (Nextcloud, Jellyfin) à des sous-domaines de mon domaine personnel afin de pouvoir y accéder depuis n'importe où.`,
        },
      },
      limits: {
        en: `However, I'm starting to hit some limits. Jellyfin now has about ten user accounts, around five of them used regularly. Running Proxmox as a base layer might be too heavy for my old PC once several users rely on the planned services: video streaming (Jellyfin), dedicated photo storage (Immich) and bulk storage (NAS access, Nextcloud). I'm currently considering switching to a bare-metal TrueNAS install and building a dedicated machine for virtualization later on. I also planned to add an Arc A380 GPU, which would allow Jellyfin to transcode video files on the fly without crushing the CPU. With component prices rising sharply, these upgrades are on hold, so this test phase will last longer than planned.`,
        fr: `Cependant, je commence à atteindre certaines limites. Jellyfin compte maintenant une dizaine de comptes utilisateur, dont environ cinq utilisés régulièrement. L'exécution de Proxmox en tant que couche de base risque d'être trop lourde pour mon ancien PC une fois que plusieurs utilisateurs s'appuieront sur les services prévus : streaming vidéo (Jellyfin), stockage dédié des photos (Immich) et stockage de masse (accès NAS, Nextcloud). J'envisage actuellement de passer à une installation TrueNAS *bare-metal* et de construire plus tard une machine dédiée à la virtualisation. J'avais aussi prévu d'ajouter un GPU Arc A380, qui permettrait à Jellyfin de transcoder des fichiers vidéo à la volée sans saturer le CPU. Avec la flambée des prix des composants, ces améliorations sont en attente, et cette phase de test va durer plus longtemps que prévu.`,
      },
      kind: 'infra',
      sourceOfSkills: 'personal',
      technologies: ['Proxmox', 'TrueNAS', 'Nextcloud', 'Jellyfin', 'Nginx Proxy Manager'],
      domains: ['Virtualization', 'Networking', 'Self-hosting'],
      keywords: ['virtualization', 'storage', 'cloud', 'server', 'truenas', 'NAS'],
      category: 'personal',
      status: 'in-progress',
      period: '2025 - 2026',
      location: { en: 'Personal project', fr: 'Projet personnel' },
      image: '/images/Dashboard_Truenas.webp',
      imageAlt: {
        en: 'TrueNAS dashboard showing virtual machines and server interface',
        fr: 'Tableau de bord TrueNAS affichant les machines virtuelles et l\'interface serveur',
      },
      media: [
        {
          src: '/images/Dashboard_Truenas.webp',
          alt: { en: 'TrueNAS dashboard showing virtual machines and server interface', fr: 'Tableau de bord TrueNAS affichant les machines virtuelles et l\'interface serveur' },
          caption: { en: 'The TrueNAS dashboard of the server: system, CPU, memory and storage.', fr: 'Le tableau de bord TrueNAS du serveur : système, processeur, mémoire et stockage.' },
          frame: 'interface',
          role: 'interface',
        },
      ],
      textColor: "black",
      dateCreated: '2025-07-15',
    },
    'portfolio-website': {
      id: 'portfolio-website',
      title: { en: 'Portfolio Website', fr: 'Site portfolio' },
      description: {
        en: 'A personal website built with Next.js 15: Three.js effects, server-side rendering, and every page in French and English.',
        fr: 'Site personnel développé avec Next.js 15 : effets Three.js, rendu côté serveur, et chaque page en français et en anglais.',
      },
      subtitle: {
        en: 'Presenting my profile and projects in physics and computer science',
        fr: 'Présenter mon profil et mes projets en physique et informatique',
      },
      sections: {
        context: {
          en: `I started this portfolio project in 2024 because I wanted a space to present my profile and projects in a less formal way than a CV allows. Building it myself also gave me an opportunity to learn web development progressively while having a concrete goal.`,
          fr: `J'ai commencé ce projet de portfolio en 2024, car je souhaitais disposer d'un espace pour présenter mon profil et mes projets de manière moins formelle qu'un CV. Le créer moi-même m'a également donné l'occasion d'apprendre progressivement le développement web tout en ayant un objectif concret.`,
        },
        approach: {
          en: `The first version used WordPress, but I quickly found the platform too limiting and heavy for what I needed. Between late 2024 and early 2025, I rebuilt everything with Eleventy (V2), which let me work directly with HTML and CSS in a structure I understood well. A few months later, I moved to React with Vite (V3) to learn component-based architecture and client-side rendering (CSR), which established the foundation of modern web apps, even though I could see the limits of pure CSR.

By October 2025, I decided to migrate to Next.js 15. The main motivation was to solve the performance gaps I noticed in V3, specifically through server-side rendering and built-in optimizations like image lazy loading. The transition to the App Router architecture required a lot of work and testing to figure out how to move from Vite to this new framework.`,
          fr: `La première version utilisait WordPress, mais j'ai rapidement trouvé cette plateforme trop restrictive et trop lourde pour mes besoins. Entre fin 2024 et début 2025, j'ai tout reconstruit avec Eleventy (V2), qui m'a permis de travailler directement avec HTML et CSS dans une structure que je comprenais bien. Quelques mois plus tard, je suis passé à React avec Vite (V3) pour apprendre l'architecture basée sur les composants et le rendu côté client (CSR), qui ont établi les bases des applications web modernes, même si je pouvais voir les limites du CSR pur.

À partir d'octobre 2025, j'ai décidé de migrer vers Next.js 15. Ma principale motivation était de résoudre les problèmes de performances que j'avais remarqués dans la V3, notamment grâce au rendu côté serveur et à des optimisations intégrées telles que le chargement différé des images. La transition vers l'architecture App Router a nécessité beaucoup de travail et de tests pour comprendre comment passer de Vite à ce nouveau framework.`,
        },
        whatIBuilt: {
          en: `The visual design centers on Three.js particle effects. Getting acceptable performance on mobile devices meant reducing particle counts and implementing proper cleanup to prevent memory leaks. The landing page includes a moving starfield with an animated hyperspace effect that plays on first visit.

Finally, all site text is managed through two JSON files, one per language, except for project pages which use Markdown. This translation infrastructure is what makes the site bilingual (French and English). For content rendering, I integrated react-markdown with KaTeX to support LaTeX equations in project descriptions.

The site runs on Cloudflare Workers through OpenNext. Every push to the main branch goes through a CI pipeline (type checking, lint, build), then semantic-release reads the commit messages to set the version number, write the changelog and tag the release.`,
          fr: `La conception visuelle est centrée sur les effets de particules Three.js. Pour obtenir des performances acceptables sur les appareils mobiles, il a fallu réduire le nombre de particules et mettre en place un nettoyage approprié afin d'éviter les fuites de mémoire. La page d'accueil comprend un champ d'étoiles en mouvement avec un effet d'hyperspace animé qui s'affiche lors de la première visite.

Enfin, tout le texte du site est géré via deux fichiers JSON, un par langue, à l'exception des pages de projet qui utilisent Markdown. C'est cette infrastructure de traduction qui rend le site bilingue (français et anglais). Pour le rendu du contenu, j'ai intégré react-markdown avec KaTeX afin de prendre en charge les équations LaTeX dans les descriptions de projet.

Le site tourne sur Cloudflare Workers via OpenNext. Chaque push sur la branche principale passe par une chaîne CI (vérification des types, lint, build), puis semantic-release lit les messages de commit pour fixer le numéro de version, écrire le changelog et publier la release.`,
        },
      },
      kind: 'webapp',
      sourceOfSkills: 'personal',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'GSAP', 'Cloudflare Workers'],
      domains: ['Web Development', 'Frontend'],
      keywords: ['portfolio', 'frontend', 'typescript', 'nextjs', 'threejs', 'webgl'],
      category: 'personal',
      status: 'in-progress',
      period: '2024 - 2026',
      location: { en: 'Personal project', fr: 'Projet personnel' },
      image: '/images/portfolioWebsite.webp',
      imageAlt: { en: 'Front page of my website', fr: 'Page d\'accueil de mon site web' },
      media: [
        {
          src: '/images/portfolioWebsite.webp',
          alt: { en: 'Front page of my website', fr: 'Page d\'accueil de mon site web' },
          frame: 'photo',
          role: 'hero',
        },
      ],
      gitHubUrl: "https://github.com/Samuellct/portfolio-2026",
      dateCreated: '2025-02-15',
    },
    'alpine-route': {
      id: 'alpine-route',
      title: { en: 'AlpineRoute', fr: 'AlpineRoute' },
      description: {
        en: 'Route optimizer for off-trail mountaineering in the Alps, using high-resolution Lidar data and a multi-criteria cost function.',
        fr: 'Optimiseur d\'itinéraires pour l\'alpinisme hors-piste dans les Alpes, utilisant des données Lidar HD et une fonction de coût multi-critères.',
      },
      subtitle: {
        en: 'Off-trail mountaineering routes, computed from Lidar and OSM data',
        fr: 'Itinéraires d\'alpinisme hors sentier, calculés via des données Lidar et OSM',
      },
      sections: {
        context: {
          en: `Most apps for mountain route planning follow established trails or ignore terrain complexity entirely. I built AlpineRoute to compute realistic off-trail itineraries in the Alps, treating the mountain as a continuous cost surface rather than a network of paths.`,
          fr: `La plupart des applications de planification en montagne suivent des sentiers balisés ou ignorent la complexité du terrain. J'ai décidé de développer AlpineRoute pour calculer des itinéraires hors-sentier dans les Alpes, en modélisant la montagne comme une surface de coût continue plutôt que comme un réseau de chemins incomplet.`,
        },
        approach: {
          en: `The system downloads IGN Lidar HD elevation tiles (50 cm resolution, downsampled afterwards) on demand via the Géoplateforme API, covering only the bounding box of the planned route. For areas outside France, it falls back to the Copernicus GLO-30 DEM (30 m resolution). From the elevation data, the pipeline derives slope, aspect, roughness, and solar radiation for each grid cell.

These raster layers are combined with vector data: glacier outlines from RGI 7.0 (the Randolph Glacier Inventory), land cover from ESA WorldCover, and trails and barriers from OpenStreetMap. The resulting cost function penalizes steep slopes, glacier zones, dense vegetation and restricted areas, while favoring established trails and safer aspects.`,
          fr: `Le système télécharge à la demande des tuiles IGN Lidar MNT (modèle numérique de terrain, résolution 50 cm, sous-échantillonné ensuite) via l'API Géoplateforme, en se limitant à l'emprise de l'itinéraire planifié. Pour les zones hors de France, le système bascule sur le MNT Copernicus GLO-30 (résolution 30 m). À partir des données d'élévation, le pipeline dérive la pente, l'orientation, la rugosité et l'exposition solaire pour chaque cellule de la grille.

Ces couches raster sont combinées avec des données vectorielles : contours glaciaires RGI 7.0 (Randolph Glacier Inventory, l'inventaire mondial des glaciers), occupation du sol ESA WorldCover 10 m, et sentiers/barrières OSM. La fonction de coût pénalise les fortes pentes, les zones glaciaires crevassées, la végétation dense et les zones interdites, tout en favorisant les sentiers établis et les expositions sûres.`,
        },
        whatIBuilt: {
          en: `Two routing strategies handle different terrain types: Valhalla, an open-source routing engine built on OpenStreetMap data, for sections that follow existing trails, and Dijkstra pathfinding on the cost raster for off-trail itineraries. Route computations typically take 10 to 90 seconds, so the API streams progress updates live as it works, rather than leaving the user staring at a frozen screen until the final result.`,
          fr: `Deux stratégies de calcul d'itinéraire sont utilisées en fonction du type de terrain : Valhalla, un moteur de routage open source qui s'appuie sur les données OpenStreetMap, pour les sections de suivi des chemins existants, et l'algorithme de Dijkstra sur la grille de coûts pour les itinéraires hors-piste. Le calcul d'un itinéraire prend généralement entre 10 et 90 secondes ; l'API envoie donc sa progression en direct au fur et à mesure, plutôt que de faire attendre l'utilisateur devant un écran figé jusqu'au résultat final.`,
        },
      },
      kind: 'webapp',
      results: [
        { label: { en: 'Working resolution', fr: 'Résolution de travail' }, value: '1', unit: 'm', note: { en: '0.5 m remains possible but too heavy to compute for now', fr: '0.5 m reste possible, mais trop lourd à calculer pour l\'instant' } },
        { label: { en: 'Average computation time', fr: 'Temps de calcul moyen' }, value: '10-90', unit: 's' },
        { label: { en: 'Largest area computed', fr: 'Surface maximale traitée' }, value: '100', unit: 'km²', note: { en: '10,000 × 10,000 px grid at 1 m', fr: 'grille de 10 000 × 10 000 px à 1 m' } },
      ],
      limits: {
        en: `The project works well on the itineraries I've tested in the French Alps, including approaches around Chamonix and the Écrins. It's now on its second major iteration, but it still only runs locally: hosting the Lidar processing and routing stack publicly at a reasonable cost remains an open problem, so development is on hold for now.`,
        fr: `Le projet fonctionne bien sur les itinéraires testés dans les Alpes françaises, notamment autour de Chamonix et des Écrins. Il en est maintenant à sa deuxième itération majeure, mais il ne tourne encore qu'en local : héberger la chaîne de traitement Lidar et de calcul d'itinéraire publiquement à un coût raisonnable reste un problème non résolu, donc le développement est en pause pour le moment.`,
      },
      sourceOfSkills: 'personal',
      technologies: ['Python', 'FastAPI', 'NetworkX', 'Rasterio', 'GDAL', 'GeoPandas', 'scikit-image', 'React', 'MapLibre GL JS', 'Leaflet', 'Recharts', 'Terra Draw', 'Valhalla', 'Docker'],
      domains: ['Geospatial Analysis', 'Shortest path problem', 'Web Development'],
      keywords: ['mountaineering', 'route planning', 'lidar', 'pathfinding', 'geospatial', 'alps', 'dem', 'fastapi'],
      category: 'personal',
      status: 'paused',
      period: '2025 - 2026',
      location: { en: 'Personal project', fr: 'Projet personnel' },
      textColor: "black",
      image: '/images/alpineRoute.webp',
      imageAlt: {
        en: 'Topographic map showing a computed mountaineering route',
        fr: 'Carte topographique montrant un itinéraire alpiniste calculé',
      },
      media: [
        {
          src: '/images/alpineRoute.webp',
          alt: { en: 'Topographic map showing a computed mountaineering route', fr: 'Carte topographique montrant un itinéraire alpiniste calculé' },
          caption: { en: 'A route computed by AlpineRoute on a topographic base map, with the settings panel on the left.', fr: 'Un itinéraire calculé par AlpineRoute sur fond topographique, avec le panneau de réglages à gauche.' },
          frame: 'interface',
          role: 'interface',
        },
      ],
      gitHubUrl: 'https://github.com/Samuellct/AlpineRoute',
      featured: true,
      dateCreated: '2025-12-09',
    },
    'hep-gui': {
      id: 'hep-gui',
      title: { en: 'HEP-GUI', fr: 'HEP-GUI' },
      description: {
        en: 'Desktop GUI for managing Monte Carlo event generation pipelines in particle physics with MadGraph5, Pythia8 and Rivet.',
        fr: 'Interface graphique desktop pour gérer les pipelines de génération d\'événements Monte Carlo en physique des particules avec MadGraph5, Pythia8 et Rivet.',
      },
      subtitle: {
        en: 'Graphical Interface for Monte Carlo Event Generation',
        fr: 'Interface graphique pour la génération d\'événements Monte Carlo',
      },
      detailedDescription: {
        en: `During my M2 internship at the Clermont Physics Laboratory (LPC), I regularly ran Monte Carlo event generation pipelines from the command line, chaining MadGraph5, Pythia8 and Rivet with manual configuration files at each step. I built HEP-GUI to replace that workflow with a desktop interface, so the same simulation run can be configured, launched and monitored without manual terminal interaction.

The app runs on Windows and drives all HEP (high-energy physics) tools inside a Docker container, with the local data directory mounted as a shared volume. The three-stage pipeline follows the standard HEP workflow: MadGraph5 generates parton-level events from UFO (Universal FeynRules Output, the standard format for model files) physics models, Pythia8 applies parton showering and hadronization, and Rivet produces YODA (Rivet's histogram format) histogram files for analysis. The current version is built around the MC_JETS (a generic Rivet analysis of jet observables) routine and the custom Rivet analyses used during my internship, which serve as the reference workflow.

To keep the interface responsive during long computations (event generation runs can take hours), execution is handled by QThread workers that stream container logs line by line via Qt signals. PyQtGraph renders the output histograms directly in the interface.

HEP-GUI was a proof of concept scoped to that one workflow, and I'm not planning to develop it further.`,
        fr: `Lors de mon stage de M2 au Laboratoire de Physique de Clermont (LPC), je lançais régulièrement des pipelines de génération d'événements Monte Carlo depuis la ligne de commande, en enchaînant MadGraph5, Pythia8 et Rivet avec des fichiers de configuration manuels à chaque étape. J'ai développé HEP-GUI pour remplacer ce flux de travail par une interface desktop permettant de configurer, lancer et surveiller ces simulations sans interaction manuelle avec le terminal.

L'application fonctionne sous Windows et pilote tous les outils HEP (physique des hautes énergies) dans un container Docker, avec le répertoire de données local monté comme volume partagé. Le pipeline en trois étapes suit le workflow HEP standard : MadGraph5 génère des événements au niveau des partons à partir de modèles de physique UFO (Universal FeynRules Output, le format standard des fichiers de modèle), Pythia8 simule les cascades partoniques et l'hadronisation, et Rivet produit des fichiers d'histogrammes YODA (le format d'histogrammes de Rivet) pour l'analyse. La version actuelle est construite autour de la routine MC_JETS (une analyse Rivet générique des observables de jets) et des analyses Rivet personnalisées utilisées pendant mon stage, qui servent de workflow de référence.

Pour maintenir la réactivité de l'interface lors des calculs longs (la génération d'événements peut prendre plusieurs heures), l'exécution est gérée par des workers QThread qui transmettent les logs du container ligne par ligne via des signaux Qt. PyQtGraph affiche les histogrammes de sortie directement dans l'interface.

HEP-GUI était une preuve de concept limitée à ce workflow précis, et je ne prévois pas de le développer davantage.`,
      },
      technologies: ['Python', 'PySide6', 'Docker', 'MadGraph5', 'Pythia8', 'Rivet'],
      domains: ['Particle Physics', 'Desktop Application', 'Monte Carlo Simulation'],
      keywords: ['particle physics', 'monte carlo', 'madgraph', 'hep', 'gui', 'simulation', 'docker'],
      category: 'personal',
      status: 'completed',
      period: { en: 'February 2026', fr: 'Février 2026' },
      location: { en: 'Personal project', fr: 'Projet personnel' },
      textColor: "black",
      image: '/images/hepGUI.webp',
      imageAlt: {
        en: 'HEP-GUI desktop interface showing Monte Carlo simulation controls and histogram visualization',
        fr: 'Interface desktop HEP-GUI affichant les contrôles de simulation Monte Carlo et la visualisation des histogrammes',
      },
      media: [
        {
          src: '/images/hepGUI.webp',
          alt: { en: 'HEP-GUI desktop interface showing Monte Carlo simulation controls and histogram visualization', fr: 'Interface desktop HEP-GUI affichant les contrôles de simulation Monte Carlo et la visualisation des histogrammes' },
          caption: { en: 'Output histograms drawn by PyQtGraph in the Plots tab of HEP-GUI.', fr: 'Histogrammes de sortie tracés par PyQtGraph dans l\'onglet Plots de HEP-GUI.' },
          frame: 'figure',
          width: 1202,
          height: 832,
          role: 'interface',
        },
      ],
      gitHubUrl: 'https://github.com/Samuellct/HEP-GUI',
      kind: 'desktop',
      sourceOfSkills: 'personal',
      dateCreated: '2026-02-22',
    },
    'accred': {
      id: 'accred',
      title: { en: 'Accred', fr: 'Accred' },
      description: {
        en: 'Mobile-first PWA companion for film festival attendees: schedule screenings, take quick notes between sessions, and archive participations over time.',
        fr: 'PWA mobile-first pour les festivaliers de cinéma : planifier ses séances, prendre des notes rapides entre deux films et archiver ses participations.',
      },
      subtitle: {
        en: 'Personal Companion App for Film Festival Goers',
        fr: 'Application compagnon pour les festivals de cinéma',
      },
      sections: {
        context: {
          en: `I built Accred as a personal companion app for film festival attendees: plan a selection before the festival starts, take quick notes on a phone between screenings, and build an archive of participations over time. The name is a reference to festival accreditation. The project started when I applied for a cinephile accreditation for Cannes 2026 and wanted a dedicated tool rather than adapting a generic agenda app.`,
          fr: `J'ai développé Accred comme application compagnon pour les festivals de cinéma : planifier une sélection avant le début du festival, prendre des notes rapides sur téléphone entre deux séances, et construire une archive de ses participations au fil du temps. Le nom fait référence aux accréditations de festival. Le projet a démarré lorsque j'ai fait une demande d'accréditation cinéphile pour Cannes 2026 et que je voulais un outil dédié plutôt que d'adapter une application d'agenda générique.`,
        },
        whatIBuilt: {
          en: `The app is a mobile-first PWA (progressive web app: a website you can install on a phone like an app) built with Next.js 15 and SQLite. The programme view displays the full festival schedule in a grid, color-coded by venue and conflict status. The selection module manages the personal lineup and flags scheduling conflicts between chosen screenings. The journal module is designed to let you quickly open a new note between two sessions and jot down a few thoughts, before having time at the end of the day to write the full review.

Film metadata is fetched from the TMDb API (The Movie Database) and cached locally so the app works offline once data is loaded. Festival programmes can be imported from CSV or JSON files, and selections can be exported to Letterboxd CSV or iCalendar format. The app is self-hosted via Docker Compose behind Nginx Proxy Manager.`,
          fr: `L'application est une PWA (application web progressive : un site qui s'installe sur le téléphone comme une application) mobile-first développée avec Next.js 15 et SQLite. La vue programme affiche le planning complet du festival sous forme de grille, colorée par salle et par statut de conflit. Le module sélection gère la programmation personnelle et signale les conflits d'horaire entre les séances choisies. Le module journal est conçu pour permettre d'ouvrir rapidement une nouvelle note entre deux sessions et de noter quelques idées, avant de prendre le temps, en fin de journée, de rédiger la critique complète.

Les métadonnées des films sont récupérées depuis l'API TMDb (The Movie Database) et mises en cache localement pour que l'application fonctionne hors ligne une fois les données chargées. Les programmes peuvent être importés depuis des fichiers CSV ou JSON, et les sélections exportées au format CSV Letterboxd ou iCalendar. L'application est auto-hébergée via Docker Compose derrière Nginx Proxy Manager.`,
        },
      },
      limits: {
        en: `I used Accred at the Cannes 2026 festival in a private deployment, which confirmed the core workflow holds up in practice. It's not yet ready for a full public release.`,
        fr: `J'ai utilisé Accred au Festival de Cannes 2026 en déploiement privé, ce qui a confirmé que le fonctionnement de base tient la route en conditions réelles. L'application n'est pas encore prête pour une mise en ligne publique.`,
      },
      kind: 'webapp',
      sourceOfSkills: 'personal',
      technologies: ['Next.js', 'TypeScript', 'SQLite', 'PostgreSQL', 'Docker'],
      domains: ['Web Development', 'Mobile', 'PWA'],
      keywords: ['pwa', 'film festival', 'mobile', 'self-hosted', 'nextjs', 'scheduler'],
      category: 'personal',
      status: 'paused',
      period: { en: 'March - May 2026', fr: 'Mars - Mai 2026' },
      location: { en: 'Personal project', fr: 'Projet personnel' },
      textColor: "black",
      image: '/images/accred.webp',
      imageAlt: {
        en: 'Accred app interface showing a film festival programme grid with selected screenings',
        fr: 'Interface de l\'application Accred montrant une grille de programme de festival avec des séances sélectionnées',
      },
      media: [
        {
          src: '/images/accred.webp',
          alt: { en: 'Accred app interface showing a film festival programme grid with selected screenings', fr: 'Interface de l\'application Accred montrant une grille de programme de festival avec des séances sélectionnées' },
          caption: { en: 'A festival programme grid in Accred, with the selected screenings.', fr: 'La grille de programme d\'un festival dans Accred, avec les séances sélectionnées.' },
          frame: 'interface',
          role: 'interface',
        },
      ],
      gitHubUrl: 'https://github.com/Samuellct/Accred',
      dateCreated: '2026-03-10',
    },
    'time-predict': {
      id: 'time-predict',
      title: { en: 'TimePredict', fr: 'TimePredict' },
      description: {
        en: 'Trail running performance predictor: route, weather, physiology and nutrition analysis, rebuilt from scratch on components validated against real race data.',
        fr: 'Prédicteur de performance en trail : analyse de parcours, météo, physiologie et nutrition, reconstruit à partir de composants validés sur des données de course réelles.',
      },
      subtitle: {
        en: 'Race Performance Prediction, Rebuilt on Real Data',
        fr: 'Prédiction de performance en course, reconstruite sur données réelles',
      },
      sections: {
        context: {
          en: `TimePredict predicts race performance for trail running: it takes a route, the weather expected along it, and an athlete's physiology and nutrition needs, and turns them into a personalized race report.`,
          fr: `TimePredict prédit la performance en trail running : à partir d'un parcours, de la météo attendue et des besoins physiologiques et nutritionnels d'un coureur, l'outil génère un rapport de course personnalisé.`,
        },
        problem: {
          en: `My first approach was to split the project into many small, independent modules, meant to be combined afterward into one global model. That approach quickly proved unworkable: once put together, the modules accumulated invisible errors, invented indices, a hard-coded pace-per-slope table that was wrong 30 to 50 percent of the time, a weather module that silently failed on most of a route. I'm now rebuilding the project from scratch, keeping only the calculation and logic pieces that had proven themselves, but this time validating them together against real race data before wiring anything up.`,
          fr: `Au départ, j'avais découpé le projet en une multitude de petits modules indépendants, pensant les assembler ensuite dans un modèle global. Cette approche s'est vite révélée intenable : une fois réunis, les modules accumulaient des erreurs invisibles, indices inventés, table vitesse-pente codée en dur qui se trompait de 30 à 50 %, module météo qui échouait silencieusement sur la majorité d'un parcours. Je reconstruis maintenant le projet depuis le début, en ne gardant que les briques de calcul et de logique qui avaient fait leurs preuves, mais en les validant ensemble cette fois, sur des données de course réelles, avant de les assembler.`,
        },
        whatIBuilt: {
          en: `The new version is online in beta and still under active development. The pace-per-slope curve is now fitted on 26,301 real GPS segments instead of typed by hand. The level and uncertainty model reaches a 25.4% average error on nine real races, against 37.0% for a Riegel estimate, the classic empirical formula that predicts a race time from a single reference performance at another distance. Its error roughly doubles when tested outside its training conditions, instead of quietly staying wrong the way the old version did. Terrain classification and elevation gain are checked against actual races (Trail du Sancy, MaxiRace, UTMB) instead of assumed correct. The weather module, now built around the WBGT heat-stress index (a measure combining temperature, humidity and radiation to estimate heatstroke risk), matches an official reference calculation to within 0.00°C, and returns a result on all 138 points of a real tested route, versus zero out of six attempts for the old version.`,
          fr: `La nouvelle version est en ligne en bêta et toujours en cours de développement. La courbe vitesse-pente est désormais ajustée sur 26 301 segments GPS réels, au lieu d'être saisie à la main. Le modèle de niveau et d'incertitude atteint une erreur moyenne de 25,4 % sur neuf courses réelles, contre 37,0 % pour une estimation de Riegel, la formule empirique classique qui prédit un temps de course à partir d'une seule performance de référence sur une autre distance. Son erreur double à peu près quand on le teste hors de ses conditions d'entraînement, plutôt que de rester silencieusement faux comme le faisait l'ancienne version. La classification du terrain et le calcul de dénivelé sont vérifiés sur de vraies courses (Trail du Sancy, MaxiRace, UTMB) plutôt que supposés corrects. Le module météo, reconstruit autour de l'indice de stress thermique WBGT (un indicateur qui combine température, humidité et rayonnement pour estimer le risque de coup de chaleur), retrouve à 0,00 °C près une référence officielle, et renvoie un résultat sur les 138 points d'un parcours réel testé, contre zéro sur six tentatives pour l'ancienne version.`,
        },
      },
      kind: 'analysis',
      results: [
        { label: { en: 'GPS segments', fr: 'Segments GPS' }, value: '26 301' },
        { label: { en: 'Model error', fr: 'Erreur modèle' }, value: '25.4', unit: '%', baseline: { value: '37.0 %', label: { en: 'Riegel estimate', fr: 'estimation de Riegel' } } },
        { label: { en: 'WBGT accuracy', fr: 'Précision météo WBGT' }, value: '0.00', unit: '°C' },
        { label: { en: 'Route coverage', fr: 'Couverture parcours' }, value: '138/138', baseline: { value: '0/6', label: { en: 'old version', fr: 'ancienne version' } } },
      ],
      limits: {
        en: `These validated pieces now run as one system: the prediction engine combines terrain, weather and a runner's profile into one estimate, the report generator turns it into a race report (HTML, PDF or JSON), and a web app ties it all together. That app is still a beta. Each finished piece ships with its own tests and its own documented limits, so nothing gets marked done just because it looks like it works.`,
        fr: `Ces briques validées fonctionnent désormais comme un seul système : le moteur de prédiction combine le terrain, la météo et le profil du coureur en une seule estimation, le générateur de rapport en tire un rapport de course (HTML, PDF ou JSON), et une application web réunit le tout. Cette application est encore en bêta. Chaque brique déjà terminée est livrée avec ses propres tests et ses propres limites documentées, pour ne rien déclarer fini simplement parce que ça a l'air de marcher.`,
      },
      sourceOfSkills: 'personal',
      technologies: ['Python', 'uv', 'Rasterio', 'OSMnx', 'GeoPandas', 'pvlib', 'thermofeel', 'gpxpy', 'Meteostat'],
      domains: ['Data Science', 'Meteorology', 'Sports Analytics', 'Geospatial Analysis'],
      keywords: ['trail running', 'weather', 'gpx', 'utci', 'python', 'forecast', 'thermal analysis'],
      category: 'personal',
      status: 'in-progress',
      period: '2025 - 2026',
      location: { en: 'Personal project', fr: 'Projet personnel' },
      image: '/images/timepredict.webp',
      imageAlt: {
        en: 'Chart of the measured cost-of-transport factor against slope, fitted on real GPS data with 95% confidence intervals, compared to the Minetti model and the old lookup table',
        fr: 'Graphique du facteur de coût mesuré en fonction de la pente, ajusté sur des données GPS réelles avec intervalles de confiance à 95 %, comparé au modèle de Minetti et à l\'ancienne table',
      },
      media: [
        {
          src: '/images/timepredict.webp',
          alt: { en: 'Chart of the measured cost-of-transport factor against slope, fitted on real GPS data with 95% confidence intervals, compared to the Minetti model and the old lookup table', fr: 'Graphique du facteur de coût mesuré en fonction de la pente, ajusté sur des données GPS réelles avec intervalles de confiance à 95 %, comparé au modèle de Minetti et à l\'ancienne table' },
          caption: { en: 'Measured cost factor against slope, fitted on 26,301 GPS segments (bars: 95% confidence intervals), compared with the Minetti model and the old V1 table.', fr: 'Facteur de coût mesuré selon la pente, ajusté sur 26 301 segments GPS (barres : intervalles de confiance à 95 %), comparé au modèle de Minetti et à l\'ancienne table V1.' },
          frame: 'figure',
          width: 1210,
          height: 770,
          role: 'result',
        },
      ],
      gitHubUrl: 'https://github.com/Samuellct/TimePredict',
      links: [{ type: 'demo', url: 'https://timepredict.samuel-lecomte.fr/', label: { en: 'App (beta)', fr: 'Application (bêta)' } }],
      visible: true,
      featured: true,
      dateCreated: '2025-11-27',
    },
    'jellyux': {
      id: 'jellyux',
      title: { en: 'JellyUX', fr: 'JellyUX' },
      description: {
        en: 'A small family of open-source Jellyfin plugins I maintain: a home screen widget engine, a storage-triage voting tool, and an email notification service.',
        fr: 'Une petite famille de plugins Jellyfin open source que je maintiens : un moteur de widgets d\'accueil, un outil de vote pour trier le stockage, et un service de notifications par email.',
      },
      subtitle: {
        en: 'A Family of Jellyfin Plugins',
        fr: 'Une famille de plugins Jellyfin',
      },
      sections: {
        context: {
          en: `JellyUX is a small family of open-source plugins I maintain for Jellyfin, the self-hosted media server running on my home lab. Each plugin is self-contained, targets Jellyfin 10.11.x, injects its assets through the File Transformation plugin rather than patching Jellyfin itself, and can be removed without leaving anything behind.`,
          fr: `JellyUX est une petite famille de plugins open source que je maintiens pour Jellyfin, le serveur multimédia auto-hébergé qui tourne sur mon homelab. Chaque plugin est autonome, cible Jellyfin 10.11.x, injecte ses assets via le plugin File Transformation plutôt que de patcher Jellyfin lui-même, et se désinstalle sans rien laisser derrière lui.`,
        },
        whatIBuilt: {
          en: `### Homepage

The flagship plugin: it replaces Jellyfin's default home page with a fully configurable widget engine, 27 widgets across native, admin-curated, personalized and TMDb-connected categories (TMDb: The Movie Database, a public film database), with drag-and-drop layout from the admin dashboard. It stays out of the way on TV clients, where the native home screen still makes more sense. It has its own documentation site: see it on [GitHub](https://github.com/JellyUX/Homepage) or read the [docs](https://jellyux.github.io/Homepage/).

### Keep or Remove

A small, deliberately temporary plugin for when server storage runs low: users vote keep or remove on a title, the admin gets a plain aggregated table, and that's it. It never deletes, moves or modifies anything itself, and removing it leaves a single JSON file to clean up. On [GitHub](https://github.com/JellyUX/Keep_or_Remove).

### Easy Notif

An internal email notification service for Jellyfin: a new-media newsletter on a schedule the admin picks (weekly, monthly, every N days or daily), with cover art and links back to each title; a personal weekly recap for each user, with what they watched that week and their running total for the year; and one-off announcements written from the dashboard, in plain text or HTML. Each user picks which categories they receive and sets their own contact address, every email carries a one-click unsubscribe link, and the plugin only reads library and playback data. Mail goes out through Resend. On [GitHub](https://github.com/JellyUX/Easy_Notif).`,
          fr: `### Homepage

Le plugin phare : il remplace la page d'accueil par défaut de Jellyfin par un moteur de widgets entièrement configurable, 27 widgets répartis entre catégories natives, gérées par l'admin, personnalisées et connectées à TMDb (The Movie Database, une base publique de films), avec une disposition en glisser-déposer depuis le tableau de bord admin. Il reste discret sur les clients TV, où l'accueil natif garde plus de sens. Il a son propre site de documentation : disponible sur [GitHub](https://github.com/JellyUX/Homepage) ou dans la [documentation](https://jellyux.github.io/Homepage/).

### Keep or Remove

Un petit plugin volontairement temporaire pour les moments où le stockage du serveur se fait rare : les utilisateurs votent garder ou retirer sur un titre, l'admin obtient un tableau agrégé simple, et c'est tout. Il ne supprime, ne déplace ni ne modifie jamais rien lui-même, et le désinstaller ne laisse qu'un seul fichier JSON à nettoyer. Sur [GitHub](https://github.com/JellyUX/Keep_or_Remove).

### Easy Notif

Un service de notifications par email interne à Jellyfin : une newsletter des nouveautés au rythme choisi par l'admin (hebdomadaire, mensuelle, tous les N jours ou quotidienne), avec affiches et liens vers chaque titre ; un récapitulatif hebdomadaire personnel pour chaque utilisateur, avec ce qu'il a regardé dans la semaine et son total de l'année ; et des annonces ponctuelles rédigées depuis le tableau de bord, en texte brut ou en HTML. Chaque utilisateur choisit les catégories qu'il reçoit et sa propre adresse, chaque email porte un lien de désinscription en un clic, et le plugin ne fait que lire les données de bibliothèque et de lecture. L'envoi passe par Resend. Sur [GitHub](https://github.com/JellyUX/Easy_Notif).`,
        },
      },
      kind: 'library',
      sourceOfSkills: 'personal',
      technologies: ['C#', '.NET', 'TypeScript', 'GitHub Actions', 'semantic-release'],
      domains: ['Web Development', 'Open Source'],
      keywords: ['jellyfin', 'plugin', 'homelab', 'self-hosted', 'csharp', 'dotnet'],
      category: 'personal',
      status: 'in-progress',
      period: { en: 'July - October 2026', fr: 'Juillet - Octobre 2026' },
      location: { en: 'Personal project', fr: 'Projet personnel' },
      image: '/images/jellyux.webp',
      imageAlt: {
        en: 'Screenshot of the JellyUX Homepage widget engine on a Jellyfin home page',
        fr: 'Capture d\'écran du moteur de widgets JellyUX Homepage sur une page d\'accueil Jellyfin',
      },
      media: [
        {
          src: '/images/jellyux.webp',
          alt: { en: 'Screenshot of the JellyUX Homepage widget engine on a Jellyfin home page', fr: 'Capture d\'écran du moteur de widgets JellyUX Homepage sur une page d\'accueil Jellyfin' },
          caption: { en: 'The JellyUX Homepage widget engine on the Jellyfin home page.', fr: 'Le moteur de widgets JellyUX Homepage sur la page d\'accueil de Jellyfin.' },
          frame: 'interface',
          role: 'interface',
        },
      ],
      gitHubUrl: 'https://github.com/JellyUX',
      links: [{ type: 'docs', url: 'https://jellyux.github.io/Homepage/', label: { en: 'Homepage docs', fr: 'Documentation Homepage' } }],
      featured: true,
      dateCreated: '2026-06-27',
    },
    'delivr': {
      id: 'delivr',
      title: { en: 'Delivr', fr: 'Delivr' },
      description: {
        en: 'Android app that scans the morning delivery sheet, pulls the cottage numbers out by OCR, and guides me through the round cottage by cottage, built to speed up a temp job delivering breakfasts at a holiday camp.',
        fr: 'Application Android qui scanne la feuille de livraison du matin, en extrait les numéros de cottages par OCR, et guide la tournée cottage par cottage, développée pour accélérer un job d\'intérim de livraison de petits-déjeuners en centre de vacances.',
      },
      subtitle: {
        en: 'OCR-Guided Delivery Rounds',
        fr: 'Tournées de livraison guidées par OCR',
      },
      detailedDescription: {
        en: `I built Delivr for a temp job delivering breakfasts at a holiday camp: every morning a paper sheet lists which cottages get a delivery, and copying those cottage numbers by hand before each round was the tedious part. The app scans the sheet, runs offline OCR (optical character recognition) to pull the cottage numbers out of the right column, sorts them into a logical route, and lets me check the list before starting.

Once a round starts, the screen shows one thing: the current cottage number, in large type, with its position in the round underneath. Delivered or skipped, one tap moves to the next one, and everything saves continuously so closing the app by accident never loses the round in progress.

It runs entirely offline: no server, no cloud, no account. Under the hood it's Kotlin and Jetpack Compose, Room for storage, and Google's ML Kit for document detection and text recognition, with a small CI pipeline that runs tests and lint and builds a signed release APK on every version bump.`,
        fr: `J'ai développé Delivr pour un job d'intérim de livraison de petits-déjeuners en centre de vacances : chaque matin, une feuille papier liste les cottages à livrer, et recopier ces numéros à la main avant chaque tournée était la partie fastidieuse. L'application scanne la feuille, extrait les numéros de cottages par OCR (reconnaissance optique de caractères) hors ligne dans la bonne colonne, les trie dans un ordre logique de tournée, et permet de vérifier la liste avant de démarrer.

Une fois la tournée lancée, l'écran n'affiche qu'une chose : le numéro du cottage en cours, en grand, avec sa position dans la tournée en dessous. Livré ou passé, un tap suffit pour passer au suivant, et tout se sauvegarde en continu pour qu'une fermeture accidentelle de l'application ne fasse jamais perdre la tournée en cours.

L'application fonctionne entièrement hors ligne : aucun serveur, aucun cloud, aucun compte. Sous le capot, c'est du Kotlin et Jetpack Compose, Room pour le stockage, et le ML Kit de Google pour la détection de document et la reconnaissance de texte, avec une petite chaîne CI qui exécute les tests et le lint et construit une APK de release signée à chaque montée de version.`,
      },
      technologies: ['Kotlin', 'Jetpack Compose', 'Room', 'ML Kit', 'GitHub Actions'],
      domains: ['Mobile Development', 'Android'],
      keywords: ['android', 'kotlin', 'ocr', 'jetpack compose', 'offline-first'],
      category: 'personal',
      status: 'completed',
      period: { en: 'July - August 2026', fr: 'Juillet - Août 2026' },
      location: { en: 'Personal project', fr: 'Projet personnel' },
      image: '/images/delivr.webp',
      imageAlt: {
        en: 'Home screen and delivery mode of the Delivr Android app, side by side',
        fr: 'Écran d\'accueil et mode livraison de l\'application Android Delivr, côte à côte',
      },
      media: [
        {
          src: '/images/delivr.webp',
          alt: { en: 'Home screen and delivery mode of the Delivr Android app, side by side', fr: 'Écran d\'accueil et mode livraison de l\'application Android Delivr, côte à côte' },
          caption: { en: 'Home screen and delivery mode of the Delivr Android app.', fr: 'Écran d\'accueil et mode livraison de l\'application Android Delivr.' },
          frame: 'interface',
          role: 'interface',
        },
      ],
      gitHubUrl: 'https://github.com/Samuellct/Delivr',
      links: [{ type: 'release', url: 'https://github.com/Samuellct/Delivr/releases', label: { en: 'Releases (APK)', fr: 'Versions (APK)' } }],
      kind: 'mobile',
      sourceOfSkills: 'personal',
      dateCreated: '2026-07-06',
    },
  },
  academic: {
    'data-analysis': {
      id: 'data-analysis',
      title: {
        en: 'Introduction to Data Analysis in Physics',
        fr: 'Introduction à l\'analyse de données en physique',
      },
      description: {
        en: "Presentation of data filtering process applied to HL-LHC (High-Luminosity LHC) simulated data to estimate the presence of an \"X boson\".",
        fr: "Présentation du processus de filtrage de données appliqué aux données simulées du HL-LHC (LHC à haute luminosité) pour estimer la présence d'un \"boson X\".",
      },
      subtitle: {
        en: 'Searching for New Particles in Simulated LHC Data',
        fr: 'Recherche de nouvelles particules dans les données simulées du LHC',
      },
      sections: {
        context: {
          en: `During my third year of bachelor's degree, I worked on a particle physics analysis that simulated the search for a hypothetical *X boson* decaying into two photons. The simulated samples were provided by the teacher.`,
          fr: `Au cours de ma troisième année de licence, j'ai travaillé sur une analyse de physique des particules qui simulait la recherche d'un *boson X* hypothétique se désintégrant en deux photons. Les échantillons simulés étaient fournis par l'enseignant.`,
        },
        approach: {
          en: `While I was familiar with Python and libraries like Pandas or SciPy, applying them to physics analysis required a different approach. We needed to optimize selection cuts on variables like photon isolation (a variable that separates genuine photons from those produced in particle decays) and transverse momentum to separate the signal from Standard Model background noise. The cuts had to be precise: too strict and we'd lose signal events, too loose and the background would dominate. Through this trial-and-error process, we managed to reduce background by a factor of 40 while retaining most signal events.

After establishing the selection criteria on simulated samples, we moved to statistical analysis. We fitted the invariant mass spectrum background with an exponential function to see if a local excess appeared, which would indicate a new particle. Our dataset of observed data showed no evidence of the X boson, with a significance of only $0.5~\\sigma$, consistent with statistical fluctuation.

Following the CLs method (a standard statistical method for setting exclusion limits), we determined that we could exclude signals of strength above $0.3736~\\mu$, corresponding to an effective cross-section ($\\sigma$) of approximately $2.017~\\text{pb}$ (picobarns, a unit of cross-section). This upper limit means that if a signal does exist, it will necessarily be smaller than $2.017~\\text{pb}$.`,
          fr: `Bien que je connaisse bien Python et des bibliothèques telles que Pandas ou SciPy, leur application à l'analyse en physique demandait une autre approche. Nous devions optimiser les critères de sélection sur des variables telles que la *photon isolation* (variable permettant de séparer les vrais photons de ceux étant des produits de désintégration) et *l'impulsion transverse* afin de séparer le signal du bruit de fond du modèle standard. Les critères devaient être précis : trop stricts, nous perdions des événements de signal, trop laxistes, le bruit de fond dominait. Grâce à ce processus d'essais et d'erreurs, nous avons réussi à réduire le bruit de fond d'un facteur 40 tout en conservant la plupart des événements de signal.

Après avoir établi les critères de sélection sur des échantillons simulés, nous sommes passés à l'analyse statistique. Le fond du spectre de masse invariante a été ajusté par une fonction exponentielle afin de détecter un éventuel excès local, ce qui indiquerait une nouvelle particule. Notre ensemble de données observées n'a montré aucune preuve de l'existence du boson X, avec une signification de seulement $0.5~\\sigma$, ce qui correspond à une fluctuation statistique.

En suivant la méthode CLs (méthode statistique standard pour fixer des limites d'exclusion), nous avons déterminé que nous pouvions exclure les signaux d'une intensité supérieure à $0.3736~\\mu$, ce qui correspond à une section efficace ($\\sigma$) d'environ $2.017~\\text{pb}$ (picobarns, unité de section efficace). Cette limite supérieure signifie que si un signal existe, il sera nécessairement inférieur à $2.017~\\text{pb}$.`,
        },
      },
      kind: 'analysis',
      results: [
        { label: { en: 'Background reduction', fr: 'Réduction du bruit de fond' }, value: '40×', note: { en: 'most signal events kept', fr: 'la plupart des événements de signal conservés' } },
        { label: { en: 'Observed significance', fr: 'Significance observée' }, value: '0.5', unit: 'σ', note: { en: 'no evidence of the X boson', fr: 'aucun signe du boson X' } },
        { label: { en: 'Cross-section upper limit', fr: 'Limite sur la section efficace' }, value: '2.017', unit: 'pb', note: { en: 'signal strength above 0.3736 excluded (CLs)', fr: 'intensité de signal au-delà de 0.3736 exclue (CLs)' } },
      ],
      sourceOfSkills: 'academic',
      technologies: ['Python', 'NumPy', 'Matplotlib', 'Pandas', 'SciPy'],
      domains: ['Particle Physics', 'Data Analysis', 'Simulation'],
      keywords: ['physics', 'statistics', 'python', 'simulation'],
      category: 'academic',
      status: 'completed',
      period: 'L3 - 2023',
      location: 'Université Clermont Auvergne',
      image: '/images/data_analysis_fit.webp',
      imageAlt: {
        en: 'Exponential fit of the diphoton invariant mass background in the sidebands, with statistical and systematic errors',
        fr: 'Ajustement exponentiel du bruit de fond de la masse invariante diphoton sur les bandes latérales, avec erreurs statistiques et systématiques',
      },
      media: [
        {
          src: '/images/data_analysis_fit.webp',
          alt: { en: 'Exponential fit of the diphoton invariant mass background in the sidebands, with statistical and systematic errors', fr: 'Ajustement exponentiel du bruit de fond de la masse invariante diphoton sur les bandes latérales, avec erreurs statistiques et systématiques' },
          caption: { en: 'Exponential fit of the diphoton invariant mass background in the sidebands, with statistical and systematic errors.', fr: 'Ajustement exponentiel du bruit de fond de la masse invariante diphoton dans les bandes latérales, avec erreurs statistiques et systématiques.' },
          frame: 'figure',
          width: 571,
          height: 432,
          role: 'result',
        },
      ],
      gitHubUrl: 'https://github.com/Samuellct/ATLAS-basic-particle-search-workflow',
      dateCreated: '2024-09-17',
    },
    'ising-model': {
      id: 'ising-model',
      title: 'Ising Model',
      description: 'Study of the Ising model with a Python simulation of the two-dimensional case.',
      subtitle: 'Simulating Phase Transitions in Magnetic Systems',
      detailedDescription: 'This project explores the Ising model, a fundamental model in statistical mechanics for understanding phase transitions in magnetic systems. The simulation uses Monte Carlo methods to study the behavior of a 2D spin lattice.',
      technologies: ['Python', 'NumPy', 'Matplotlib', 'SciPy'],
      domains: ['Statistical Physics', 'Monte Carlo Simulation'],
      keywords: ['ising', 'monte carlo', 'phase transition'],
      category: 'academic',
      status: 'completed',
      period: 'M1 - 2023',
      location: 'Université Clermont Auvergne',
      image: '/images/ising.webp',
      imageAlt: 'Animated visualization of Ising model spin lattice showing magnetic domain formation near critical temperature',
      imageCredit: 'Damian Owls',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Ising_Criticality2.gif',
      gitHubUrl: 'https://github.com/Samuellct/2D-3D-python-Ising-model',
      visible: false,
      dateCreated: '2023-11-21',
    },
    'quantum-algorithms': {
      id: 'quantum-algorithms',
      title: {
        en: 'Quantum Algorithm Demos using Cirq',
        fr: 'Démonstrations d\'algorithmes quantiques avec Cirq',
      },
      description: {
        en: "Python simulation of Shor's algorithm using the Cirq library, limited to factoring small numbers, to show how it threatens RSA encryption.",
        fr: "Simulation Python de l'algorithme de Shor à l'aide de la bibliothèque Cirq, limitée à la factorisation de petits nombres, pour montrer la menace qu'il représente pour le chiffrement RSA.",
      },
      subtitle: {
        en: 'Principles of Quantum Computing and Application to Cryptographic Algorithms',
        fr: 'Principes de l\'informatique quantique et application aux algorithmes cryptographiques',
      },
      sections: {
        context: {
          en: `This project was carried out as part of my Quantum Mechanics course during my first year of Master's. Working alongside two classmates, we studied the principles of quantum computing and their implications for modern cryptography. Our goal was to understand how qubits, quantum gates, and quantum circuits work, and then apply this knowledge to a real-world problem: breaking RSA encryption (a widely used public-key encryption scheme) using Shor's algorithm.`,
          fr: `Ce projet a été réalisé dans le cadre du cours de mécanique quantique pendant ma première année de master. En collaboration avec deux camarades, nous avons étudié les principes de l'informatique quantique et leurs implications pour la cryptographie moderne. Notre objectif était de comprendre le fonctionnement des qubits, des portes quantiques et des circuits quantiques, puis d'appliquer ces connaissances à un problème concret : casser le chiffrement RSA (un chiffrement à clé publique très répandu) à l'aide de l'algorithme de Shor.`,
        },
        approach: {
          en: `We started with the theory. We studied superposition, entanglement, and the Bloch sphere representation, then moved on to quantum gates like Hadamard, Pauli-X, and CNOT (controlled-NOT), as well as the Quantum Fourier Transform. Once we felt comfortable with the basics, we implemented RSA encryption in Python using both a simple version with SymPy and a standard implementation with the cryptography library. We wanted to see firsthand how asymmetric encryption works before attempting to crack it.`,
          fr: `Nous avons commencé par la théorie. Nous avons étudié la superposition, l'intrication et la représentation de la sphère de Bloch, puis nous sommes passés aux portes quantiques telles que Hadamard, Pauli-X et CNOT (NON contrôlé), ainsi qu'à la transformée de Fourier quantique. Une fois que nous nous sommes familiarisés avec les bases, nous avons implémenté le chiffrement RSA en Python en utilisant à la fois une version simple avec SymPy et une implémentation standard avec la bibliothèque *cryptography*. L'objectif était de voir concrètement le fonctionnement du chiffrement asymétrique avant de tenter de le casser.`,
        },
        whatIBuilt: {
          en: `The most challenging part was implementing Shor's algorithm for integer factorization. We started with IBM's Qiskit framework, but we struggled with how the library handled the modular exponentiation gate and the circuit optimization. After many weeks of troubleshooting, we decided to switch to Google's Cirq library, which gave us more direct control over the gate decomposition. With Cirq, we were finally able to build a working simulation.

We also got a taste of why researchers are now developing new encryption methods that could resist quantum attacks. These "post-quantum" algorithms rely on mathematical problems that even quantum computers would struggle with, like finding short vectors in high-dimensional lattices (the shortest vector problem, SVP).`,
          fr: `La partie la plus difficile a été la mise en œuvre de l'algorithme de Shor pour la factorisation des nombres entiers. Nous avons commencé avec le framework Qiskit d'IBM, mais nous avons rencontré des difficultés avec la manière dont la bibliothèque gérait les portes quantiques complexes et l'optimisation des circuits. Après plusieurs semaines de débogage, nous avons décidé de passer à la bibliothèque Cirq de Google, qui nous offrait un contrôle plus direct sur la décomposition des portes. Avec Cirq, nous avons enfin pu créer une simulation fonctionnelle.

Nous avons également compris pourquoi les chercheurs développent actuellement de nouvelles méthodes de chiffrement capables de résister aux attaques quantiques. Ces algorithmes *post-quantiques* s'appuient sur des problèmes mathématiques que même les ordinateurs quantiques auraient du mal à résoudre, comme la recherche de vecteurs courts dans des réseaux de grande dimension (problème du plus court vecteur, SVP).`,
        },
      },
      limits: {
        en: `The algorithm worked well for small numbers, but we quickly hit memory limitations for numbers larger than five digits. This makes sense because simulating n qubits requires storing $2^{n}$ complex numbers in memory, so the requirements explode exponentially.`,
        fr: `L'algorithme a bien fonctionné pour les petits nombres, mais nous avons rapidement atteint les limites de mémoire pour les nombres supérieurs à cinq chiffres. C'est logique, car la simulation de n qubits nécessite de stocker $2^{n}$ nombres complexes en mémoire, ce qui fait exploser les besoins de manière exponentielle.`,
      },
      kind: 'analysis',
      sourceOfSkills: 'academic',
      technologies: ['Python', 'Qiskit', 'Cirq', 'SymPy'],
      domains: ['Quantum Computing', 'Cryptography'],
      keywords: ['quantum computing', 'Shor algorithm', 'RSA', 'cryptography'],
      category: 'academic',
      status: 'completed',
      period: 'M1 - 2023',
      location: 'Université Clermont Auvergne',
      image: '/images/quantum_cpu.webp',
      imageAlt: {
        en: 'Close-up of a quantum processor chip with superconducting qubits',
        fr: 'Gros plan d\'une puce de processeur quantique avec qubits supraconducteurs',
      },
      media: [
        {
          src: '/images/quantum_cpu.webp',
          alt: { en: 'Close-up of a quantum processor chip with superconducting qubits', fr: 'Gros plan d\'une puce de processeur quantique avec qubits supraconducteurs' },
          credit: { name: 'Google' },
          frame: 'photo',
          role: 'context',
        },
      ],
      imageCredit: 'Google',
      gitHubUrl: 'https://github.com/Samuellct/Cirq-Quantum-Cryptography-Demo',
      dateCreated: '2023-11-29',
    },
    'weather-station': {
      id: 'weather-station',
      title: 'Arduino Weather Station',
      description: 'Design and implementation of a weather station using Arduino with sensor data visualization.',
      subtitle: 'Building a DIY Environmental Monitoring System',
      detailedDescription: 'A complete weather station built with Arduino, featuring multiple environmental sensors and a display for real-time data visualization.',
      technologies: ['Arduino', 'C++'],
      domains: ['IoT', 'Electronics'],
      keywords: ['arduino', 'iot', 'sensors', 'weather'],
      category: 'academic',
      status: 'completed',
      period: 'M1 - 2024',
      location: 'Université Clermont Auvergne',
      image: '/images/arduino_M1.webp',
      imageAlt: 'Arduino weather station setup with temperature and humidity sensors on breadboard',
      visible: false,
      dateCreated: '2025-01-22',
    },
    'labview': {
      id: 'labview',
      title: {
        en: 'LabVIEW Muon System Update',
        fr: 'Contrôle système muon sous LabVIEW',
      },
      description: {
        en: 'LabVIEW interface for muon detector control and TAC (time-to-amplitude converter) calibration routines.',
        fr: 'Interface LabVIEW pour le contrôle du détecteur de muons et les routines de calibration du TAC (convertisseur temps-amplitude).',
      },
      subtitle: {
        en: 'Real-Time Particle Detection and Analysis',
        fr: 'Détection et analyse de particules en temps réel',
      },
      sections: {
        context: {
          en: `During a week-long project in March 2024, I worked with a team of two other students to develop additional LabVIEW functionality for an existing muon Landé g-factor measurement system. This project was primarily a practical introduction to instrument control and data acquisition programming, with the physics experiment serving as a context for learning LabVIEW development.`,
          fr: `Au cours d'un projet d'une semaine en mars 2024, j'ai travaillé avec une équipe de deux autres étudiants afin de développer des fonctionnalités LabVIEW supplémentaires pour un système existant de mesure du facteur de Landé des muons. Ce projet consistait principalement en une introduction pratique à la programmation du contrôle des instruments et de l'acquisition de données, l'expérience physique servant de contexte pour l'apprentissage du développement LabVIEW.`,
        },
        approach: {
          en: `Atmospheric muons originate from cosmic ray interactions at an altitude of around 15 km, arriving at ground level with a flux of roughly 1 muon per $\\text{cm}^{2}$ per minute. These particles have a rest-frame lifetime of 2.2 microseconds and decay via the weak interaction: $\\mu^+ \\rightarrow e^+ + \\nu_e + \\bar{\\nu}_\\mu$. The key property we exploit is spin polarization. Due to parity violation in weak interactions, the decay positron is preferentially emitted along the muon's spin direction at the moment of decay.

When placed in a magnetic field $\\vec{B}$, the muon spin precesses at the Larmor frequency $\\omega_L = g(e/2m_\\mu)B$, where $g$ is the Landé factor we aim to measure. This precession modulates the decay time distribution, creating an oscillatory pattern superimposed on the exponential decay.

The detector consists of four plastic scintillators coupled to photomultiplier tubes (PMT), with 20 mm of copper plates positioned between the upper and lower detector pairs. The copper stops incoming muons while allowing higher-energy decay positrons to escape and reach the lower detectors. Two Helmholtz coils (1 meter diameter, field-to-current ratio of 302 µT/A) generate the uniform magnetic field in the detection volume.

Discriminators turn the PMT pulses into standard logic pulses, and coincidence logic selects the events: valid muon stops require signals in the upper detectors but not in the lower ones, while decay positron detection requires the opposite pattern. A Time-to-Amplitude Converter (TAC) measures the microsecond-scale intervals between these events, outputting an analog voltage proportional to the measured time.`,
          fr: `Les muons atmosphériques proviennent des interactions des rayons cosmiques à une altitude d'environ 15 km et atteignent le sol avec un flux d'environ 1 muon par $\\text{cm}^{2}$ par minute. Ces particules ont une durée de vie propre de 2,2 microsecondes et se désintègrent par interaction faible : $\\mu^+ \\rightarrow e^+ + \\nu_e + \\bar{\\nu}_\\mu$. La propriété clé que nous exploitons est la polarisation du spin. En raison de la violation de parité dans les interactions faibles, le positon issu de la désintégration est émis de préférence dans la direction du spin du muon au moment de la désintégration.

Lorsqu'il est placé dans un champ magnétique $\\vec{B}$, le spin du muon précesse à la fréquence de Larmor $\\omega_L = g(e/2m_\\mu)B$, où $g$ est le facteur de Landé que nous cherchons à mesurer. Cette précession module la distribution du temps de désintégration, créant un motif oscillatoire superposé à la désintégration exponentielle.

Le détecteur se compose de quatre scintillateurs couplés à des tubes photomultiplicateurs (PMT), avec des plaques de cuivre de 20 mm positionnées entre les paires de détecteurs supérieures et inférieures. Le cuivre arrête les muons entrants tout en permettant aux positons de plus haute énergie de s'échapper et d'atteindre les détecteurs inférieurs. Deux bobines de Helmholtz génèrent un champ magnétique uniforme dans le volume de détection.

Des discriminateurs transforment les impulsions des PMT en impulsions logiques standard, puis une logique de coïncidence sélectionne les événements : les arrêts de muons valides nécessitent des signaux dans les détecteurs supérieurs mais pas dans les détecteurs inférieurs, tandis que la détection des positons de désintégration nécessite le schéma inverse. Un convertisseur temps-amplitude (TAC) mesure les intervalles à l'échelle de la microseconde entre ces événements, produisant une tension analogique proportionnelle au temps mesuré.`,
        },
        whatIBuilt: {
          en: `The project builds upon work from previous student groups, with each iteration adding new functionality. Our main objectives were to implement graphical analysis of TAC calibration and to develop an interface for controlling the Helmholtz coil power supply.

Day one was spent understanding the hardware and the existing LabVIEW code. We launched our first overnight acquisition but encountered timeout errors the next morning. We traced this to communication issues between LabVIEW and the oscilloscope and reduced the timeout parameter from 50 minutes to 4.8 minutes, which resolved the stability problems.

Day three focused on TAC calibration and data quality. We developed a calibration routine correlating direct oscilloscope timing measurements with TAC voltage outputs. The linear fit yielded a slope of 0.996 ± 0.001 and an intercept of 0.085 ± 0.001 µs, providing the calibration for converting TAC outputs to actual time intervals.

Using Python for rapid prototyping, we developed filtering criteria before implementing them in LabVIEW's graphical environment. In parallel, we worked on the power supply control interface. Initial attempts produced severe current oscillations, requiring systematic tuning of voltage-to-current ratios. We also discovered that the power supply needed about 15 minutes of thermal stabilization and that the teslameter required careful zero calibration before each measurement session.

By day four, we streamlined the interface to essential controls: ON/OFF for the magnetic field, START for data acquisition, and real-time display of field strength. We implemented error handling structures throughout to prevent the crashes that plagued early development.

Both features were added to the existing LabVIEW system: the TAC calibration module runs automatically, and the magnetic field control interface is stable.`,
          fr: `Le projet s'appuie sur les travaux réalisés par les groupes d'étudiants précédents, chaque itération ajoutant de nouvelles fonctionnalités. Nos principaux objectifs étaient de mettre en œuvre l'analyse graphique de l'étalonnage TAC et de développer une interface pour contrôler l'alimentation électrique de la bobine de Helmholtz.

Le premier jour a été consacré à la compréhension du matériel et du code LabVIEW existant. Nous avons lancé notre première acquisition nocturne, mais des erreurs de timeout sont apparues le lendemain matin. Nous avons identifié le problème comme étant lié à des soucis de communication entre LabVIEW et l'oscilloscope et avons réduit le paramètre de timeout de 50 à 4,8 minutes, ce qui a résolu les problèmes de stabilité.

Le troisième jour a été consacré à l'étalonnage du TAC et à la qualité des données. Nous avons développé une routine d'étalonnage corrélant les mesures de synchronisation directes de l'oscilloscope avec les sorties de tension du TAC. L'ajustement linéaire a donné une pente de 0,996 ± 0,001 et une ordonnée à l'origine de 0,085 ± 0,001 µs, fournissant la calibration pour convertir les sorties du TAC en intervalles de temps réels.

À l'aide de Python pour le prototypage rapide, nous avons développé des critères de filtrage avant de les implémenter dans l'environnement graphique de LabVIEW. En parallèle, nous avons travaillé sur l'interface de contrôle de l'alimentation électrique. Les premières tentatives ont produit de fortes oscillations de courant, nécessitant un réglage systématique des rapports tension/courant. Nous avons également découvert que l'alimentation électrique avait besoin d'environ 15 minutes de stabilisation thermique et que le teslamètre nécessitait un étalonnage minutieux du zéro avant chaque session de mesure.

Au quatrième jour, nous avons simplifié l'interface pour ne conserver que les commandes essentielles : ON/OFF pour le champ magnétique, START pour l'acquisition des données et affichage en temps réel de l'intensité du champ. Nous avons mis en place des structures de gestion des erreurs afin d'éviter les plantages qui avaient entravé les premières phases de développement.

Les deux fonctionnalités ont été ajoutées au système LabVIEW existant : le module d'étalonnage du TAC fonctionne automatiquement et l'interface de contrôle du champ magnétique est stable.`,
        },
      },
      kind: 'desktop',
      results: [
        { label: { en: 'TAC calibration slope', fr: 'Pente d\'étalonnage du TAC' }, value: '0.996', uncertainty: '0.001', note: { en: 'intercept 0.085 ± 0.001 µs', fr: 'ordonnée à l\'origine 0.085 ± 0.001 µs' } },
        { label: { en: 'Acquisition timeout', fr: 'Timeout d\'acquisition' }, value: '4.8', unit: 'min', baseline: { value: '50 min', label: { en: 'initial value', fr: 'valeur initiale' } }, note: { en: 'overnight acquisitions stabilized', fr: 'acquisitions nocturnes stabilisées' } },
      ],
      sourceOfSkills: 'academic',
      technologies: ['LabVIEW', 'Python'],
      domains: ['Data Acquisition', 'Instrument Control', 'Particle Physics'],
      keywords: ['labview', 'muons', 'data acquisition', 'instrument control', 'TAC calibration'],
      category: 'academic',
      status: 'completed',
      period: 'M1 - 2024',
      location: 'Université Clermont Auvergne',
      image: '/images/LabVIEW.webp',
      imageAlt: {
        en: 'Example LabVIEW block diagram (illustration, not from this project)',
        fr: 'Exemple de diagramme de blocs LabVIEW (illustration, hors projet)',
      },
      media: [
        {
          src: '/images/LabVIEW.webp',
          alt: { en: 'Example LabVIEW block diagram (illustration, not from this project)', fr: 'Exemple de diagramme de blocs LabVIEW (illustration, hors projet)' },
          caption: { en: 'An example LabVIEW block diagram, not from this project: the graphical programming I used for the TAC calibration module.', fr: 'Un exemple de diagramme de blocs LabVIEW, hors projet : la programmation graphique que j\'ai utilisée pour le module d\'étalonnage du TAC.' },
          credit: { name: 'Aldhair.gsnt', url: 'https://commons.wikimedia.org/wiki/File:Labview_code_example.png' },
          frame: 'figure',
          width: 960,
          height: 416,
          role: 'context',
        },
      ],
      imageCredit: 'Aldhair.gsnt',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Labview_code_example.png',
      textColor: 'black',
      dateCreated: '2024-04-15',
    },
    'muon-lifetime': {
      id: 'muon-lifetime',
      title: 'Muon Lifetime Measurement',
      description: 'Data acquisition with a muon detector and analysis using ROOT to determine muon lifetime.',
      subtitle: 'Measuring Fundamental Particle Properties',
      detailedDescription: 'An experimental physics project measuring the lifetime of muons using scintillator detectors and ROOT-based analysis.',
      technologies: ['ROOT', 'C++'],
      domains: ['Particle Physics', 'Data Analysis'],
      keywords: ['muons', 'root', 'particle physics'],
      category: 'academic',
      status: 'completed',
      period: 'M1 - 2024',
      location: 'Université Clermont Auvergne',
      image: '/images/muon_lifetime.webp',
      imageAlt: 'Feynman diagram illustrating muon decay into electron and neutrinos',
      imageCredit: 'Mrmw',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Muon_Decay.svg',
      visible: false,
      dateCreated: '2024-02-15',
    },
    'saturn-rings': {
      id: 'saturn-rings',
      title: {
        en: "Stability of Saturn's Rings",
        fr: 'Stabilité des anneaux de Saturne',
      },
      description: {
        en: "Study of the dynamic stability and chaotic regime of Saturn's rings.",
        fr: 'Étude de la stabilité dynamique et du régime chaotique des anneaux de Saturne.',
      },
      subtitle: {
        en: 'Studying Orbital Dynamics and Chaos Theory',
        fr: 'Étude de la dynamique orbitale et de la théorie du chaos',
      },
      sections: {
        context: {
          en: `For a three-month project in the chaos theory course, we explored Saturn's rings as a complex dynamical system. We wanted to understand whether the massive ring systems are actually stable over hundreds of millions of years, or if they could eventually disperse.`,
          fr: `Dans le cadre d'un projet de trois mois dans le cours de théorie du chaos, nous avons étudié les anneaux de Saturne en tant que système dynamique complexe. L'objectif était de comprendre si ces systèmes d'anneaux sont réellement stables sur des centaines de millions d'années, ou s'ils pourraient finir par se disperser.`,
        },
        approach: {
          en: `We began by reviewing the historical theories on the composition and dynamics of the rings. Cassini thought they were made of colliding rocks, Laplace argued for solid structures, but Maxwell settled it in 1859 by proving mathematically that only systems of independent particles could remain stable. His work also revealed that these systems are inherently sensitive to initial conditions, which is a hint of chaos theory before Poincaré formalized the concept. We also learned about the Roche limit, which explains how tidal forces can tear apart a moon to create rings in the first place.`,
          fr: `Nous avons commencé par passer en revue les théories historiques sur la composition et la dynamique des anneaux. Cassini pensait qu'ils étaient constitués de roches en collision, Laplace défendait l'hypothèse de structures solides, mais Maxwell a tranché en 1859 en prouvant mathématiquement que seuls des systèmes de particules indépendantes pouvaient rester stables. Ses travaux ont également révélé que ces systèmes sont intrinsèquement sensibles aux conditions initiales, ce qui est un indice de la théorie du chaos avant que Poincaré ne formalise le concept. Nous avons également découvert la limite de Roche, qui explique comment les forces de marée peuvent disloquer une lune pour créer des anneaux.`,
        },
        whatIBuilt: {
          en: `Our computational work focused on modeling the rings as an N-body problem using Python. We implemented Newton's equations, treating the rings as collections of particles interacting with Saturn and its moons. We ran simulations tracking 20 particles over 10-year periods, visualizing their trajectories in 2D and 3D. The results showed clear chaotic behavior with high sensitivity to initial conditions, just like Poincaré predicted for the three-body problem. We did confirm that small changes in particle positions lead to dramatically different long-term evolution.`,
          fr: `Le travail numérique s'est concentré sur la modélisation des anneaux en tant que problème à N corps à l'aide de Python. Nous avons mis en œuvre les équations de Newton, en traitant les anneaux comme des collections de particules interagissant avec Saturne et ses lunes. Nous avons effectué des simulations suivant 20 particules sur des périodes de 10 ans, en visualisant leurs trajectoires en 2D et 3D. Les résultats ont montré un comportement chaotique clair avec une grande sensibilité aux conditions initiales, comme Poincaré l'avait prédit pour le problème à trois corps. Nous avons confirmé que de petits changements dans la position des particules entraînent une évolution à long terme radicalement différente.`,
        },
      },
      limits: {
        en: `We tried calculating Lyapunov exponents to quantify the chaos, but we found this task relatively difficult to implement properly.`,
        fr: `Nous avons essayé de calculer les exposants de Lyapunov pour quantifier le chaos, mais nous avons trouvé cette tâche relativement difficile à mettre en œuvre correctement.`,
      },
      kind: 'analysis',
      sourceOfSkills: 'academic',
      technologies: ['Python', 'NumPy', 'Matplotlib'],
      domains: ['Chaos Theory', 'Celestial Mechanics', 'Simulation'],
      keywords: ['chaos theory', 'N-body problem', 'simulation', 'Lyapunov'],
      category: 'academic',
      status: 'completed',
      period: 'L3 - 2022',
      location: 'Université Clermont Auvergne',
      image: '/images/saturn.webp',
      imageAlt: {
        en: 'Hubble Space Telescope image of Saturn showing its distinctive ring system',
        fr: 'Image du télescope spatial Hubble montrant Saturne et son système d\'anneaux caractéristique',
      },
      media: [
        {
          src: '/images/saturn.webp',
          alt: { en: 'Hubble Space Telescope image of Saturn showing its distinctive ring system', fr: 'Image du télescope spatial Hubble montrant Saturne et son système d\'anneaux caractéristique' },
          credit: { name: 'NASA, ESA, A. Simon, and M.H. Wong', url: 'https://esahubble.org/images/heic1917a/' },
          frame: 'photo',
          role: 'context',
        },
      ],
      imageCredit: 'NASA, ESA, A. Simon, and M.H. Wong',
      imageCreditUrl: 'https://esahubble.org/images/heic1917a/',
      gitHubUrl: "https://github.com/Samuellct/Stability-of-Saturns-rings",
      dateCreated: '2022-12-16',
    },
    'arduino-anemometer': {
      id: 'arduino-anemometer',
      title: 'Arduino-Controlled Anemometer',
      description: 'Design and calibration of a wind-speed measurement system using Arduino.',
      subtitle: 'Designing Precision Wind Measurement Tools',
      detailedDescription: 'A precision wind speed measurement system built with Arduino, featuring sensor calibration and data logging capabilities.',
      technologies: ['Arduino', 'C++'],
      domains: ['IoT', 'Electronics'],
      keywords: ['arduino', 'anemometer', 'sensors', 'wind measurement'],
      category: 'academic',
      status: 'completed',
      period: 'M1 - 2024',
      location: 'Université Clermont Auvergne',
      image: '/images/arduino_M2.webp',
      imageAlt: 'Arduino-based anemometer circuit with wind speed sensor and LCD display',
      visible: false,
      dateCreated: '2024-03-10',
    },
  },
  internship: {
    'internship-m1': {
      id: 'internship-m1',
      title: {
        en: 'Master 1 Internship - LHCb Team',
        fr: 'Stage de Master 1 - Équipe LHCb',
      },
      description: {
        en: 'Study of a rare B meson decay mode at LHCb, one of the four large LHC experiments. Development of data analysis scripts with ROOT for Run 1.',
        fr: 'Étude d\'un mode de désintégration rare du méson B au LHCb, l\'une des quatre grandes expériences du LHC. Développement de scripts d\'analyse de données avec ROOT pour le Run 1.',
      },
      subtitle: {
        en: 'Data analysis of the rare B meson decay into kaon and photon',
        fr: 'Analyse de données de la désintégration rare du méson B en kaon et photon',
      },
      sections: {
        context: {
          en: `During my first year of master's degree, I spent two months at the Clermont Physics Laboratory as part of the LHCb team, working on a rare decay mode of the B meson. I studied B⁺ → K₁⁺γ, which is a process that could reveal physics beyond the Standard Model through the polarization of the emitted photon.`,
          fr: `Au cours de ma première année de master, j'ai passé deux mois au Laboratoire de physique de Clermont au sein de l'équipe LHCb, où j'ai travaillé sur un mode de désintégration rare du méson B. J'ai étudié le processus B⁺ → K₁⁺γ, qui pourrait être un signe de physique au-delà du Modèle standard à travers la polarisation du photon émis.`,
        },
        approach: {
          en: `This internship was my first experience working with large-scale experimental data from LHC Run 1. I worked primarily with ROOT (CERN's data analysis framework) and C++ to filter through the collected events. Starting from samples containing several hundred thousand candidates, the challenge was to reduce this to a manageable dataset while preserving potential signal events.

Most of my time went into building a preselection strategy using simulated data. I studied particle identification variables to distinguish signal from background. For charged particles, the RICH detectors (Cherenkov detectors that identify charged particles) of LHCb produce probability outputs like ProbNNk, which indicates how likely a track is to be a kaon rather than a pion or proton. For photons, I used gammaCL to assess the quality of electromagnetic showers in the calorimeters and reject background noise. I also reconstructed the helicity angle, which relates to the photon's polarization and would eventually help probe for new physics.`,
          fr: `Ce stage a été ma première expérience de travail avec des données expérimentales à grande échelle issues du Run 1 du LHC. J'ai principalement utilisé ROOT (l'environnement d'analyse de données du CERN) et C++ pour filtrer les événements collectés. À partir d'échantillons contenant plusieurs centaines de milliers de candidats, le défi était de réduire l'ensemble à un jeu de données exploitable tout en préservant les événements de signal potentiels.

J'ai consacré la majeure partie de mon temps à élaborer une stratégie de présélection à partir de données simulées. J'ai étudié les variables d'identification des particules afin de distinguer le signal du bruit de fond. Pour les particules chargées, les détecteurs RICH (détecteurs Tcherenkov qui identifient les particules chargées) du LHCb produisent des sorties probabilistes telles que ProbNNk, qui indiquent la probabilité qu'une trace soit un kaon plutôt qu'un pion ou un proton. Pour les photons, j'ai utilisé gammaCL afin d'évaluer la qualité des gerbes électromagnétiques dans les calorimètres et de rejeter le bruit de fond. J'ai également reconstruit l'angle d'hélicité, qui est lié à la polarisation du photon et qui pourrait à terme aider à explorer la nouvelle physique.`,
        },
        whatIBuilt: {
          en: `When I applied this preselection to real Run 1 data, I reduced the dataset by a factor of 30, while maintaining 57% efficiency on simulated signal. I could clearly identify the $\\omega$ meson peak in the data at 783 MeV, validating the reconstruction approach.`,
          fr: `Lorsque j'ai appliqué cette présélection aux données réelles du Run 1, j'ai réduit l'ensemble de données d'un facteur 30, tout en conservant une efficacité de 57 % sur le signal simulé. J'ai pu clairement identifier le pic du méson $\\omega$ dans les données à 783 MeV, validant ainsi l'approche de reconstruction.`,
        },
      },
      limits: {
        en: `The $K_{1}^{+}$ signal was not observed, which is not surprising given the rarity of this decay and the limited Run 1 statistics.`,
        fr: `Le signal $K_{1}^{+}$ n'a pas été observé, ce qui n'est pas surprenant compte tenu de la rareté de cette désintégration et des statistiques limitées du Run 1.`,
      },
      kind: 'research',
      results: [
        { label: { en: 'Data reduction', fr: 'Réduction des données' }, value: '30×', note: { en: 'on real Run 1 data', fr: 'sur les données réelles du Run 1' } },
        { label: { en: 'Signal efficiency', fr: 'Efficacité du signal' }, value: '57', unit: '%', note: { en: 'on simulated signal', fr: 'sur le signal simulé' } },
        { label: { en: 'ω meson peak', fr: 'Pic du méson ω' }, value: '783', unit: 'MeV', note: { en: 'reconstructed in the data', fr: 'reconstruit dans les données' } },
      ],
      sourceOfSkills: 'internship',
      research: {
        lab: { en: 'Clermont Physics Laboratory (LPC)', fr: 'Laboratoire de Physique de Clermont (LPC)' },
        collaboration: 'LHCb',
      },
      technologies: ['ROOT', 'C++'],
      domains: ['Particle Physics', 'Data Analysis'],
      keywords: ['lhcb', 'particle physics', 'root', 'data analysis', 'B meson', 'rare decay'],
      category: 'internship',
      status: 'completed',
      period: { en: 'April - June 2024', fr: 'Avril - Juin 2024' },
      location: { en: 'Clermont Physics Laboratory (LPC)', fr: 'Laboratoire de Physique de Clermont (LPC)' },
      image: '/images/m1Internship.webp',
      imageAlt: {
        en: 'Attempt to Fit the B Meson mass',
        fr: 'Tentative d\'ajustement de la masse du méson B',
      },
      media: [
        {
          src: '/images/m1Internship.webp',
          alt: { en: 'Attempt to Fit the B Meson mass', fr: 'Tentative d\'ajustement de la masse du méson B' },
          caption: { en: 'Fit of the B meson mass (χ²/ndf = 47/24): the K₁⁺ signal was not observed.', fr: 'Ajustement de la masse du méson B (χ²/ndf = 47/24) : le signal K₁⁺ n\'a pas été observé.' },
          frame: 'figure',
          width: 752,
          height: 541,
          role: 'result',
        },
      ],
      gitHubUrl: "https://github.com/Samuellct/Internship-M1-B-meson-decay",
      textColor: 'black',
      dateCreated: '2024-07-05',
    },
    'internship-m2': {
      id: 'internship-m2',
      title: {
        en: 'Master 2 Internship - ATLAS Team',
        fr: 'Stage de Master 2 - Équipe ATLAS',
      },
      description: {
        en: 'Generation and analysis of simulated events to evaluate the feasibility of searches for LLPs at the HL-LHC.',
        fr: 'Génération et analyse d\'événements simulés pour évaluer la faisabilité des recherches de LLP au HL-LHC.',
      },
      subtitle: {
        en: 'Feasibility study of long-lived particle (LLPs) detection at the HL-LHC',
        fr: 'Étude de faisabilité de la détection de particules à longue durée de vie (LLP) au HL-LHC',
      },
      sections: {
        context: {
          en: `During my final master's degree year, I spent five months with the ATLAS collaboration at the Clermont Physics Laboratory. I worked on simulating Long-Lived Particles, a class of particles predicted by several extensions of the Standard Model. Unlike ordinary particles that decay almost instantly near the collision point, LLPs can travel centimeters or even meters through the detector before breaking apart into observable products.`,
          fr: `Au cours de ma dernière année de master, j'ai passé cinq mois au sein de l'équipe ATLAS au Laboratoire de physique de Clermont. J'ai travaillé sur la simulation de particules à longue durée de vie (LLP), une classe de particules prédite par plusieurs extensions du Modèle standard. Contrairement aux particules ordinaires qui se désintègrent presque instantanément près du point de collision, les LLP peuvent parcourir plusieurs centimètres, voire plusieurs mètres, à travers le détecteur avant de se désintégrer en produits observables.`,
        },
        problem: {
          en: `The challenge is that ATLAS wasn't originally designed to catch these delayed signatures. Standard reconstruction algorithms expect particles to decay close to the interaction point, so LLP events often get missed or classified as background noise.`,
          fr: `La difficulté réside dans le fait qu'ATLAS n'a pas été conçu à l'origine pour détecter ces signatures retardées. Les algorithmes de reconstruction standard s'attendent à ce que les particules se désintègrent près du point d'interaction, de sorte que les événements LLP sont souvent manqués ou classés comme bruit de fond.`,
        },
        approach: {
          en: `I used Monte Carlo event generators to simulate thousands of proton-proton collisions at 13.6 TeV. The simulations covered two production mechanisms: *gluon fusion*, which has the highest Higgs boson production rate, and *associated production with W or Z bosons*, which provides cleaner experimental signatures. I tested three different LLP masses (10, 30, and 55 GeV) to understand how the kinematics change across this range.`,
          fr: `J'ai utilisé des générateurs d'événements Monte Carlo pour simuler des milliers de collisions proton-proton à 13,6 TeV. Les simulations couvraient deux mécanismes de production : la *fusion de gluons*, qui présente le taux le plus élevé de production de boson de Higgs, et la *production associée à des bosons W ou Z*, qui fournit des signatures expérimentales plus nettes. J'ai testé trois masses LLP différentes (10, 30 et 55 GeV) afin de comprendre comment la cinématique évolue dans cette gamme.`,
        },
        whatIBuilt: {
          en: `The analysis focused on identifying kinematic patterns in the resulting jets (i.e. narrow showers of particles produced in collisions). I found that a transverse momentum cut at 60 GeV retains 61% of the signal while reducing QCD background to just 7%. The work also had a forward-looking component. ATLAS is being upgraded for the High-Luminosity LHC era with new tracking detectors that will extend coverage into regions currently inaccessible. The simulations showed that this upgrade will capture an additional 16% of signal events that would otherwise be lost.`,
          fr: `L'analyse s'est concentrée sur l'identification de la cinématique dans les jets résultants (i.e. les gerbes étroites de particules produites lors des collisions). J'ai découvert qu'une coupure de l'impulsion transverse à 60 GeV conservait 61 % du signal tout en réduisant le bruit de fond QCD à seulement 7 %. Ce travail comportait également une dimension prospective. ATLAS est en cours de mise à niveau pour l'ère du LHC à haute luminosité, avec de nouveaux détecteurs de trajectoire qui étendront la couverture à des régions actuellement inaccessibles. Les simulations ont montré que cette mise à niveau permettra de capturer 16 % d'événements supplémentaires qui, autrement, seraient perdus.`,
        },
      },
      kind: 'research',
      results: [
        { label: { en: 'Signal efficiency', fr: 'Efficacité du signal' }, value: '61', unit: '%', note: { en: 'at a 60 GeV transverse momentum cut', fr: 'à une coupure de 60 GeV en impulsion transverse' } },
        { label: { en: 'QCD background', fr: 'Bruit de fond QCD' }, value: '7', unit: '%' },
        { label: { en: 'HL-LHC gain', fr: 'Gain HL-LHC' }, value: '+16', unit: '%', note: { en: 'additional signal events captured', fr: 'événements de signal supplémentaires captés' } },
      ],
      sourceOfSkills: 'internship',
      research: {
        lab: { en: 'Clermont Physics Laboratory (LPC)', fr: 'Laboratoire de Physique de Clermont (LPC)' },
        collaboration: 'ATLAS',
      },
      technologies: ['MadGraph5', 'Rivet', 'Docker', 'C++', 'Bash'],
      domains: ['Particle Physics', 'Simulation'],
      keywords: ['atlas', 'long-lived particles', 'hl-lhc', 'simulation', 'bsm physics'],
      category: 'internship',
      status: 'completed',
      period: { en: 'February - July 2025', fr: 'Février - Juillet 2025' },
      location: { en: 'Clermont Physics Laboratory (LPC)', fr: 'Laboratoire de Physique de Clermont (LPC)' },
      gitHubUrl: "https://github.com/Samuellct/Internship-M2-LLP-in-ATLAS",
      image: '/images/m2Internship.webp',
      imageAlt: {
        en: 'Types of LLPs signatures in LHC detectors',
        fr: 'Types de signatures de LLP dans les détecteurs du LHC',
      },
      media: [
        {
          src: '/images/m2Internship.webp',
          alt: { en: 'Types of LLPs signatures in LHC detectors', fr: 'Types de signatures de LLP dans les détecteurs du LHC' },
          caption: { en: 'Possible signatures of long-lived particles in the LHC detectors.', fr: 'Signatures possibles des particules à longue durée de vie dans les détecteurs du LHC.' },
          credit: { name: 'H. Russell', url: 'https://indico.cern.ch/event/607314/contributions/2542309/attachments/1447873/2231444/20170424_LLPs.pdf' },
          frame: 'figure',
          width: 1200,
          height: 854,
          role: 'context',
        },
      ],
      imageCredit: 'H. Russell',
      imageCreditUrl: 'https://indico.cern.ch/event/607314/contributions/2542309/attachments/1447873/2231444/20170424_LLPs.pdf',
      textColor: 'black',
      featured: true,
      dateCreated: '2025-09-17',
    },
  },
}

export const getProjectById = (categoryId: string, projectId: string): ProjectData | null => {
  return projectsData[categoryId]?.[projectId] || null
}

export const getProjectsByCategory = (categoryId: string): ProjectData[] => {
  const categoryProjects = projectsData[categoryId]
  if (!categoryProjects) return []
  return Object.values(categoryProjects).filter((project) => project.visible !== false)
}

export const getAllProjects = (): ProjectData[] => {
  const allProjects: ProjectData[] = []
  Object.keys(projectsData).forEach((categoryId) => {
    Object.values(projectsData[categoryId]).forEach((project) => {
      // Only include projects that are visible
      if (project.visible !== false) {
        allProjects.push(project)
      }
    })
  })
  return allProjects
}

export const getFeaturedProjects = (): ProjectData[] => {
  return getAllProjects().filter((project) => project.featured)
}

// The listing's chronological order (AUDIT-009), the single source for what
// "previous / next" means on a project detail page (AUDIT-019).
export const getProjectsSortedByDate = (): ProjectData[] => {
  return [...getAllProjects()].sort((a, b) => b.dateCreated.localeCompare(a.dateCreated))
}

// Up to `max` related projects for the "connexes" block on a project detail
// page (AUDIT-019): same category first, then most shared technologies,
// ties broken by most recent. Excludes the project itself.
export const getRelatedProjects = (project: ProjectData, max: number = 3): ProjectData[] => {
  return getAllProjects()
    .filter((p) => !(p.category === project.category && p.id === project.id))
    .map((p) => ({
      project: p,
      sameCategory: p.category === project.category,
      sharedTechCount: p.technologies.filter((tech) => project.technologies.includes(tech)).length,
    }))
    .filter((entry) => entry.sameCategory || entry.sharedTechCount > 0)
    .sort((a, b) => {
      if (a.sameCategory !== b.sameCategory) return a.sameCategory ? -1 : 1
      if (b.sharedTechCount !== a.sharedTechCount) return b.sharedTechCount - a.sharedTechCount
      return b.project.dateCreated.localeCompare(a.project.dateCreated)
    })
    .slice(0, max)
    .map((entry) => entry.project)
}

export const getCategoryById = (categoryId: string): CategoryData | undefined => {
  return projectCategories.find((cat) => cat.id === categoryId)
}

export const getAllProjectParams = () => {
  const params: { category: string; id: string }[] = []
  Object.keys(projectsData).forEach((categoryId) => {
    Object.keys(projectsData[categoryId]).forEach((projectId) => {
      const project = projectsData[categoryId][projectId]
      if (project.visible !== false) {
        params.push({ category: categoryId, id: projectId })
      }
    })
  })
  return params
}
