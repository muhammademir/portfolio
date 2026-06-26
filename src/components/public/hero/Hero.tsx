'use client'

import { ArrowDown, Download } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Hero() {
  // Variabel untuk animasi stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="relative min-h-screen flex items-center pt-14 overflow-hidden selection:bg-neo-purple selection:text-black">
      {/* ═══ Background Animasi Gradasi (Aurora / Mesh Effect) ═══ */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Pola grid halus sudah ada di globals.css */}
      </div>

      {/* ═══ Konten Utama ═══ */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 w-full py-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          
          {/* Teks dengan Animasi Stagger */}
          <motion.div 
            className="flex-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-block bg-neo-yellow border-2 border-black px-3 py-1 mb-4 shadow-neo-sm transform -rotate-2">
              <span className="text-sm font-bold text-black uppercase tracking-widest">Hi, I'm</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold font-serif text-black leading-[1.1] tracking-tight mb-4 relative">
              Muhammad Emir Fadlyanto
              <svg className="absolute w-full h-4 -bottom-2 left-0 text-neo-purple" viewBox="0 0 300 20" preserveAspectRatio="none">
                <path d="M 0,10 Q 75,0 150,10 T 300,10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </motion.h1>
            
            <motion.div variants={itemVariants} className="mt-6 mb-6">
              <Badge variant="default" className="text-sm px-4 py-2 bg-neo-purple text-black border-2 border-black shadow-neo">
                Fullstack Developer & IoT Enthusiast
              </Badge>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-base font-bold text-gray-800 leading-relaxed max-w-md bg-white border-2 border-black p-4 shadow-neo">
              As a Web Developer, I am passionate about creating intuitive and engaging digital experiences that help users accomplish their goals. 
              Whether I'm working on a website or mobile app. My work is focused on branding, digitalization, and strategy for various project.
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mt-8">
              <a href="#projects" className={buttonVariants({ variant: 'default', size: 'lg' })}>
                Lihat Project
              </a>
              
              <a href="/cv-emir-ramadhan.pdf" download className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                <Download size={16} />
                Download CV
              </a>
            </motion.div>
          </motion.div>

          {/* Avatar / Ilustrasi */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="w-64 h-72 bg-white border-4 border-black rounded-xl shadow-neo flex flex-col overflow-hidden transform rotate-2 hover:rotate-0 transition-transform">
              {/* Window Header */}
              <div className="h-8 border-b-4 border-black flex items-center px-3 gap-2 bg-neo-pink">
                <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-black" />
                <div className="w-3 h-3 rounded-full bg-neo-yellow border-2 border-black" />
                <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
              </div>
              {/* Window Body */}
              <div className="flex-1 bg-neo-blue flex items-center justify-center relative overflow-hidden">
                {/* Background grid dalam window */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="text-8xl z-10 transform hover:scale-110 transition-transform cursor-pointer">
                  👨‍💻
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-24 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowDown size={20} className="text-[#6B6B68]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
