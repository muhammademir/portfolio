'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Project } from '@/types'
import { Github, FileText, ExternalLink, X } from 'lucide-react'
import { cn, getChipColors } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const categoryLabels: Record<string, string> = {
  all: 'Semua',
  web: 'Web',
  iot: 'IoT',
  design: 'Desain',
  mobile: 'Mobile',
  uiux: 'UI/UX',
}

const categoryColors: Record<string, string> = {
  web: 'bg-[#EEEDFE] text-[#3C3489]',
  iot: 'bg-[#FAEEDA] text-[#633806]',
  design: 'bg-[#E6F1FB] text-[#0C447C]',
  mobile: 'bg-[#E1F5EE] text-[#085041]',
  uiux: 'bg-[#FDE8F5] text-[#7C1C5E]',
}

interface Props {
  projects: Project[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
}

export default function Projects({ projects }: Props) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.category)))]

  const filtered =
    activeFilter === 'all' ? projects : projects.filter((p) => p.category === activeFilter)

  return (
    <>
    <section id="projects" className="py-20 border-t-4 border-black relative">
      {/* Dekorasi blur di background - DIHAPUS */}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-6 relative z-10"
      >
        <p className="text-sm font-bold text-black uppercase tracking-widest mb-6 inline-block bg-neo-yellow border-2 border-black px-3 py-1 shadow-neo-sm transform rotate-1">
          Projects
        </p>
        <h2 className="text-4xl md:text-5xl font-bold font-serif text-black mb-8 tracking-tight">
          Yang pernah saya bangun
        </h2>

        {/* Filter */}
        <div className="mb-10">
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
            <TabsList className="bg-transparent gap-2 h-auto flex-wrap justify-start">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="px-5 py-2 text-sm font-bold border-2 border-black bg-white hover:bg-neo-pink data-[state=active]:bg-neo-purple data-[state=active]:text-black data-[state=active]:border-black data-[state=active]:shadow-neo-sm transition-all duration-300"
                >
                  {categoryLabels[cat] ?? cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {filtered.length === 0 ? (
          <p className="text-[14px] text-[#6B6B68]">Belum ada project yang ditambahkan.</p>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid sm:grid-cols-2 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={project.id}
                >
                  <Card 
                    onClick={() => setSelectedProject(project)}
                    className="group overflow-hidden hover:shadow-neo-lg transition-all duration-500 bg-white hover:-translate-y-1 border-4 border-black h-full flex flex-col cursor-pointer shadow-neo rounded-xl"
                  >
                    {/* Thumbnail */}
                    <div className="h-48 bg-neo-pink flex items-center justify-center overflow-hidden relative flex-shrink-0 border-b-4 border-black">
                      <div className="absolute inset-0 bg-neo-purple/0 group-hover:bg-neo-purple/20 transition-colors duration-500 z-10"></div>
                      {project.image_url ? (
                        <img
                          src={project.image_url.split(',')[0]}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                      ) : (
                        <span className="text-5xl group-hover:scale-125 transition-transform duration-500">🖥️</span>
                      )}
                    </div>

                    {/* Body */}
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-black group-hover:text-neo-purple transition-colors">{project.title}</h3>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-xs tracking-wide uppercase font-bold border-2 border-black px-2 py-0.5 whitespace-nowrap shadow-neo-sm',
                            categoryColors[project.category] ?? 'bg-[#F1EFE8] text-[#444441]'
                          )}
                        >
                          {categoryLabels[project.category] ?? project.category}
                        </Badge>
                      </div>

                      <p className="text-sm font-bold text-gray-800 leading-relaxed mb-5 line-clamp-3 flex-1">
                        {project.description}
                      </p>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.tech_stack.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className={cn("text-xs font-bold border-2 border-black px-2 py-0.5 shadow-neo-sm bg-white", getChipColors(tech))}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-2 pt-4 border-t-4 border-black -mx-6 px-6 -mb-6 pb-4 mt-auto">
                        {project.case_study_url && (
                          <a href={project.case_study_url} onClick={(e) => e.stopPropagation()} className={buttonVariants({ variant: "ghost", size: "sm", className: "h-8 text-black border-2 border-transparent hover:border-black font-bold" })}>
                            <FileText size={14} className="mr-1.5" /> Case Study
                          </a>
                        )}
                        {project.demo_url && (
                          <a href={project.demo_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className={buttonVariants({ variant: "ghost", size: "sm", className: "h-8 text-black border-2 border-transparent hover:border-black font-bold" })}>
                            <ExternalLink size={14} className="mr-1.5" /> Demo
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className={buttonVariants({ variant: "ghost", size: "sm", className: "h-8 text-black border-2 border-transparent hover:border-black ml-auto font-bold" })}>
                            <Github size={14} className="mr-1.5" /> Code
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </section>

    {/* Modal Detail Project — dirender di luar section via Portal */}
    {typeof document !== 'undefined' && createPortal(
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 9999 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-4 border-black shadow-neo-lg rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b-4 border-black bg-neo-yellow shrink-0">
                <h3 className="text-2xl font-bold font-serif text-black pr-4 leading-tight">{selectedProject.title}</h3>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-black hover:text-white rounded-full transition-colors border-2 border-transparent hover:border-black shrink-0"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-xs tracking-wide uppercase font-bold border-2 border-black px-3 py-1 shadow-neo-sm',
                        categoryColors[selectedProject.category] ?? 'bg-[#F1EFE8] text-[#444441]'
                      )}
                    >
                      {categoryLabels[selectedProject.category] ?? selectedProject.category}
                    </Badge>
                  </div>
                  <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Tech stack */}
                <div>
                  <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-3">Teknologi yang digunakan</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech_stack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className={cn("text-xs font-bold border-2 border-black px-3 py-1 shadow-neo-sm bg-white", getChipColors(tech))}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Gallery */}
                {selectedProject.image_url && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-black uppercase tracking-wider">Screenshots</h4>
                    {selectedProject.image_url.split(',').map((url, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border-4 border-black shadow-neo-sm bg-neo-pink">
                        <img src={url} alt={`${selectedProject.title} ${idx + 1}`} className="w-full h-auto object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Links */}
              {(selectedProject.demo_url || selectedProject.github_url || selectedProject.case_study_url) && (
                <div className="flex flex-wrap items-center gap-4 p-5 border-t-4 border-black bg-gray-50 shrink-0">
                  {selectedProject.demo_url && (
                    <a href={selectedProject.demo_url} target="_blank" rel="noreferrer" className={buttonVariants({ className: "border-2 border-black shadow-neo-sm font-bold hover:-translate-y-1 transition-transform" })}>
                      <ExternalLink size={16} className="mr-2" /> Kunjungi Live Demo
                    </a>
                  )}
                  {selectedProject.github_url && (
                    <a href={selectedProject.github_url} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", className: "border-2 border-black shadow-neo-sm font-bold hover:-translate-y-1 transition-transform bg-white" })}>
                      <Github size={16} className="mr-2" /> Source Code
                    </a>
                  )}
                  {selectedProject.case_study_url && (
                    <a href={selectedProject.case_study_url} className={buttonVariants({ variant: "outline", className: "border-2 border-black shadow-neo-sm font-bold hover:-translate-y-1 transition-transform bg-white" })}>
                      <FileText size={16} className="mr-2" /> Baca Case Study
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  )
}
