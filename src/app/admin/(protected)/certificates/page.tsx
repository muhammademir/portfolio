'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { adminDb } from '@/lib/adminDb'
import { Certificate } from '@/types'
import { Plus, Trash2, X, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyForm = { name: '', issuer: '', year: '' }

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchCerts = async () => {
    const { data } = await supabase.from('certificates').select('*').order('year', { ascending: false })
    setCertificates(data ?? [])
  }

  useEffect(() => { fetchCerts() }, [])

  const uploadFile = async (file: File, folder: string) => {
    const ext = file.name.split('.').pop()
    const filename = `${folder}/${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('portfolio').upload(filename, file)
    if (error || !data) {
      console.error('Upload Error:', error)
      toast.error(`Gagal mengupload ${file.name}`)
      return ''
    }
    const { data: urlData } = supabase.storage.from('portfolio').getPublicUrl(filename)
    return urlData.publicUrl
  }

  const handleSave = async () => {
    setSaving(true)
    let imageUrl = ''
    let pdfUrl = ''

    if (imageFile) {
      imageUrl = await uploadFile(imageFile, 'certificates/images')
      if (!imageUrl) {
        setSaving(false)
        return
      }
    }
    
    if (pdfFile) {
      pdfUrl = await uploadFile(pdfFile, 'certificates/pdfs')
      if (!pdfUrl) {
        setSaving(false)
        return
      }
    }

    await adminDb('certificates', 'insert', { ...form, image_url: imageUrl || null, pdf_url: pdfUrl || null })
    toast.success('Sertifikat ditambahkan!')
    setSaving(false); setOpen(false); setForm(emptyForm); setImageFile(null); setPdfFile(null)
    fetchCerts()
  }

  const handleDelete = (cert: Certificate) => {
    toast((t) => (
      <div className="flex flex-col gap-2 min-w-[200px]">
        <p className="text-[13px] font-medium text-[#1A1A18]">Hapus sertifikat ini?</p>
        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-[12px] font-medium text-[#6B6B68] bg-[#F7F6F3] rounded-md hover:bg-[#E5E4DF] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              await adminDb('certificates', 'delete', undefined, cert.id)
              toast.success('Sertifikat dihapus.')
              fetchCerts()
            }}
            className="px-3 py-1.5 text-[12px] font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    ), { duration: Infinity, id: `delete-${cert.id}` })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[20px] font-semibold text-[#1A1A18]">Certificates</h1>
        <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-[13px] font-medium hover:bg-accent-dark transition-colors">
          <Plus size={15} /> Upload
        </button>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white border border-[#E5E4DF] rounded-xl p-8 text-center text-[13px] text-[#6B6B68]">
          Belum ada sertifikat. Klik "Upload" untuk menambahkan.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {certificates.map((cert) => (
            <div key={cert.id} className="border border-[#E5E4DF] rounded-xl overflow-hidden bg-white group relative">
              <div className="h-24 bg-[#F7F6F3] flex items-center justify-center overflow-hidden border-b border-[#E5E4DF]">
                {cert.image_url
                  ? <img src={cert.image_url} alt={cert.name} className="w-full h-full object-cover" />
                  : cert.pdf_url
                  ? <div className="flex flex-col items-center justify-center text-[#6B6B68]"><FileText size={24} /><span className="text-[10px] font-bold mt-1">PDF</span></div>
                  : <span className="text-3xl">🏅</span>
                }
              </div>
              <div className="p-3">
                <p className="text-[11px] font-medium text-[#1A1A18] leading-tight mb-0.5">{cert.name}</p>
                <p className="text-[10px] text-[#6B6B68]">{cert.issuer} · {cert.year}</p>
              </div>
              <button
                onClick={() => handleDelete(cert)}
                className="absolute top-2 right-2 p-1 rounded-lg bg-white/80 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity border border-[#E5E4DF]"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E4DF]">
              <h2 className="text-[15px] font-semibold text-[#1A1A18]">Upload Sertifikat</h2>
              <button onClick={() => setOpen(false)}><X size={18} className="text-[#6B6B68]" /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <input placeholder="Nama sertifikat" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" />
              <input placeholder="Penerbit (BNSP, Dicoding, dll)" value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} className="input-field" />
              <input placeholder="Tahun (misal: 2024)" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className="input-field" />

              <div>
                <p className="text-[12px] text-[#6B6B68] mb-1">Gambar sertifikat (JPG/PNG)</p>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} className="text-[13px] text-[#6B6B68] w-full" />
              </div>

              <div>
                <p className="text-[12px] text-[#6B6B68] mb-1">File PDF (opsional)</p>
                <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0] ?? null)} className="text-[13px] text-[#6B6B68] w-full" />
              </div>

              <button onClick={handleSave} disabled={saving || !form.name || !form.issuer || !form.year} className="w-full py-2.5 rounded-lg bg-accent text-white text-[13px] font-medium hover:bg-accent-dark transition-colors disabled:opacity-50">
                {saving ? 'Mengupload...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .input-field { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #E5E4DF; font-size: 13px; color: #1A1A18; background: white; outline: none; transition: border-color 0.15s; }
        .input-field:focus { border-color: #7F77DD; }
        .input-field::placeholder { color: #6B6B68; }
      `}</style>
    </div>
  )
}
