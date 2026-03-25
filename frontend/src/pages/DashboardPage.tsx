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
    { label: 'Total Notes', value: total, icon: StickyNote },
    { label: 'Pending', value: pending, icon: AlertCircle },
    { label: 'In Progress', value: inProgress, icon: Clock },
    { label: 'Completed', value: done, icon: CheckCircle },
  ]

  const recent = notes.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Your notes at a glance</p>
      </div>

      {/* Sticky stat cards */}
      <div className="sticky top-0 z-20 bg-muted/80 backdrop-blur-sm -mx-4 md:-mx-6 px-4 md:px-6 py-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="shadow-sm">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{label}</p>
                    <p className="text-3xl font-bold mt-1">
                      {loading ? <span className="text-muted-foreground text-xl">…</span> : value}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Icon size={18} className="text-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium border ${
                    note.status === 'done' ? 'bg-black text-white border-black' :
                    note.status === 'in-progress' ? 'bg-zinc-800 text-white border-zinc-800' :
                    'bg-white text-black border-black'
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
