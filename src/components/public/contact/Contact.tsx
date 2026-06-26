'use client'

import { useState } from 'react'
import { Github, Linkedin, Mail, MessageCircle, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const socials = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/muhammademir' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/muhammad-emir-fadlyanto-23086337b/' },
  { icon: Mail, label: 'Email', href: 'mailto:muhammademir202@gmail.com' },
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/6287800051259' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    setSending(true)
    // Kirim ke Formspree
    await fetch('https://formspree.io/f/xjgqyakb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSending(false)
    setSent(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="py-20 border-t-4 border-black relative overflow-hidden">
      {/* Dekorasi blur di background - DIHAPUS */}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-6 relative z-10"
      >
        <p className="text-sm font-bold text-black uppercase tracking-widest mb-6 inline-block bg-neo-green border-2 border-black px-3 py-1 shadow-neo-sm transform -rotate-2">
          Contact
        </p>
        <h2 className="text-4xl md:text-5xl font-bold font-serif text-black mb-3 tracking-tight">
          Hubungi saya
        </h2>
        <p className="text-base font-bold text-gray-800 mb-12 max-w-md">
          Terbuka untuk peluang kerja, kolaborasi project, atau sekedar ngobrol soal tech.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Sosial */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <p className="text-xs font-bold text-black uppercase tracking-wider mb-6 border-b-4 border-black pb-2 inline-block">
              Temukan saya di
            </p>
            <div className="flex flex-col gap-4">
              {socials.map(({ icon: Icon, label, href }) => (
                <motion.a
                  variants={itemVariants}
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 text-[14px] font-medium text-[#6B6B68] hover:text-[#1A1A18] transition-colors group"
                >
                  <span className="w-10 h-10 rounded-xl bg-white border-2 border-black shadow-neo-sm flex items-center justify-center group-hover:bg-neo-yellow group-hover:shadow-neo group-hover:-translate-y-1 transition-all duration-300">
                    <Icon size={18} className="text-black" />
                  </span>
                  <span className="font-bold text-black group-hover:underline">{label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <Card className="flex flex-col gap-4 p-8 bg-white border-4 border-black shadow-neo">
              {sent ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-xl bg-neo-green border-2 border-black text-sm font-bold text-black shadow-neo flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">✨</span> Pesan terkirim! Saya akan segera membalas.
                  </motion.div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-black font-bold">Nama</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-white border-2 border-black rounded-md shadow-neo-sm focus-visible:ring-0 focus-visible:border-black focus-visible:-translate-y-0.5 transition-transform"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-black font-bold">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-white border-2 border-black rounded-md shadow-neo-sm focus-visible:ring-0 focus-visible:border-black focus-visible:-translate-y-0.5 transition-transform"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-black font-bold">Pesan</Label>
                    <Textarea
                      id="message"
                      placeholder="Hai Emir, saya ingin mengajak kolaborasi..."
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="bg-white border-2 border-black rounded-md shadow-neo-sm focus-visible:ring-0 focus-visible:border-black resize-none focus-visible:-translate-y-0.5 transition-transform"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={sending || !form.name || !form.email || !form.message}
                    className="mt-2 w-full py-6 rounded-xl border-2 border-black bg-neo-purple text-black font-bold shadow-neo hover:bg-neo-yellow hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-neo"
                  >
                    <Send size={16} className={cn("mr-2", sending ? "animate-pulse" : "")} />
                    {sending ? 'Mengirim...' : 'Kirim Pesan'}
                  </Button>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
