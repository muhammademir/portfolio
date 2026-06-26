'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  { value: 'Design', label: 'Landing Page & UI/UX' },
  { value: 'Develop', label: 'Software & Apps' },
  { value: 'Build', label: 'IoT & Smart System' },
  { value: 'Bandung', label: 'Location' },
]

export default function About() {
  return (
    <section id="about" className="py-20 border-t-4 border-black relative overflow-hidden">
      {/* Dekorasi blur di background - DIHAPUS */}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-6"
      >
        <p className="text-sm font-bold text-black uppercase tracking-widest mb-6 inline-block bg-neo-green border-2 border-black px-3 py-1 shadow-neo-sm transform rotate-2">
          About
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-black mb-6 tracking-tight">
              About me
            </h2>
            <p className="text-base font-bold text-gray-800 leading-relaxed mb-4 bg-white border-2 border-black p-4 shadow-neo">
              I am an Informatics Engineering graduate currently working as a Frontend Developer at B4T Bandung. 
              I specialize in building modern digital experiences that are not only highly functional but also intuitive, 
              scalable, and easy to maintain. My primary focus is crafting seamless user interfaces that deliver real value.
            </p>
            <p className="text-base font-bold text-gray-800 leading-relaxed bg-white border-2 border-black p-4 shadow-neo">
              Beyond web development, I have a strong passion for the Internet of Things, having engineered integrated hardware software solutions like ESP32 based monitoring systems. 
              I firmly believe that great developers don't just write code, they understand business challenges and architect solutions that drive tangible impact.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
              >
                <Card className="bg-white border-4 border-black shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-300 group cursor-default">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-black group-hover:text-neo-purple transition-colors">{stat.value}</div>
                    <div className="text-sm text-black font-bold mt-1 uppercase tracking-wider">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
