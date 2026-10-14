import type { ProjectData } from './projects/helpers'
import { getTechColor, techFamilies, type TechFamily } from './technologies'

// Programming languages eligible for the top 4
export const programmingLanguages = [
  'Python', 'C++', 'TypeScript', 'JavaScript', 'Bash', 'Kotlin', 'C#', 'SQL', 'R', 'Java', 'Go', 'Rust'
]

// Whether a colour is light, to pick a readable text colour on top of it
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
  id: TechFamily
  color: string
  techs: TechStats[]
}

// Technology statistics from the visible projects
export function extractTechStats(projects: ProjectData[]): {
  topTechs: TechStats[]
  secondaryByFamily: TechFamilyStats[]
} {
  const totalProjects = projects.length
  const techCount: Record<string, number> = {}

  // Count the projects that use each technology
  projects.forEach(project => {
    project.technologies.forEach(tech => {
      techCount[tech] = (techCount[tech] || 0) + 1
    })
  })

  // Most used first
  const sortedTechs = Object.entries(techCount)
    .map(([name, count]) => ({
      name,
      count,
      color: getTechColor(name),
      percentage: 0 // computed below
    }))
    // ties broken by name so the ranking does not depend on project order
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  // Top 4: programming languages only
  const topTechs = sortedTechs
    .filter(t => programmingLanguages.includes(t.name))
    .slice(0, 4)

  // Share of projects using each top technology (projects using it / all projects)
  topTechs.forEach(tech => {
    tech.percentage = Math.round((tech.count / totalProjects) * 100)
  })

  const topTechNames = new Set(topTechs.map(t => t.name))

  const secondaryByFamily: TechFamilyStats[] = []

  ;(Object.keys(techFamilies) as TechFamily[]).forEach((id) => {
    const family = techFamilies[id]
    const familyTechs = family.techs
      .filter(techName => {
        // Only technologies used by a project and not already in the top 4
        const techStat = sortedTechs.find(t => t.name === techName)
        return techStat && !topTechNames.has(techName)
      })
      .map(techName => sortedTechs.find(t => t.name === techName)!)
      .sort((a, b) => b.count - a.count)

    if (familyTechs.length > 0) {
      secondaryByFamily.push({
        id,
        color: family.color,
        techs: familyTechs,
      })
    }
  })

  return {
    topTechs,
    secondaryByFamily,
  }
}
