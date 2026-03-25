import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const mockNotes = [
  { id: '1', title: 'Follow up with client', description: 'Send proposal by end of week', status: 'pending', dueDate: '2025-07-10' },
  { id: '2', title: 'Onboarding call', description: 'Schedule intro call with new lead', status: 'in-progress', dueDate: '2025-07-08' },
  { id: '3', title: 'Contract review', description: 'Review and sign updated contract', status: 'done', dueDate: '2025-07-05' },
]

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
}

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Notes</h2>
        <Button size="sm">
          <Plus size={16} className="mr-1" />
          New Note
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockNotes.map(note => (
          <Card key={note.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{note.title}</CardTitle>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusStyles[note.status]}`}>
                  {note.status}
                </span>
              </div>
              <CardDescription>{note.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Due: {note.dueDate}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
