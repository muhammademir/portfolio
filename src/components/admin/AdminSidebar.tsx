'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, FolderOpen, Briefcase, Award, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-52 min-h-screen border-r border-[#E5E4DF] bg-white flex flex-col py-6 px-3">
      {/* Logo */}
      <div className="px-3 mb-8">
        <p className="text-[15px] font-semibold text-[#1A1A18]">
          Emir<span className="text-accent">.</span>
          <span className="text-[11px] text-[#6B6B68] font-normal ml-1">Admin</span>
        </p>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-[10px] text-[#6B6B68] uppercase tracking-widest px-3 mb-2">Menu</p>
        {menuItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors',
              pathname === href
                ? 'bg-[#EEEDFE] text-accent font-medium'
                : 'text-[#6B6B68] hover:bg-[#F7F6F3] hover:text-[#1A1A18]'
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={() => signOut({ callbackUrl: '/admin/login' })}
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-red-500 hover:bg-red-50 transition-colors"
      >
        <LogOut size={15} />
        Logout
      </button>
    </aside>
  )
}
