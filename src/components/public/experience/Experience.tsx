'use client'

import { Experience } from '@/types'
import { MapPin } from 'lucide-react'
import { getChipColors, cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const dotColor = {
  internship: 'bg-accent outline-accent',
  freelance: 'bg-emerald-500 outline-emerald-500',
  fulltime: 'bg-amber-500 outline-amber-500',
}

const typeLabel = {
  internship: 'Internship / PKL',
  freelance: 'Freelance',
  fulltime: 'Full-time',
}

// Format "January 2025"
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  if (!year || !month) return dateStr
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

interface Props {
  experiences: Experience[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function ExperienceSection({ experiences }: Props) {
  return (
    <section id="experience" className="py-20 border-t-4 border-black relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-6 relative z-10"
      >
        <p className="text-sm font-bold text-black uppercase tracking-widest mb-6 inline-block bg-neo-blue border-2 border-black px-3 py-1 shadow-neo-sm transform -rotate-1">
          Experience
        </p>
        <h2 className="text-4xl md:text-5xl font-bold font-serif text-black mb-12 tracking-tight">
          Pengalaman kerja
        </h2>

        {experiences.length === 0 ? (
          <p className="text-[14px] text-[#6B6B68]">Belum ada pengalaman yang ditambahkan.</p>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="relative"
          >
            {experiences.map((exp, i) => (
              <motion.div variants={itemVariants} key={exp.id} className="flex gap-6 group">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center w-5 flex-shrink-0 mt-1">
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 border-black z-10 group-hover:scale-110 transition-transform duration-300',
                      dotColor[exp.type]
                    )}
                  />
                  {i < experiences.length - 1 && (
                    <div className="w-[4px] flex-1 bg-black -mt-2 group-hover:bg-neo-purple transition-colors duration-300" />
                  )}
                </div>

                {/* Content */}
                <Card className="pb-6 pt-5 px-6 flex-1 bg-white border-4 border-black shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all rounded-xl ml-2">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-black group-hover:text-neo-purple transition-colors">{exp.title}</h3>
                      <p className="text-[14px] text-accent font-medium mt-0.5">{exp.company}</p>
                    </div>
                    <Badge variant="outline" className="text-xs font-bold text-black bg-neo-yellow border-2 border-black px-2 py-0.5 whitespace-nowrap shadow-neo-sm">
                      {typeLabel[exp.type]}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-gray-800 font-bold mb-4 mt-2">
                    <MapPin size={16} className="text-black" />
                    {exp.location} <span className="mx-1 text-black">|</span>
                    <span className="text-black">{formatDate(exp.start_date)} — {exp.is_current ? 'Sekarang' : formatDate(exp.end_date)}</span>
                  </div>

                  <div className="text-base text-gray-800 leading-relaxed font-medium mb-4 space-y-1">
                    {exp.description.split('\n').map((line, idx) => (
                      line.trim() ? (
                        <p key={idx}>{line}</p>
                      ) : (
                        <br key={idx} />
                      )
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exp.tech_stack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className={cn("text-xs font-bold border-2 border-black bg-white hover:bg-neo-pink transition-colors px-2 py-1 shadow-neo-sm", getChipColors(tech))}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
