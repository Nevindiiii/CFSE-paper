import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, HelpCircle, ChevronDown, Command } from 'lucide-react'
import { getProfileApi, type UserProfile } from '@/services/authService'

interface HeaderProps {
  title: string
  collapsed: boolean
  onToggleCollapse: () => void
}

export default function Header({ title: _, collapsed, onToggleCollapse }: HeaderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getProfileApi().then(({ data }) => setUser(data)).catch(() => {})
  }, [])
  return (
    <header className="hidden lg:flex h-12 border-b border-gray-200 bg-white items-center px-4 gap-4 shrink-0 sticky top-0 z-10">
      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="text-gray-400 hover:text-gray-600 flex items-center gap-0.5 font-mono text-xs select-none"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '>' : '<>'}
      </button>

      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-xs bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
        <Search size={13} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none flex-1 w-full"
        />
        <div className="flex items-center gap-0.5 text-gray-400">
          <Command size={11} />
          <span className="text-xs">F</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Help */}
      <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <HelpCircle size={15} />
        <span>Help Center</span>
      </button>

      {/* User */}
      <button onClick={() => navigate('/profile')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center">
          <span className="text-white text-xs font-semibold">
            {user ? user.name.charAt(0).toUpperCase() : '?'}
          </span>
        </div>
        <span className="text-sm text-gray-700 font-medium">
          {user ? user.name.split(' ').slice(0, 2).join(' ') : '…'}
        </span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
    </header>
  )
}
