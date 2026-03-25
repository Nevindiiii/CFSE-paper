import { useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export type NoteStatus = 'pending' | 'in-progress' | 'done'

export interface NoteFormValues {
  title: string
  description: string
  status: NoteStatus
  dueDate: string
  image: string
}

export interface NoteFormErrors {
  title?: string
  dueDate?: string
}

interface NoteFormProps {
  values: NoteFormValues
  errors: NoteFormErrors
  onChange: (field: keyof NoteFormValues, value: string) => void
}

export default function NoteForm({ values, errors, onChange }: NoteFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange('image', reader.result as string)
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    onChange('image', '')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-4">

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
        <Input
          id="title"
          placeholder="Note title"
          value={values.title}
          onChange={e => onChange('title', e.target.value)}
          className={cn(errors.title && 'border-destructive focus-visible:ring-destructive')}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Add a description…"
          rows={3}
          value={values.description}
          onChange={e => onChange('description', e.target.value)}
        />
      </div>

      {/* Status + Due Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={values.status}
            onChange={e => onChange('status', e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dueDate">Due Date <span className="text-destructive">*</span></Label>
          <Input
            id="dueDate"
            type="date"
            value={values.dueDate}
            onChange={e => onChange('dueDate', e.target.value)}
            className={cn(errors.dueDate && 'border-destructive focus-visible:ring-destructive')}
          />
          {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
        </div>
      </div>

      {/* Image upload */}
      <div className="space-y-1.5">
        <Label>Image</Label>
        {values.image ? (
          <div className="relative w-full rounded-md overflow-hidden border border-border">
            <img src={values.image} alt="Note preview" className="w-full h-40 object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-28 rounded-md border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors text-muted-foreground hover:text-primary"
          >
            <ImagePlus size={22} className="mb-1.5" />
            <span className="text-xs font-medium">Click to upload image</span>
            <span className="text-xs mt-0.5">PNG, JPG up to 5MB</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

    </div>
  )
}
