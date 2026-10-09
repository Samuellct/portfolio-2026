import { notFound } from 'next/navigation'

// Unknown paths under a locale prefix (/fr/nope) land here, so they get the
// localized [locale]/not-found.tsx, with a 404 status, instead of the bare root 404.
export default function CatchAllNotFound() {
  notFound()
}
