import { useState } from 'react'
import { Plus, Pencil, Trash2, CalendarDays, StickyNote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Status = 'pending' | 'in-progress' | 'done'

interface Note {
  id: string
  title: string
  description: string
  status: Status
  dueDate: string
}

const initialNotes: Note[] = [
  { id: '1', title: 'Follow up with client', description: 'Send the updated proposal document by end of this week.', status: 'pending', dueDate: '2025-07-10' },
  { id: '2', title: 'Onboarding call', description: 'Schedule and conduct intro call with the new lead from Monday.', status: 'in-progress', dueDate: '2025-07-08' },
  { id: '3', title: 'Contract review', description: 'Review the updated contract terms and get sign-off from legal.', status: 'done', dueDate: '2025-07-05' },
  { id: '4', title: 'Update CRM records', description: 'Sync latest contact details from the spreadsheet into the system.', status: 'pending', dueDate: '2025-07-12' },
]

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending:     { label: 'Pending',     className: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
  'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-700 border border-blue-200' },
  done:        { label: 'Done',        className: 'bg-green-100 text-green-700 border border-green-200' },
}

const emptyForm = { title: '', description: '', status: 'pending' as Status, dueDate: '' }

interface FormErrors { title?: string; dueDate?: string }

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [showModal, setShowModal] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const openAdd = () => {
    setEditingNote(null)
    setForm(emptyForm)
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (note: Note) => {
    setEditingNote(note)
    setForm({ title: note.title, description: note.description, status: note.status, dueDate: note.dueDate })
    setErrors({})
    setShowModal(true)
  }

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.dueDate) e.dueDate = 'Due date is required'
    return e
  }

  const handleSave = () => {
    const v = validate()
    if (Object.keys(v).length > 0) return setErrors(v)
    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...editingNote, ...form } : n))
    } else {
      setNotes(prev => [...prev, { id: Date.now().toString(), ...form }])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    setDeleteId(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Notes</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} className="mr-1.5" />
          Add Note
        </Button>
      </div>

      {/* Empty state */}
      {notes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <StickyNote size={24} className="text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No notes yet</p>
          <p className="text-sm text-muted-foreground mt-1">Click "Add Note" to create your first one.</p>
        </div>
      )}

      {/* Notes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => {
          const { label, className } = statusConfig[note.status]
          return (
            <Card key={note.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{note.title}</CardTitle>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${className}`}>
                    {label}
                  </span>
                </div>
                <CardDescription className="line-clamp-2 mt-1">{note.description || 'No description'}</CardDescription>
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
                <Button variant="ghost" size="sm" className="flex-1 mt-3 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(note.id)}>
                  <Trash2 size={14} className="mr-1.5" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader>
              <CardTitle>{editingNote ? 'Edit Note' : 'New Note'}</CardTitle>
              <CardDescription>{editingNote ? 'Update the note details below.' : 'Fill in the details for your new note.'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title" name="title" placeholder="Note title"
                  value={form.title} onChange={handleChange}
                  className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description" name="description" placeholder="Add a description…"
                  value={form.description} onChange={handleChange} rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status" name="status" value={form.status} onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate" name="dueDate" type="date"
                    value={form.dueDate} onChange={handleChange}
                    className={errors.dueDate ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
                </div>
              </div>

            </CardContent>
            <CardFooter className="gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave}>{editingNote ? 'Save changes' : 'Add Note'}</Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <Card className="w-full max-w-sm shadow-xl">
            <CardHeader>
              <CardTitle>Delete note?</CardTitle>
              <CardDescription>This action cannot be undone.</CardDescription>
            </CardHeader>
            <CardFooter className="gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteId)}>Delete</Button>
            </CardFooter>
          </Card>
        </div>
      )}

    </div>
  )
}
