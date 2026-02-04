'use client'

import { useEffect, useRef, useLayoutEffect, useMemo, useState } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, Download, Github, Linkedin } from 'lucide-react'
import { extractTechStats, TechStats, isLightColor } from '@/lib/techStats'
import ElevationPath from '@/components/about/ElevationPath'
import NetworkGraph from '@/components/about/NetworkGraph'
import WaveEmitter from '@/components/about/WaveEmitter'
import ScrollIndicator from '@/components/about/ScrollIndicator'
import content from '@/lib/content.json'

gsap.registerPlugin(ScrollTrigger)

// ============================================
// SECTION COLORS
// ============================================
const sectionColors = {
  intro: '#080510',
  stack: '#050c1a',
  education: '#09120a',
  interests: '#120505',
}

// ============================================
// BACKGROUND TEXTS
// ============================================
const bgTexts = ['ABOUT', 'STACK', 'EDUCATION', 'INTERESTS']

// ============================================
// EDUCATION DATA
// ============================================
const education = [
  {
    id: 'master2',
    period: content.about.education.master2.period,
    degree: content.about.education.master2.degree,
    track: content.about.education.master2.track,
    school: content.about.education.master2.school,
    color: '#00f0ff',
  },
  {
    id: 'datascience',
    period: content.about.education.datascience.period,
    degree: content.about.education.datascience.degree,
    school: content.about.education.datascience.school,
    color: '#a855f7',
  },
  {
    id: 'bachelor',
    period: content.about.education.bachelor.period,
    degree: content.about.education.bachelor.degree,
    school: content.about.education.bachelor.school,
    color: '#10b981',
  },
]

// ============================================
// INTERESTS DATA
// ============================================
const interests = [
  { 
    id: 'running',
    label: content.about.interests.running.title, 
    description: content.about.interests.running.description,
  },
  { 
    id: 'homelab',
    label: content.about.interests.tech.title, 
    description: content.about.interests.tech.description,
  },
  { 
    id: 'science',
    label: content.about.interests.science.title, 
    description: content.about.interests.science.description,
  },
]

