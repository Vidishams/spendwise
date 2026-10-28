import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { inr, seed, thisMonth, monthOf, uid } from './lib'

const Ctx = createContext()
export const useApp = () => useContext(Ctx)
const DEF = { total: 40000, cats: { 'Food & Dining': 8000, Shopping: 6000 } }
const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }

export function AppProvider({ children }) {
  const [tx, setTx] = useState(() => load('sw_tx', null) ?? seed())
  const [budgets, setBudgets] = useState(() => load('sw_budgets', DEF))
  const [dark, setDark] = useState(() => load('sw_dark', false))
  const [month, setMonth] = useState(thisMonth())
  const [toasts, setToasts] = useState([])
  const [hl, setHl] = useState(null)
  const [quick, setQuick] = useState(null)
  const [form, setForm] = useState(null)

  useEffect(() => save('sw_tx', tx), [tx])
  useEffect(() => save('sw_budgets', budgets), [budgets])
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); save('sw_dark', dark) }, [dark])

  const toast = useCallback((msg, kind = 'ok') => {
    const id = uid()
    setToasts((t) => [...t, { id, msg, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500)
  }, [])

  const budgetAlerts = (n, after) => {
    if (n.type !== 'expense') return
    const m = monthOf(n)
    const spent = (l, cat) => l.reduce((a, t) => (t.type === 'expense' && monthOf(t) === m && (!cat || t.category === cat) ? a + t.amount : a), 0)
    const chk = (label, limit, b, a) => {
      if (!limit) return
      const pb = (b / limit) * 100, pa = (a / limit) * 100
      if (pa >= 100 && pb < 100) toast(`${label} budget exceeded · ${Math.round(pa)}% used`, 'danger')
      else if (pa >= 80 && pb < 80) toast(`${label} budget at ${Math.round(pa)}% · approaching limit`, 'warn')
    }
    chk('Monthly', budgets.total, spent(tx), spent(after))
    chk(n.category, budgets.cats[n.category], spent(tx, n.category), spent(after, n.category))
  }

  const addTx = (t) => {
    const n = { ...t, id: uid() }
    const after = [n, ...tx]
    setTx(after); setMonth(monthOf(n)); setHl(n.id)
    setTimeout(() => setHl(null), 2500)
    const label = t.category === 'Other' ? t.title : t.category
    toast(`${inr(t.amount)} ${t.type === 'income' ? 'credited' : 'debited'} · ${label}`, t.type === 'income' ? 'credit' : 'debit')
    budgetAlerts(n, after)
  }
  const updateTx = (t) => { setTx(tx.map((x) => (x.id === t.id ? t : x))); toast('Transaction updated') }
  const delTx = (id) => { setTx(tx.filter((x) => x.id !== id)); toast('Transaction deleted') }
  const resetDemo = () => { setTx(seed()); setBudgets(DEF); toast('Demo data restored') }
  const clearAll = () => { setTx([]); toast('All transactions cleared') }

  const setPage = (p) => { location.hash = p; window.scrollTo(0, 0) }

  return (
    <Ctx.Provider value={{ setPage, tx, budgets, setBudgets, dark, setDark, month, setMonth, toasts, hl, quick, setQuick, form, setForm, toast, addTx, updateTx, delTx, resetDemo, clearAll }}>
      {children}
    </Ctx.Provider>
  )
}
