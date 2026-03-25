import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="hidden lg:flex h-14 border-b bg-background items-center justify-between px-6">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
        <LogOut size={16} className="mr-1.5" />
        Logout
      </Button>
    </header>
  )
}