// ============================================
// GHOST TAG COMPONENT
// ============================================
function GhostTag({ tech }: { tech: TechStats }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const textColor = isHovered 
    ? (isLightColor(tech.color) ? '#000000' : '#ffffff')
    : 'rgba(255,255,255,0.5)'
  
  return (
    <span
      className="inline-block px-4 py-2 text-sm tracking-wide border cursor-default transition-all duration-300"
      style={{
        backgroundColor: isHovered ? tech.color : 'transparent',
        borderColor: isHovered ? tech.color : 'rgba(255,255,255,0.15)',
        color: textColor,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {tech.name}
    </span>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function AboutPage() {
  // Page container ref
  const pageRef = useRef<HTMLDivElement>(null)
  
  // Background text CONTAINER ref (pour le parallax)
  const bgContainerRef = useRef<HTMLDivElement>(null)
  
  // Section refs
  const introSectionRef = useRef<HTMLElement>(null)
  const stackSectionRef = useRef<HTMLElement>(null)
  const educationSectionRef = useRef<HTMLElement>(null)
  const interestsSectionRef = useRef<HTMLElement>(null)
  
  // Refs pour stocker la progression MAXIMALE atteinte
  const introMaxProgressRef = useRef(0)
  const stackMaxProgressRef = useRef(0)
  const educationMaxProgressRef = useRef(0)
  const interestsMaxProgressRef = useRef(0)
  
  // Progress states for animations
  const [introProgress, setIntroProgress] = useState(0)
  const [stackProgress, setStackProgress] = useState(0)
  const [educationProgress, setEducationProgress] = useState(0)
  const [interestsProgress, setInterestsProgress] = useState(0)
  
  const [currentBgText, setCurrentBgText] = useState(0)
  
  // Get tech stats
  const { topTechs, secondaryByFamily } = useMemo(() => extractTechStats(), [])
  
  // Scroll to top on mount
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.backgroundColor = sectionColors.intro
  }, [])
  
  // ============================================
  // GSAP
  // ============================================
  useEffect(() => {
    if (!pageRef.current) return
    
    const ctx = gsap.context(() => {
      
      // ========================================
      // 1. PARALLAX BACKGROUND txt
      // ========================================
      if (bgContainerRef.current) {
        gsap.fromTo(bgContainerRef.current,
          { xPercent: -12 },
          {
            xPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: pageRef.current,
              start: 'top top',
              end: () => `+=${document.scrollingElement?.scrollHeight || document.body.scrollHeight}`,
              scrub: 1,
            }
          }
        )
      }
      
      // ========================================
      // 2. SECTION TRIGGERS AVEC NAVIGATION INTÉGRÉE
      // ========================================
      
      // Section 001 - Intro
      ScrollTrigger.create({
        trigger: introSectionRef.current,
        start: 'top top',
        end: '+=2000',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          if (self.progress > introMaxProgressRef.current) {
            introMaxProgressRef.current = self.progress
            setIntroProgress(self.progress)
          }
        },
        onLeave: () => {
          gsap.to(document.body, { backgroundColor: sectionColors.stack, duration: 1.2, ease: 'power2.out' })
          setCurrentBgText(1)
        },
        onEnterBack: () => {
          gsap.to(document.body, { backgroundColor: sectionColors.intro, duration: 1.2, ease: 'power2.out' })
          setCurrentBgText(0)
        },
      })
      
      // Section 002 - Stack
      ScrollTrigger.create({
        trigger: stackSectionRef.current,
        start: 'top top',
        end: '+=2500',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          if (self.progress > stackMaxProgressRef.current) {
            stackMaxProgressRef.current = self.progress
            setStackProgress(self.progress)
          }
        },
        onLeave: () => {
          gsap.to(document.body, { backgroundColor: sectionColors.education, duration: 1.2, ease: 'power2.out' })
          setCurrentBgText(2)
        },
        onEnterBack: () => {
          gsap.to(document.body, { backgroundColor: sectionColors.stack, duration: 1.2, ease: 'power2.out' })
          setCurrentBgText(1)
        },
      })
      
      // Section 003 - Education
      ScrollTrigger.create({
        trigger: educationSectionRef.current,
        start: 'top top',
        end: '+=2000',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          if (self.progress > educationMaxProgressRef.current) {
            educationMaxProgressRef.current = self.progress
            setEducationProgress(self.progress)
          }
        },
        onLeave: () => {
          gsap.to(document.body, { backgroundColor: sectionColors.interests, duration: 1.2, ease: 'power2.out' })
          setCurrentBgText(3)
        },
        onEnterBack: () => {
          gsap.to(document.body, { backgroundColor: sectionColors.education, duration: 1.2, ease: 'power2.out' })
          setCurrentBgText(2)
        },
      })
      
      // Section 004 - Interests
      ScrollTrigger.create({
        trigger: interestsSectionRef.current,
        start: 'top top',
        end: '+=3000',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          if (self.progress > interestsMaxProgressRef.current) {
            interestsMaxProgressRef.current = self.progress
            setInterestsProgress(self.progress)
          }
        },
      })
      
    }, pageRef)
    
    return () => ctx.revert()
  }, [])
  
  // ============================================
  // INTRO SECTION CALCULATIONS
  // ============================================
  const introTitleOpacity = 1
  const introTextOpacity = Math.max(0, Math.min(1, (introProgress - 0.1) / 0.25))
  const introTextY = Math.max(0, 30 - introProgress * 120)
  const goalsOpacity = Math.max(0, Math.min(1, (introProgress - 0.35) / 0.25))
  const goalsY = Math.max(0, 30 - (introProgress - 0.35) * 120)
  const buttonsOpacity = Math.max(0, Math.min(1, (introProgress - 0.6) / 0.25))
  const buttonsY = Math.max(0, 40 - (introProgress - 0.6) * 160)
  
  // ============================================
  // STACK SECTION CALCULATIONS
  // ============================================
  const stackTitleOpacity = Math.max(0, Math.min(1, stackProgress / 0.1))
  const stackSubtitleOpacity = Math.max(0, Math.min(1, (stackProgress - 0.1) / 0.1))
  const barContainerOpacity = Math.max(0, Math.min(1, (stackProgress - 0.2) / 0.1))
  const barProgress = Math.max(0, Math.min(1, (stackProgress - 0.3) / 0.4))
  const toolkitOpacity = Math.max(0, Math.min(1, (stackProgress - 0.7) / 0.2))
  const toolkitY = Math.max(0, 30 - (stackProgress - 0.7) * 150)
  
  // ============================================
  // EDUCATION SECTION CALCULATIONS
  // ============================================
  const eduTitleOpacity = Math.min(1, educationProgress * 10)
  const lineProgress = Math.max(0, Math.min(1, (educationProgress - 0.1) / 0.6))
  const item1Progress = Math.max(0, Math.min(1, (lineProgress - 0.05) / 0.25))
  const item2Progress = Math.max(0, Math.min(1, (lineProgress - 0.35) / 0.25))
  const item3Progress = Math.max(0, Math.min(1, (lineProgress - 0.65) / 0.25))
  
  // ============================================
  // INTERESTS SECTION CALCULATIONS
  // ============================================
  const interestsTitleOpacity = Math.min(1, interestsProgress * 10)
  const interest1Progress = Math.max(0, Math.min(1, (interestsProgress - 0.15) / 0.25))
  const interest2Progress = Math.max(0, Math.min(1, (interestsProgress - 0.4) / 0.25))
  const interest3Progress = Math.max(0, Math.min(1, (interestsProgress - 0.65) / 0.25))
  
  return (
    <>
      {/* ============================================ */}
      {/* HEADER */}
      {/* z-index = 100 pour être au-dessus des sections pinnées */}
      {/* ============================================ */}
      <header className="fixed top-0 left-0 right-0 z-[100] pt-6 pb-4 px-6 md:px-12 lg:px-16 pointer-events-none">
        <div className="flex justify-between items-center">
          {/* Espace pour le logo SL de la NavBar (à gauche) */}
          <div className="w-20" />
          
          {/* Bouton Back */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute left-20 md:left-24 pointer-events-auto"
          >
            <TransitionLink
              href="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span className="text-sm tracking-[0.1em] uppercase">{content.common.back}</span>
            </TransitionLink>
          </motion.div>
        </div>
      </header>
      
      {/* ============================================ */}
      {/* SCROLL INDICATOR */}
      {/* ============================================ */}
      <ScrollIndicator hideAfterPx={100} />
      
      {/* ============================================ */}
      {/* PARALLAX BACKGROUND TEXT */}
      {/* pointer-events: none pour pas bloquer les clics */}
      {/* ref sur le conteneur, pas sur le span qui change */}
      {/* besoin de corriger cet effet, marche pas comme attendu */}
      {/* ============================================ */}
      <div 
        className="fixed inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center"
      >
        <div ref={bgContainerRef} className="relative">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentBgText}
              initial={{ 
                opacity: 0, 
                x: currentBgText % 2 === 0 ? -30 : 30 
              }}
              animate={{ opacity: 0.025, x: 0 }}
              exit={{ 
                opacity: 0, 
                x: currentBgText % 2 === 0 ? 30 : -30 
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="font-display text-[20vw] md:text-[15vw] leading-none tracking-widest text-white whitespace-nowrap"
            >
              {bgTexts[currentBgText]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      
      {/* ============================================ */}
      {/* PAGE CONTENT */}
      {/* ============================================ */}
      <div ref={pageRef}>
        
        {/* ============================================ */}
        {/* SECTION 001 - ABOUT */}
        {/* ============================================ */}
        <section 
          ref={introSectionRef}
          className="min-h-screen flex items-center px-6 md:px-12 lg:px-16 py-24"
        >
          <div className="max-w-4xl mx-auto w-full">
            {/* Title */}
            <div style={{ opacity: introTitleOpacity }}>
              <div className="section-label text-accent-cyan mb-4">
                {content.about.sectionLabel}
              </div>
              <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] tracking-wide mb-12">
                {content.about.title}
              </h1>
            </div>
            
            {/* Intro text */}
            <div 
              className="mb-12"
              style={{ 
                opacity: introTextOpacity,
                transform: `translateY(${introTextY}px)`,
              }}
            >
              <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                {content.about.full.intro}
              </p>
            </div>
            
            {/* Goals */}
            <div 
              className="mb-12"
              style={{ 
                opacity: goalsOpacity,
                transform: `translateY(${goalsY}px)`,
              }}
            >
              <h2 className="text-xs tracking-[0.2em] uppercase text-accent-purple mb-4">
                {content.about.full.goalsTitle}
              </h2>
              <p className="text-white/50 leading-relaxed">
                {content.about.full.goals}
              </p>
            </div>
            
            {/* Buttons */}
            <div 
              className="flex flex-wrap justify-center gap-4"
              style={{ 
                opacity: buttonsOpacity,
                transform: `translateY(${buttonsY}px)`,
              }}
            >
              <a
                href="/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-accent-cyan/50 hover:bg-accent-cyan/10 transition-all duration-300"
              >
                <Download size={18} className="text-accent-cyan" />
                <span className="text-sm">{content.about.downloadCV}</span>
              </a>
              
              <a
                href="https://github.com/Samuellct"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300"
              >
                <Github size={18} />
                <span className="text-sm">{content.menu.github}</span>
              </a>
              
              <a
                href="https://www.linkedin.com/in/samuel-lecomte37/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#0077b5]/50 hover:bg-[#0077b5]/10 transition-all duration-300"
              >
                <Linkedin size={18} className="text-[#0077b5]" />
                <span className="text-sm">{content.menu.linkedin}</span>
              </a>
            </div>
          </div>
        </section>
        
        {/* ============================================ */}
        {/* SECTION 002 - TECHNICAL STACK */}
        {/* ============================================ */}
        <section 
          ref={stackSectionRef}
          className="min-h-screen flex items-center px-6 md:px-12 lg:px-16 py-24"
        >
          <div className="max-w-5xl mx-auto w-full">
            {/* Titre section */}
            <div 
              className="mb-4"
              style={{ opacity: stackTitleOpacity }}
            >
              <div className="section-label text-accent-purple mb-4">
                {content.about.stack.sectionLabel}
              </div>
            </div>
            
            {/* Sous-titre + description */}
            <div 
              className="mb-16"
              style={{ opacity: stackSubtitleOpacity }}
            >
              <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-wide mb-4">
                {content.about.stack.title}
              </h2>
              <p className="text-white/40 max-w-xl">
                {content.about.stack.description}
              </p>
            </div>
            
            {/* Progress Bar */}
            <div 
              className="grid md:grid-cols-2 gap-x-12 gap-y-6 mb-20"
              style={{ opacity: barContainerOpacity }}
            >
              {topTechs.map((tech, index) => {
                const barStartDelay = index * 0.1
                const individualBarProgress = Math.max(0, Math.min(1, (barProgress - barStartDelay) / 0.6))
                const barFill = individualBarProgress * tech.percentage
                
                return (
                  <div key={tech.name} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium tracking-wide text-white/90">
                        {tech.name}
                      </span>
                      <span className="text-xs text-white/40 tabular-nums">
                        {tech.count} {tech.count === 1 ? 'project' : 'projects'}
                      </span>
                    </div>
                    <div className="relative h-[3px] bg-white/10 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0"
                        style={{ 
                          width: `${barFill}%`,
                          backgroundColor: tech.color,
                          boxShadow: `0 0 15px ${tech.color}50`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Extended Toolkit */}
            <div
              style={{ 
                opacity: toolkitOpacity,
                transform: `translateY(${toolkitY}px)`,
              }}
            >
              <h3 className="text-xs tracking-[0.2em] uppercase text-white/30 mb-8">
                {content.about.stack.extendedToolkit}
              </h3>
              
              <div className="space-y-8">
                {secondaryByFamily.map((family) => (
                  <div key={family.id}>
                    <h4 
                      className="text-xs tracking-wider uppercase mb-4"
                      style={{ color: family.color }}
                    >
                      {family.label}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {family.techs.map((tech) => (
                        <GhostTag key={tech.name} tech={tech} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* ============================================ */}
        {/* SECTION 003 - EDUCATION */}
        {/* ============================================ */}
        <section 
          ref={educationSectionRef}
          className="min-h-screen flex items-center px-6 md:px-12 lg:px-16 py-24"
        >
          <div className="max-w-5xl mx-auto w-full">
            {/* Title */}
            <div 
              className="mb-12 text-center"
              style={{ opacity: eduTitleOpacity }}
            >
              <div className="section-label text-emerald-400 justify-center mb-4">
                {content.about.education.sectionLabel}
              </div>
              <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-wide">
                {content.about.education.subtitle}
              </h2>
            </div>
            
            {/* Timeline */}
            <div className="relative">
              {/* Central line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/5">
                <div 
                  className="w-full bg-gradient-to-b from-accent-cyan via-accent-purple to-emerald-400 origin-top"
                  style={{ height: `${lineProgress * 100}%` }}
                />
              </div>
              
              {/* Timeline items */}
              {education.map((item, index) => {
                const itemProgress = index === 0 ? item1Progress : index === 1 ? item2Progress : item3Progress
                const isLeft = index % 2 === 0
                const slideX = isLeft 
                  ? -50 + itemProgress * 50
                  : 50 - itemProgress * 50
                
                return (
                  <div 
                    key={item.id}
                    className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'} mb-12 last:mb-0`}
                    style={{
                      opacity: itemProgress,
                      transform: `translateX(${slideX}px)`,
                    }}
                  >
                    <div className={`w-full md:w-[45%] ${isLeft ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                      <div 
                        className="relative p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors duration-500"
                        style={{ 
                          borderLeftColor: isLeft ? item.color : undefined,
                          borderRightColor: !isLeft ? item.color : undefined,
                          borderLeftWidth: isLeft ? '2px' : undefined,
                          borderRightWidth: !isLeft ? '2px' : undefined,
                        }}
                      >
                        <span 
                          className="inline-block px-2 py-0.5 text-[0.6rem] tracking-wider uppercase mb-2"
                          style={{ backgroundColor: `${item.color}15`, color: item.color }}
                        >
                          {item.period}
                        </span>
                        
                        <h3 className="font-display text-lg md:text-xl tracking-wide mb-1">
                          {item.degree}
                        </h3>
                        
                        {'track' in item && item.track && (
                          <p className="text-xs text-white/60 mb-1">{item.track}</p>
                        )}
                        
                        <p className="text-xs text-white/40">{item.school}</p>
                      </div>
                    </div>
                    
                    {/* Center point */}
                    <div 
                      className="hidden md:block absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 bg-primary z-10"
                      style={{ 
                        borderColor: item.color,
                        opacity: itemProgress
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
        
        {/* ============================================ */}
        {/* SECTION 004 - INTERESTS */}
        {/* ============================================ */}
        <section 
          ref={interestsSectionRef}
          className="min-h-screen flex items-center px-6 md:px-12 lg:px-16 py-24"
        >
          <div className="max-w-6xl mx-auto w-full">
            {/* Title */}
            <div 
              className="mb-16"
              style={{ opacity: interestsTitleOpacity }}
            >
              <div className="section-label text-pink-400 mb-4">
                {content.about.interests.sectionLabel}
              </div>
              <p className="text-white/40">
                {content.about.interests.subtitle}
              </p>
            </div>
            
            {/* Interest 1 - Trail Running (Left) */}
            <div 
              className="flex flex-col md:flex-row items-center gap-8 mb-16"
              style={{ 
                opacity: interest1Progress,
                transform: `translateX(${-50 + interest1Progress * 50}px)`,
              }}
            >
              <div className="md:w-1/2">
                <h3 className="font-display text-2xl md:text-3xl tracking-wide mb-3 text-accent-cyan">
                  {interests[0].label}
                </h3>
                <p className="text-white/50 leading-relaxed">
                  {interests[0].description}
                </p>
              </div>
              <div className="md:w-1/2 h-32 md:h-40">
                <ElevationPath progress={interest1Progress} className="w-full h-full" />
              </div>
            </div>
            
            {/* Interest 2 - Home Lab (Right) */}
            <div 
              className="flex flex-col md:flex-row-reverse items-center gap-8 mb-16"
              style={{ 
                opacity: interest2Progress,
                transform: `translateX(${50 - interest2Progress * 50}px)`,
              }}
            >
              <div className="md:w-1/2 md:text-right">
                <h3 className="font-display text-2xl md:text-3xl tracking-wide mb-3 text-[#e57000]">
                  {interests[1].label}
                </h3>
                <p className="text-white/50 leading-relaxed">
                  {interests[1].description}
                </p>
              </div>
              <div className="md:w-1/2 h-48 md:h-52">
                <NetworkGraph progress={interest2Progress} className="w-full h-full" />
              </div>
            </div>
            
            {/* Interest 3 - Science Communication (Left) */}
            <div 
              className="flex flex-col md:flex-row items-center gap-8"
              style={{ 
                opacity: interest3Progress,
                transform: `translateX(${-50 + interest3Progress * 50}px)`,
              }}
            >
              <div className="md:w-1/2">
                <h3 className="font-display text-2xl md:text-3xl tracking-wide mb-3 text-accent-purple">
                  {interests[2].label}
                </h3>
                <p className="text-white/50 leading-relaxed">
                  {interests[2].description}
                </p>
              </div>
              <div className="md:w-1/2 h-48 md:h-52">
                <WaveEmitter progress={interest3Progress} className="w-full h-full" />
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </>
  )
}
