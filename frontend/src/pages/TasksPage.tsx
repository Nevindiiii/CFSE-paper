import { useState, useEffect } from 'react'
import { Plus, SlidersHorizontal, Filter, Loader2, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NoteModal from '@/components/notes/NoteModal'
import type { NoteFormValues } from '@/components/notes/NoteForm'
import { getNotesApi, createNoteApi, updateNoteApi, deleteNoteApi, type Note } from '@/services/noteService'

const COLUMNS = [
  { key: 'pending',     label: 'Planned',   color: 'text-gray-700' },
  { key: 'in-progress', label: 'Upcoming',  color: 'text-blue-600' },
  { key: 'done',        label: 'Completed', color: 'text-green-600' },
] as const

const TAG_COLORS = [
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-blue-100',   text: 'text-blue-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700' },
  { bg: 'bg-green-100',  text: 'text-green-700' },
  { bg: 'bg-pink-100',   text: 'text-pink-700' },
]

const TAGS = ['Product', 'Business', 'Personal', 'Marketing', 'Urgent']

function getAvatarColor(s: string) {
  const colors = ['bg-orange-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400']
  let h = 0
  for (const c of s) h = c.charCodeAt(0) + ((h << 5) - h)
  return colors[Math.abs(h) % colors.length]
}

function formatDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function TaskCard({ note, onEdit, onDelete }: { note: Note; onEdit: () => void; onDelete: () => void }) {
  const tagCount = (Math.abs(note._id.charCodeAt(0)) % 3) + 1
  const initials = note.title.slice(0, 2).toUpperCase()

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col gap-2.5 hover:shadow-sm transition-shadow group">
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: tagCount }, (_, i) => {
          const idx = (note._id.charCodeAt(i) ?? i) % TAGS.length
          const col = TAG_COLORS[idx % TAG_COLORS.length]
          return (
            <span key={i} className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>
              {TAGS[idx]}
            </span>
          )
        })}
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-gray-900 leading-snug">{note.title}</p>

      {/* Image or description */}
      {note.image ? (
        <img src={note.image} alt={note.title} className="w-full h-24 object-cover rounded-lg" />
      ) : note.description ? (
        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{note.description}</p>
      ) : null}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 mt-auto">
        <div className="flex items-center gap-1.5">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${getAvatarColor(note.title)}`}>
            {initials}
          </div>
          {note.dueDate && (
            <span className="text-[11px] text-gray-400">Due {formatDate(note.dueDate)}</span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700">
            <Pencil size={12} />
          </button>
          <button onClick={onDelete} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TasksPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { fetchNotes() }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true); setError('')
      const { data } = await getNotesApi()
      setNotes(data)
    } catch { setError('Failed to load tasks.') }
    finally { setLoading(false) }
  }

  const openAdd = () => { setEditingNote(null); setSaveError(''); setModalOpen(true) }
  const openEdit = (note: Note) => { setEditingNote(note); setSaveError(''); setModalOpen(true) }

  const handleSave = async (values: NoteFormValues) => {
    setSaving(true)
    try {
      if (editingNote) {
        const { data } = await updateNoteApi(editingNote._id, values)
        setNotes(prev => prev.map(n => n._id === editingNote._id ? data : n))
      } else {
        const { data } = await createNoteApi(values)
        setNotes(prev => [data, ...prev])
      }
      setModalOpen(false)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      setSaveError(msg ?? 'Failed to save task.')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteNoteApi(deleteId)
      setNotes(prev => prev.filter(n => n._id !== deleteId))
      setDeleteId(null)
    } catch { } finally { setDeleting(false) }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900">Task</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
            <SlidersHorizontal size={14} /> Sort By
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
            <Filter size={14} /> Filter
          </button>
          <Button onClick={openAdd} className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm px-3 py-1.5 h-auto rounded-lg">
            <Plus size={14} /> Add Task
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-auto px-6 py-5">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex justify-between">
            {error}
            <button onClick={fetchNotes} className="underline font-medium">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full">
            {COLUMNS.map(col => {
              const colNotes = notes.filter(n => n.status === col.key)
              return (
                <div key={col.key} className="flex flex-col gap-3">
                  {/* Column header */}
                  <div className="flex items-center gap-2">
                    <h2 className={`text-sm font-semibold ${col.color}`}>{col.label}</h2>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{colNotes.length} tasks</span>
                  </div>

                  {/* Create button */}
                  <button
                    onClick={openAdd}
                    className="flex items-center gap-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl px-4 py-2.5 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    <Plus size={14} /> Create Task
                  </button>

                  {/* Cards */}
                  <div className="flex flex-col gap-3">
                    {colNotes.map(note => (
                      <TaskCard
                        key={note._id}
                        note={note}
                        onEdit={() => openEdit(note)}
                        onDelete={() => setDeleteId(note._id)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <NoteModal
        open={modalOpen}
        initial={editingNote ? { ...editingNote, id: editingNote._id } : null}
        onSave={handleSave}
        onClose={() => { setModalOpen(false); setSaveError('') }}
        saving={saving}
        error={saveError}
      />

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <p className="font-semibold text-gray-900 mb-1">Delete task?</p>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} disabled={deleting}
                className="flex-1 border border-gray-200 rounded-lg py-2 text-sm text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center">
                {deleting ? <Loader2 size={15} className="animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
