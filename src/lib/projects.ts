export interface ProjectData {
  id: string
  title: string
  description: string
  subtitle?: string
  detailedDescription: string
  technologies: string[]
  domains: string[]
  keywords: string[]
  category: 'personal' | 'academic' | 'internship'
  status: 'completed' | 'in-progress' | 'planned'
  period: string
  location: string
  image: string
  imageAlt: string
  imageCredit?: string
  imageCreditUrl?: string
  gitHubUrl?: string
  featured?: boolean
  visible?: boolean // Set to false to hide project from listings (default: true)
  dateCreated: string
}

export interface CategoryData {
  id: string
  title: string
  description: string
  color: string
  accentColor: string
}

export const projectCategories: CategoryData[] = [
  {
    id: 'personal',
    title: 'Personal',
    description: 'Self-developed projects to try new technologies',
    color: 'from-blue-500 to-cyan-500',
    accentColor: '#00f0ff',
  },
  {
    id: 'academic',
    title: 'Academic',
    description: 'Projects from my university coursework',
    color: 'from-purple-500 to-violet-500',
    accentColor: '#a855f7',
  },
  {
    id: 'internship',
    title: 'Research',
    description: 'Professional experience and lab research projects',
    color: 'from-green-500 to-emerald-500',
    accentColor: '#10b981',
  },
]

