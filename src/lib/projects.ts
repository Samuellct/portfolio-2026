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

export interface ProjectData {
  id: string
  title: BilingualText | string
  description: BilingualText | string
  subtitle?: BilingualText | string
  detailedDescription: BilingualText | string
  technologies: string[]
  domains: string[]
  keywords: string[]
  category: 'personal' | 'academic' | 'internship'
  status: 'completed' | 'in-progress' | 'planned'
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
}

export interface CategoryData {
  id: string
  color: string
  accentColor: string
}

export const projectCategories: CategoryData[] = [
  {
    id: 'personal',
    color: 'from-blue-500 to-cyan-500',
    accentColor: '#00f0ff',
  },
  {
    id: 'academic',
    color: 'from-purple-500 to-violet-500',
    accentColor: '#a855f7',
  },
  {
    id: 'internship',
    color: 'from-green-500 to-emerald-500',
    accentColor: '#10b981',
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
        en: 'Building a Private and Scalable Family Cloud',
        fr: 'Construire un cloud familial privé et évolutif',
      },
      detailedDescription: {
        en: `
I started this project to learn the basics of server administration and virtualization. Instead of buying a ready-made NAS, I repurposed an old PC (AMD A8-7650K, 32GB DDR3 RAM, 400 Gb SSD for system files) to build a "Proof of Concept" system. The goal is to test how different services work together before investing in more expensive hardware.

### My current setup:
I started by installing **Proxmox VE** as the main OS.
- **Storage:** : I installed **TrueNAS** on a Proxmox VM and connected a single 500GB drive to it. This is mainly to get used to the Truenas / ZFS interface. In the future, I plan to install between 15 and 20TB of storage in a RAID-Z1 configuration.
- **Cloud & Media:** : I installed **Nextcloud** and **Jellyfin** on Truenas, one app is dedicated to file sharing (like Google Drive) and the other to streaming movies.
- **Network** : I implemented **Nginx Proxy Manager** to manage reverse proxy logic and connect my services (Nextcloud, Jellyfin) to subdomains of my personal domain so that I can access them from anywhere.

However, I'm starting to hit some limits. Running Proxmox as a base layer might be too heavy for my old PC once several users start streaming or using VMs. I'm currently considering switching to a bare-metal TrueNAS install and building a dedicated machine for virtualization later on. I also plan to add an Arc A380 GPU soon, which will allow Jellyfin to transcode video files on the fly without crushing the CPU.`,
        fr: `
J'ai lancé ce projet afin d'apprendre les bases de l'administration de serveurs et de la virtualisation. Au lieu d'acheter un NAS prêt à l'emploi, j'ai réutilisé un ancien PC (AMD A8-7650K, 32 Go de RAM DDR3, SSD de 400 Go pour les fichiers système) afin de construire un système *Proof of Concept*. L'objectif est de tester le fonctionnement conjoint de différents services avant d'investir dans du matériel plus coûteux.

### Ma configuration actuelle :
J'ai commencé par installer **Proxmox VE** comme OS principal.
- **Stockage :** j'ai installé **TrueNAS** sur une machine virtuelle Proxmox et j'y ai connecté un seul disque dur de 500 Go. Cela m'a principalement permis de me familiariser avec l'interface Truenas / ZFS. À l'avenir, je prévois d'installer entre 15 et 20 To de stockage dans une configuration RAID-Z1.
- **Cloud et médias :** j'ai installé **Nextcloud** et **Jellyfin** sur Truenas, l'une des applications étant dédiée au partage de fichiers (comme Google Drive) et l'autre au streaming de films.
- **Réseau** : j'ai mis en place **Nginx Proxy Manager** pour gérer la logique de reverse proxy et connecter mes services (Nextcloud, Jellyfin) à des sous-domaines de mon domaine personnel afin de pouvoir y accéder depuis n'importe où.

Cependant, je commence à atteindre certaines limites. L'exécution de Proxmox en tant que couche de base risque d'être trop lourde pour mon ancien PC une fois que plusieurs utilisateurs commenceront à utiliser les services proposés. J'envisage actuellement de passer à une installation TrueNAS *bare-metal* et de construire plus tard une machine dédiée à la virtualisation. Je prévois également d'ajouter prochainement un GPU Arc A380, qui permettra à Jellyfin de transcoder des fichiers vidéo à la volée sans saturer le CPU.`,
      },
      technologies: ['Proxmox', 'TrueNAS', 'Nextcloud', 'Jellyfin', 'Nginx Proxy Manager'],
      domains: ['Virtualization', 'Networking', 'Self-hosting'],
      keywords: ['virtualization', 'storage', 'cloud', 'server', 'truenas', 'NAS'],
      category: 'personal',
      status: 'in-progress',
      period: { en: '2025 - Present', fr: '2025 - Présent' },
      location: { en: 'Personal project', fr: 'Projet personnel' },
      image: '/images/Dashboard_Truenas.webp',
      imageAlt: {
        en: 'Truenas dashboard showing virtual machines and server interface',
        fr: 'Tableau de bord TrueNAS affichant les machines virtuelles et l\'interface serveur',
      },
      featured: true,
      textColor: "black",
      dateCreated: '2025-07-15',
    },
    'portfolio-website': {
      id: 'portfolio-website',
      title: { en: 'Portfolio Website', fr: 'Site portfolio' },
      description: {
        en: 'A personal website built with Next.js 15, featuring Three.js effects and SSR.',
        fr: 'Site personnel développé avec Next.js 15, intégrant des effets Three.js et le rendu côté serveur.',
      },
      subtitle: {
        en: 'Presenting my profile and projects in physics and computer science',
        fr: 'Présenter mon profil et mes projets en physique et informatique',
      },
      detailedDescription: {
        en: `I started this portfolio project in 2024 because I wanted a space to present my profile and projects in a less formal way than a CV allows. Building it myself also gave me an opportunity to learn web development progressively while having a concrete goal.

The first version used WordPress, but I quickly found the platform too limiting and heavy for what I needed. In early 2025, I rebuilt everything with Eleventy (V2), which let me work directly with HTML and CSS in a structure I understood well. A few months later, I moved to React with Vite (V3) to learn component-based architecture and client-side rendering, which established the foundation of modern web apps, even though I could see the limits of pure CSR.

By October 2025, I decided to migrate to Next.js 15. The main motivation was to solve the performance gaps I noticed in V3, specifically through server-side rendering and built-in optimizations like image lazy loading. The transition to the App Router architecture required a lot of work and testing to figure out how to move from Vite to this new framework.

The visual design centers on Three.js particle effects. I implemented a wave background using WebGL shaders, which required learning about coordinate transformations and fragment shaders. Getting acceptable performance on mobile devices meant reducing particle counts and implementing proper cleanup to prevent memory leaks. The landing page includes a moving starfield with an animated hyperspace effect that plays on first visit.

Finally, all site text is managed through a centralized JSON file, except for project pages which use Markdown. This structure will simplify adding other languages in the future, since the translation infrastructure is already in place. For content rendering, I integrated react-markdown with KaTeX to support LaTeX equations in project descriptions. This was necessary for properly displaying physics notation without converting everything to images.`,
        fr: `J'ai commencé ce projet de portfolio en 2024, car je souhaitais disposer d'un espace pour présenter mon profil et mes projets de manière moins formelle qu'un CV. Le créer moi-même m'a également donné l'occasion d'apprendre progressivement le développement web tout en ayant un objectif concret.

La première version utilisait WordPress, mais j'ai rapidement trouvé cette plateforme trop restrictive et trop lourde pour mes besoins. Entre fin 2024 et début 2025, j'ai tout reconstruit avec Eleventy (V2), qui m'a permis de travailler directement avec HTML et CSS dans une structure que je comprenais bien. Quelques mois plus tard, je suis passé à React avec Vite (V3) pour apprendre l'architecture basée sur les composants et le rendu côté client, qui ont établi les bases des applications web modernes, même si je pouvais voir les limites du CSR pur.

A partir d'octobre 2025, j'ai décidé de migrer vers Next.js 15. Ma principale motivation était de résoudre les problèmes de performances que j'avais remarqués dans la V3, notamment grâce au rendu côté serveur et à des optimisations intégrées telles que le chargement différé des images. La transition vers l'architecture App Router a nécessité beaucoup de travail et de tests pour comprendre comment passer de Vite à ce nouveau framework.

La conception visuelle est centrée sur les effets de particules Three.js. Pour obtenir des performances acceptables sur les appareils mobiles, il a fallu réduire le nombre de particules et mettre en place un nettoyage approprié afin d'éviter les fuites de mémoire. La page d'accueil comprend un champ d'étoiles en mouvement avec un effet d'hyperspace animé qui s'affiche lors de la première visite.

Enfin, tout le texte du site est géré via un fichier JSON centralisé, à l'exception des pages de projet qui utilisent Markdown. Cette structure simplifie l'ajout d'autres langues à l'avenir, puisque l'infrastructure de traduction est déjà en place. Pour le rendu du contenu, j'ai intégré react-markdown avec KaTeX afin de prendre en charge les équations LaTeX dans les descriptions de projet.`,
      },
      technologies: ['Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Three.js', 'GSAP'],
      domains: ['Web Development', 'Frontend'],
      keywords: ['portfolio', 'frontend', 'typescript', 'nextjs', 'threejs', 'webgl'],
      category: 'personal',
      status: 'in-progress',
      period: { en: '2024 - Present', fr: '2024 - Présent' },
      location: { en: 'Personal project', fr: 'Projet personnel' },
      image: '/images/portfolioWebsite.webp',
      imageAlt: { en: 'Front page of my website', fr: 'Page d\'accueil de mon site web' },
      gitHubUrl: "https://github.com/Samuellct/portfolio-2026",
      dateCreated: '2025-02-15',
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
        en: "Presentation of data filtering process applied to HL-LHC simulated data to estimate the presence of an 'X boson'.",
        fr: "Présentation du processus de filtrage de données appliqué aux données simulées du HL-LHC pour estimer la présence d'un « boson X ».",
      },
      subtitle: {
        en: 'Searching for New Particles in Simulated LHC Data',
        fr: 'Recherche de nouvelles particules dans les données simulées du LHC',
      },
      detailedDescription: {
        en: `During my third year of bachelor's degree, I worked on a particle physics analysis that simulated the search for a hypothetical *X boson* decaying into two photons.

While I was familiar with Python and libraries like Pandas or SciPy, applying them to physics analysis required a different approach. We needed to optimize selection cuts on variables like photon isolation and transverse momentum to separate the signal from Standard Model background noise. The cuts had to be precise: too strict and we'd lose signal events, too loose and the background would dominate. Through this trial-and-error process, we managed to reduce background by a factor of 40 while retaining most signal events.

After establishing the selection criteria on simulated samples, we moved to statistical analysis. We fitted the invariant mass spectrum background with an exponential function to see if a local excess appeared, which would indicate a new particle. Our dataset of observed data showed no evidence of the X boson, with a significance of only $0.5~\\sigma$, consistent with statistical fluctuation.

Following the CLs method, we determined that we could exclude signals of strength above $0.3736~\\mu$, corresponding to an effective cross-section ($\\sigma$) of approximately $2.017~\\text{pb}$. This upper limit means that if a signal does exist, it will necessarily be smaller than $2.017~\\text{pb}$.`,
        fr: `Au cours de ma troisième année de licence, j'ai travaillé sur une analyse de physique des particules qui simulait la recherche d'un *boson X* hypothétique se désintégrant en deux photons.

Bien que je connaisse bien Python et des bibliothèques telles que Pandas ou SciPy, leur application à l'analyse de données était nouveau pour moi. Nous devions optimiser les critères de sélection sur des variables telles que la *photon isolation* (variable permettant de séparer les vrais photons de ceux étant des produits de désintégration) et *l'impulsion transverse* afin de séparer le signal du bruit de fond du modèle standard. Les critères devaient être précis : trop stricts, nous perdions des événements de signal, trop laxistes, le bruit de fond dominait. Grâce à ce processus d'essais et d'erreurs, nous avons réussi à réduire le bruit de fond d'un facteur 40 tout en conservant la plupart des événements de signal.

Après avoir établi les critères de sélection sur des échantillons simulés, nous sommes passés à l'analyse statistique. Le fond du spectre de masse invariante a été ajusté par une fonction exponentielle afin de détecter un éventuel excès local, ce qui indiquerait une nouvelle particule. Notre ensemble de données observées n'a montré aucune preuve de l'existence du boson X, avec une signification de seulement $0.5~\\sigma$, ce qui correspond à une fluctuation statistique.

En suivant la méthode CLs, nous avons déterminé que nous pouvions exclure les signaux d'une intensité supérieure à $0.3736~\\mu$, ce qui correspond à une section efficace ($\\sigma$) d'environ $2.017~\\text{pb}$. Cette limite supérieure signifie que si un signal existe, il sera nécessairement inférieur à $2.017~\\text{pb}$.`,
      },
      technologies: ['Python', 'NumPy', 'Matplotlib', "Pandas", "Scipy"],
      domains: ['Particle Physics', 'Data Analysis', 'Simulation'],
      keywords: ['physics', 'statistics', 'python', 'simulation'],
      category: 'academic',
      status: 'completed',
      period: 'L3 - 2023',
      location: 'Université Clermont Auvergne',
      image: '/images/data_analysis.webp',
      imageAlt: {
        en: 'The Compact Muon Solenoid (CMS) experiment in the Large Hadron Collider (LHC) at CERN.',
        fr: 'L\'expérience Compact Muon Solenoid (CMS) dans le Grand collisionneur de hadrons (LHC) au CERN.',
      },
      imageCredit: 'SimonWaldherr',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:CERN_LHC_CMS_08.jpg',
      gitHubUrl: 'https://github.com/Samuellct/ATLAS-basic-particle-search-workflow',
      dateCreated: '2024-09-17',
    },
    'ising-model': {
      id: 'ising-model',
      title: 'Ising Model',
      description: 'Study of the Ising model with a Python simulation of the two-dimensional case.',
      subtitle: 'Simulating Phase Transitions in Magnetic Systems',
      detailedDescription: 'This project explores the Ising model, a fundamental model in statistical mechanics for understanding phase transitions in magnetic systems. The simulation uses Monte Carlo methods to study the behavior of a 2D spin lattice.',
      technologies: ['Python', 'NumPy', 'Matplotlib', "Scipy"],
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
        en: "Python simulation of Shor's algorithm using the Cirq library to break RSA encryption.",
        fr: "Simulation Python de l'algorithme de Shor à l'aide de la bibliothèque Cirq pour casser le chiffrement RSA.",
      },
      subtitle: {
        en: 'Principles of Quantum Computing and Application to Cryptographic Algorithms',
        fr: 'Principes de l\'informatique quantique et application aux algorithmes cryptographiques',
      },
      detailedDescription: {
        en: `This project was carried out as part of my Quantum Mechanics course during my first year of Master's. Working alongside two classmates, we studied the principles of quantum computing and their implications for modern cryptography. Our goal was to understand how qubits, quantum gates, and quantum circuits work, and then apply this knowledge to a real-world problem: breaking RSA encryption using Shor's algorithm.

We started by building a strong theoretical foundation. We studied superposition, entanglement, and the Bloch sphere representation, then moved on to quantum gates like Hadamard, Pauli-X, and CNOT, as well as the Quantum Fourier Transform. Once we felt comfortable with the basics, we implemented RSA encryption in Python using both a simple version with SymPy and a more robust one with the cryptography library. We wanted to see firsthand how asymmetric encryption works before attempting to crack it.

The most challenging part was implementing Shor's algorithm for integer factorization. We started with IBM's Qiskit framework, but we struggled with how the library handled the modular exponentiation gate and the circuit optimization. After many weeks of troubleshooting, we decided to switch to Google's Cirq library, which gave us more direct control over the gate decomposition. With Cirq, we were finally able to build a working simulation.

The algorithm worked well for small numbers, but we quickly hit memory limitations for numbers larger than five digits. This makes sense because simulating n qubits requires storing $2^{n}$ complex numbers in memory, so the requirements explode exponentially. We also got a taste of why researchers are now developing new encryption methods that could resist quantum attacks. These "post-quantum" algorithms rely on mathematical problems that even quantum computers would struggle with, like finding short vectors in high-dimensional lattices.`,
        fr: `Ce projet a été réalisé dans le cadre du cours de mécanique quantique pendant ma première année de master. En collaboration avec deux camarades, nous avons étudié les principes de l'informatique quantique et leurs implications pour la cryptographie moderne. Notre objectif était de comprendre le fonctionnement des qubits, des portes quantiques et des circuits quantiques, puis d'appliquer ces connaissances à un problème concret : casser le cryptage RSA à l'aide de l'algorithme de Shor.

Nous avons commencé par établir une base théorique solide. Nous avons étudié la superposition, l'intrication et la représentation de la sphère de Bloch, puis nous sommes passés aux portes quantiques telles que Hadamard, Pauli-X et CNOT, ainsi qu'à la transformée de Fourier quantique. Une fois que nous nous sommes familiarisés avec les bases, nous avons implémenté le cryptage RSA en Python en utilisant à la fois une version simple avec SymPy et une version plus robuste avec la bibliothèque *cryptography*. L'objectif était de voir concrètement le fonctionnement du chiffrement asymétrique avant de tenter de le casser.

La partie la plus difficile a été la mise en œuvre de l'algorithme de Shor pour la factorisation des nombres entiers. Nous avons commencé avec le framework Qiskit d'IBM, mais nous avons rencontré des difficultés avec la manière dont la bibliothèque gérait les portes quantiques complexes et l'optimisation des circuits. Après plusieurs semaines de débogage, nous avons décidé de passer à la bibliothèque Cirq de Google, qui nous offrait un contrôle plus direct sur la décomposition des portes. Avec Cirq, nous avons enfin pu créer une simulation fonctionnelle.

L'algorithme a bien fonctionné pour les petits nombres, mais nous avons rapidement atteint les limites de mémoire pour les nombres supérieurs à cinq chiffres. C'est logique, car la simulation de n qubits nécessite de stocker $2^{n}$ nombres complexes en mémoire, ce qui fait exploser les besoins de manière exponentielle. Nous avons également compris pourquoi les chercheurs développent actuellement de nouvelles méthodes de cryptage capables de résister aux attaques quantiques. Ces algorithmes *post-quantiques* s'appuient sur des problèmes mathématiques que même les ordinateurs quantiques auraient du mal à résoudre, comme la recherche de vecteurs courts (SVP) dans des réseaux de grande dimension.`,
      },
      technologies: ['Python', 'Qiskit', 'Cirq', 'Sympy'],
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
      imageCredit: 'Google',
      gitHubUrl: 'https://github.com/Samuellct/Cirq-Quantum-Cryptography-Demo',
      featured: true,
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
      gitHubUrl: 'https://gitlab.com/samuel.lecomte37/arduino-weather-station',
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
        en: 'LabVIEW interface for muon detector control and TAC calibration routines.',
        fr: 'Interface LabVIEW pour le contrôle du détecteur de muons et les routines de calibration du TAC.',
      },
      subtitle: {
        en: 'Real-Time Particle Detection and Analysis',
        fr: 'Détection et analyse de particules en temps réel',
      },
      detailedDescription: {
        en: `During a week-long project in March 2024, I worked with a team of two other students to develop additional LabVIEW functionality for an existing muon Landé g-factor measurement system. This project was primarily a practical introduction to instrument control and data acquisition programming, with the physics experiment serving as a context for learning LabVIEW development.

**Physical basis**

Atmospheric muons originate from cosmic ray interactions at an altitude of around 15 km, arriving at ground level with a flux of roughly 1 muon per $\\text{cm}^{2}$ per minute. These particles have a rest-frame lifetime of 2.2 microseconds and decay via the weak interaction: $\\mu^+ \\rightarrow e^+ + \\nu_e + \\bar{\\nu}_\\mu$. The key property we exploit is spin polarization. Due to parity violation in weak interactions, the decay antielectron is preferentially emitted along the muon's spin direction at the moment of decay.

When placed in a magnetic field $\\vec{B}$, the muon spin precesses at the Larmor frequency $\\omega_L = g(e/2m_\\mu)B$, where $g$ is the Landé factor we aim to measure. This precession modulates the decay time distribution, creating an oscillatory pattern superimposed on the exponential decay.

**Experimental Setup**

The detector consists of four plastic scintillators coupled to photomultiplier tubes (PMT), with 20 mm of copper plates positioned between the upper and lower detector pairs. The copper stops incoming muons while allowing higher-energy decay positrons to escape and reach the lower detectors. Two Helmholtz coils (1 meter diameter, field-to-current ratio of 302 µT/A) generate the uniform magnetic field in the detection volume.

Signals from the PMT pass through constant fraction discriminators that convert the variable-amplitude pulses into standardized logic pulses with fixed timing and duration. Coincidence logic gates implement event selection: valid muon stops require signals in the upper detectors but not in the lower ones, while decay positron detection requires the opposite pattern. A Time-to-Amplitude Converter (TAC) measures the microsecond-scale intervals between these events, outputting an analog voltage proportional to the measured time.

**Our development work**

The project builds upon work from previous student groups, with each iteration adding new functionality. Our main objectives were to implement graphical analysis of TAC calibration and to develop an interface for controlling the Helmholtz coil power supply.

Day one was spent understanding the hardware and the existing LabVIEW code. We launched our first overnight acquisition but encountered timeout errors the next morning. We traced this to communication issues between LabVIEW and the oscilloscope and reduced the timeout parameter from 50 minutes to 4.8 minutes, which resolved the stability problems.

Day three focused on TAC calibration and data quality. We developed a calibration routine correlating direct oscilloscope timing measurements with TAC voltage outputs. The linear fit yielded a slope of 0.996 ± 0.001 and an intercept of 0.085 ± 0.001 µs, providing the calibration for converting TAC outputs to actual time intervals.

Using Python for rapid prototyping, we developed filtering criteria before implementing them in LabVIEW's graphical environment. In parallel, we worked on the power supply control interface. Initial attempts produced severe current oscillations, requiring systematic tuning of voltage-to-current ratios. We also discovered that the power supply needed about 15 minutes of thermal stabilization and that the teslameter required careful zero calibration before each measurement session.

By day four, we streamlined the interface to essential controls: ON/OFF for the magnetic field, START for data acquisition, and real-time display of field strength. We implemented error handling structures throughout to prevent the crashes that plagued early development.

**Results**

We successfully added the requested functionality to the existing LabVIEW system. The TAC calibration module now operates automatically, and the magnetic field control interface works stably.

Previous acquisitions by earlier student groups had demonstrated the system's capability, collecting datasets of $\\sim 80,000$ events that yielded muon lifetime of $\\tau_{\\mu^+} = (2.19 \\pm 0.03)~\\mu\\text{s}$ and clear Larmor precession signals at 4 mT.`,
        fr: `Au cours d'un projet d'une semaine en mars 2024, j'ai travaillé avec une équipe de deux autres étudiants afin de développer des fonctionnalités LabVIEW supplémentaires pour un système existant de mesure du facteur de Landé des muons. Ce projet consistait principalement en une introduction pratique à la programmation du contrôle des instruments et de l'acquisition de données, l'expérience physique servant de contexte pour l'apprentissage du développement LabVIEW.

**Bases physiques**

Les muons atmosphériques proviennent des interactions des rayons cosmiques à une altitude d'environ 15 km et atteignent le sol avec un flux d'environ 1 muon par $\\text{cm}^{2}$ par minute. Ces particules ont une durée de vie de 2,2 microsecondes et se désintègrent par interaction faible : $\\mu^+ \\rightarrow e^+ + \\nu_e + \\bar{\\nu}_\\mu$. La propriété clé que nous exploitons est la polarisation du spin. En raison de la violation de parité dans les interactions faibles, l'anti-électron issu de la désintégration est émis de préférence dans la direction du spin du muon au moment de la désintégration.

Lorsqu'il est placé dans un champ magnétique $\\vec{B}$, le spin du muon précesse à la fréquence de Larmor $\\omega_L = g(e/2m_\\mu)B$, où $g$ est le facteur de Landé que nous cherchons à mesurer. Cette précession module la distribution du temps de désintégration, créant un motif oscillatoire superposé à la désintégration exponentielle.

**Montage expérimental**

Le détecteur se compose de quatre scintillateurs couplés à des tubes photomultiplicateurs (PMT), avec des plaques de cuivre de 20 mm positionnées entre les paires de détecteurs supérieures et inférieures. Le cuivre arrête les muons entrants tout en permettant aux positons de plus haute énergie de s'échapper et d'atteindre les détecteurs inférieurs. Deux bobines de Helmholtz génèrent un champ magnétique uniforme dans le volume de détection.

Les signaux provenant des PMT passent par des discriminateurs à fraction constante qui convertissent les impulsions d'amplitude variable en impulsions logiques standardisées avec une durée et un timing fixes. Des portes logiques mettent en œuvre la sélection des événements : les arrêts de muons valides nécessitent des signaux dans les détecteurs supérieurs mais pas dans les détecteurs inférieurs, tandis que la détection des positons de désintégration nécessite le schéma inverse. Un convertisseur temps-amplitude (TAC) mesure les intervalles à l'échelle de la microseconde entre ces événements, produisant une tension analogique proportionnelle au temps mesuré.

**Notre travail de développement**

Le projet s'appuie sur les travaux réalisés par les groupes d'étudiants précédents, chaque itération ajoutant de nouvelles fonctionnalités. Nos principaux objectifs étaient de mettre en œuvre l'analyse graphique de l'étalonnage TAC et de développer une interface pour contrôler l'alimentation électrique de la bobine de Helmholtz.

Le premier jour a été consacré à la compréhension du matériel et du code LabVIEW existant. Nous avons lancé notre première acquisition nocturne, mais des erreurs de timeout sont apparues le lendemain matin. Nous avons identifié le problème comme étant lié à des soucis de communication entre LabVIEW et l'oscilloscope et avons réduit le paramètre de timeout de 50 à 4,8 minutes, ce qui a résolu les problèmes de stabilité.

Le troisième jour a été consacré à l'étalonnage du TAC et à la qualité des données. Nous avons développé une routine d'étalonnage corrélant les mesures de synchronisation directes de l'oscilloscope avec les sorties de tension du TAC. L'ajustement linéaire a donné une pente de 0,996 ± 0,001 et une ordonnée à l'origine de 0,085 ± 0,001 µs, fournissant la calibration pour convertir les sorties du TAC en intervalles de temps réels.

À l'aide de Python pour le prototypage rapide, nous avons développé des critères de filtrage avant de les implémenter dans l'environnement graphique de LabVIEW. En parallèle, nous avons travaillé sur l'interface de contrôle de l'alimentation électrique. Les premières tentatives ont produit de fortes oscillations de courant, nécessitant un réglage systématique des rapports tension/courant. Nous avons également découvert que l'alimentation électrique avait besoin d'environ 15 minutes de stabilisation thermique et que le teslamètre nécessitait un étalonnage minutieux du zéro avant chaque session de mesure.

Au quatrième jour, nous avons simplifiée l'interface pour ne conserver que les commandes essentielles : ON/OFF pour le champ magnétique, START pour l'acquisition des données et affichage en temps réel de l'intensité du champ. Nous avons mis en place des structures de gestion des erreurs afin d'éviter les plantages qui avaient entravé les premières phases de développement.

**Résultats**

Nous avons ajouté avec succès la fonctionnalité demandée au système LabVIEW existant. Le module d'étalonnage TAC fonctionne désormais automatiquement et l'interface de contrôle du champ magnétique fonctionne de manière stable.

Les acquisitions précédentes réalisées par des groupes d'étudiants antérieurs avaient démontré les capacités du système, en collectant des ensembles de données de 80 000 événements qui ont permis d'obtenir une durée de vie du muon de 2,19 ± 0,03 μs et des signaux de précession de Larmor clairs à 4 mT.`,
      },
      technologies: ['LabVIEW', 'Python'],
      domains: ['Data Acquisition', 'Instrument Control', 'Particle Physics'],
      keywords: ['labview', 'muons', 'data acquisition', 'instrument control', 'TAC calibration'],
      category: 'academic',
      status: 'completed',
      period: 'M1 - 2024',
      location: 'Université Clermont Auvergne',
      image: '/images/LabVIEW.webp',
      imageAlt: {
        en: 'LabVIEW block diagram showing data acquisition and signal processing workflow',
        fr: 'Diagramme de blocs LabVIEW illustrant le flux d\'acquisition de données et de traitement du signal',
      },
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
      gitHubUrl: 'https://gitlab.com/samuel.lecomte37/muon-lifetime-analysis',
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
      detailedDescription: {
        en: `For a three-month project in the chaos theory course, we explored Saturn's rings as a complex dynamical system. We wanted to understand whether the massive ring systems are actually stable over hundreds of millions of years, or if they could eventually disperse.

We began by reviewing the historical theories on the composition and dynamics of the rings. Cassini thought they were made of colliding rocks, Laplace argued for solid structures, but Maxwell settled it in 1859 by proving mathematically that only systems of independent particles could remain stable. His work also revealed that these systems are inherently sensitive to initial conditions, which is a hint of chaos theory before Poincaré formalized the concept. We also learned about the Roche limit, which explains how tidal forces can tear apart a moon to create rings in the first place.

Our computational work focused on modeling the rings as an N-body problem using Python. We implemented Newton's equations, treating the rings as collections of particles interacting with Saturn and its moons. We ran simulations tracking 20 particles over 10-year periods, visualizing their trajectories in 2D and 3D. The results showed clear chaotic behavior with high sensitivity to initial conditions, just like Poincaré predicted for the three-body problem. We tried calculating Lyapunov exponents to quantify the chaos, but we found this task relatively difficult to implement properly. What we did confirm is that small changes in particle positions lead to dramatically different long-term evolution. The whole project connected classical celestial mechanics with chaos theory, showing that even though Saturn's rings appear stable now, their behavior over geological timescales is fundamentally unpredictable.`,
        fr: `Dans le cadre d'un projet de trois mois dans le cours de théorie du chaos, nous avons étudié les anneaux de Saturne en tant que système dynamique complexe. L'objectif était de comprendre si ces systèmes d'anneaux sont réellement stables sur des centaines de millions d'années, ou s'ils pourraient finir par se disperser.

Nous avons commencé par passer en revue les théories historiques sur la composition et la dynamique des anneaux. Cassini pensait qu'ils étaient constitués de roches en collision, Laplace défendait l'hypothèse de structures solides, mais Maxwell a tranché en 1859 en prouvant mathématiquement que seuls des systèmes de particules indépendantes pouvaient rester stables. Ses travaux ont également révélé que ces systèmes sont intrinsèquement sensibles aux conditions initiales, ce qui est un indice de la théorie du chaos avant que Poincaré ne formalise le concept. Nous avons également découvert la limite de Roche, qui explique comment les forces de marée peuvent disloquer une lune pour créer des anneaux. 

Le travail numérique s'est concentré sur la modélisation des anneaux en tant que problème à N corps à l'aide de Python. Nous avons mis en œuvre les équations de Newton, en traitant les anneaux comme des collections de particules interagissant avec Saturne et ses lunes. Nous avons effectué des simulations suivant 20 particules sur des périodes de 10 ans, en visualisant leurs trajectoires en 2D et 3D. Les résultats ont montré un comportement chaotique clair avec une grande sensibilité aux conditions initiales, comme Poincaré l'avait prédit pour le problème à trois corps. Nous avons essayé de calculer les exposants de Lyapunov pour quantifier le chaos, mais nous avons trouvé cette tâche relativement difficile à mettre en œuvre correctement. Ce que nous avons confirmé, c'est que de petits changements dans la position des particules entraînent une évolution à long terme radicalement différente. L'ensemble du projet a établi un lien entre la mécanique céleste classique et la théorie du chaos, montrant que même si les anneaux de Saturne semblent stables aujourd'hui, leur comportement à l'échelle géologique est fondamentalement imprévisible.`,
      },
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
        fr: 'Stage de Master 1 — Équipe LHCb',
      },
      description: {
        en: 'Study of a rare B meson decay mode. Development of data analysis scripts with ROOT for LHCb Run I.',
        fr: 'Étude d\'un mode de désintégration rare du méson B. Développement de scripts d\'analyse de données avec ROOT pour le Run I du LHCb.',
      },
      subtitle: {
        en: 'Data analysis of the rare B meson decay into Kaon and photon',
        fr: 'Analyse de données de la désintégration rare du méson B en Kaon et photon',
      },
      detailedDescription: {
        en: `During my first year of master's degree, I spent two months at the Clermont Physics Laboratory as part of the LHCb team, working on a rare decay mode of the B meson. I studied $B^{+} \\to K_{1}^{+}\\gamma$, which is a process that could reveal physics beyond the Standard Model through the polarization of the emitted photon.

This internship was my first experience working with large-scale experimental data from LHC Run 1. I worked primarily with ROOT and C++ to filter through the collected events. Starting from samples containing several hundred thousand candidates, the challenge was to reduce this to a manageable dataset while preserving potential signal events.

Most of my time went into building a preselection strategy using simulated data. I studied particle identification variables to distinguish signal from background. For charged particles, the RICH detectors of LHCb produce probability outputs like ProbNNk, which indicates how likely a track is to be a kaon rather than a pion or proton. For photons, I used gammaCL to assess the quality of electromagnetic showers in the calorimeters and reject background noise. I also reconstructed the helicity angle, which relates to the photon's polarization and would eventually help probe for new physics.

When I applied this preselection to real Run 1 data, I reduced the dataset by a factor of 30, while maintaining 57% efficiency on simulated signal. I could clearly identify the $\\omega$ meson peak in the data at 783 MeV, validating the reconstruction approach. However, the $K_{1}^{+}$ signal remained elusive, which wasn't surprising given the rarity of this decay and limited Run 1 statistics. The work establishes a foundation for fuller analysis with Run 2 and Run 3 data.`,
        fr: `Au cours de ma première année de master, j'ai passé deux mois au Laboratoire de physique de Clermont au sein de l'équipe LHCb, où j'ai travaillé sur un mode de désintégration rare du méson B. J'ai étudié le processus $B^{+} \\to K_{1}^{+}\\gamma$, qui pourrait être un signe de physique au-delà du Modèle standard à travers la polarisation du photon émis.

Ce stage a été ma première expérience de travail avec des données expérimentales à grande échelle issues du Run 1 du LHC. J'ai principalement utilisé ROOT et C++ pour filtrer les événements collectés. À partir d'échantillons contenant plusieurs centaines de milliers de candidats, le défi était de réduire l'ensemble à un jeu de données exploitable tout en préservant les événements de signal potentiels.

J'ai consacré la majeure partie de mon temps à élaborer une stratégie de présélection à partir de données simulées. J'ai étudié les variables d'identification des particules afin de distinguer le signal du bruit de fond. Pour les particules chargées, les détecteurs RICH du LHCb produisent des sorties probabilistes telles que ProbNNk, qui indiquent la probabilité qu'une trace soit un kaon plutôt qu'un pion ou un proton. Pour les photons, j'ai utilisé gammaCL afin d'évaluer la qualité des gerbes électromagnétiques dans les calorimètres et de rejeter le bruit de fond. J'ai également reconstruit l'angle d'hélicité, qui est lié à la polarisation du photon et qui pourrait à terme aider à explorer la nouvelle physique.

Lorsque j'ai appliqué cette présélection aux données réelles du Run 1, j'ai réduit l'ensemble de données d'un facteur 30, tout en conservant une efficacité de 57 % sur le signal simulé. J'ai pu clairement identifier le pic du méson $\\omega$ dans les données à 783 MeV, validant ainsi l'approche de reconstruction. Cependant, le signal $K_{1}^{+}$ est resté insaisissable, ce qui n'était pas surprenant compte tenu de la rareté de cette désintégration et des statistiques limitées du Run 1. Ce travail jette les bases d'une analyse plus complète avec les données des Run 2 et Run 3.`,
      },
      technologies: ['ROOT', 'C++'],
      domains: ['Particle Physics', 'Data Analysis'],
      keywords: ['lhcb', 'particle physics', 'root', 'data analysis', 'B meson', 'rare decay'],
      category: 'internship',
      status: 'completed',
      period: { en: 'April - June 2024', fr: 'Avril - Juin 2024' },
      location: 'LPCA',
      image: '/images/m1Internship.webp',
      imageAlt: {
        en: 'Attempt to Fit the B Meson mass',
        fr: 'Tentative d\'ajustement de la masse du méson B',
      },
      featured: true,
      gitHubUrl: "https://github.com/Samuellct/Internship-M1-B-meson-decay",
      textColor: 'black',
      dateCreated: '2024-07-05',
    },
    'internship-m2': {
      id: 'internship-m2',
      title: {
        en: 'Master 2 Internship - ATLAS Team',
        fr: 'Stage de Master 2 — Équipe ATLAS',
      },
      description: {
        en: 'Generation and analysis of simulated events to evaluate the feasibility of searches for LLPs at the HL-LHC.',
        fr: 'Génération et analyse d\'événements simulés pour évaluer la faisabilité des recherches de LLP au HL-LHC.',
      },
      subtitle: {
        en: 'Feasibility study of long-lived particle (LLPs) detection at the HL-LHC',
        fr: 'Étude de faisabilité de la détection de particules à longue durée de vie (LLP) au HL-LHC',
      },
      detailedDescription: {
        en: `During my final master's degree year, I spent five months with the ATLAS collaboration at the Clermont Physics Laboratory. I worked on simulating Long-Lived Particles, a class of particles predicted by several extensions of the Standard Model. Unlike ordinary particles that decay almost instantly near the collision point, LLPs can travel centimeters or even meters through the detector before breaking apart into observable products.

The challenge is that ATLAS wasn't originally designed to catch these delayed signatures. Standard reconstruction algorithms expect particles to decay close to the interaction point, so LLP events often get missed or classified as background noise.

I used Monte Carlo event generators to simulate thousands of proton-proton collisions at 13.6 TeV. The simulations covered two production mechanisms: *gluon fusion*, which has the highest rate, and *associated production with W or Z bosons*, which provides cleaner experimental signatures. I tested three different LLP masses (10, 30, and 55 GeV) to understand how the kinematics change across this range.

The analysis focused on identifying kinematic patterns in the resulting jets (i.e. narrow showers of particles produced in collisions). I found that a transverse momentum cut at 60 GeV retains 61% of the signal while reducing QCD background to just 7%. The work also had a forward-looking component. ATLAS is being upgraded for the High-Luminosity LHC era with new tracking detectors that will extend coverage into regions currently inaccessible. The simulations showed that this upgrade will capture an additional 16% of signal events that would otherwise be lost.`,
        fr: `Au cours de ma dernière année de master, j'ai passé cinq mois au sein de l'équipe ATLAS au Laboratoire de physique de Clermont. J'ai travaillé sur la simulation de particules à longue durée de vie (LLP), une classe de particules prédite par plusieurs extensions du Modèle standard. Contrairement aux particules ordinaires qui se désintègrent presque instantanément près du point de collision, les LLP peuvent parcourir plusieurs centimètres, voire plusieurs mètres, à travers le détecteur avant de se désintégrer en produits observables.

La difficulté réside dans le fait qu'ATLAS n'a pas été conçu à l'origine pour détecter ces signatures retardées. Les algorithmes de reconstruction standard s'attendent à ce que les particules se désintègrent près du point d'interaction, de sorte que les événements LLP sont souvent manqués ou classés comme bruit de fond.

J'ai utilisé des générateurs d'événements Monte Carlo pour simuler des milliers de collisions proton-proton à 13,6 TeV. Les simulations couvraient deux mécanismes de production : la *fusion de gluons*, qui présente le taux le plus élevé de production de boson de Higgs, et la *production associée à des bosons W ou Z*, qui fournit des signatures expérimentales plus nettes. J'ai testé trois masses LLP différentes (10, 30 et 55 GeV) afin de comprendre comment la cinématique évolue dans cette gamme.

L'analyse s'est concentrée sur l'identification de la cinématique dans les jets résultants (i.e. les gerbes étroites de particules produites lors des collisions). J'ai découvert qu'une coupure de l'impulsion transverse à 60 GeV conservait 61 % du signal tout en réduisant le bruit de fond QCD à seulement 7 %. Ce travail comportait également une dimension prospective. ATLAS est en cours de mise à niveau pour l'ère du LHC à haute luminosité, avec de nouveaux détecteurs de trajectoire qui étendront la couverture à des régions actuellement inaccessibles. Les simulations ont montré que cette mise à niveau permettra de capturer 16 % d'événements supplémentaires qui, autrement, seraient perdus.`,
      },
      technologies: ['MadGraph', 'Rivet', 'Docker', 'C++', 'Bash'],
      domains: ['Particle Physics', 'Simulation'],
      keywords: ['atlas', 'long-lived particles', 'hl-lhc', 'simulation', 'bsm physics'],
      category: 'internship',
      status: 'completed',
      period: { en: 'February - July 2025', fr: 'Février - Juillet 2025' },
      location: 'LPCA',
      gitHubUrl: "https://github.com/Samuellct/Internship-M2-LLP-in-ATLAS",
      image: '/images/m2Internship.webp',
      imageAlt: {
        en: 'Types of LLPs signatures in LHC detectors',
        fr: 'Types de signatures de LLP dans les détecteurs du LHC',
      },
      imageCredit: 'H. Russell',
      imageCreditUrl: 'https://indico.cern.ch/event/607314/contributions/2542309/attachments/1447873/2231444/20170424_LLPs.pdf',
      textColor: 'black',
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
