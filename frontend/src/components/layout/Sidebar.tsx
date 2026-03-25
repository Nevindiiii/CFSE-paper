import { NavLink } from 'react-router-dom'
import { StickyNote, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/notes', label: 'Notes', icon: StickyNote },
]

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="px-6 py-5 text-lg font-bold tracking-tight border-b border-white/10">
        CRM App
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
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
    </aside>
  )
}
