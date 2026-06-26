'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { getChipColors, cn } from '@/lib/utils'
import { Magnet } from '@/components/animations/Magnet'

const skillGroups = [
  {
    category: 'Frontend',
    skills: ['Next.js', 'React', 'Tailwind CSS', 'shadcn/ui', 'HTML & CSS', 'Bootstrap', 'TypeScript', 'JavaScript'],
  },
  {
    category: 'Backend',
    skills: ['Laravel', 'REST API', 'MySQL', 'PHP','MongoDB','C++'],
  },
  {
    category: 'IoT & Hardware',
    skills: ['ESP32', 'Sensor pH/Suhu', 'MQTT','Grafana','Arduino'],
  },
  {
    category: 'Tools',
    skills: ['Git', 'Docker', 'Figma', 'Vercel', 'Supabase', 'Postman', 'Docker Compose', 'GitHub', 'Tableau','Power BI','Excel','REST API','AnyDesk', 'TeamViewer','WordPress','Trello'],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
}

export default function Skills() {
  return (
    <section id="skills" className="py-20 border-t-4 border-black relative overflow-hidden selection:bg-neo-yellow selection:text-black">
      {/* Dekorasi blur di background - DIHAPUS */}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-6"
      >
        <p className="text-sm font-bold text-black uppercase tracking-widest mb-6 inline-block bg-neo-yellow border-2 border-black px-3 py-1 shadow-neo-sm transform -rotate-2">
          Skills
        </p>
        <h2 className="text-4xl md:text-5xl font-bold font-serif text-black mb-10 tracking-tight">
          Yang saya kuasai
        </h2>

        <div className="flex flex-col gap-10">
          {skillGroups.map((group) => (
            <motion.div 
              key={group.category}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="bg-white border-4 border-black p-6 rounded-xl shadow-neo transform transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
                <div className="w-4 h-4 bg-neo-purple border-2 border-black rounded-full" />
                <h3 className="text-xl font-bold text-black uppercase tracking-wider">
                  {group.category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill) => (
                  <motion.div
                    variants={itemVariants}
                    key={skill}
                  >
                    <Badge variant="outline" className={cn("px-4 py-2 text-sm font-bold border-2 border-black hover:bg-neo-yellow transition-colors cursor-default shadow-neo-sm", getChipColors(skill))}>
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
