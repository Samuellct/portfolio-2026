'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getAllProjects, projectCategories, ProjectData } from '@/lib/projects'
import HiddenIcon from '@/components/easter-egg/HiddenIcon'
import content from '@/lib/content.json'

gsap.registerPlugin(ScrollTrigger)

// Background color for projects page (matches projects section)
const PROJECTS_BG_COLOR = '#0a0a12'

// ============================================
// Project card with Stock Dutch hover effect
// ============================================
function ProjectCard({ project, index }: { project: ProjectData; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { stiffness: 150, damping: 25 }
  const x = useSpring(useTransform(mouseX, [-1, 1], [-10, 10]), springConfig)
  const y = useSpring(useTransform(mouseY, [-1, 1], [-10, 10]), springConfig)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) / (rect.width / 2))
    mouseY.set((e.clientY - centerY) / (rect.height / 2))
  }
  
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }
  
  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <TransitionLink
        href={`/projects/${project.category}/${project.id}`}
        className="block"
      >
        {/* Image container - respecte le ratio original */}
        <motion.div 
          className="relative overflow-hidden mb-5 bg-white/[0.02]"
          style={{ x, y }}
        >
          {/* Container flexible avec hauteur min/max */}
          <div className="relative min-h-[200px] max-h-[280px] flex items-center justify-center overflow-hidden">
            <motion.img
              src={project.image}
              alt={project.title}
              className={`w-full h-auto max-h-[280px] object-contain transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              animate={{ 
                scale: isHovered ? 1.05 : 1,
                filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)'
              }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            />
            
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/10 border-t-accent-cyan rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0.3 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Status badge */}
          {project.status === 'in-progress' && (
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-accent-cyan/20 backdrop-blur-sm border border-accent-cyan/30 text-[0.6rem] tracking-[0.15em] uppercase text-accent-cyan">
              {content.projects.status.inProgress}
            </div>
          )}
          
          {/* Decorative frame on hover */}
          <motion.div
            className="absolute inset-3 border border-white/20 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.95
            }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
        
        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[0.6rem] tracking-[0.2em] uppercase text-white/40">
            <span style={{ color: project.category === 'internship' ? '#10b981' : project.category === 'academic' ? '#a855f7' : '#00f0ff' }}>
              {project.category === 'internship' ? content.projects.categories.internship : project.category}
            </span>
            <span>•</span>
            <span>{project.period}</span>
          </div>
          
          <h3 className="font-display text-xl md:text-2xl tracking-wide group-hover:text-accent-cyan transition-colors duration-300">
            {project.title}
          </h3>
          
          <p className="text-sm text-white/50 leading-relaxed line-clamp-2 text-justify">
            {project.description}
          </p>
          
          {/* View link */}
          <motion.div
            className="flex items-center gap-2 pt-2 text-accent-cyan"
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -10
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xs tracking-[0.15em] uppercase">{content.projects.viewProject}</span>
            <ArrowRight size={12} />
          </motion.div>
        </div>
      </TransitionLink>
    </motion.div>
  )
}

// ============================================
// Main Projects Page
// ============================================
export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const allProjects = getAllProjects()
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  
  const filteredProjects = activeFilter === 'all'
    ? allProjects
    : allProjects.filter((p) => p.category === activeFilter)
  
  // Scroll to top before paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  // GSAP animations
  useEffect(() => {
    if (!pageRef.current) return
    
    const ctx = gsap.context(() => {
      // Title reveal
      const title = headerRef.current?.querySelector('h1')
      if (title) {
        gsap.fromTo(title,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.2
          }
        )
      }
      
      // Parallax decorative text
      const decorText = pageRef.current?.querySelector('.decor-text')
      if (decorText) {
        gsap.fromTo(decorText,
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: pageRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          }
        )
      }
    }, pageRef)
    
    return () => ctx.revert()
  }, [])
  
  return (
    <div ref={pageRef} className="min-h-screen relative" style={{ backgroundColor: PROJECTS_BG_COLOR }}>
      {/* Decorative text - parallax */}
      <div className="decor-text fixed top-1/2 -translate-y-1/2 left-0 pointer-events-none select-none z-0">
        <span className="font-display text-[20vw] text-white/[0.015] leading-none whitespace-nowrap">
          PROJECTS
        </span>
      </div>
      
      <div className="relative z-10 pt-24 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-sm tracking-[0.1em] uppercase">{content.common.back}</span>
          </TransitionLink>
        </motion.div>
        
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-label text-accent-cyan mb-4"
          >
            {content.projects.sectionLabel}
          </motion.div>
          
          <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.85] tracking-wide mb-6">
            {content.projects.title}
          </h1>
          
          <p className="text-lg text-white/50 max-w-2xl">
            {content.projects.preview.description}
          </p>
        </div>
        
        {/* Filters with hidden icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap items-center gap-3 mb-16"
        >
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2.5 text-xs tracking-[0.2em] uppercase border transition-all duration-300 ${
              activeFilter === 'all'
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white/60 border-white/20 hover:border-white/50 hover:text-white'
            }`}
          >
            {content.projects.categories.all}
          </button>
          
          {projectCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-2.5 text-xs tracking-[0.2em] uppercase border transition-all duration-300 ${
                activeFilter === category.id
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white/60 border-white/20 hover:border-white/50 hover:text-white'
              }`}
            >
              {category.id === 'internship' ? content.projects.categories.internship : category.title}
            </button>
          ))}
          
          {/* Hidden easter egg icon */}
          <HiddenIcon id="projects-icon" className="ml-2" />
        </motion.div>
        
        {/* Projects Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-white/40"
          >
            No projects found in this category.
          </motion.div>
        )}
      </div>
    </div>
  )
}
