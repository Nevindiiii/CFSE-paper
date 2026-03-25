import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const stats = [
  { label: 'Total Notes', value: '12' },
  { label: 'In Progress', value: '4' },
  { label: 'Completed', value: '7' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
