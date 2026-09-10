import { MetadataRoute } from 'next'
import { getAllProjectParams } from '@/lib/projects'
import { routing } from '@/i18n/routing'
import { BASE_URL, buildAlternates } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    { path: '', changeFrequency: 'monthly' as const, priority: 1 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/projects', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/contact', changeFrequency: 'yearly' as const, priority: 0.7 },
  ]

  const staticPages: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    staticPaths.map(({ path, changeFrequency, priority }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: buildAlternates(path),
    }))
  )

  const projectParams = getAllProjectParams()
  const projectPages: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    projectParams.map((params) => {
      const path = `/projects/${params.category}/${params.id}`
      return {
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: buildAlternates(path),
      }
    })
  )

  return [...staticPages, ...projectPages]
}
