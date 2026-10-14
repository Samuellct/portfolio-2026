'use client'

import { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'
import { SmoothScrollProvider } from '@/context/SmoothScrollContext'
import { TransitionProvider } from '@/context/TransitionContext'
import MainLayout from '@/components/layout/MainLayout'
import { useMarkAppHydrated } from '@/hooks/use-entry-animation'

export function Providers({ children }: { children: ReactNode }) {
  useMarkAppHydrated()
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <TransitionProvider>
          <MainLayout>{children}</MainLayout>
        </TransitionProvider>
      </SmoothScrollProvider>
    </MotionConfig>
  )
}
