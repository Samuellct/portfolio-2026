import AboutView from './AboutView'
import { getAllProjects, getProjectsByCategory } from '@/lib/projects/data'
import { extractTechStats } from '@/lib/techStats'
import { experiences } from '@/lib/experience'

// Data is prepared here, on the server, so the client view ships without the
// project content (V6-COD-08)
export default function AboutPage() {
  // Research internships, most recent first
  const internships = [...getProjectsByCategory('internship')]
    .sort((a, b) => b.dateCreated.localeCompare(a.dateCreated))
    .map(({ id, category, title, subtitle, period, research, results }) => ({
      id, category, title, subtitle, period, research, results,
    }))
  return <AboutView internships={internships} experiences={experiences} techStats={extractTechStats(getAllProjects())} />
}
