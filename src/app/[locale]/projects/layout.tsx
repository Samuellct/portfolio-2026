import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my portfolio of particle physics research, data analysis projects, and technical work from CERN collaborations.',
  openGraph: {
    title: 'Projects | Samuel Lecomte',
    description: 'Research projects, academic work, and personal experiments in physics and data engineering.',
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
