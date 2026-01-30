'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import BlogSection from '@/components/sections/BlogSection'
import ContactSection from '@/components/sections/ContactSection'

gsap.registerPlugin(ScrollTrigger)

// Background colors for each section
const sectionColors: Record<string, string> = {
  hero: '#030308',
  about: '#08051a',
  projects: '#0f0805',
  blog: '#050f08',
  contact: '#05050f',
}

export default function HomePageClient() {
  // Setup bkg color transition
  useEffect(() => {
    const sections = document.querySelectorAll('.section')
    
    sections.forEach((section) => {
      const sectionId = section.id
      const color = sectionColors[sectionId] || sectionColors.hero
      
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to(document.body, {
            backgroundColor: color,
            duration: 1.2,
            ease: 'power2.out',
          })
        },
        onEnterBack: () => {
          gsap.to(document.body, {
            backgroundColor: color,
            duration: 1.2,
            ease: 'power2.out',
          })
        },
      })
    })
    
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])
  
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
    </>
  )
}
