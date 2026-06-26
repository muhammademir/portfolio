'use client'

import { useState } from 'react'
import { Certificate } from '@/types'
import { ZoomIn, Download, X, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
  certificates: Certificate[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Certificates({ certificates }: Props) {
  const [preview, setPreview] = useState<Certificate | null>(null)

  return (
    <section id="certificates" className="py-20 border-t-4 border-black relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-6 relative z-10"
      >
        <p className="text-sm font-bold text-black uppercase tracking-widest mb-6 inline-block bg-neo-pink border-2 border-black px-3 py-1 shadow-neo-sm transform rotate-2">
          Certificates
        </p>
        <h2 className="text-4xl md:text-5xl font-bold font-serif text-black mb-10 tracking-tight">
          Sertifikasi & kursus
        </h2>

        {certificates.length === 0 ? (
          <p className="text-[14px] text-[#6B6B68]">Belum ada sertifikat yang ditambahkan.</p>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            {certificates.map((cert) => (
              <motion.div
                variants={itemVariants}
                key={cert.id}
              >
                <Card 
                  onClick={() => (cert.image_url || cert.pdf_url) && setPreview(cert)}
                  className="group overflow-hidden bg-white hover:shadow-neo-lg transition-all duration-300 hover:-translate-y-1 border-4 border-black h-full flex flex-col cursor-pointer p-0 shadow-neo rounded-xl"
                >
                  {/* Thumbnail */}
                  <div className="h-28 bg-neo-yellow flex items-center justify-center overflow-hidden border-b-4 border-black relative flex-shrink-0">
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-300 z-10"></div>
                    {cert.image_url ? (
                      <img
                        src={cert.image_url}
                        alt={cert.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                      />
                    ) : cert.pdf_url ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-black group-hover:scale-110 transition-transform duration-300">
                        <FileText size={32} />
                        <span className="text-[10px] font-bold mt-1">PDF</span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                        🏅
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <p className="text-sm font-bold text-black leading-tight mb-1 group-hover:text-neo-purple transition-colors">
                      {cert.name}
                    </p>
                    <p className="text-xs text-gray-800 font-bold mb-3 flex-1">
                      {cert.issuer} <span className="mx-0.5 text-black">•</span> {cert.year}
                    </p>
                    <div className="flex gap-2">
                      {(cert.image_url || cert.pdf_url) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); setPreview(cert); }}
                          className="h-8 text-xs font-bold text-black border-2 border-transparent hover:border-black transition-colors z-20 relative"
                        >
                          <ZoomIn size={14} className="mr-1.5" /> Lihat
                        </Button>
                      )}
                      {cert.pdf_url && (
                        <a 
                          href={cert.pdf_url} 
                          download
                          onClick={(e) => e.stopPropagation()}
                          className={buttonVariants({ variant: "ghost", size: "sm", className: "h-8 text-xs font-bold text-black border-2 border-transparent hover:border-black transition-colors z-20 relative" })}
                        >
                          <Download size={14} className="mr-1.5" /> PDF
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Lightbox modal via Shadcn Dialog */}
      <Dialog open={!!preview} onOpenChange={(isOpen) => !isOpen && setPreview(null)}>
        {preview && (
          <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white border-4 border-black shadow-neo-lg gap-0">
            <DialogHeader className="sr-only">
              <DialogTitle>{preview.name}</DialogTitle>
            </DialogHeader>
            <div className="bg-neo-blue flex justify-center border-b-4 border-black p-4">
              {preview.image_url ? (
                <img
                  src={preview.image_url}
                  alt={preview.name}
                  className="w-full object-contain max-h-[70vh]"
                />
              ) : preview.pdf_url ? (
                <iframe
                  src={`${preview.pdf_url}#toolbar=0&view=FitH`}
                  title={preview.name}
                  className="w-full aspect-[1.414/1] max-h-[70vh] border-none bg-white"
                />
              ) : null}
            </div>
            <div className="p-6 flex flex-wrap items-center justify-between gap-4 bg-white">
              <div>
                <p className="text-lg font-bold text-black">{preview.name}</p>
                <p className="text-sm text-gray-800 font-bold mt-1">{preview.issuer} <span className="mx-1 text-black">•</span> {preview.year}</p>
              </div>
              {preview.pdf_url && (
                <a
                  href={preview.pdf_url}
                  download
                  className={buttonVariants({ variant: "default", className: "border-2 border-black shadow-neo-sm font-bold text-black" })}
                >
                  <Download size={16} className="mr-2" /> Download PDF
                </a>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  )
}
