import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StickyNote, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getNotesApi, type Note } from '@/services/noteService'

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotesApi().then(({ data }) => setNotes(data)).finally(() => setLoading(false))
  }, [])

  const total = notes.length
  const inProgress = notes.filter(n => n.status === 'in-progress').length
  const done = notes.filter(n => n.status === 'done').length
  const pending = notes.filter(n => n.status === 'pending').length

  const stats = [
    { label: 'Total Notes', value: total, icon: StickyNote, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: pending, icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'In Progress', value: inProgress, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Completed', value: done, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  const recent = notes.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Your notes at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{label}</p>
                  <p className="text-3xl font-bold mt-1">
                    {loading ? <span className="text-muted-foreground text-xl">…</span> : value}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
                  <Icon size={18} className={color} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Notes</CardTitle>
          <Link to="/notes" className="text-xs text-primary flex items-center gap-1 hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No notes yet. <Link to="/notes" className="text-primary hover:underline">Create one</Link></p>
          ) : (
            <div className="divide-y">
              {recent.map(note => (
                <div key={note._id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{note.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{note.description || 'No description'}</p>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                    note.status === 'done' ? 'bg-green-100 text-green-700' :
                    note.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {note.status === 'in-progress' ? 'In Progress' : note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
