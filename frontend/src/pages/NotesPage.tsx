import { useState, useEffect } from 'react'
import { Plus, SlidersHorizontal, Filter, Loader2, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NoteModal from '@/components/notes/NoteModal'
import type { NoteFormValues, NoteStatus } from '@/components/notes/NoteForm'
import { getNotesApi, createNoteApi, updateNoteApi, deleteNoteApi, type Note } from '@/services/noteService'
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const TAG_COLORS: Record<NoteStatus, { bg: string; text: string; label: string }> = {
  pending:       { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Weekly' },
  'in-progress': { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Monthly' },
  done:          { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Personal' },
}

const CATEGORY_COLORS = [
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-blue-100',   text: 'text-blue-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700' },
  { bg: 'bg-green-100',  text: 'text-green-700' },
]

const CATEGORIES = ['Product', 'Business', 'Personal', 'Badge']

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function getAvatarColor(name: string) {
  const colors = ['bg-orange-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400', 'bg-teal-400']
  let hash = 0
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function formatNoteDate(d: string) {
  if (!d) return ''
  const date = new Date(d)
  return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }) +
    ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function NoteCard({ note, onEdit, onDelete }: { note: Note; onEdit: () => void; onDelete: () => void }) {
  const tag = TAG_COLORS[note.status]
  const catIndex = Math.abs(note._id.charCodeAt(0)) % CATEGORIES.length
  const cat = CATEGORIES[catIndex]
  const catColor = CATEGORY_COLORS[catIndex]
  const authorName = note.title.split(' ').slice(0, 2).join(' ') // fallback display name
  const displayName = 'User'

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow group">
      {/* Tags */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tag.bg} ${tag.text}`}>
          {tag.label}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catColor.bg} ${catColor.text}`}>
          {cat}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-gray-900 leading-snug">{note.title}</p>

      {/* Description / image */}
      {note.image ? (
        <img src={note.image} alt={note.title} className="w-full h-28 object-cover rounded-lg" />
      ) : (
        <div className="text-xs text-gray-500 leading-relaxed line-clamp-4">
          {note.description || 'No description'}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${getAvatarColor(note.title)}`}>
            {getInitials(note.title)}
          </div>
          <span className="text-xs text-gray-500">{displayName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{formatNoteDate(note.createdAt)}</span>
          <div className="hidden group-hover:flex items-center gap-1">
            <button onClick={onEdit} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700">
              <Pencil size={12} />
            </button>
            <button onClick={onDelete} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NotesPage() {
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
    } catch { setError('Failed to load notes.') }
    finally { setLoading(false) }
  }

  const openAdd = () => { setEditingNote(null); setSaveError(''); setModalOpen(true) }
  const openEdit = (note: Note) => { setEditingNote(note); setSaveError(''); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setSaveError('') }

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
      setSaveError(msg ?? 'Failed to save note.')
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
      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900">Notes</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
            <SlidersHorizontal size={14} />
            Sort By
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
            <Filter size={14} />
            Filter
          </button>
          <Button onClick={openAdd} className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm px-3 py-1.5 h-auto rounded-lg">
            <Plus size={14} />
            Add Notes
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-5">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex justify-between">
            {error}
            <button onClick={fetchNotes} className="underline font-medium">Retry</button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gray-400" />
          </div>
        )}

        {!loading && !error && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-medium text-gray-700">No notes yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Notes" to create your first one.</p>
          </div>
        )}

        {!loading && notes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={() => openEdit(note)}
                onDelete={() => setDeleteId(note._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <NoteModal
        open={modalOpen}
        initial={editingNote ? { ...editingNote, id: editingNote._id } : null}
        onSave={handleSave}
        onClose={closeModal}
        saving={saving}
        error={saveError}
      />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <p className="font-semibold text-gray-900 mb-1">Delete note?</p>
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
