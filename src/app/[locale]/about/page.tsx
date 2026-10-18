import AboutView from './AboutView'
import { getAllProjects, getProjectById, getProjectsByCategory } from '@/lib/projects/data'
import { extractTechStats } from '@/lib/techStats'
import { experiences } from '@/lib/experience'

// Data is prepared here, on the server, so the client view ships without the
// project content (V6-COD-08)
// The projects each interest led to (P14-D8)
const INTEREST_PROJECTS: Record<string, string[]> = {
  running: ['alpine-route', 'time-predict'],
  homelab: ['home-server', 'jellyux'],
  science: ['accred'],
}

export default function AboutPage() {
  // Research internships, most recent first
  const internships = [...getProjectsByCategory('internship')]
    .sort((a, b) => b.dateCreated.localeCompare(a.dateCreated))
    .map(({ id, category, title, subtitle, period, research, results }) => ({
      id, category, title, subtitle, period, research, results,
    }))
  const interestProjects = Object.fromEntries(
    Object.entries(INTEREST_PROJECTS).map(([interest, ids]) => [
      interest,
      ids
        .map((id) => getProjectById('personal', id))
        .filter((p) => p !== null && p.visible !== false)
        .map((p) => ({ id: p!.id, category: p!.category, title: p!.title })),
    ])
  )
  return (
    <AboutView
      internships={internships}
      experiences={experiences}
      interestProjects={interestProjects}
      techStats={extractTechStats(getAllProjects())}
    />
  )
}
