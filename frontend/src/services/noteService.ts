import api from './api'
import type { NoteFormValues } from '@/components/notes/NoteForm'

export interface Note extends NoteFormValues {
  _id: string
  createdAt: string
  updatedAt: string
}

export const getNotesApi = () =>
  api.get<Note[]>('/notes')

export const createNoteApi = (data: NoteFormValues) =>
  api.post<Note>('/notes', data)

export const updateNoteApi = (id: string, data: NoteFormValues) =>
  api.put<Note>(`/notes/${id}`, data)

export const deleteNoteApi = (id: string) =>
  api.delete(`/notes/${id}`)
