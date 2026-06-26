'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { adminDb } from '@/lib/adminDb'
import { Experience } from '@/types'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyForm: Omit<Experience, 'id' | 'created_at'> = {
  title: '',
  company: '',
  type: 'internship',
  location: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  tech_stack: [],
}

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [techInput, setTechInput] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchExperiences = async () => {
    const { data } = await supabase.from('experiences').select('*').order('start_date', { ascending: false })
    setExperiences(data ?? [])
  }

  useEffect(() => { fetchExperiences() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setTechInput(''); setOpen(true) }
  const openEdit = (e: Experience) => { setEditing(e); setForm({ title: e.title, company: e.company, type: e.type, location: e.location, start_date: e.start_date, end_date: e.end_date ?? '', is_current: e.is_current, description: e.description, tech_stack: e.tech_stack }); setTechInput(''); setOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const payload = { ...form, end_date: form.is_current ? null : form.end_date }
    if (editing) {
      await adminDb('experiences', 'update', payload, editing.id)
      toast.success('Pengalaman diperbarui!')
    } else {
      await adminDb('experiences', 'insert', payload)
      toast.success('Pengalaman ditambahkan!')
    }
    setSaving(false); setOpen(false); fetchExperiences()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pengalaman ini?')) return
    await adminDb('experiences', 'delete', undefined, id)
    toast.success('Pengalaman dihapus.')
    fetchExperiences()
  }

  const addTech = () => {
    if (techInput.trim() && !form.tech_stack.includes(techInput.trim())) {
      setForm({ ...form, tech_stack: [...form.tech_stack, techInput.trim()] })
      setTechInput('')
    }
  }

  const typeLabel = { internship: 'Internship / PKL', freelance: 'Freelance', fulltime: 'Full-time' }

  function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return ''
    const [year, month] = dateStr.split('-')
    if (!year || !month) return dateStr
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[20px] font-semibold text-[#1A1A18]">Experience</h1>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-[13px] font-medium hover:bg-accent-dark transition-colors">
          <Plus size={15} /> Tambah
        </button>
      </div>

      <div className="bg-white border border-[#E5E4DF] rounded-xl overflow-hidden">
        {experiences.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-[#6B6B68]">Belum ada pengalaman. Klik "Tambah" untuk mulai.</div>
        ) : (
          experiences.map((e, i) => (
            <div key={e.id} className={`flex items-center gap-4 p-4 ${i < experiences.length - 1 ? 'border-b border-[#E5E4DF]' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-[#1A1A18] truncate">{e.title}</p>
                <p className="text-[12px] text-[#6B6B68]">{e.company} · {typeLabel[e.type]} · {formatDate(e.start_date)} — {e.is_current ? 'Sekarang' : formatDate(e.end_date)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-[#F7F6F3] text-[#6B6B68] hover:text-accent transition-colors"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B6B68] hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E4DF]">
              <h2 className="text-[15px] font-semibold text-[#1A1A18]">{editing ? 'Edit Experience' : 'Tambah Experience'}</h2>
              <button onClick={() => setOpen(false)}><X size={18} className="text-[#6B6B68]" /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <input placeholder="Jabatan / Posisi" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" />
              <input placeholder="Nama perusahaan / klien" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="input-field" />
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Experience['type'] })} className="input-field">
                <option value="internship">Internship / PKL</option>
                <option value="freelance">Freelance</option>
                <option value="fulltime">Full-time</option>
              </select>
              <input placeholder="Lokasi (misal: Bandung)" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-[#6B6B68] mb-1">Mulai</p>
                  <input type="month" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="input-field" />
                </div>
                <div>
                  <p className="text-[11px] text-[#6B6B68] mb-1">Selesai</p>
                  <input type="month" value={form.end_date} disabled={form.is_current} onChange={e => setForm({ ...form, end_date: e.target.value })} className="input-field disabled:opacity-40" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-[13px] text-[#6B6B68] cursor-pointer">
                <input type="checkbox" checked={form.is_current} onChange={e => setForm({ ...form, is_current: e.target.checked })} className="accent-accent" />
                Masih berlangsung saat ini
              </label>
              <textarea placeholder="Deskripsi pekerjaan" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />

              <div>
                <div className="flex gap-2">
                  <input placeholder="Tech stack (Enter)" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} className="input-field flex-1" />
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

              <button onClick={handleSave} disabled={saving || !form.title || !form.company} className="w-full py-2.5 rounded-lg bg-accent text-white text-[13px] font-medium hover:bg-accent-dark transition-colors disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
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
