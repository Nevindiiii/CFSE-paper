import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/notes': 'Notes',
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? 'CRM'

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-6 bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
