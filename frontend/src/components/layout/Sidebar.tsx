import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { StickyNote, LayoutDashboard, User, Menu, X, LogOut, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  { to: '/profile', label: 'Profile', icon: User },
]

function Brand() {
  return (
    <div className="px-5 py-5 flex items-center gap-3 border-b border-white/8">
      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
        <Zap size={15} className="text-white" fill="white" />
      </div>
      <div>
        <p className="text-white font-bold text-sm tracking-wide leading-none">CRM App</p>
        <p className="text-white/35 text-[10px] mt-0.5 tracking-widest uppercase">Workspace</p>
      </div>
    </div>
  )
}

function NavItems({ onClose }: { onClose?: () => void }) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      <p className="text-white/25 text-[10px] font-semibold tracking-widest uppercase px-3 mb-3">Menu</p>
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
              isActive
                ? 'bg-white/10 text-white font-medium shadow-inner'
                : 'text-white/50 hover:bg-white/6 hover:text-white/90'
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-full shadow-[0_0_8px_2px_rgba(96,165,250,0.6)]" />
              )}
              <span className={cn(
                'flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-white/40 group-hover:bg-white/8 group-hover:text-white/80'
              )}>
                <Icon size={15} />
              </span>
              <span className="tracking-wide">{label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_2px_rgba(96,165,250,0.7)]" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function BottomSection({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="px-3 py-4 border-t border-white/8 space-y-1">
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-400 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
          <User size={13} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-xs font-medium truncate">My Account</p>
          <p className="text-white/30 text-[10px] truncate">user@example.com</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-lg group-hover:bg-red-500/15 transition-all duration-200">
          <LogOut size={14} />
        </span>
        <span className="tracking-wide">Sign out</span>
      </button>
    </div>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarClass = 'flex flex-col h-full bg-[hsl(222.2,47.4%,9%)] text-sidebar-foreground border-r border-white/6'

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[hsl(222.2,47.4%,9%)] flex items-center px-4 border-b border-white/8">
        <button onClick={() => setOpen(true)} className="text-white/60 hover:text-white p-1 transition-colors">
          <Menu size={22} />
        </button>
        <span className="ml-3 text-white font-bold text-base tracking-wide">CRM App</span>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside className={cn(
        'lg:hidden fixed top-0 left-0 z-50 h-full w-64 transition-transform duration-300 ease-in-out',
        sidebarClass,
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between pr-4">
          <Brand />
          <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <NavItems onClose={() => setOpen(false)} />
        <BottomSection onLogout={handleLogout} />
      </aside>

      {/* Desktop sidebar */}
      <aside className={cn('hidden lg:flex w-64 min-h-screen flex-col', sidebarClass)}>
        <Brand />
        <NavItems />
        <BottomSection onLogout={handleLogout} />
      </aside>
    </>
  )
}
