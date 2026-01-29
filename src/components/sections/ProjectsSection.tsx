'use client'

import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { getAllProjects, ProjectData } from '@/lib/projects'
import content from '@/lib/content.json'

gsap.registerPlugin(ScrollTrigger)

/* ============================================ */
/* CATEGORY CONFIGURATION                       */
/* ============================================ */

const categoryColors: Record<string, string> = {
  personal: '#1a4a5c',
  academic: '#3d2a5c',
  internship: '#1a4a3d',
}

const categoryLabels: Record<string, string> = {
  personal: 'PERSONAL',
  academic: 'ACADEMIC',
  internship: 'RESEARCH',
}

function getCategoryColor(category: string): string {
  return categoryColors[category] || categoryColors['personal']
}

function getCategoryLabel(category: string): string {
  return categoryLabels[category] || 'PROJECTS'
}

/* ============================================ */
/* ORDERED PROJECTS LOGIC                       */
/* ============================================ */

function getOrderedProjects(allProjects: ProjectData[]): ProjectData[] {
  const sortByDate = (a: ProjectData, b: ProjectData) => {
    const dateA = a.period.split(' — ')[1] || a.period
    const dateB = b.period.split(' — ')[1] || b.period
    return dateB.localeCompare(dateA)
  }
  
  const research = allProjects.filter(p => p.category === 'internship').sort(sortByDate)
  const personal = allProjects.filter(p => p.category === 'personal').sort(sortByDate)
  const academic = allProjects.filter(p => p.category === 'academic').sort(sortByDate)
  
  const ordered: ProjectData[] = []
  
  if (research[0]) ordered.push(research[0])
  if (personal[0]) ordered.push(personal[0])
  if (academic[0]) ordered.push(academic[0])
  
  if (research[1]) ordered.push(research[1])
  else if (personal[1]) ordered.push(personal[1])
  else if (academic[1]) ordered.push(academic[1])
  
  return ordered.slice(0, 4)
}

