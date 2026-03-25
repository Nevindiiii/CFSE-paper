import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Bell, StickyNote, CheckSquare, Mail, Calendar,
  BarChart2, Users, Building2, Puzzle, Settings, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import logo from '@/assets/Logogram (1).png'

const mainNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/emails', label: 'Emails', icon: Mail, hasArrow: true },
  { to: '/calendars', label: 'Calendars', icon: Calendar },
]

const dbNav = [
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/contacts', label: 'Contacts', icon: Users },
  { to: '/companies', label: 'Companies', icon: Building2 },
]

const bottomNav = [
  { to: '/integrations', label: 'Integrations', icon: Puzzle },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function NavItem({ to, label, icon: Icon, hasArrow, collapsed }: { to: string; label: string; icon: React.ElementType; hasArrow?: boolean; collapsed?: boolean }) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
          collapsed ? 'justify-center px-2' : '',
          isActive
            ? 'bg-gray-100 text-gray-900 font-medium'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={16} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
          {!collapsed && <span className="flex-1">{label}</span>}
          {!collapsed && hasArrow && <ChevronDown size={14} className="text-gray-400" />}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ collapsed = false, onCollapse: _ }: { collapsed?: boolean; onCollapse?: (c: boolean) => void }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className={cn(
      'hidden lg:flex flex-col h-screen sticky top-0 bg-white border-r border-gray-200 shrink-0 transition-all duration-300',
      collapsed ? 'w-14' : 'w-52'
    )}>
      {/* Brand */}
      <div className={cn('flex items-center gap-2 px-4 py-4 border-b border-gray-100', collapsed && 'justify-center px-2')}>
        <img src={logo} alt="logo" className="w-6 h-6 shrink-0" />
        {!collapsed && <span className="font-semibold text-gray-900 text-sm">Venture</span>}
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {mainNav.map(item => <NavItem key={item.to} {...item} collapsed={collapsed} />)}

        {!collapsed && <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 pt-4 pb-1">Database</p>}
        {collapsed && <div className="my-2 border-t border-gray-100" />}
        {dbNav.map(item => <NavItem key={item.to} {...item} collapsed={collapsed} />)}
      </div>

      <div className="px-2 py-3 border-t border-gray-100 space-y-0.5">
        {bottomNav.map(item => <NavItem key={item.to} {...item} collapsed={collapsed} />)}
      </div>

      {/* Workspace footer */}
      <div className={cn('px-3 py-3 border-t border-gray-100 flex items-center gap-2', collapsed && 'justify-center px-2')}>
        <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center shrink-0">
          <span className="text-white text-[10px] font-bold">M</span>
        </div>
        {!collapsed && (
          <>
            <span className="text-xs text-gray-600 flex-1 truncate">Marketing Team's</span>
            <button onClick={() => { logout(); navigate('/login') }} className="text-gray-400 hover:text-gray-600">
              <ChevronDown size={14} />
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
