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
  visible?: boolean // default: true
  textColor?: 'white' | 'black' // default: white
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
      description: 'Building a home server to learn virtualization, NAS administration and self-hosting.',
      subtitle: 'Building a Private and Scalable Family Cloud',
      detailedDescription: `
I started this project to learn the basics of server administration and virtualization. Instead of buying a ready-made NAS, I repurposed an old PC (AMD A8-7650K, 32GB DDR3 RAM, 400 Gb SSD for system files) to build a "Proof of Concept" system. The goal is to test how different services work together before investing in more expensive hardware.

### My current setup:
I started by installing **Proxmox VE** as the main OS.
- **Storage:** : I installed **TrueNAS** on a Proxmox VM and connected a single 500GB drive to it. This is mainly to get used to the Truenas / ZFS interface. In the future, I plan to install between 15 and 20TB of storage in a RAID-Z1 configuration.
- **Cloud & Media:** : I installed **Nextcloud** and **Jellyfin** on Truenas, one app is dedicated to file sharing (like Google Drive) and the other to streaming movies.
- **Network** : I implemented **Nginx Proxy Manager** to manage reverse proxy logic and connect my services (Nextcloud, Jellyfin) to subdomains of my personal domain so that I can access them from anywhere.

However, I'm starting to hit some limits. Running Proxmox as a base layer might be too heavy for my old PC once several users start streaming or using VMs. I'm currently considering switching to a bare-metal TrueNAS install and building a dedicated machine for virtualization later on. I also plan to add an Arc A380 GPU soon, which will allow Jellyfin to transcode video files on the fly without crushing the CPU.`,
      technologies: ['Proxmox', 'TrueNAS', 'Nextcloud', 'Jellyfin', 'Nginx Proxy Manager'],
      domains: ['Virtualization', 'Networking', 'Self-hosting'],
      keywords: ['virtualization', 'storage', 'cloud', 'server', 'truenas', 'NAS'],
      category: 'personal',
      status: 'in-progress',
      period: '2025 - Present',
      location: 'Personal project',
      image: '/images/Dashboard_Truenas.webp',
      imageAlt: 'Truenas dashboard showing virtual machines and server interface',
      featured: true,
      textColor :"black",
      dateCreated: '2025-07-15',
    },
    'portfolio-website': {
      id: 'portfolio-website',
      title: 'Portfolio Website',
      description: 'A personal website built with Next.js 15, featuring Three.js effects and SSR.',
      subtitle: 'Presenting my profile and projects in physics and computer science',
      detailedDescription: `I started this portfolio project in late 2024 because I wanted a space to present my profile and projects in a less formal way than a CV allows. Building it myself also gave me an opportunity to learn web development progressively while having a concrete goal.

The first version used WordPress, but I quickly found the platform too limiting and heavy for what I needed. In early 2025, I rebuilt everything with Eleventy (V2), which let me work directly with HTML and CSS in a structure I understood well. A few months later, I moved to React with Vite (V3) to learn component-based architecture and client-side rendering, which established the foundation of modern web apps, even though I could see the limits of pure CSR.

By October 2025, I decided to migrate to Next.js 15. The main motivation was to solve the performance gaps I noticed in V3, specifically through server-side rendering and built-in optimizations like image lazy loading. The transition to the App Router architecture required a lot of work and testing to figure out how to move from Vite to this new framework.

The visual design centers on Three.js particle effects. I implemented a wave background using WebGL shaders, which required learning about coordinate transformations and fragment shaders. Getting acceptable performance on mobile devices meant reducing particle counts and implementing proper cleanup to prevent memory leaks. The landing page includes a moving starfield with an animated hyperspace effect that plays on first visit.

Finally, all site text is managed through a centralized JSON file, except for project pages which use Markdown. This structure will simplify adding other languages in the future, since the translation infrastructure is already in place. For content rendering, I integrated react-markdown with KaTeX to support LaTeX equations in project descriptions. This was necessary for properly displaying physics notation without converting everything to images.`,
      technologies: ['Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Three.js', 'GSAP'],
      domains: ['Web Development', 'Frontend'],
      keywords: ['portfolio', 'frontend', 'typescript', 'nextjs', 'threejs', 'webgl'],
      category: 'personal',
      status: 'in-progress',
      period: '2024 - Present',
      location: 'Personal project',
      image: '/images/portfolioWebsite.png',
      imageAlt: 'Front page of my website',
      gitHubUrl: "https://github.com/Samuellct/portfolio-2026",
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
      technologies: ['Python', 'NumPy', 'Matplotlib', "Pandas", "Scipy"],
      domains: ['Particle Physics', 'Data Analysis', 'Simulation'],
      keywords: ['physics', 'statistics', 'python', 'simulation'],
      category: 'academic',
      status: 'completed',
      period: 'L3 - 2022',
      location: 'Université Clermont Auvergne',
      image: '/images/data_analysis.jpg',
      imageAlt: 'Histogram showing particle mass distribution with signal and background separation',
      gitHubUrl: 'https://github.com/Samuellct/ATLAS-basic-particle-search-workflow',
      visible: false,
      dateCreated: '2022-03-01',
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
      image: '/images/ising.jpg',
      imageAlt: 'Animated visualization of Ising model spin lattice showing magnetic domain formation near critical temperature',
      imageCredit: 'Damian Owls',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Ising_Criticality2.gif',
      gitHubUrl: 'https://github.com/Samuellct/2D-3D-python-Ising-model',
      visible: false,
      dateCreated: '2023-11-21',
    },
    'quantum-algorithms': {
      id: 'quantum-algorithms',
      title: 'Quantum Algorithm Demos using Cirq',
      description: "Python simulation of Shor's algorithm using the Cirq library to break RSA encryption.",
      subtitle: 'Principles of Quantum Computing and Application to Cryptographic Algorithms',
      detailedDescription: `This project was carried out as part of my Quantum Mechanics course during my first year of Master's. Working alongside two classmates, we studied the principles of quantum computing and their implications for modern cryptography. Our goal was to understand how qubits, quantum gates, and quantum circuits work, and then apply this knowledge to a real-world problem: breaking RSA encryption using Shor's algorithm.

We started by building a strong theoretical foundation. We studied superposition, entanglement, and the Bloch sphere representation, then moved on to quantum gates like Hadamard, Pauli-X, and CNOT, as well as the Quantum Fourier Transform. Once we felt comfortable with the basics, we implemented RSA encryption in Python using both a simple version with SymPy and a more robust one with the cryptography library. We wanted to see firsthand how asymmetric encryption works before attempting to crack it.

The most challenging part was implementing Shor's algorithm for integer factorization. We started with IBM's Qiskit framework, but we struggled with how the library handled the modular exponentiation gate and the circuit optimization. After many weeks of troubleshooting, we decided to switch to Google's Cirq library, which gave us more direct control over the gate decomposition. With Cirq, we were finally able to build a working simulation. 

The algorithm worked well for small numbers, but we quickly hit memory limitations for numbers larger than five digits. This makes sense because simulating n qubits requires storing $2^{n}$ complex numbers in memory, so the requirements explode exponentially. We also got a taste of why researchers are now developing new encryption methods that could resist quantum attacks. These "post-quantum" algorithms rely on mathematical problems that even quantum computers would struggle with, like finding short vectors in high-dimensional lattices.`,
      technologies: ['Python', 'Qiskit', 'Cirq', 'Sympy'],
      domains: ['Quantum Computing', 'Cryptography'],
      keywords: ['quantum computing', 'Shor algorithm', 'RSA', 'cryptography'],
      category: 'academic',
      status: 'completed',
      period: 'M1 - 2023',
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
      title: 'LabVIEW Muon System Update',
      description: 'LabVIEW interface for muon detector control and TAC calibration routines.',
      subtitle: 'Real-Time Particle Detection and Analysis',
      detailedDescription: `During a week-long project in March 2024, I worked with a team of two other students to develop additional LabVIEW functionality for an existing muon Landé g-factor measurement system. This project was primarily a practical introduction to instrument control and data acquisition programming, with the physics experiment serving as a context for learning LabVIEW development.

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

Previous acquisitions by earlier student groups had demonstrated the system's capability, collecting datasets of $\\sim 80,000$ events that yielded muon lifetime of $\\tau_{\\mu^+} = (2.19 \\pm 0.03)~\\mu\\text{s}$ and clear Larmor precession signals at 4 mT.

This project taught us that experimental physics is as much about debugging electronics as it is about measurements. We delivered a working tool that future students could use to extract the Landé factor with minimal setup time.

However, several improvements remain for future groups like an automated field regulation mode that would compensate for thermal drift.`,
      technologies: ['LabVIEW', 'Python'],
      domains: ['Data Acquisition', 'Instrument Control', 'Particle Physics'],
      keywords: ['labview', 'muons', 'data acquisition', 'instrument control', 'TAC calibration'],
      category: 'academic',
      status: 'completed',
      period: 'M1 - 2024',
      location: 'Université Clermont Auvergne',
      image: '/images/LabVIEW.png',
      imageAlt: 'LabVIEW block diagram showing data acquisition and signal processing workflow',
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
      subtitle: 'Studying Orbital Dynamics and Chaos Theory',
      detailedDescription: `For a three-month project in the chaos theory course, we explored Saturn's rings as a complex dynamical system. We wanted to understand whether the massive ring systems are actually stable over hundreds of millions of years, or if they could eventually disperse.

We began by reviewing the historical theories on the composition and dynamics of the rings. Cassini thought they were made of colliding rocks, Laplace argued for solid structures, but Maxwell settled it in 1859 by proving mathematically that only systems of independent particles could remain stable. His work also revealed that these systems are inherently sensitive to initial conditions, which is a hint of chaos theory before Poincaré formalized the concept. We also learned about the Roche limit, which explains how tidal forces can tear apart a moon to create rings in the first place. 

Our computational work focused on modeling the rings as an N-body problem using Python. We implemented Newton's equations, treating the rings as collections of particles interacting with Saturn and its moons. We ran simulations tracking 20 particles over 10-year periods, visualizing their trajectories in 2D and 3D. The results showed clear chaotic behavior with high sensitivity to initial conditions, just like Poincaré predicted for the three-body problem. We tried calculating Lyapunov exponents to quantify the chaos, but we found this task relatively difficult to implement properly. What we did confirm is that small changes in particle positions lead to dramatically different long-term evolution. The whole project connected classical celestial mechanics with chaos theory, showing that even though Saturn's rings appear stable now, their behavior over geological timescales is fundamentally unpredictable.`,
      technologies: ['Python', 'NumPy', 'Matplotlib'],
      domains: ['Chaos Theory', 'Celestial Mechanics', 'Simulation'],
      keywords: ['chaos theory', 'N-body problem', 'simulation', 'Lyapunov'],
      category: 'academic',
      status: 'completed',
      period: 'L3 - 2022',
      location: 'Université Clermont Auvergne',
      image: '/images/saturn.jpg',
      imageAlt: 'Hubble Space Telescope image of Saturn showing its distinctive ring system',
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
      subtitle: 'Data analysis of the rare B meson decay into Kaon and photon',
      detailedDescription: `During my first year of master's degree, I spent two months at the Clermont Physics Laboratory as part of the LHCb team, working on a rare decay mode of the B meson. I studied $B^{+} \\to K_{1}^{+}\\gamma$, which is a process that could reveal physics beyond the Standard Model through the polarization of the emitted photon.

This internship was my first experience working with large-scale experimental data from LHC Run 1. I worked primarily with ROOT and C++ to filter through the collected events. Starting from samples containing several hundred thousand candidates, the challenge was to reduce this to a manageable dataset while preserving potential signal events.

Most of my time went into building a preselection strategy using simulated data. I studied particle identification variables to distinguish signal from background. For charged particles, the RICH detectors of LHCb produce probability outputs like ProbNNk, which indicates how likely a track is to be a kaon rather than a pion or proton. For photons, I used gammaCL to assess the quality of electromagnetic showers in the calorimeters and reject background noise. I also reconstructed the helicity angle, which relates to the photon's polarization and would eventually help probe for new physics.

When I applied this preselection to real Run 1 data, I reduced the dataset by a factor of 300, from about 100,000 candidates down to roughly 2,600 events, while maintaining 57% efficiency on simulated signal. I could clearly identify the $\\omega$ meson peak in the data at 783 MeV, validating the reconstruction approach. However, the $K_{1}^{+}$ signal remained elusive, which wasn't surprising given the rarity of this decay and limited Run 1 statistics. The work establishes a foundation for fuller analysis with Run 2 and Run 3 data.`,
      technologies: ['ROOT', 'C++'],
      domains: ['Particle Physics', 'Data Analysis'],
      keywords: ['lhcb', 'particle physics', 'root', 'data analysis', 'B meson', 'rare decay'],
      category: 'internship',
      status: 'completed',
      period: 'April - June 2024',
      location: 'LPCA',
      image: '/images/m1Internship.png',
      imageAlt: 'Attempt to Fit the B Meson mass',
      featured: true,
      gitHubUrl: "https://github.com/Samuellct/Internship-M1-B-meson-decay",
      textColor: 'black',
      dateCreated: '2024-07-05',
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
      // Only include projects that are visible
      if (project.visible !== false) {
        params.push({ category: categoryId, id: projectId })
      }
    })
  })
  return params
}