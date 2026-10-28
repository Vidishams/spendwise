import { Utensils, Car, ShoppingBag, Receipt, GraduationCap, HeartPulse, Clapperboard, Plane, CircleEllipsis, Briefcase, Laptop, Award, Users } from 'lucide-react'

export const EXP = ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Education', 'Health', 'Entertainment', 'Travel', 'Other']
export const INC = ['Salary', 'Freelance', 'Scholarship', 'Friend', 'Other']
export const ICONS = { 'Food & Dining': Utensils, Transportation: Car, Shopping: ShoppingBag, 'Bills & Utilities': Receipt, Education: GraduationCap, Health: HeartPulse, Entertainment: Clapperboard, Travel: Plane, Other: CircleEllipsis, Salary: Briefcase, Freelance: Laptop, Scholarship: Award, Friend: Users }
export const COLORS = { 'Food & Dining': '#10b981', Transportation: '#3b82f6', Shopping: '#f59e0b', 'Bills & Utilities': '#ef4444', Education: '#8b5cf6', Health: '#ec4899', Entertainment: '#06b6d4', Travel: '#f97316', Other: '#64748b', Salary: '#059669', Freelance: '#0ea5e9', Scholarship: '#a855f7', Friend: '#eab308' }

export const inr = (n) => (n < 0 ? '-' : '') + '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(Math.abs(n))
export const short = (n) => (n >= 1e5 ? `${+(n / 1e5).toFixed(1)}L` : n >= 1e3 ? `${+(n / 1e3).toFixed(1)}k` : n)

const p2 = (n) => String(n).padStart(2, '0')
export const iso = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`
export const today = () => iso(new Date())
export const thisMonth = () => today().slice(0, 7)
export const monthOf = (t) => t.date.slice(0, 7)
export const shift = (m, d) => { const [y, mo] = m.split('-').map(Number); const x = new Date(y, mo - 1 + d, 1); return `${x.getFullYear()}-${p2(x.getMonth() + 1)}` }
export const monthLabel = (m) => { const [y, mo] = m.split('-').map(Number); return new Date(y, mo - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) }
export const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

export const sum = (l, type) => l.reduce((a, t) => (t.type === type ? a + t.amount : a), 0)
export const byCat = (l) => {
  const m = {}
  l.forEach((t) => { if (t.type === 'expense') m[t.category] = (m[t.category] || 0) + t.amount })
  return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}
export const monthly = (tx, end, n = 6) => Array.from({ length: n }, (_, i) => {
  const m = shift(end, i - n + 1)
  const l = tx.filter((t) => monthOf(t) === m)
  return { m, label: monthLabel(m).slice(0, 3), Income: sum(l, 'income'), Expenses: sum(l, 'expense') }
})
export const dailyCum = (l, m) => {
  const [y, mo] = m.split('-').map(Number)
  const n = m === thisMonth() ? new Date().getDate() : new Date(y, mo, 0).getDate()
  let c = 0
  return Array.from({ length: n }, (_, i) => {
    const d = `${m}-${p2(i + 1)}`
    c += l.reduce((a, t) => (t.type === 'expense' && t.date === d ? a + t.amount : a), 0)
    return { day: i + 1, Spent: c }
  })
}
export const daysIn = (m) => { const [y, mo] = m.split('-').map(Number); return m === thisMonth() ? new Date().getDate() : new Date(y, mo, 0).getDate() }
export const change = (a, b) => (b ? ((a - b) / b) * 100 : null)

export const parseAmount = (v) => {
  const s = String(v ?? '').replace(/,/g, '').trim()
  const n = Number(s)
  return s !== '' && Number.isFinite(n) && n > 0 && n <= 1e9 ? Math.round(n * 100) / 100 : null
}

export const exportCsv = (list) => {
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const rows = [['ID', 'Title', 'Amount', 'Type', 'Category', 'Date', 'Notes'], ...list.map((t) => [t.id, t.title, t.amount, t.type, t.category, t.date, t.notes])]
  const url = URL.createObjectURL(new Blob([rows.map((r) => r.map(q).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url; a.download = `spendwise-${today()}.csv`; a.click()
  URL.revokeObjectURL(url)
}

export const seed = () => {
  const now = new Date(), out = []
  let i = 0
  const add = (m, d, title, amount, type, category) => {
    const dt = new Date(now.getFullYear(), now.getMonth() - m, d)
    if (dt <= now) out.push({ id: 's' + i++, title, amount, type, category, date: iso(dt), notes: '' })
  }
  for (let m = 0; m < 5; m++) {
    add(m, 1, 'Monthly salary', 65000, 'income', 'Salary')
    add(m, 12, 'Freelance project', 8000 + m * 2500, 'income', 'Freelance')
    add(m, 2, 'Rent & electricity', 14500, 'expense', 'Bills & Utilities')
    add(m, 4, 'Swiggy', 420 + m * 60, 'expense', 'Food & Dining')
    add(m, 6, 'Groceries', 2400 + m * 150, 'expense', 'Food & Dining')
    add(m, 8, 'Uber', 310, 'expense', 'Transportation')
    add(m, 10, 'Amazon order', 2899 + m * 400, 'expense', 'Shopping')
    add(m, 14, 'Udemy course', 1299, 'expense', 'Education')
    add(m, 16, 'Zomato', 650, 'expense', 'Food & Dining')
    add(m, 18, 'Movie night', 700 + m * 80, 'expense', 'Entertainment')
    add(m, 20, 'Pharmacy', 540, 'expense', 'Health')
    add(m, 22, 'Metro recharge', 500, 'expense', 'Transportation')
    add(m, 24, 'Train tickets', 1800 + m * 300, 'expense', 'Travel')
    add(m, 26, 'Myntra', 1999, 'expense', 'Shopping')
  }
  return out.sort((a, b) => b.date.localeCompare(a.date))
}

const R = (a, b) => Math.round((a + Math.random() * (b - a)) / 10) * 10
const pick = (a) => a[Math.floor(Math.random() * a.length)]
const MER = {
  'Food & Dining': [['Swiggy', 180, 650], ['Zomato', 200, 700], ['Starbucks', 250, 480]],
  Transportation: [['Uber', 120, 600], ['Ola', 100, 450], ['Metro recharge', 200, 500]],
  Shopping: [['Amazon', 500, 3500], ['Myntra', 799, 2999], ['Flipkart', 400, 2500]],
  'Bills & Utilities': [['Jio recharge', 299, 799], ['Electricity bill', 900, 2200]],
  Entertainment: [['Netflix', 199, 649], ['BookMyShow', 250, 800]],
  Health: [['Apollo Pharmacy', 150, 900]],
  Education: [['Udemy', 449, 1299]],
  Travel: [['IRCTC', 400, 2200], ['RedBus', 350, 1500]],
}
const SRC = [['Freelance payment', 'Freelance', 2000, 12000], ['Scholarship installment', 'Scholarship', 3000, 10000], ['Friend paid back', 'Friend', 500, 3000], ['Salary bonus', 'Salary', 3000, 15000]]
export const randomTx = (type) => {
  const base = { type, date: today(), notes: 'Quick Pay · random' }
  if (type === 'income') { const [title, category, a, b] = pick(SRC); return { ...base, title, category, amount: R(a, b) } }
  const category = pick(Object.keys(MER)); const [title, a, b] = pick(MER[category])
  return { ...base, title, category, amount: R(a, b) }
}
