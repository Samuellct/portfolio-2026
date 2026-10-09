import { BASE_URL } from '@/lib/constants'

// BreadcrumbList structured data matching the visible breadcrumb, Home first.
// `path` is locale-less ('' for Home, '/about'); the last item is the current
// page. Synchronous so both server layouts and client pages can render it.
export default function BreadcrumbJsonLd({
  locale,
  items,
}: {
  locale: string
  items: { name: string; path: string }[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}/${locale}${item.path}`,
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
