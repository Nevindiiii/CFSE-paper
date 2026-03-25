import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/notes': 'Notes',
  '/profile': 'Profile',
  '/analytics': 'Analytics',
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? 'CRM'
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} collapsed={collapsed} onToggleCollapse={() => setCollapsed(c => !c)} />
        <main className="flex-1 bg-white overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
