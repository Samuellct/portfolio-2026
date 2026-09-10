import { getAllProjects } from './projects'

// Langages de prog pour le Top 4
export const programmingLanguages = [
  'Python', 'C++', 'TypeScript', 'JavaScript', 'Bash', 'SQL', 'R', 'Java', 'Go', 'Rust'
]

// Couleurs des technologies
export const techColors: Record<string, string> = {

  'Python': '#ffdd54',
  'C++': '#00599c',
  'TypeScript': '#007accde',
  'JavaScript': '#f7df1e',
  'Bash': '#4eaa25',

  'React': '#61dafb',
  'Next.js': '#ffffff',
  'Tailwind CSS': '#38b2ac',
  'Framer Motion': '#bb4b96',
  'Three.js': '#000000',
  'GSAP': '#0ae348',
  
  'ROOT': '#6bc0dc',
  'NumPy': '#013243',
  'Pandas': '#150458',
  'Matplotlib': '#e5e5e6',
  'Scikit-learn': '#f7931e',
  'pytorch': '#ee4c2c',
  'Cirq': '#ff8209',
  
  'MadGraph': '#eeaa89',
  'Pythia': '#eba047',
  
  'Git': '#f05033',
  'Docker': '#0db7ed',
  'Linux': '#fcc624',
  'LaTeX': '#008080',
  'Jupyter': '#f37626',
  'VS Code': '#007acc',
  'LabVIEW': '#ffdb00',
  'Vite': '#646cff',
  
  'Arduino': '#00979d',
  
  'Proxmox': '#e57000',
  'TrueNAS': '#0095d5',
}

// Extended Toolkit
export const techFamilies: Record<string, { label: string; color: string; techs: string[] }> = {
  languages: {
    label: 'Languages',
    color: '#3178c6',
    techs: ['Python', 'C++', 'TypeScript', 'JavaScript', 'Bash', 'Arduino'],
  },
  frameworks: {
    label: 'Frameworks & Libraries',
    color: '#61dafb',
    techs: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'GSAP', 'Vite'],
  },
  dataAnalysis: {
    label: 'Data & Analysis',
    color: '#f89939',
    techs: ['ROOT', 'NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn', 'TensorFlow', 'Cirq', 'MadGraph', 'Pythia'],
  },
  tools: {
    label: 'Tools & Systems',
    color: '#f05032',
    techs: ['Git', 'Docker', 'Linux', 'LaTeX', 'Jupyter', 'VS Code', 'LabVIEW', 'Proxmox', 'TrueNAS'],
  },
}

// Couleur par défaut au cas ou
export const defaultTechColor = '#6b7280'

export function getTechColor(tech: string): string {
  return techColors[tech] || defaultTechColor
}

// test fct pour savoir si une couleur est claire pour choisir le bon contraste du txt
export function isLightColor(hex: string): boolean {
  const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex
  const r = parseInt(cleanHex.slice(0, 2), 16)
  const g = parseInt(cleanHex.slice(2, 4), 16)
  const b = parseInt(cleanHex.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

export interface TechStats {
  name: string
  count: number
  color: string
  percentage: number // 0-100
}

export interface TechFamilyStats {
  id: string
  label: string
  color: string
  techs: TechStats[]
}

// Extraire les technologies des projets
export function extractTechStats(): {
  topTechs: TechStats[]
  secondaryTechs: TechStats[]
  secondaryByFamily: TechFamilyStats[]
  allTechs: TechStats[]
  totalProjects: number
} {
  const projects = getAllProjects()
  const totalProjects = projects.length
  const techCount: Record<string, number> = {}
  
  // Compter les occurrences de chaque technologie
  projects.forEach(project => {
    project.technologies.forEach(tech => {
      techCount[tech] = (techCount[tech] || 0) + 1
    })
  })
  
  // trier par nb décroissant
  const sortedTechs = Object.entries(techCount)
    .map(([name, count]) => ({
      name,
      count,
      color: getTechColor(name),
      percentage: 0 // Calculé après
    }))
    .sort((a, b) => b.count - a.count)
  
  // Top 4 = only langages de prog
  const topTechs = sortedTechs
    .filter(t => programmingLanguages.includes(t.name))
    .slice(0, 4)
  
  // Calculer les pourcentages pour le top (nb de projets qui utilie la tech / nbtot de projets)
  topTechs.forEach(tech => {
    tech.percentage = Math.round((tech.count / totalProjects) * 100)
  })
  
  const topTechNames = new Set(topTechs.map(t => t.name))
  
  const secondaryTechs = sortedTechs.filter(t => !topTechNames.has(t.name))
  
  const secondaryByFamily: TechFamilyStats[] = []
  
  Object.entries(techFamilies).forEach(([id, family]) => {
    const familyTechs = family.techs
      .filter(techName => {
        // Inclure only if visible dans les projets + pas dans le top
        const techStat = sortedTechs.find(t => t.name === techName)
        return techStat && !topTechNames.has(techName)
      })
      .map(techName => sortedTechs.find(t => t.name === techName)!)
      .sort((a, b) => b.count - a.count)
    
    if (familyTechs.length > 0) {
      secondaryByFamily.push({
        id,
        label: family.label,
        color: family.color,
        techs: familyTechs,
      })
    }
  })
  
  return {
    topTechs,
    secondaryTechs,
    secondaryByFamily,
    allTechs: sortedTechs,
    totalProjects
  }
}

export function getTopTechNames(count: number = 4): string[] {
  const { topTechs } = extractTechStats()
  return topTechs.slice(0, count).map(t => t.name)
}
