import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, CalendarDays, StickyNote, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import NoteModal from '@/components/notes/NoteModal'
import type { NoteFormValues, NoteStatus } from '@/components/notes/NoteForm'
import { getNotesApi, createNoteApi, updateNoteApi, deleteNoteApi, type Note } from '@/services/noteService'

const statusConfig: Record<NoteStatus, { label: string; className: string }> = {
  pending:       { label: 'Pending',     className: 'bg-white text-black border border-black' },
  'in-progress': { label: 'In Progress', className: 'bg-zinc-800 text-white border border-zinc-800' },
  done:          { label: 'Done',        className: 'bg-black text-white border border-black' },
}

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await getNotesApi()
      setNotes(data)
    } catch {
      setError('Failed to load notes. Please refresh.')
    } finally {
      setLoading(false)
    }
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
      setSaveError(msg ?? 'Failed to save note. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteNoteApi(deleteId)
      setNotes(prev => prev.filter(n => n._id !== deleteId))
      setDeleteId(null)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Notes</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openAdd} disabled={loading}>
          <Plus size={16} className="mr-1.5" />
          Add Note
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center justify-between">
          {error}
          <button onClick={fetchNotes} className="underline font-medium ml-4">Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && notes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <StickyNote size={24} className="text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No notes yet</p>
          <p className="text-sm text-muted-foreground mt-1">Click "Add Note" to create your first one.</p>
        </div>
      )}

      {/* Notes grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => {
            const { label, className } = statusConfig[note.status]
            return (
              <Card key={note._id} className="flex flex-col hover:shadow-md transition-shadow overflow-hidden">

                {note.image && (
                  <div className="w-full h-36 overflow-hidden">
                    <img src={note.image} alt={note.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{note.title}</CardTitle>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${className}`}>
                      {label}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2 mt-1">
                    {note.description || 'No description'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3 mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays size={13} />
                    <span>Due {formatDate(note.dueDate)}</span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0 gap-2 border-t">
                  <Button variant="ghost" size="sm" className="flex-1 mt-3" onClick={() => openEdit(note)}>
                    <Pencil size={14} className="mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    className="flex-1 mt-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteId(note._id)}
                  >
                    <Trash2 size={14} className="mr-1.5" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <NoteModal
        open={modalOpen}
        initial={editingNote ? { ...editingNote, id: editingNote._id } : null}
        onSave={handleSave}
        onClose={closeModal}
        saving={saving}
        error={saveError}
      />

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <Card className="w-full max-w-sm shadow-xl">
            <CardHeader>
              <CardTitle>Delete note?</CardTitle>
              <CardDescription>This action cannot be undone.</CardDescription>
            </CardHeader>
            <CardFooter className="gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleting}>
                {deleting ? <Loader2 size={15} className="animate-spin" /> : 'Delete'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

    </div>
  )
}
