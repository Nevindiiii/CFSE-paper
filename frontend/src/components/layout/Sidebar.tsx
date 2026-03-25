import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { StickyNote, LayoutDashboard, User, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  { to: '/profile', label: 'Profile', icon: User },
]

function NavItems({ onClose }: { onClose?: () => void }) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
              isActive
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            )
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-sidebar flex items-center px-4 border-b border-white/10">
        <button onClick={() => setOpen(true)} className="text-white p-1">
          <Menu size={22} />
        </button>
        <span className="ml-3 text-white font-bold text-base">CRM App</span>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside className={cn(
        'lg:hidden fixed top-0 left-0 z-50 h-full w-60 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-200',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="px-6 py-5 text-lg font-bold tracking-tight border-b border-white/10 flex items-center justify-between">
          CRM App
          <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <NavItems onClose={() => setOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 min-h-screen bg-sidebar text-sidebar-foreground flex-col">
        <div className="px-6 py-5 text-lg font-bold tracking-tight border-b border-white/10">
          CRM App
        </div>
        <NavItems />
      </aside>
    </>
  )
}