/* ============================================ */
/* MAIN COMPONENT                               */
/* ============================================ */

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [backgroundText, setBackgroundText] = useState('PROJECTS')
  
  // Mouse Y tracking - PERSISTENT (never unmounted)
  const mouseY = useMotionValue(0)
  const smoothY = useSpring(mouseY, { stiffness: 140, damping: 30, restDelta: 0.001 })
  
  // Background color transition
  const [bgColor, setBgColor] = useState('transparent')
  const [isFirstHover, setIsFirstHover] = useState(true)
  
  const allProjects = getAllProjects()
  const displayProjects = useMemo(() => getOrderedProjects(allProjects), [allProjects])
  
  // Mouse move handler - updates Y position continuously
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
  // On envoie directement la position Y de la souris (en pixels)
    mouseY.set(e.clientY)
  }, [mouseY])

  
  // Project hover enter
  const handleProjectEnter = useCallback((project: ProjectData) => {
    setActiveProject(project)
    setIsHovering(true)
    setBgColor(getCategoryColor(project.category))
    setBackgroundText(getCategoryLabel(project.category))
    if (isFirstHover) setIsFirstHover(false)
  }, [isFirstHover])
  
  // Container leave - fade out without position reset
  const handleContainerLeave = useCallback(() => {
    setIsHovering(false)
    setBgColor('transparent')
    setBackgroundText('PROJECTS')
    setIsFirstHover(true)
    // Note: activeProject is NOT reset immediately to allow fade-out
    setTimeout(() => {
      setActiveProject(null)
    }, 500)
  }, [])
  
  // GSAP parallax for decorative text
  useEffect(() => {
    if (!sectionRef.current) return
    
    const ctx = gsap.context(() => {
      const decorText = sectionRef.current?.querySelector('.decor-text-container')
      if (decorText) {
        gsap.fromTo(decorText,
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          }
        )
      }
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])
  
  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section min-h-screen py-32 md:py-40 relative overflow-hidden"
    >
      {/* ============================================ */}
      {/* BACKGROUND COLOR LAYER                      */}
      {/* ============================================ */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ 
          backgroundColor: bgColor,
          opacity: isHovering ? 1 : 0
        }}
        transition={{ 
          duration: isFirstHover ? 0.3 : 0.8,
          ease: "easeInOut"
        }}
      />
      
      {/* ============================================ */}
      {/* DECORATIVE BACKGROUND TEXT                  */}
      {/* ============================================ */}
      <div className="decor-text-container absolute top-1/2 -translate-y-1/2 left-0 pointer-events-none select-none z-0">
        <div className="flex overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={backgroundText}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex"
            >
              {backgroundText.split("").map((char, i) => (
                <motion.span
                  key={`${backgroundText}-${i}`}
                  variants={{
                    initial: { y: "100%", opacity: 0 },
                    animate: { y: 0, opacity: 1 },
                    exit: { y: "-100%", opacity: 0 }
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.215, 0.61, 0.355, 1],
                    delay: i * 0.04
                  }}
                  className="font-display text-[25vw] text-white/[0.05] leading-none whitespace-pre"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* ============================================ */}
      {/* MAIN CONTENT                                */}
      {/* ============================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="section-label text-accent-cyan mb-4"
            >
              {content.projects.sectionLabel}
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display text-[clamp(3rem,10vw,7rem)] leading-[0.9] tracking-wide"
            >
              {content.projects.title}
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TransitionLink
              href="/projects"
              className="inline-flex items-center gap-3 text-white/50 hover:text-white transition-colors group"
            >
              <span className="text-sm tracking-[0.15em] uppercase">{content.projects.preview.cta}</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </TransitionLink>
          </motion.div>
        </div>
        
        {/* ============================================ */}
        {/* PROJECTS LIST WITH SANDWICH EFFECT          */}
        {/* ============================================ */}
        <div 
          ref={containerRef}
          className="relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleContainerLeave}
        >
          {/* ============================================ */}
          {/* FLOATING IMAGE - MIDDLE LAYER (z-20)        */}
          {/* Container is ALWAYS mounted for continuity  */}
          {/* ============================================ */}
          <motion.div 
            className="fixed pointer-events-none"
            style={{
              left: '50%',
              top: 0,
              x: '-50%',
              y: smoothY,
              translateY: '-50%',
              zIndex: 20,
              width: '40vw',
              maxWidth: '500px',
              aspectRatio: '4/3'
            }}
          >
            {/* Image content with cross-fade (popLayout) */}
            <AnimatePresence mode="popLayout">
              {activeProject && (
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0}}
                  animate={{ opacity: isHovering ? 1 : 0}}
                  exit={{ opacity: 0}}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0 overflow-hidden"
                >
                  <img
                    src={activeProject.image}
                    alt={activeProject.imageAlt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border border-white/10" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* ============================================ */}
          {/* PROJECT TITLES LIST                         */}
          {/* ============================================ */}
          <div className="relative py-8 flex flex-col items-center">
            {displayProjects.map((project, index) => {
              const isActive = activeProject?.id === project.id
              const activeTextColor = activeProject?.textColor === 'black' ? '#000000' : '#ffffff'
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                  style={{ 
                    // SANDWICH: Active title (z-30) > Image (z-20) > Other titles (z-10)
                    zIndex: isActive ? 30 : 10 
                  }}
                >
                  <TransitionLink
                    href={`/projects/${project.category}/${project.id}`}
                    className="inline-block py-6 md:py-8 group relative"
                    onMouseEnter={() => handleProjectEnter(project)}
                  >
                    <motion.h3
                      className="font-display text-[clamp(1.8rem,6vw,5rem)] leading-[1] tracking-wide"
                      animate={{ 
                        opacity: isHovering 
                          ? (isActive ? 1 : 0.15)  // Active: full, Others: very dim
                          : 0.8,                    // Default state
                        color: isHovering && isActive ? activeTextColor : undefined
                      }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      {project.title}
                    </motion.h3>
                  </TransitionLink>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
