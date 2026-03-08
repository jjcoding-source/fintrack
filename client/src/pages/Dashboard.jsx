import { useState } from "react"
import {
  TrendingUp, TrendingDown, Wallet, PiggyBank,
  ArrowUpRight, ArrowDownRight, MoreVertical
} from "lucide-react"
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"
import { mockTransactions, mockMonthlyFlow } from "../data/mockData"


const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0
  }).format(n)

const totalIncome  = mockTransactions.filter(t => t.type === "income").reduce((s,t) => s + t.amount, 0)
const totalExpense = mockTransactions.filter(t => t.type === "expense").reduce((s,t) => s + t.amount, 0)
const balance      = totalIncome - totalExpense
const savingsRate  = Math.round((( totalIncome - totalExpense) / totalIncome) * 100)

const spendByCategory = mockTransactions
  .filter(t => t.type === "expense")
  .reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {})

const pieData = Object.entries(spendByCategory).map(([name, value]) => ({ name, value }))

const PIE_COLORS = ["#4D9EFF","#FFD166","#4ADE80","#FF8FAB","#B57BFF","#FF5F7E"]


function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#13151F] border border-white/10 rounded-xl px-4 py-3 text-xs">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex gap-3 items-center" style={{ color: p.color }}>
          <span className="text-gray-400">{p.name}:</span>
          <span className="text-white font-bold">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

function StatCard({ label, value, sub, positive, icon: Icon, iconColor, iconBg }) {
  return (
    <div className="bg-[#13151F] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.13] transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={18} weight="duotone" className={iconColor} />
        </div>
        <MoreVertical size={18} className="text-gray-700 cursor-pointer hover:text-gray-400 transition-colors" />
      </div>
      <p className="text-gray-500 text-[11px] tracking-widest uppercase mb-1">{label}</p>
      <p className="text-white font-black text-2xl tracking-tight">{value}</p>
      <div className={`flex items-center gap-1 mt-2 text-[11px] ${positive ? "text-emerald-400" : "text-red-400"}`}>
        {positive
          ? <ArrowUpRight size={13} weight="bold" />
          : <ArrowDownRight size={13} weight="bold" />
        }
        <span>{sub}</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)

  const stats = [
    {
      label: "Total Balance",
      value: fmt(balance + 8500),
      sub: "+8.2% vs last month",
      positive: true,
      icon: Wallet,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-400/10",
    },
    {
      label: "Income (Mar)",
      value: fmt(totalIncome),
      sub: "+6.1% vs February",
      positive: true,
      icon: TrendingUp,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-400/10",
    },
    {
      label: "Expenses (Mar)",
      value: fmt(totalExpense),
      sub: "-3.4% vs February",
      positive: false,
      icon: TrendingDown,
      iconColor: "text-red-400",
      iconBg: "bg-red-400/10",
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      sub: "Target 30% — crushing it",
      positive: true,
      icon: PiggyBank,
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-400/10",
    },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-2xl tracking-tight">Overview</h2>
          <p className="text-gray-500 text-sm mt-0.5">Your financial snapshot for March 2025</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-400 hover:bg-emerald-300 text-[#08090E] text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          Add Transaction
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-5 gap-4">

        {/* Area Chart */}
        <div className="col-span-3 bg-[#13151F] border border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white font-bold text-base">Cash Flow</p>
              <p className="text-gray-500 text-xs mt-0.5">6-month income vs expenses</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block" />
                Income
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2 h-2 rounded-sm bg-red-400 inline-block" />
                Expenses
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockMonthlyFlow} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4ADE80" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#FF5F7E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF5F7E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="income"  name="Income"   stroke="#4ADE80" strokeWidth={2} fill="url(#gIncome)" />
              <Area type="monotone" dataKey="expense" name="Expenses" stroke="#FF5F7E" strokeWidth={2} fill="url(#gExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="col-span-2 bg-[#13151F] border border-white/[0.07] rounded-2xl p-6">
          <p className="text-white font-bold text-base mb-1">Spending Breakdown</p>
          <p className="text-gray-500 text-xs mb-4">March 2025</p>
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={34} outerRadius={52} dataKey="value" paddingAngle={3}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-white font-black text-sm leading-none">{fmt(totalExpense)}</p>
                <p className="text-gray-600 text-[9px] mt-0.5">spent</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-gray-400 flex-1 truncate">{d.name}</span>
                  <span className="text-white font-medium">{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#13151F] border border-white/[0.07] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-white font-bold text-base">Recent Transactions</p>
          <button className="text-emerald-400 text-xs hover:text-emerald-300 transition-colors font-medium">
            View all
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {mockTransactions.slice(0, 6).map(t => (
            <div
              key={t._id}
              className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-default"
            >
              <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center text-base shrink-0">
                {t.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{t.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.category} · {t.date}</p>
              </div>
              <p className={`font-bold text-sm tabular-nums ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#13151F] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-black text-xl tracking-tight">Add Transaction</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                x
              </button>
            </div>

            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-white/[0.03] rounded-xl">
              {["expense", "income"].map(type => (
                <button
                  key={type}
                  className={`py-2.5 rounded-lg text-sm font-medium capitalize transition-colors
                    ${type === "expense"
                      ? "bg-red-400/15 text-red-400"
                      : "text-gray-500 hover:text-gray-300"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Grocery run"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Category</label>
                <select className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400/40 transition-colors">
                  <option value="" className="bg-[#13151F]">Select category</option>
                  <option className="bg-[#13151F]">Housing</option>
                  <option className="bg-[#13151F]">Food</option>
                  <option className="bg-[#13151F]">Transport</option>
                  <option className="bg-[#13151F]">Health</option>
                  <option className="bg-[#13151F]">Shopping</option>
                  <option className="bg-[#13151F]">Entertainment</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Date</label>
                <input
                  type="date"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400/40 transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Note (optional)</label>
              <textarea
                rows={2}
                placeholder="Add a note..."
                className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/40 transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.07] text-gray-400 text-sm hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#08090E] text-sm font-bold transition-colors">
                Save Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
