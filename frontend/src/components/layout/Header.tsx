import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-6">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell size={18} />
        </Button>
        <Button variant="ghost" size="icon">
          <User size={18} />
        </Button>
      </div>
    </header>
  )
}
