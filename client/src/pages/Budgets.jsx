import { useState, useMemo, useEffect } from "react"
import { Plus, Pencil, Trash2, X, Check, Target } from "lucide-react"
import api from "../utils/api"

const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(n)

const EMPTY_FORM = { category: "", limit: "" }

const CATEGORY_OPTIONS = [
  "Housing", "Food", "Transport", "Health", "Shopping", "Entertainment"
]

export default function Budgets() {
  const [budgets, setBudgets]           = useState([])
  const [transactions, setTransactions] = useState([])
  const [showModal, setShowModal]       = useState(false)
  const [editingId, setEditingId]       = useState(null)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [deleteId, setDeleteId]         = useState(null)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [budgetsRes, txRes] = await Promise.all([
        api.get("/budgets"),
        api.get("/transactions"),
      ])
      setBudgets(budgetsRes.data)
      setTransactions(txRes.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const spentMap = useMemo(() => {
    return transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})
  }, [transactions])

  const totalBudgeted = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent    = budgets.reduce((s, b) => s + (spentMap[b.category] || 0), 0)
  const totalLeft     = totalBudgeted - totalSpent

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(b) {
    setForm({ category: b.category, limit: b.limit })
    setEditingId(b._id)
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.category || !form.limit) return
    try {
      const now = new Date()
      if (editingId) {
        const { data } = await api.put(`/budgets/${editingId}`, {
          category: form.category,
          limit: Number(form.limit),
        })
        setBudgets(prev => prev.map(b => b._id === editingId ? data : b))
      } else {
        const { data } = await api.post("/budgets", {
          category: form.category,
          limit: Number(form.limit),
          color: "#4D9EFF",
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        })
        setBudgets(prev => [...prev, data])
      }
      setShowModal(false)
      setForm(EMPTY_FORM)
      setEditingId(null)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/budgets/${id}`)
      setBudgets(prev => prev.filter(b => b._id !== id))
      setDeleteId(null)
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-white/10 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-2xl tracking-tight">Budgets</h2>
          <p className="text-gray-500 text-sm mt-0.5">Set limits and track your spending</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-[#08090E] text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={15} strokeWidth={2.5} />
          New Budget
        </button>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Budgeted", value: fmt(totalBudgeted), color: "text-blue-400"    },
          { label: "Total Spent",    value: fmt(totalSpent),    color: "text-yellow-400"  },
          { label: "Remaining",      value: fmt(totalLeft),     color: "text-emerald-400" },
        ].map((s, i) => (
          <div key={i} className="bg-[#13151F] border border-white/[0.07] rounded-2xl px-5 py-4">
            <p className="text-gray-500 text-[11px] tracking-widest uppercase mb-1">{s.label}</p>
            <p className={`font-black text-xl tracking-tight ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div className="bg-[#13151F] border border-white/[0.07] rounded-2xl py-16 text-center">
          <p className="text-gray-600 text-sm">No budgets yet — create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {budgets.map(b => {
            const spent = spentMap[b.category] || 0
            const pct   = Math.min(Math.round((spent / b.limit) * 100), 100)
            const over  = spent > b.limit
            const warn  = pct >= 80 && !over
            const barColor = over ? "#FF5F7E" : warn ? "#FFD166" : b.color || "#4D9EFF"

            return (
              <div
                key={b._id}
                className="bg-[#13151F] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.13] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white font-bold text-base">{b.category}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{pct}% used</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg tracking-tight" style={{ color: over ? "#FF5F7E" : "#F1F2F6" }}>
                      {fmt(spent)}
                    </p>
                    <p className="text-gray-600 text-xs">of {fmt(b.limit)}</p>
                  </div>
                </div>

                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${barColor}99, ${barColor})`,
                      boxShadow: over ? `0 0 10px ${barColor}66` : warn ? `0 0 6px ${barColor}44` : "none",
                    }}
                  />
                </div>

                {over  && <p className="text-xs text-red-400 mb-3">Over budget by {fmt(spent - b.limit)}</p>}
                {warn  && <p className="text-xs text-yellow-400 mb-3">Almost at limit — {fmt(b.limit - spent)} remaining</p>}
                {!over && !warn && <p className="text-xs text-gray-600 mb-3">{fmt(b.limit - spent)} remaining</p>}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => openEdit(b)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/[0.07] text-gray-400 text-xs hover:bg-white/[0.04] transition-colors"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(b._id)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-400/[0.08] text-red-400 text-xs hover:bg-red-400/20 transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
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
              <h3 className="text-white font-black text-xl tracking-tight">
                {editingId ? "Edit Budget" : "New Budget"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400/40 transition-colors"
                >
                  <option value="" className="bg-[#13151F]">Select category</option>
                  {CATEGORY_OPTIONS.map(c => (
                    <option key={c} value={c} className="bg-[#13151F]">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Monthly Limit ($)</label>
                <input
                  type="number"
                  value={form.limit}
                  onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
                  placeholder="e.g. 500"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/40 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.07] text-gray-400 text-sm hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#08090E] text-sm font-bold transition-colors"
              >
                <Check size={15} strokeWidth={2.5} />
                {editingId ? "Save Changes" : "Create Budget"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-[#13151F] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-400/10 flex items-center justify-center mb-4">
              <Target size={22} className="text-red-400" />
            </div>
            <h3 className="text-white font-black text-lg tracking-tight mb-2">Delete Budget</h3>
            <p className="text-gray-500 text-sm mb-6">
              This budget will be permanently removed. Your transactions will not be affected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.07] text-gray-400 text-sm hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-red-400/90 hover:bg-red-400 text-white text-sm font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}