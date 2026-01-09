import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Samuel Lecomte - Particle Physicist at Université Clermont Auvergne, working on CERN collaborations including ATLAS and LHCb experiments.',
  openGraph: {
    title: 'About | Samuel Lecomte',
    description: 'Particle Physicist & Data Engineer specializing in high-energy physics experiments.',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
