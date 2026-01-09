'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import NavBar from '@/components/navigation/NavBar'
import Footer from '@/components/layout/Footer'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavBar />
      <main id="main-content">
        {children}
      </main>
      <Footer />
    </motion.div>
  )
}
