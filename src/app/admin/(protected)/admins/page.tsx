'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Admin {
  id: string
  name: string
  username: string
  created_at: string
}

const emptyForm = {
  name: '',
  username: '',
  password: '',
}

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Admin | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/admins')
      if (!res.ok) throw new Error('Gagal memuat data')
      const { data } = await res.json()
      setAdmins(data ?? [])
    } catch (e: any) {
      toast.error(e.message)
      setAdmins([])
    }
  }

  useEffect(() => { fetchAdmins() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (a: Admin) => {
    setEditing(a)
    setForm({ name: a.name, username: a.username, password: '' })
    setOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editing ? 'update' : 'insert',
          payload: form,
          id: editing?.id
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Terjadi kesalahan')
      }

      toast.success(editing ? 'Admin diperbarui!' : 'Admin ditambahkan!')
      setOpen(false)
      fetchAdmins()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus admin ini?')) return
    
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          id: id
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Terjadi kesalahan')
      }

      toast.success('Admin dihapus.')
      fetchAdmins()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[20px] font-semibold text-[#1A1A18]">Admins</h1>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-[13px] font-medium hover:bg-accent-dark transition-colors">
          <Plus size={15} /> Tambah Admin
        </button>
      </div>

      {/* List */}
      <div className="bg-white border border-[#E5E4DF] rounded-xl overflow-hidden">
        {admins.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-[#6B6B68]">Belum ada admin.</div>
        ) : (
          admins.map((a, i) => (
            <div key={a.id} className={`flex items-center gap-4 p-4 ${i < admins.length - 1 ? 'border-b border-[#E5E4DF]' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-[#1A1A18] truncate">{a.name}</p>
                <p className="text-[12px] text-[#6B6B68]">@{a.username}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-[#F7F6F3] text-[#6B6B68] hover:text-accent transition-colors"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B6B68] hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E4DF]">
              <h2 className="text-[15px] font-semibold text-[#1A1A18]">{editing ? 'Edit Admin' : 'Tambah Admin'}</h2>
              <button onClick={() => setOpen(false)}><X size={18} className="text-[#6B6B68]" /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <input 
                placeholder="Nama Lengkap" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                className="input-field" 
              />
              <input 
                placeholder="Username" 
                value={form.username} 
                onChange={e => setForm({ ...form, username: e.target.value })} 
                className="input-field" 
              />
              <input 
                type="password"
                placeholder={editing ? "Password Baru (Opsional)" : "Password"} 
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
                className="input-field" 
              />

              <button 
                onClick={handleSave} 
                disabled={saving || !form.name || !form.username || (!editing && !form.password)} 
                className="w-full py-2.5 rounded-lg bg-accent text-white text-[13px] font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 mt-2"
              >
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
