import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StickyNote, Clock, CheckCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { getNotesApi, type Note } from '@/services/noteService'

const TAG_BG: Record<string, string> = {
  pending: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-purple-100 text-purple-700',
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotesApi().then(({ data }) => setNotes(data)).finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Total Notes', value: notes.length, icon: StickyNote },
    { label: 'Pending', value: notes.filter(n => n.status === 'pending').length, icon: AlertCircle },
    { label: 'In Progress', value: notes.filter(n => n.status === 'in-progress').length, icon: Clock },
    { label: 'Completed', value: notes.filter(n => n.status === 'done').length, icon: CheckCircle },
  ]

  return (
    <div className="px-6 py-5 space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? <span className="text-gray-300 text-lg">…</span> : value}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <Icon size={16} className="text-gray-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Notes */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-900 text-sm">Recent Notes</p>
          <Link to="/notes" className="text-xs text-gray-500 flex items-center gap-1 hover:text-gray-700">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 size={22} className="animate-spin text-gray-300" />
            </div>
          )}
          {!loading && notes.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-10">
              No notes yet. <Link to="/notes" className="text-gray-700 underline">Create one</Link>
            </p>
          )}
          {!loading && notes.slice(0, 5).map(note => (
            <div key={note._id} className="flex items-center justify-between px-5 py-3 gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{note.title}</p>
                <p className="text-xs text-gray-400 truncate">{note.description || 'No description'}</p>
              </div>
              <span className={`shrink-0 text-xs px-2.5 py-0.5 rounded-full font-medium ${TAG_BG[note.status]}`}>
                {note.status === 'in-progress' ? 'In Progress' : note.status.charAt(0).toUpperCase() + note.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
