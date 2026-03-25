
import { describe, it, expect } from 'vitest'
import type { NoteStatus } from '@/components/notes/NoteForm'

// Helpers 

interface NoteFormErrors { title?: string; dueDate?: string }

function validateNote(title: string, dueDate: string): NoteFormErrors {
  const e: NoteFormErrors = {}
  if (!title.trim()) e.title = 'Title is required'
  if (!dueDate) e.dueDate = 'Due date is required'
  return e
}

interface MockNote {
  _id: string
  title: string
  status: NoteStatus
  dueDate: string
}

function filterByStatus(notes: MockNote[], status: NoteStatus) {
  return notes.filter(n => n.status === status)
}

function sortByDateDesc(notes: MockNote[]) {
  return [...notes].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
}

//Sample data

const sampleNotes: MockNote[] = [
  { _id: '1', title: 'First task',  status: 'pending',     dueDate: '2025-01-10' },
  { _id: '2', title: 'Second task', status: 'in-progress', dueDate: '2025-03-15' },
  { _id: '3', title: 'Third task',  status: 'done',        dueDate: '2025-02-20' },
  { _id: '4', title: 'Fourth task', status: 'pending',     dueDate: '2025-04-01' },
]

//Tests

describe('Note — form validation', () => {
  it('returns no errors for valid note data', () => {
    expect(validateNote('My Note', '2025-12-01')).toEqual({})
  })

  it('requires title field', () => {
    const errors = validateNote('', '2025-12-01')
    expect(errors.title).toBe('Title is required')
  })

  it('rejects whitespace-only title', () => {
    const errors = validateNote('   ', '2025-12-01')
    expect(errors.title).toBe('Title is required')
  })

  it('requires due date field', () => {
    const errors = validateNote('My Note', '')
    expect(errors.dueDate).toBe('Due date is required')
  })

  it('returns both errors when both fields are empty', () => {
    const errors = validateNote('', '')
    expect(errors.title).toBeDefined()
    expect(errors.dueDate).toBeDefined()
  })
})

describe('Note — filtering and sorting', () => {
  it('filters notes by pending status', () => {
    const result = filterByStatus(sampleNotes, 'pending')
    expect(result).toHaveLength(2)
    expect(result.every(n => n.status === 'pending')).toBe(true)
  })

  it('filters notes by in-progress status', () => {
    const result = filterByStatus(sampleNotes, 'in-progress')
    expect(result).toHaveLength(1)
    expect(result[0]._id).toBe('2')
  })

  it('filters notes by done status', () => {
    const result = filterByStatus(sampleNotes, 'done')
    expect(result).toHaveLength(1)
    expect(result[0]._id).toBe('3')
  })

  it('sorts notes by due date descending (newest first)', () => {
    const sorted = sortByDateDesc(sampleNotes)
    expect(sorted[0]._id).toBe('4') // 2025-04-01 is latest
    expect(sorted[sorted.length - 1]._id).toBe('1') // 2025-01-10 is earliest
  })

  it('returns empty array when no notes match the filter', () => {
    const result = filterByStatus([], 'done')
    expect(result).toHaveLength(0)
  })
})
