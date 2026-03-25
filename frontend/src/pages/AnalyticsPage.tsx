import { useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

// ── Mock data ─────────────────────────────────────────────────────────────────
const completedTasks = 21

const topCompanies = [
  { name: 'Product Hunt', color: '#e05d44', up: true,  count: 5 },
  { name: 'Google',       color: '#4285f4', up: true,  count: 2 },
  { name: 'Wordpress',    color: '#7c3aed', up: true,  count: 1 },
  { name: 'Tripadvisor',  color: '#16a34a', up: false, count: 3 },
  { name: 'Slack',        color: '#7c3aed', up: false, count: 2 },
  { name: 'Zendesk',      color: '#e05d44', up: false, count: 3 },
]

// Active Projects line chart — monthly values
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const projectPoints = [30, 55, 45, 80, 51, 60, 75, 50, 85, 65, 90, 70]

// Active Companies bar data
const companyBars = [
  { label: 'Agency',          value: 57 },
  { label: 'Development',     value: 38 },
  { label: 'Marketing',       value: 25 },
  { label: 'Marketing',       value: 25 },
  { label: 'Communication',   value: 38 },
  { label: 'Web Development', value: 13 },
  { label: 'Web Development', value: 13 },
  { label: 'Web Development', value: 13 },
  { label: 'Travel Agency',   value: 11 },
]

// Weekly target bar chart
const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const weekBars = [
  { done: 70, total: 90 },
  { done: 55, total: 80 },
  { done: 80, total: 95 },
  { done: 65, total: 85 },
  { done: 90, total: 100 },
  { done: 50, total: 75 },
  { done: 75, total: 90 },
]

// ── Line Chart (SVG) ──────────────────────────────────────────────────────────
function LineChart() {
  const W = 400, H = 140, padL = 30, padB = 24, padT = 10, padR = 10
  const chartW = W - padL - padR
  const chartH = H - padB - padT
  const max = 100

  const pts = projectPoints.map((v, i) => ({
    x: padL + (i / (projectPoints.length - 1)) * chartW,
    y: padT + chartH - (v / max) * chartH,
  }))

  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }}>
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map(v => {
        const y = padT + chartH - (v / max) * chartH
        return (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="#f0f0f0" strokeWidth="1" />
            <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="8" fill="#aaa">{v}</text>
          </g>
        )
      })}
      {/* Month labels */}
      {pts.map((p, i) => (
        <text key={i} x={p.x} y={H - 4} textAnchor="middle" fontSize="8" fill="#aaa">{months[i]}</text>
      ))}
      {/* Line */}
      <path d={d} fill="none" stroke="#111" strokeWidth="1.5" />
      {/* Dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#111" />
      ))}
    </svg>
  )
}

// ── Weekly Bar Chart (SVG) ────────────────────────────────────────────────────
function WeeklyChart() {
  const W = 260, H = 120, padB = 20, padT = 8
  const chartH = H - padB - padT
  const barW = 20
  const gap = (W - weekBars.length * barW) / (weekBars.length + 1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }}>
      {weekBars.map((b, i) => {
        const x = gap + i * (barW + gap)
        const totalH = (b.total / 100) * chartH
        const doneH = (b.done / 100) * chartH
        const baseY = padT + chartH
        return (
          <g key={i}>
            <rect x={x} y={baseY - totalH} width={barW} height={totalH} rx="3" fill="#e5e5e5" />
            <rect x={x} y={baseY - doneH}  width={barW} height={doneH}  rx="3" fill="#111" />
            <text x={x + barW / 2} y={H - 4} textAnchor="middle" fontSize="8" fill="#aaa">{weekDays[i]}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'activity'>('activity')

  return (
    <div className="px-6 py-5 space-y-5 bg-gray-50 min-h-screen">

      {/* Page header */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
        <div className="flex items-center gap-1 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
              activeTab === 'sales'
                ? 'border-b-2 border-gray-900 text-gray-900 font-medium -mb-px'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            💲 Sales
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
              activeTab === 'activity'
                ? 'border-b-2 border-gray-900 text-gray-900 font-medium -mb-px'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🔄 Activity
          </button>
        </div>
      </div>

      {/* Row 1: Completed Task + Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">

        {/* Completed Task */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
          <p className="text-sm font-semibold text-gray-900">Completed Task</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">{completedTasks} Task</p>
            <button className="text-xs border border-gray-200 rounded px-2.5 py-1 text-gray-600 hover:bg-gray-50">
              View All
            </button>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Top Companies</p>
            <ul className="space-y-2.5">
              {topCompanies.map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400 w-3">{i + 1}.</span>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                    style={{ background: c.color }}
                  >
                    {c.name[0]}
                  </span>
                  <span className="flex-1 text-gray-700">{c.name}</span>
                  <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    c.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {c.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {c.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Active Projects</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-bold text-gray-900">68 Projects</span>
                <span className="flex items-center gap-0.5 text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-medium">
                  <TrendingUp size={11} /> 12%
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">This Month</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600">
                January, 2023 – December, 2023 ▾
              </span>
              <span className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600">Month ▾</span>
            </div>
          </div>
          <LineChart />
        </div>
      </div>

      {/* Row 2: Active Companies + Weekly Target */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">

        {/* Active Companies */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-900">Active Companies</p>
          <div className="flex items-center gap-2 mt-1 mb-1">
            <span className="text-3xl font-bold text-gray-900">341 Companies</span>
            <span className="flex items-center gap-0.5 text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-medium">
              <TrendingUp size={11} /> 12%
            </span>
            <div className="ml-auto">
              <span className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600">Year ▾</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mb-4">This Years</p>

          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            {companyBars.map((b, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>{b.label}</span>
                  <span>{b.value}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-800 rounded-full"
                    style={{ width: `${(b.value / 60) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Project Target This Week */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-900 mb-4">Completed Project Target This Week</p>
          <WeeklyChart />
        </div>
      </div>

    </div>
  )
}
