import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import NoteForm, { type NoteFormValues, type NoteFormErrors, type NoteStatus } from './NoteForm'

export interface NotePayload extends NoteFormValues {
  id?: string
}

interface NoteModalProps {
  open: boolean
  initial?: NotePayload | null
  onSave: (values: NoteFormValues) => void
  onClose: () => void
  saving?: boolean
  error?: string
}

const emptyValues: NoteFormValues = {
  title: '',
  description: '',
  status: 'pending' as NoteStatus,
  dueDate: '',
  image: '',
}

export default function NoteModal({ open, initial, onSave, onClose, saving = false, error = '' }: NoteModalProps) {
  const [values, setValues] = useState<NoteFormValues>(emptyValues)
  const [errors, setErrors] = useState<NoteFormErrors>({})

  useEffect(() => {
    if (open) {
      setValues(initial ? { ...emptyValues, ...initial } : emptyValues)
      setErrors({})
    }
  }, [open, initial])

  const validate = (): NoteFormErrors => {
    const e: NoteFormErrors = {}
    if (!values.title.trim()) e.title = 'Title is required'
    if (!values.dueDate) e.dueDate = 'Due date is required'
    return e
  }

  const handleChange = (field: keyof NoteFormValues, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof NoteFormErrors]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSave = () => {
    const v = validate()
    if (Object.keys(v).length > 0) return setErrors(v)
    onSave(values)
  }

  if (!open) return null

  const isEditing = Boolean(initial?.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
      <Card className="w-full max-w-lg shadow-xl my-auto">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Note' : 'Add Note'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Update the details below and save.' : 'Fill in the details to create a new note.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <NoteForm values={values} errors={errors} onChange={handleChange} />
        </CardContent>

        <CardFooter className="gap-3 border-t pt-4">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button className="flex-1" onClick={handleSave} disabled={saving}>
            {saving
              ? <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</span>
              : isEditing ? 'Save changes' : 'Add Note'
            }
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
