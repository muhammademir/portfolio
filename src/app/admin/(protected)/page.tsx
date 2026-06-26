import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FolderOpen, Briefcase, Award, ArrowRight } from 'lucide-react'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  const [
    { count: projectCount },
    { count: expCount },
    { count: certCount },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('experiences').select('*', { count: 'exact', head: true }),
    supabase.from('certificates').select('*', { count: 'exact', head: true }),
  ])

  const cards = [
    { label: 'Projects', count: projectCount ?? 0, icon: FolderOpen, href: '/admin/projects', color: 'bg-[#EEEDFE] text-accent' },
    { label: 'Experience', count: expCount ?? 0, icon: Briefcase, href: '/admin/experience', color: 'bg-[#E1F5EE] text-emerald-700' },
    { label: 'Certificates', count: certCount ?? 0, icon: Award, href: '/admin/certificates', color: 'bg-[#FAEEDA] text-amber-700' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[20px] font-semibold text-[#1A1A18]">Dashboard</h1>
        <p className="text-[13px] text-[#6B6B68] mt-1">
          Selamat datang, {session?.user?.name ?? 'Admin'} 👋
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map(({ label, count, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white border border-[#E5E4DF] rounded-xl p-5 hover:shadow-sm transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
              <ArrowRight size={15} className="text-[#E5E4DF] group-hover:text-accent transition-colors mt-1" />
            </div>
            <p className="text-[26px] font-semibold text-[#1A1A18]">{count}</p>
            <p className="text-[13px] text-[#6B6B68]">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-[#F7F6F3] border border-[#E5E4DF]">
        <p className="text-[12px] text-[#6B6B68]">
          Perubahan yang kamu buat akan langsung tampil di halaman publik dalam ~60 detik.
        </p>
      </div>
    </div>
  )
}
