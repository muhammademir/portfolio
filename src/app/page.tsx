import Navbar from '@/components/public/Navbar'
import Hero from '@/components/public/hero/Hero'
import About from '@/components/public/about/About'
import Skills from '@/components/public/skills/Skills'
import Experience from '@/components/public/experience/Experience'
import Projects from '@/components/public/projects/Projects'
import Certificates from '@/components/public/certificates/Certificates'
import Contact from '@/components/public/contact/Contact'
import Footer from '@/components/public/Footer'
import { supabase } from '@/lib/supabase'

export const revalidate = 60 // revalidate setiap 60 detik

export default async function HomePage() {
  // Fetch semua data dari Supabase
  const [
    { data: projects },
    { data: experiences },
    { data: certificates },
  ] = await Promise.all([
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
    supabase.from('experiences').select('*').order('start_date', { ascending: false }),
    supabase.from('certificates').select('*').order('year', { ascending: false }),
  ])

  return (
    <main className="relative min-h-screen">
      
      {/* Konten Utama harus ada di z-10 agar di atas canvas 3D */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Experience experiences={experiences ?? []} />
        <Projects projects={projects ?? []} />
        <Certificates certificates={certificates ?? []} />
        <Contact />
        <Footer />
      </div>
    </main>
  )
}
