import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, X, Check, Tag, LayoutGrid, List } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import api from "../utils/api"

import { useCurrency } from "../context/CurrencyContext"

const EMPTY_FORM = { name: "", type: "expense", color: "#4D9EFF" }

const COLOR_OPTIONS = [
  "#4D9EFF", "#FFD166", "#4ADE80", "#FF8FAB",
  "#B57BFF", "#FF5F7E", "#00E5A0", "#FB923C",
]


function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#13151F] border border-white/10 rounded-xl px-4 py-3 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex gap-3 items-center">
          <span className="text-gray-400">{p.name}:</span>
          <span className="text-white font-bold">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Categories() {
  const [categories, setCategories]     = useState([])
  const [transactions, setTransactions] = useState([])
  const [view, setView]                 = useState("grid")
  const [showModal, setShowModal]       = useState(false)
  const [editingId, setEditingId]       = useState(null)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [deleteId, setDeleteId]         = useState(null)
  const [loading, setLoading]           = useState(true)
  const { fmt } = useCurrency()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [catsRes, txRes] = await Promise.all([
        api.get("/categories"),
        api.get("/transactions"),
      ])
      setCategories(catsRes.data)
      setTransactions(txRes.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const statsMap = categories.reduce((acc, c) => {
    const catTxns = transactions.filter(t => t.category === c.name)
    acc[c.name] = {
      count: catTxns.length,
      total: catTxns.reduce((s, t) => s + t.amount, 0),
    }
    return acc
  }, {})

  const chartData = categories.map(c => ({
    name:   c.name,
    amount: statsMap[c.name]?.total || 0,
    color:  c.color,
  }))

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(c) {
    setForm({ name: c.name, type: c.type, color: c.color })
    setEditingId(c._id)
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.name) return
    try {
      if (editingId) {
        const { data } = await api.put(`/categories/${editingId}`, form)
        setCategories(prev => prev.map(c => c._id === editingId ? data : c))
      } else {
        const { data } = await api.post("/categories", form)
        setCategories(prev => [...prev, data])
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
      await api.delete(`/categories/${id}`)
      setCategories(prev => prev.filter(c => c._id !== id))
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
          <h2 className="text-white font-black text-2xl tracking-tight">Categories</h2>
          <p className="text-gray-500 text-sm mt-0.5">Organize your money by type</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#13151F] border border-white/[0.07] rounded-xl p-1">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-white/[0.08] text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-white/[0.08] text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              <List size={15} />
            </button>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-[#08090E] text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={15} strokeWidth={2.5} />
            New Category
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="bg-[#13151F] border border-white/[0.07] rounded-2xl p-6">
          <p className="text-white font-bold text-base mb-1">Spending by Category</p>
          <p className="text-gray-500 text-xs mb-5">All transactions</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="amount" name="Amount" radius={[6, 6, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.color || "#4D9EFF"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="bg-[#13151F] border border-white/[0.07] rounded-2xl py-16 text-center">
          <p className="text-gray-600 text-sm">No categories yet — create your first one!</p>
        </div>
      )}

      {/* Grid View */}
      {view === "grid" && categories.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {categories.map(c => {
            const stats = statsMap[c.name] || { count: 0, total: 0 }
            return (
              <div
                key={c._id}
                className="bg-[#13151F] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.13] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${c.color}18`, border: `1px solid ${c.color}33` }}
                  >
                    <Tag size={18} style={{ color: c.color }} />
                  </div>
                  <span
                    className="text-[10px] px-2.5 py-1 rounded-full border"
                    style={{
                      color:       c.type === "income" ? "#00E5A0" : "#FF5F7E",
                      background:  c.type === "income" ? "#00E5A010" : "#FF5F7E10",
                      borderColor: c.type === "income" ? "#00E5A033" : "#FF5F7E33",
                    }}
                  >
                    {c.type.toUpperCase()}
                  </span>
                </div>

                <p className="text-white font-bold text-base mb-1">{c.name}</p>
                <p className="text-gray-500 text-xs mb-4">
                  {stats.count} transaction{stats.count !== 1 ? "s" : ""}
                </p>

                <div className="flex items-center justify-between">
                  <p
                    className="font-black text-xl tracking-tight"
                    style={{ color: c.type === "income" ? "#00E5A0" : "#F1F2F6" }}
                  >
                    {fmt(stats.total)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteId(c._id)}
                      className="w-7 h-7 rounded-lg bg-red-400/[0.08] flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && categories.length > 0 && (
        <div className="bg-[#13151F] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] px-5 py-3 border-b border-white/[0.07]">
            {["Category", "Type", "Transactions", "Total", ""].map((h, i) => (
              <p key={i} className="text-[10px] text-gray-600 tracking-widest uppercase">{h}</p>
            ))}
          </div>
          {categories.map((c, i) => {
            const stats = statsMap[c.name] || { count: 0, total: 0 }
            return (
              <div
                key={c._id}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_80px] px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors
                  ${i < categories.length - 1 ? "border-b border-white/[0.04]" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${c.color}18` }}
                  >
                    <Tag size={14} style={{ color: c.color }} />
                  </div>
                  <p className="text-sm text-white">{c.name}</p>
                </div>

                <span
                  className="text-[10px] px-2.5 py-1 rounded-full border w-fit"
                  style={{
                    color:       c.type === "income" ? "#00E5A0" : "#FF5F7E",
                    background:  c.type === "income" ? "#00E5A010" : "#FF5F7E10",
                    borderColor: c.type === "income" ? "#00E5A033" : "#FF5F7E33",
                  }}
                >
                  {c.type.toUpperCase()}
                </span>

                <p className="text-sm text-gray-400">{stats.count}</p>

                <p
                  className="font-bold text-sm tabular-nums"
                  style={{ color: c.type === "income" ? "#00E5A0" : "#F1F2F6" }}
                >
                  {fmt(stats.total)}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteId(c._id)}
                    className="w-7 h-7 rounded-lg bg-red-400/[0.08] flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-colors"
                  >
                    <Trash2 size={13} />
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
                {editingId ? "Edit Category" : "New Category"}
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
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Groceries"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/40 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-1.5">Type</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.03] rounded-xl">
                  {["expense", "income"].map(type => (
                    <button
                      key={type}
                      onClick={() => setForm(f => ({ ...f, type }))}
                      className={`py-2.5 rounded-lg text-sm font-medium capitalize transition-colors
                        ${form.type === type
                          ? type === "expense"
                            ? "bg-red-400/15 text-red-400"
                            : "bg-emerald-400/15 text-emerald-400"
                          : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 tracking-widest uppercase mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_OPTIONS.map(color => (
                    <button
                      key={color}
                      onClick={() => setForm(f => ({ ...f, color }))}
                      className="w-8 h-8 rounded-lg transition-transform hover:scale-110"
                      style={{
                        background:    color,
                        outline:       form.color === color ? `2px solid ${color}` : "none",
                        outlineOffset: "2px",
                      }}
                    />
                  ))}
                </div>
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
                {editingId ? "Save Changes" : "Create Category"}
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
              <Tag size={22} className="text-red-400" />
            </div>
            <h3 className="text-white font-black text-lg tracking-tight mb-2">Delete Category</h3>
            <p className="text-gray-500 text-sm mb-6">
              This category will be permanently removed. Existing transactions will not be affected.
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