import ProjectsView from './ProjectsView'
import { getProjectsSortedByDate, toProjectSummary } from '@/lib/projects/data'

// Data is prepared here, on the server, so the client view ships only the
// fields its cards and search read (V6-COD-08)
export default function ProjectsPage() {
  // Chronological order (newest first), deliberately distinct from the
  // featured-first order of the homepage preview (AUDIT-009). Shared with the
  // project detail page's previous/next navigation (AUDIT-019).
  return <ProjectsView allProjects={getProjectsSortedByDate().map(toProjectSummary)} />
}
