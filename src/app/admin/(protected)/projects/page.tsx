'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { adminDb } from '@/lib/adminDb'
import { Project } from '@/types'
import { Plus, Pencil, Trash2, X, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyForm: Omit<Project, 'id' | 'created_at'> = {
  title: '',
  description: '',
  tech_stack: [],
  category: 'web',
  image_url: '',
  github_url: '',
  case_study_url: '',
  demo_url: '',
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [techInput, setTechInput] = useState('')
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data ?? [])
  }

  useEffect(() => { fetchProjects() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setTechInput('')
    setExistingImages([])
    setImageFiles([])
    setOpen(true)
  }

  const openEdit = (p: Project) => {
    setEditing(p)
    setForm({ title: p.title, description: p.description, tech_stack: p.tech_stack, category: p.category, image_url: p.image_url ?? '', github_url: p.github_url ?? '', case_study_url: p.case_study_url ?? '', demo_url: p.demo_url ?? '' })
    setTechInput('')
    setExistingImages(p.image_url ? p.image_url.split(',') : [])
    setImageFiles([])
    setOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    let newUrls: string[] = []

    // Upload gambar baru kalau ada
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        const ext = file.name.split('.').pop()
        const filename = `projects/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`
        const { data: uploadData } = await supabase.storage.from('portfolio').upload(filename, file)
        if (uploadData) {
          const { data: urlData } = supabase.storage.from('portfolio').getPublicUrl(filename)
          newUrls.push(urlData.publicUrl)
        }
      }
    }

    const finalImageUrls = [...existingImages, ...newUrls].join(',')

    if (editing) {
      await adminDb('projects', 'update', { ...form, image_url: finalImageUrls }, editing.id)
      toast.success('Project diperbarui!')
    } else {
      await adminDb('projects', 'insert', { ...form, image_url: finalImageUrls })
      toast.success('Project ditambahkan!')
    }

    setSaving(false)
    setOpen(false)
    fetchProjects()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus project ini?')) return
    await adminDb('projects', 'delete', undefined, id)
    toast.success('Project dihapus.')
    fetchProjects()
  }

  const addTech = () => {
    if (techInput.trim() && !form.tech_stack.includes(techInput.trim())) {
      setForm({ ...form, tech_stack: [...form.tech_stack, techInput.trim()] })
      setTechInput('')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[20px] font-semibold text-[#1A1A18]">Projects</h1>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-[13px] font-medium hover:bg-accent-dark transition-colors">
          <Plus size={15} /> Tambah
        </button>
      </div>

      {/* List */}
      <div className="bg-white border border-[#E5E4DF] rounded-xl overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-[#6B6B68]">Belum ada project. Klik "Tambah" untuk mulai.</div>
        ) : (
          projects.map((p, i) => (
            <div key={p.id} className={`flex items-center gap-4 p-4 ${i < projects.length - 1 ? 'border-b border-[#E5E4DF]' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-[#1A1A18] truncate">{p.title}</p>
                <p className="text-[12px] text-[#6B6B68]">{p.tech_stack.join(' · ')} · {p.category}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-[#F7F6F3] text-[#6B6B68] hover:text-accent transition-colors"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B6B68] hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E4DF]">
              <h2 className="text-[15px] font-semibold text-[#1A1A18]">{editing ? 'Edit Project' : 'Tambah Project'}</h2>
              <button onClick={() => setOpen(false)}><X size={18} className="text-[#6B6B68]" /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <input placeholder="Judul project" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" />
              <textarea placeholder="Deskripsi" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Project['category'] })} className="input-field">
                <option value="web">Web</option>
                <option value="iot">IoT</option>
                <option value="design">Desain</option>
                <option value="mobile">Mobile</option>
                <option value="uiux">UI/UX</option>
              </select>
              {/* Tech stack */}
              <div>
                <div className="flex gap-2">
                  <input placeholder="Tambah tech (Enter)" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} className="input-field flex-1" />
                  <button onClick={addTech} className="px-3 py-2 rounded-lg border border-[#E5E4DF] text-[13px] text-[#6B6B68] hover:bg-[#F7F6F3]">+</button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tech_stack.map(t => (
                    <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EEEDFE] text-[#3C3489] text-[11px]">
                      {t}
                      <button onClick={() => setForm({ ...form, tech_stack: form.tech_stack.filter(x => x !== t) })}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image upload */}
              <div>
                <p className="text-[12px] text-[#6B6B68] mb-2">Gambar project (Bisa upload lebih dari satu)</p>
                
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {existingImages.map((url, idx) => (
                      <div key={idx} className="relative group rounded-md overflow-hidden w-20 h-20 border border-[#E5E4DF]">
                        <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Files List */}
                {imageFiles.length > 0 && (
                  <div className="flex flex-col gap-1 mb-3">
                    {imageFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-1.5 bg-[#F7F6F3] rounded-md text-[12px]">
                        <span className="truncate max-w-[250px] text-[#1A1A18] flex items-center gap-2">
                          <ImageIcon size={14} className="text-[#6B6B68]" />
                          {file.name}
                        </span>
                        <button onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))} className="text-red-500 hover:bg-red-50 p-1 rounded">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative border-2 border-dashed border-[#E5E4DF] rounded-xl hover:border-accent transition-colors bg-[#F7F6F3]/50">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={e => {
                      if (e.target.files) {
                        setImageFiles([...imageFiles, ...Array.from(e.target.files)])
                        e.target.value = '' // Reset input
                      }
                    }} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <div className="py-6 flex flex-col items-center justify-center text-[#6B6B68]">
                    <Plus size={20} className="mb-2 text-[#1A1A18]" />
                    <span className="text-[13px] font-medium text-[#1A1A18]">Klik untuk upload gambar</span>
                    <span className="text-[11px] mt-1">PNG, JPG, WEBP hingga 5MB</span>
                  </div>
                </div>
              </div>

              <input placeholder="GitHub URL (opsional)" value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} className="input-field" />
              <input placeholder="Case Study URL (opsional)" value={form.case_study_url} onChange={e => setForm({ ...form, case_study_url: e.target.value })} className="input-field" />
              <input placeholder="Demo URL (opsional)" value={form.demo_url} onChange={e => setForm({ ...form, demo_url: e.target.value })} className="input-field" />

              <button onClick={handleSave} disabled={saving || !form.title || !form.description} className="w-full py-2.5 rounded-lg bg-accent text-white text-[13px] font-medium hover:bg-accent-dark transition-colors disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #E5E4DF;
          font-size: 13px;
          color: #1A1A18;
          background: white;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-field:focus { border-color: #7F77DD; }
        .input-field::placeholder { color: #6B6B68; }
      `}</style>
    </div>
  )
}
