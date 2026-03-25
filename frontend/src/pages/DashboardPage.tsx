import { Mail, Building2, Users, CheckSquare, ChevronRight, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

// ── Static mock data ──────────────────────────────────────────────────────────
const stats = [
  { label: 'Email Sent', value: '1,251 Mail', icon: Mail },
  { label: 'Active Company', value: '43 Company', icon: Building2 },
  { label: 'Total Contact', value: '162 Contact', icon: Users },
  { label: 'Ongoing Task', value: '5 Task', icon: CheckSquare },
]

const agenda = [
  { date: '11/06 - 11/09 Feb 2, 2016', title: 'Meeting with Client', desc: 'This meeting proposes agenda', color: 'text-pink-500' },
  { date: '11/06 - 11/09 Feb 2, 2016', title: 'Meeting with Client', desc: 'This meeting proposes agenda', color: 'text-purple-500' },
  { date: '11/06 - 11/09 Feb 2, 2016', title: 'Meeting with Client', desc: 'This meeting proposes agenda', color: 'text-pink-500' },
  { date: '11/06 - 11/09 Feb 2, 2016', title: 'Meeting with Client', desc: 'This meeting proposes agenda', color: 'text-purple-500' },
]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const barData = [55, 40, 60, 45, 50, 55, 100, 45, 50, 40, 55, 45]

const people = [
  { name: 'Robert Fox', email: 'robertfox@example.com', phone: '(671) 555-0110', category: 'Employee', location: 'Austin', gender: 'Male' },
  { name: 'Cody Fisher', email: 'codyfisher@example.com', phone: '(629) 555-0129', category: 'Customer', location: 'Orange', gender: 'Male' },
  { name: 'Albert Flores', email: 'albertflores@example.com', phone: '(704) 555-0127', category: 'Customer', location: 'Pembroke...', gender: 'Female' },
  { name: 'Floyd Miles', email: 'floydmiles@example.com', phone: '(629) 555-0129', category: 'Employee', location: 'Fairfield', gender: 'Male' },
  { name: 'Arlene McCoy', email: 'arlenemccoy@example.com', phone: '(219) 555-0114', category: 'Partner', location: 'Travell', gender: 'Female' },
]

const companies = [
  { name: 'Product Hunt', industry: 'Web Design', location: 'New York City, NY', status: 'Active', color: '#e05d44' },
  { name: 'Google', industry: 'Search Engine', location: 'New York City, NY', status: 'Active', color: '#4285f4' },
  { name: 'Workdocs', industry: 'Web Development', location: 'New York City, NY', status: 'Active', color: '#7c3aed' },
  { name: 'Tripadvisor', industry: 'Travel Reviews', location: 'New York City, NY', status: 'Lead', color: '#16a34a' },
  { name: 'Slack', industry: 'Communication', location: 'New York City, NY', status: 'Lead', color: '#7c3aed' },
]

const categoryColors = ['#1e1b4b', '#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe']
const categories = ['Agency', 'Marketing', 'Communication', 'Web Development', 'Travel']

const categoryBadge: Record<string, string> = {
  Employee: 'bg-purple-100 text-purple-700',
  Customer: 'bg-cyan-100 text-cyan-700',
  Partner: 'bg-orange-100 text-orange-700',
}

const statusBadge: Record<string, string> = {
  Active: 'bg-blue-100 text-blue-600',
  Lead: 'bg-yellow-100 text-yellow-700',
}

// ── Donut chart (SVG) ─────────────────────────────────────────────────────────
function DonutChart() {
  const total = 341
  const slices = [80, 70, 65, 80, 46]
  const colors = ['#1e1b4b', '#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe']
  let cumulative = 0
  const r = 50, cx = 60, cy = 60, stroke = 18
  const circumference = 2 * Math.PI * r

  return (
    <svg width={120} height={120} viewBox="0 0 120 120">
      {slices.map((val, i) => {
        const pct = val / total
        const offset = circumference * (1 - pct)
        const rotation = (cumulative / total) * 360 - 90
        cumulative += val
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={colors[i]}
            strokeWidth={stroke}
            strokeDasharray={`${circumference * pct} ${circumference * (1 - pct)}`}
            strokeDashoffset={0}
            transform={`rotate(${rotation} ${cx} ${cy})`}
          />
        )
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#111">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="#888">Companies</text>
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="px-6 py-5 space-y-5 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{value}</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <Icon size={16} className="text-gray-500" />
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Middle row: Agenda + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Upcoming Agenda */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <p className="font-semibold text-sm text-gray-900">Upcoming Agenda</p>
          {agenda.map((item, i) => (
            <div key={i} className="space-y-0.5">
              <p className={`text-[10px] font-medium ${item.color}`}>{item.date}</p>
              <p className="text-xs font-semibold text-gray-800">{item.title}</p>
              <p className="text-[11px] text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Email Open Rate Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-sm text-gray-900">Average Email Open Rate</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-bold text-gray-900">64,23%</span>
                <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-medium">↑ 19%</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">Average Open Rate</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600">January, 2023 - December, 2023 ▾</span>
              <span className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600">Month ▾</span>
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex gap-2 mt-2">
            {/* Y-axis */}
            <div className="flex flex-col justify-between text-[9px] text-gray-400 text-right pr-1" style={{ height: 140 }}>
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            {/* Bars */}
            <div className="flex-1 relative" style={{ height: 140 }}>
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((pct) => (
                <div key={pct} className="absolute w-full border-t border-gray-100" style={{ bottom: `${pct}%` }} />
              ))}
              <div className="flex items-end gap-1 h-full">
                {barData.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1" style={{ height: '100%' }}>
                    <div
                      className={`w-full rounded-sm ${i === 6 ? 'bg-purple-600' : 'bg-gray-200'}`}
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[9px] text-gray-400 shrink-0">{months[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* People Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="font-semibold text-sm text-gray-900">People</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border border-gray-200 rounded px-2 py-1">
              <Search size={12} className="text-gray-400" />
              <input className="text-xs outline-none w-24 placeholder:text-gray-400" placeholder="Search" />
            </div>
            <button className="flex items-center gap-1 text-xs border border-gray-200 rounded px-2 py-1 text-gray-600">
              <ArrowUpDown size={11} /> Sort By
            </button>
            <button className="flex items-center gap-1 text-xs border border-gray-200 rounded px-2 py-1 text-gray-600">
              <SlidersHorizontal size={11} /> Filter
            </button>
          </div>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400">
              <th className="text-left px-4 py-2 font-medium">Name ↕</th>
              <th className="text-left px-4 py-2 font-medium">Email ↕</th>
              <th className="text-left px-4 py-2 font-medium hidden md:table-cell">Phone ↕</th>
              <th className="text-left px-4 py-2 font-medium">Category ↕</th>
              <th className="text-left px-4 py-2 font-medium hidden lg:table-cell">Location ↕</th>
              <th className="text-left px-4 py-2 font-medium hidden lg:table-cell">Gender ↕</th>
              <th className="text-left px-4 py-2 font-medium">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {people.map((p) => (
              <tr key={p.email} className="hover:bg-gray-50">
                <td className="px-4 py-2.5 font-medium text-gray-800">{p.name}</td>
                <td className="px-4 py-2.5 text-blue-600 underline">{p.email}</td>
                <td className="px-4 py-2.5 text-gray-500 hidden md:table-cell">{p.phone}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryBadge[p.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {p.category}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-gray-500 hidden lg:table-cell">{p.location}</td>
                <td className="px-4 py-2.5 text-gray-500 hidden lg:table-cell">{p.gender}</td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1">
                    <button className="text-[10px] border border-gray-200 rounded px-1.5 py-0.5 text-gray-600">Call</button>
                    <button className="text-[10px] border border-gray-200 rounded px-1.5 py-0.5 text-gray-600">...</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom row: Companies + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
        {/* Companies Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-sm text-gray-900">Companies</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border border-gray-200 rounded px-2 py-1">
                <Search size={12} className="text-gray-400" />
                <input className="text-xs outline-none w-20 placeholder:text-gray-400" placeholder="Search" />
              </div>
              <button className="flex items-center gap-1 text-xs border border-gray-200 rounded px-2 py-1 text-gray-600">
                <ArrowUpDown size={11} /> Sort By
              </button>
              <button className="flex items-center gap-1 text-xs border border-gray-200 rounded px-2 py-1 text-gray-600">
                <SlidersHorizontal size={11} /> Filter
              </button>
            </div>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="text-left px-4 py-2 font-medium">Companies Name ↕</th>
                <th className="text-left px-4 py-2 font-medium">Industry ↕</th>
                <th className="text-left px-4 py-2 font-medium hidden md:table-cell">Location ↕</th>
                <th className="text-left px-4 py-2 font-medium">Status ↕</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {companies.map((c) => (
                <tr key={c.name} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ background: c.color }}>
                      {c.name[0]}
                    </span>
                    {c.name}
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">{c.industry}</td>
                  <td className="px-4 py-2.5 text-gray-500 hidden md:table-cell">{c.location}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusBadge[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Company Categories */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-semibold text-sm text-gray-900 mb-4">Company Categories</p>
          <div className="flex justify-center mb-4">
            <DonutChart />
          </div>
          <ul className="space-y-1.5">
            {categories.map((cat, i) => (
              <li key={cat} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: categoryColors[i] }} />
                {cat}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
