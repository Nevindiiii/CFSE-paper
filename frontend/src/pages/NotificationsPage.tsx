import { useState } from 'react'
import { Bell, MoreHorizontal, Check, X, Reply } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'all' | 'tasks' | 'archived'

interface Notification {
  id: number
  avatar: string
  name: string
  action: string
  context: string
  mention?: string
  time: string
  team: string
  unread: boolean
  buttons?: { label: string; variant: 'default' | 'outline' }[]
  replyable?: boolean
}

const notifications: Notification[] = [
  {
    id: 1,
    avatar: 'FE',
    name: 'Frank Edward',
    action: 'mentioned you in a comment in',
    context: 'Design Team Reports',
    mention: '@brief can you update this design so we can use it on next meeting?',
    time: '2 hours ago',
    team: 'Design Team',
    unread: true,
    replyable: true,
  },
  {
    id: 2,
    avatar: 'LW',
    name: 'Lisa Wright',
    action: 'is asking to give access to',
    context: 'Monthly Team Progress',
    time: '3 hours ago',
    team: 'Marketing Team',
    unread: true,
    buttons: [
      { label: 'Decline', variant: 'outline' },
      { label: 'Accept', variant: 'default' },
    ],
  },
  {
    id: 3,
    avatar: 'JW',
    name: 'James Wong',
    action: 'mentioned you in a comment in',
    context: 'Monthly Team Meeting',
    mention: "@brief let's do all of this event by now",
    time: 'Aug 23',
    team: 'Design Team',
    unread: false,
    replyable: true,
  },
]

const avatarColors: Record<string, string> = {
  FE: 'bg-orange-400',
  LW: 'bg-purple-400',
  JW: 'bg-blue-400',
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [dismissed, setDismissed] = useState<number[]>([])

  const visible = notifications.filter(n => !dismissed.includes(n.id))

  return (
    <div className="min-h-[calc(100vh-8rem)] px-6 py-6 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">Mark All as Read</button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-gray-200">
        {(['all', 'tasks', 'archived'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-2 text-sm capitalize font-medium border-b-2 -mb-px transition-colors',
              activeTab === tab
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            {tab === 'all' ? 'All' : tab === 'tasks' ? 'Tasks' : 'Archived'}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-1">
        {activeTab === 'all' && visible.map(n => (
          <div key={n.id} className={cn('relative rounded-lg p-3 group', n.unread ? 'bg-blue-50/60' : 'bg-white hover:bg-gray-50')}>
            <div className="flex gap-3">
              {/* Avatar */}
              <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0', avatarColors[n.avatar] ?? 'bg-gray-400')}>
                {n.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-snug">
                  <span className="font-semibold text-gray-900">{n.name}</span>{' '}
                  {n.action}{' '}
                  <span className="font-medium text-gray-900">{n.context}</span>
                </p>

                {n.mention && (
                  <div className="mt-1.5 bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-600">
                    {n.mention}
                  </div>
                )}

                {n.buttons && (
                  <div className="flex gap-2 mt-2">
                    {n.buttons.map(btn => (
                      <button
                        key={btn.label}
                        onClick={() => setDismissed(d => [...d, n.id])}
                        className={cn(
                          'px-3 py-1 rounded text-xs font-medium transition-colors',
                          btn.variant === 'default'
                            ? 'bg-gray-900 text-white hover:bg-gray-700'
                            : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                        )}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                {n.replyable && (
                  <button className="mt-2 flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded px-2 py-1 hover:bg-gray-100">
                    <Reply size={11} /> Reply
                  </button>
                )}

                <p className="text-[11px] text-gray-400 mt-1.5">{n.time} · {n.team}</p>
              </div>

              {/* Unread dot + dismiss */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                {n.unread && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1" />}
                <button
                  onClick={() => setDismissed(d => [...d, n.id])}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {activeTab !== 'all' && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Bell size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No {activeTab} notifications</p>
          </div>
        )}
      </div>

      {activeTab === 'all' && visible.length > 0 && (
        <button className="mt-4 w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
          <Check size={14} /> See all notifications
        </button>
      )}

      {activeTab === 'all' && visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Bell size={32} className="mb-2 opacity-30" />
          <p className="text-sm">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}
