'use client'

import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'

// Each section paints its own background (`.section` in globals.css, from the
// scheme's `--surface`), so the body no longer changes colour while scrolling.
export default function HomePageClient() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ContactSection />
    </>
  )
}
