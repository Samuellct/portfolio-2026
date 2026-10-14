'use client'

import { ReactNode } from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { SmoothScrollProvider } from '@/context/SmoothScrollContext'
import { TransitionProvider } from '@/context/TransitionContext'
import MainLayout from '@/components/layout/MainLayout'
import { useMarkAppHydrated } from '@/hooks/use-entry-animation'

export function Providers({ children }: { children: ReactNode }) {
  useMarkAppHydrated()
  return (
    // `m` components with the animation features only (V6-COD-10); strict
    // flags any full `motion` component that would bring the whole bundle back.
    // The listing adds layout animations with its own LazyMotion (domMax).
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <SmoothScrollProvider>
          <TransitionProvider>
            <MainLayout>{children}</MainLayout>
          </TransitionProvider>
        </SmoothScrollProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
