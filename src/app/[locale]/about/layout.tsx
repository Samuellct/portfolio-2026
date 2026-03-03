import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Samuel Lecomte - Graduate in Physics and Data Science from Université Clermont Auvergne, with experience in CERN collaborations including ATLAS and LHCb experiments.',
  openGraph: {
    title: 'About | Samuel Lecomte',
    description: 'Graduate in Physics and Data Science, specializing in high-energy physics experiments.',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
