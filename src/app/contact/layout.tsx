import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Samuel Lecomte for collaborations, research opportunities, or general inquiries.',
  openGraph: {
    title: 'Contact | Samuel Lecomte',
    description: 'Reach out for collaborations, research opportunities, or questions.',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
