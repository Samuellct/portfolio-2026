'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import NavBar from '@/components/navigation/NavBar'
import Footer from '@/components/layout/Footer'
import { useTranslations } from 'next-intl'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const t = useTranslations('common')
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-accent-cyan focus:text-black focus:text-sm focus:font-medium focus:tracking-wide"
      >
        {t('skipToContent')}
      </a>
      <NavBar />
      <main id="main-content">
        {children}
      </main>
      <Footer />
    </motion.div>
  )
}