export const projectsData: Record<string, Record<string, ProjectData>> = {
  personal: {
    'home-server': {
      id: 'home-server',
      title: 'Proxmox Home Server',
      description: 'Configuration of a Proxmox server with a TrueNAS VM to create a secure family cloud. Storage management and remote access.',
      subtitle: 'Building a Private and Scalable Family Cloud',
      detailedDescription: `
## Building a Private and Scalable Family Cloud

This project aims to build a self-hosted cloud infrastructure for my family, accessible from anywhere. The goal is to combine security, flexibility, and full control over data, while learning new things in networking, virtualization, and server administration.

Rather than relying on public cloud services or buying a prebuilt NAS, I chose to repurpose an old computer and design the system from scratch. The current setup uses an AMD A8-7650K, 32 GB of DDR3 RAM, a 500 GB SSD for system files, and a 500 GB HDD for data.

On the software side, I chose Proxmox VE as the hypervisor to manage virtual machines and containers. Inside Proxmox, I deployed TrueNAS Community, which acts as the storage backbone of the system.

The system currently supports three main objectives:
- A virtual machine platform where users can deploy and experiment with different operating systems.  
- A personal cloud powered by TrueNAS and Nextcloud for file management.
- A multimedia hub using Jellyfin, where shared libraries of movies, photos, and music are available to all users.`,
      technologies: ['Proxmox', 'TrueNAS', 'Docker', 'Linux', 'Bash'],
      domains: ['Virtualization', 'Networking', 'Self-hosting'],
      keywords: ['virtualization', 'storage', 'cloud', 'server', 'NAS'],
      category: 'personal',
      status: 'in-progress',
      period: '2025 - Present',
      location: 'Personal project',
      image: '/images/proxmox.png',
      imageAlt: 'Proxmox VE dashboard showing virtual machines and containers management interface',
      imageCredit: 'Lawrence Systems',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Client_Project_Hashcat_Testing_With_an_AMD_Epyc_Supermicro_Nvidia_GPU_Server_Using_Proxmox_%28Lawrence_Systems%29_02.png',
      gitHubUrl: 'https://gitlab.com/samuel.lecomte37/proxmox-homeserver',
      featured: true,
      dateCreated: '2025-07-15',
    },
    'portfolio-website': {
      id: 'portfolio-website',
      title: 'Portfolio Website',
      description: 'Development of a personal portfolio website to showcase my academic and technical projects.',
      subtitle: 'Showcasing My Journey in Tech and Physics',
      detailedDescription: 'This portfolio website showcases my journey through physics and technology. Built with Next.js, TypeScript, and modern web technologies, it features smooth animations, parallax effects, and a responsive design.',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'GSAP'],
      domains: ['Web Development', 'Frontend'],
      keywords: ['portfolio', 'frontend', 'typescript', 'nextjs'],
      category: 'personal',
      status: 'in-progress',
      period: '2025',
      location: 'Personal project',
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200',
      imageAlt: 'Person coding on a laptop with colorful code on screen representing web development',
      dateCreated: '2025-02-15',
    },
  },
  academic: {
    'data-analysis': {
      id: 'data-analysis',
      title: 'Introduction to Data Analysis in Physics',
      description: "Presentation of raw data filtering process applied to HL-LHC simulated data to estimate the presence of an 'X boson'.",
      subtitle: 'Searching for New Particles in Simulated LHC Data',
      detailedDescription: 'This project introduces fundamental concepts of data analysis in particle physics, applying filtering techniques to simulated HL-LHC data to search for hypothetical new particles.',
      technologies: ['Python', 'NumPy', 'Matplotlib'],
      domains: ['Particle Physics', 'Data Analysis', 'Simulation'],
      keywords: ['physics', 'statistics', 'python', 'simulation'],
      category: 'academic',
      status: 'completed',
      period: 'L3 - 2022',
      location: 'Université Clermont Auvergne',
      image: '/images/data_analysis.jpg',
      imageAlt: 'Histogram showing particle mass distribution with signal and background separation',
      gitHubUrl: 'https://github.com/Samuellct/ATLAS-basic-particle-search-workflow',
      dateCreated: '2022-03-01',
    },
    'ising-model': {
      id: 'ising-model',
      title: 'Ising Model',
      description: 'Study of the Ising model with a Python simulation of the two-dimensional case.',
      subtitle: 'Simulating Phase Transitions in Magnetic Systems',
      detailedDescription: 'This project explores the Ising model, a fundamental model in statistical mechanics for understanding phase transitions in magnetic systems. The simulation uses Monte Carlo methods to study the behavior of a 2D spin lattice.',
      technologies: ['Python', 'NumPy', 'Matplotlib'],
      domains: ['Statistical Physics', 'Monte Carlo Simulation'],
      keywords: ['ising', 'monte carlo', 'phase transition'],
      category: 'academic',
      status: 'completed',
      period: 'M1 - 2024',
      location: 'Université Clermont Auvergne',
      image: '/images/ising.jpg',
      imageAlt: 'Animated visualization of Ising model spin lattice showing magnetic domain formation near critical temperature',
      imageCredit: 'Damian Owls',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Ising_Criticality2.gif',
      gitHubUrl: 'https://gitlab.com/samuel.lecomte37/ising-model',
      dateCreated: '2024-03-01',
    },
    'quantum-algorithms': {
      id: 'quantum-algorithms',
      title: 'Quantum Algorithm Demos using Cirq',
      description: "Introduction to quantum computing and its application to cryptography. Python simulation of Shor's algorithm using the Cirq library.",
      subtitle: 'Principles of Quantum Computing and Application to Cryptographic Algorithms',
      detailedDescription: `This project introduces the fundamentals of quantum computing and explores its implications for cryptography, particularly through the simulation of Shor's algorithm using Cirq, Google's quantum framework.`,
      technologies: ['Python', 'Cirq'],
      domains: ['Quantum Computing', 'Cryptography'],
      keywords: ['quantum computing', 'Shor algorithm', 'RSA', 'cryptography'],
      category: 'academic',
      status: 'completed',
      period: 'M1 - 2024',
      location: 'Université Clermont Auvergne',
      image: '/images/quantum_cpu.jpg',
      imageAlt: 'Close-up of a quantum processor chip with superconducting qubits',
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
      image: '/images/arduino_M1.jpg',
      imageAlt: 'Arduino weather station setup with temperature and humidity sensors on breadboard',
      gitHubUrl: 'https://gitlab.com/samuel.lecomte37/arduino-weather-station',
      visible: false,
      dateCreated: '2025-01-22',
    },
    'labview': {
      id: 'labview',
      title: 'Measurement of the Muon Landé g-Factor',
      description: 'Development of a LabVIEW interface to control a muon detector with real-time graphical data analysis.',
      subtitle: 'Real-Time Particle Detection and Analysis',
      detailedDescription: 'A LabVIEW-based data acquisition system for muon detection experiments, featuring real-time analysis and visualization capabilities.',
      technologies: ['LabVIEW'],
      domains: ['Data Acquisition', 'Particle Physics'],
      keywords: ['labview', 'muons', 'data acquisition'],
      category: 'academic',
      status: 'completed',
      period: 'M1 - 2024',
      location: 'Université Clermont Auvergne',
      image: '/images/LabVIEW.png',
      imageAlt: 'LabVIEW block diagram showing data acquisition and signal processing workflow',
      imageCredit: 'Aldhair.gsnt',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Labview_code_example.png',
      gitHubUrl: 'https://gitlab.com/samuel.lecomte37/labview-muon-detector',
      dateCreated: '2024-01-15',
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
      image: '/images/muon_lifetime.png',
      imageAlt: 'Feynman diagram illustrating muon decay into electron and neutrinos',
      imageCredit: 'Mrmw',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Muon_Decay.svg',
      gitHubUrl: 'https://gitlab.com/samuel.lecomte37/muon-lifetime-analysis',
      visible: false,
      dateCreated: '2024-02-15',
    },
    'saturn-rings': {
      id: 'saturn-rings',
      title: "Stability of Saturn's Rings",
      description: "Study of the dynamic stability and chaotic regime of Saturn's rings.",
      subtitle: 'Exploring Orbital Dynamics and Chaos Theory',
      detailedDescription: "A computational study of the dynamical stability of Saturn's ring system, exploring the boundary between stable and chaotic orbits.",
      technologies: ['Python', 'NumPy', 'Matplotlib'],
      domains: ['Astrophysics', 'Modeling'],
      keywords: ['astrophysics', 'planetary science', 'simulation'],
      category: 'academic',
      status: 'completed',
      period: 'L3 - 2023',
      location: 'Université Clermont Auvergne',
      image: '/images/saturn.jpg',
      imageAlt: 'Hubble Space Telescope image of Saturn showing its distinctive ring system',
      imageCredit: 'NASA, ESA, A. Simon, and M.H. Wong',
      imageCreditUrl: 'https://esahubble.org/images/heic1917a/',
      dateCreated: '2023-04-15',
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
      image: '/images/arduino_M2.jpg',
      imageAlt: 'Arduino-based anemometer circuit with wind speed sensor and LCD display',
      visible: false,
      dateCreated: '2024-03-10',
    },
  },
  internship: {
    'internship-m1': {
      id: 'internship-m1',
      title: 'Master 1 Internship - LHCb Team',
      description: 'Study of a rare B meson decay mode. Development of data analysis scripts with ROOT for LHCb Run I.',
      subtitle: 'Investigating Rare Decay Channels in B Mesons',
      detailedDescription: 'A research internship at LPC Clermont-Ferrand within the LHCb collaboration, focused on analyzing rare B meson decays using ROOT and C++.',
      technologies: ['ROOT', 'C++', 'Python'],
      domains: ['Particle Physics', 'Data Analysis'],
      keywords: ['lhcb', 'particle physics', 'root', 'data analysis'],
      category: 'internship',
      status: 'completed',
      period: 'April - June 2024',
      location: 'LPC Clermont-Ferrand',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
      imageAlt: 'Abstract visualization of particle physics data analysis with glowing particle tracks',
      featured: true,
      dateCreated: '2024-04-01',
    },
    'internship-m2': {
      id: 'internship-m2',
      title: 'Master 2 Internship - ATLAS Team',
      description: 'Generation and analysis of simulated events to evaluate the feasibility of searches for long-lived particles (LLPs) at the HL-LHC.',
      subtitle: 'Pioneering Searches for Long-Lived Particles',
      detailedDescription: 'A research internship at LPC Clermont-Ferrand within the ATLAS collaboration, focused on feasibility studies for long-lived particle searches at the High-Luminosity LHC.',
      technologies: ['MadGraph', 'Pythia', 'Docker', 'C++', 'Git'],
      domains: ['Particle Physics', 'Simulation'],
      keywords: ['atlas', 'long-lived particles', 'hl-lhc', 'simulation'],
      category: 'internship',
      status: 'completed',
      period: 'February - July 2025',
      location: 'LPC Clermont-Ferrand',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      imageAlt: 'Earth from space at night showing city lights representing global scientific collaboration',
      visible: false,
      dateCreated: '2025-02-01',
    },
  },
}

export const getProjectById = (categoryId: string, projectId: string): ProjectData | null => {
  return projectsData[categoryId]?.[projectId] || null
}

export const getProjectsByCategory = (categoryId: string): ProjectData[] => {
  const categoryProjects = projectsData[categoryId]
  if (!categoryProjects) return []
  // Only include projects that are visible (visible is undefined or true)
  return Object.values(categoryProjects).filter((project) => project.visible !== false)
}

export const getAllProjects = (): ProjectData[] => {
  const allProjects: ProjectData[] = []
  Object.keys(projectsData).forEach((categoryId) => {
    Object.values(projectsData[categoryId]).forEach((project) => {
      // Only include projects that are visible (visible is undefined or true)
      if (project.visible !== false) {
        allProjects.push(project)
      }
    })
  })
  return allProjects
}

export const getFeaturedProjects = (): ProjectData[] => {
  // getAllProjects already filters out non-visible projects
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
      // Only include projects that are visible (visible is undefined or true)
      if (project.visible !== false) {
        params.push({ category: categoryId, id: projectId })
      }
    })
  })
  return params
}