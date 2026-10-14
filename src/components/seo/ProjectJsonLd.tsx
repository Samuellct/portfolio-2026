import { BASE_URL, LANG_TAG } from '@/lib/constants'
import { getLocalizedField, Locale, ProjectData } from '@/lib/projects/data'

// One CreativeWork node per visible project (DEC-11d), authored by the Person
// node of [locale]/layout.tsx.
export default function ProjectJsonLd({ project, locale }: { project: ProjectData; locale: Locale }) {
  const url = `${BASE_URL}/${locale}/projects/${project.category}/${project.id}`
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    name: getLocalizedField(project.title, locale),
    description: getLocalizedField(project.description, locale),
    dateCreated: project.dateCreated,
    url,
    inLanguage: LANG_TAG[locale] || 'en-US',
    author: { '@id': `${BASE_URL}/#person` },
    image: project.image.startsWith('/') ? `${BASE_URL}${project.image}` : project.image,
    ...(project.gitHubUrl && { codeRepository: project.gitHubUrl }),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
