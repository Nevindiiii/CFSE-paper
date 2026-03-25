import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { StickyNote, LayoutDashboard, User, Menu, X, LogOut, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  { to: '/profile', label: 'Profile', icon: User },
]

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn('flex items-center border-b border-black/8 transition-all duration-300', collapsed ? 'justify-center px-0 py-5' : 'gap-3 px-5 py-5')}>
      <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shrink-0">
        <Zap size={15} className="text-white" fill="white" />
      </div>
      {!collapsed && (
        <div>
          <p className="text-black font-bold text-sm tracking-wide leading-none">CRM App</p>
          <p className="text-black/40 text-[10px] mt-0.5 tracking-widest uppercase">Workspace</p>
        </div>
      )}
    </div>
  )
}

function NavItems({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  return (
    <nav className="flex-1 px-2 py-4 space-y-0.5">
      {!collapsed && (
        <p className="text-black/30 text-[10px] font-semibold tracking-widest uppercase px-3 mb-3">Menu</p>
      )}
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          title={collapsed ? label : undefined}
          className={({ isActive }) =>
            cn(
              'group relative flex items-center rounded-xl text-sm transition-all duration-200',
              collapsed ? 'justify-center px-0 py-2.5 mx-1' : 'gap-3 px-3 py-2.5',
              isActive
                ? 'bg-black text-white font-medium'
                : 'text-black/70 hover:bg-black hover:text-white'
            )
          }
        >
          {({ isActive }) => (
            <>
              <span className={cn(
                'flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 shrink-0',
                isActive ? 'text-white' : 'text-black/60 group-hover:text-white'
              )}>
                <Icon size={15} />
              </span>
              {!collapsed && <span className="tracking-wide">{label}</span>}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function BottomSection({ collapsed, onLogout }: { collapsed: boolean; onLogout: () => void }) {
  return (
    <div className={cn('py-4 border-t border-black/8 space-y-1', collapsed ? 'px-2' : 'px-2')}>
      {!collapsed && (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center shrink-0">
            <User size={13} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-black/80 text-xs font-medium truncate">My Account</p>
            <p className="text-black/40 text-[10px] truncate">user@example.com</p>
          </div>
        </div>
      )}
      <button
        onClick={onLogout}
        title={collapsed ? 'Sign out' : undefined}
        className={cn(
          'w-full group flex items-center rounded-xl text-sm text-black/50 hover:bg-black hover:text-white transition-all duration-200',
          collapsed ? 'justify-center px-0 py-2.5 mx-1' : 'gap-3 px-3 py-2.5'
        )}
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 shrink-0">
          <LogOut size={14} />
        </span>
        {!collapsed && <span className="tracking-wide">Sign out</span>}
      </button>
    </div>
  )
}

export default function Sidebar({ onCollapse }: { onCollapse?: (c: boolean) => void }) {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const toggleCollapse = () => {
    const next = !collapsed
    setCollapsed(next)
    onCollapse?.(next)
  }

  const sidebarBase = 'flex flex-col h-full bg-white text-black border-r border-black/10 transition-all duration-300'

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white flex items-center px-4 border-b border-black/10">
        <button onClick={() => setOpen(true)} className="text-black/60 hover:text-black p-1 transition-colors">
          <Menu size={22} />
        </button>
        <span className="ml-3 text-black font-bold text-base tracking-wide">CRM App</span>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={cn(
        'lg:hidden fixed top-0 left-0 z-50 h-full w-64 transition-transform duration-300 ease-in-out',
        sidebarBase,
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between pr-4">
          <Brand collapsed={false} />
          <button onClick={() => setOpen(false)} className="text-black/40 hover:text-black transition-colors">
            <X size={18} />
          </button>
        </div>
        <NavItems collapsed={false} onClose={() => setOpen(false)} />
        <BottomSection collapsed={false} onLogout={handleLogout} />
      </aside>

      {/* Desktop sidebar */}
      <aside className={cn('hidden lg:flex min-h-screen flex-col relative', sidebarBase, collapsed ? 'w-16' : 'w-64')}>
        <Brand collapsed={collapsed} />
        <NavItems collapsed={collapsed} />
        <BottomSection collapsed={collapsed} onLogout={handleLogout} />

        {/* Collapse toggle button */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-white border border-black/15 shadow-sm flex items-center justify-center text-black/50 hover:text-black hover:shadow-md transition-all duration-200"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  )
}
