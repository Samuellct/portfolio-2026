import { MetadataRoute } from 'next'
import { getAllProjectParams } from '@/lib/projects'

const BASE_URL = 'https://www.samuel-lecomte.fr'

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ]
  
  // Dynamic project pages
  const projectParams = getAllProjectParams()
  const projectPages: MetadataRoute.Sitemap = projectParams.map((params) => ({
    url: `${BASE_URL}/projects/${params.category}/${params.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
  
  return [...staticPages, ...projectPages]
}
