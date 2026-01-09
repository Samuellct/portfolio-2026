'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import TransitionLink from '@/components/navigation/TransitionLink'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Calendar, MapPin } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { getProjectById, getCategoryById } from '@/lib/projects'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import content from '@/lib/content.json'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.category as string
  const projectId = params.id as string
  
  const project = categoryId && projectId ? getProjectById(categoryId, projectId) : null
  const category = categoryId ? getCategoryById(categoryId) : null
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [projectId])
  
  useEffect(() => {
    if (!project && categoryId && projectId) {
      router.push('/projects')
    }
  }, [project, categoryId, projectId, router])
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* ============================================ */}
        {/* SPLIT LAYOUT: Desktop (lg+) = 2 colonnes */}
        {/* ============================================ */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          
          {/* ============================================ */}
          {/* LEFT COLUMN - Sticky sidebar (4/12) */}
          {/* ============================================ */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              
              {/* Back link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <TransitionLink
                  href="/projects"
                  className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span className="text-sm tracking-[0.1em] uppercase">{content.common.back}</span>
                </TransitionLink>
              </motion.div>
              
              {/* Project info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Category & Status */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span 
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{ color: category?.accentColor }}
                  >
                    {category?.title}
                  </span>
                  
                  {project.status === 'in-progress' && (
                    <span className="px-2 py-1 bg-accent-cyan/10 border border-accent-cyan/20 text-[0.6rem] tracking-wider uppercase text-accent-cyan">
                      {content.projects.status.inProgress}
                    </span>
                  )}
                </div>
                
                {/* Title */}
                <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-wide mb-4">
                  {project.title}
                </h1>
                
                {/* Subtitle */}
                {project.subtitle && (
                  <p className="text-lg text-white/60 mb-6">{project.subtitle}</p>
                )}
                
                {/* Meta info */}
                <div className="flex flex-col gap-3 text-sm text-white/40 mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{project.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{project.location}</span>
                  </div>
                </div>
                
                {/* Technologies */}
                <div className="mb-8">
                  <h2 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">
                    {content.projects.technologies}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs bg-white/[0.03] border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* GitHub CTA */}
                {project.gitHubUrl && (
                  <div className="flex justify-center">
                    <a
                      href={project.gitHubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 bg-[#238636] text-white text-sm font-medium tracking-wide transition-colors hover:bg-[#2ea043]"
                    >
                      <FaGithub size={18} />
                      View on GitHub
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
          
          {/* ============================================ */}
          {/* RIGHT COLUMN - Scrollable content (8/12) */}
          {/* ============================================ */}
          <div className="lg:col-span-8 mt-12 lg:mt-0">
            
            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-10"
            >
              <div className="relative aspect-video overflow-hidden rounded-sm">
                {project.image.startsWith('/') ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {project.imageCredit && (
                <p className="mt-2 text-xs text-white/30">
                  Image: {' '}
                  {project.imageCreditUrl ? (
                    <a
                      href={project.imageCreditUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white/50 underline"
                    >
                      {project.imageCredit}
                    </a>
                  ) : (
                    project.imageCredit
                  )}
                </p>
              )}
            </motion.div>
            
            {/* Description */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <MarkdownRenderer 
                content={project.detailedDescription}
                className="prose prose-lg max-w-none"
              />
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  )
}
