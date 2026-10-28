import { useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar as RBar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line } from 'recharts'
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, Search, Download, Sun, Moon, RotateCcw, Trash2, ArrowRight } from 'lucide-react'
import { useApp } from './store'
import { Bar, Confirm, Empty, Modal, TxTable } from './ui'
import { EXP, COLORS, inr, short, sum, byCat, monthly, dailyCum, daysIn, change, monthOf, monthLabel, shift, fmtDate, exportCsv } from './lib'

const tick = { fontSize: 12, fill: '#94a3b8' }
const tip = { contentStyle: { borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,.18)' }, formatter: (v) => inr(v) }
const Head = ({ title, sub, children }) => (
  <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
    <div><h1 className="text-2xl font-bold">{title}</h1><p className="text-sm text-slate-500">{sub}</p></div>{children}
  </div>
)
const Stat = ({ label, value, icon: I, tone }) => (
  <div className="card dashboard-stat flex items-center gap-4">
    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tone}`}><I size={20} /></span>
    <div className="min-w-0"><p className="text-xs font-medium text-slate-500">{label}</p><p className="truncate text-xl font-bold">{value}</p></div>
  </div>
)
const Donut = ({ data }) => (
  <div className="flex flex-col items-center gap-4 sm:flex-row">
    <div className="h-48 w-48 shrink-0"><ResponsiveContainer><PieChart><Pie data={data} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="none">{data.map((d) => <Cell key={d.name} fill={COLORS[d.name]} />)}</Pie><Tooltip {...tip} /></PieChart></ResponsiveContainer></div>
    <ul className="w-full space-y-1.5 text-sm">{data.slice(0, 6).map((d) => <li key={d.name} className="flex items-center justify-between gap-2"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[d.name] }} />{d.name}</span><b>{inr(d.value)}</b></li>)}</ul>
  </div>
)
const IvE = ({ data }) => (
  <div className="h-64"><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" vertical={false} /><XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} /><YAxis tick={tick} tickFormatter={short} axisLine={false} tickLine={false} width={40} /><Tooltip {...tip} /><Legend /><RBar dataKey="Income" fill="#249477" radius={[6, 6, 0, 0]} /><RBar dataKey="Expenses" fill="#df9363" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
)

export function Dashboard() {
  const { tx, month, budgets, hl, setForm, setPage } = useApp()
  const list = tx.filter((t) => monthOf(t) === month)
  const inc = sum(list, 'income'), exp = sum(list, 'expense')
  const rem = budgets.total ? budgets.total - exp : null
  const recent = [...list].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
  return (
    <div className="dashboard-page">
      <Head title="Dashboard" sub={`Overview for ${monthLabel(month)}`}><button className="btn-p" onClick={() => setForm({})}><Plus size={16} />Add transaction</button></Head>
      <div className="dashboard-stats grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total balance" value={inr(inc - exp)} icon={Wallet} tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" />
        <Stat label="Total income" value={inr(inc)} icon={TrendingUp} tone="bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" />
        <Stat label="Total expenses" value={inr(exp)} icon={TrendingDown} tone="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" />
        <Stat label="Remaining monthly budget" value={rem == null ? 'Not set' : inr(rem)} icon={PiggyBank} tone="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" />
      </div>
      {list.length === 0 ? (
        <div className="card dashboard-panel mt-4"><Empty title="No transactions this month" text="Add a transaction or use Quick Pay to see your dashboard come alive."><button className="btn-p mt-2" onClick={() => setForm({})}>Add transaction</button></Empty></div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="card dashboard-panel"><h2 className="mb-3 font-semibold">Income vs expenses</h2><IvE data={monthly(tx, month)} /></div>
          <div className="card dashboard-panel"><h2 className="mb-3 font-semibold">Spending by category</h2>{byCat(list).length ? <Donut data={byCat(list)} /> : <Empty title="No expenses yet" text="Expenses will appear here." />}</div>
          <div className="card dashboard-panel"><h2 className="mb-3 font-semibold">Spending trend (cumulative)</h2>
            <div className="h-56"><ResponsiveContainer><LineChart data={dailyCum(list, month)}><CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" vertical={false} /><XAxis dataKey="day" tick={tick} axisLine={false} tickLine={false} /><YAxis tick={tick} tickFormatter={short} axisLine={false} tickLine={false} width={40} /><Tooltip {...tip} /><Line type="monotone" dataKey="Spent" stroke="#10b981" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer></div></div>
          <div className="card dashboard-panel"><h2 className="mb-3 font-semibold">Budget usage</h2>
            {budgets.total ? <><div className="mb-2 flex justify-between text-sm"><span>{inr(exp)} of {inr(budgets.total)}</span><b>{Math.round((exp / budgets.total) * 100)}%</b></div><Bar spent={exp} limit={budgets.total} />
              <p className="mt-3 text-sm text-slate-500">{exp > budgets.total ? `Over budget by ${inr(exp - budgets.total)}` : exp / budgets.total >= 0.8 ? 'Warning: over 80% of your budget used' : `${inr(budgets.total - exp)} left this month`}</p></>
              : <p className="text-sm text-slate-500">No monthly budget set. Set one on the Budgets page.</p>}
            <button className="btn-o mt-4" onClick={() => setPage('budgets')}><PiggyBank size={16} />Manage budgets<ArrowRight size={15} /></button></div>
          <div className="card dashboard-panel lg:col-span-2"><div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Recent transactions</h2><button className="dashboard-link" onClick={() => setPage('transactions')}>View all<ArrowRight size={15} /></button></div><TxTable list={recent} hl={hl} /></div>
        </div>
      )}
    </div>
  )
}

export function Transactions() {
  const { tx, hl, setForm, delTx, toast } = useApp()
  const [f, setF] = useState({ q: '', type: 'all', cat: 'all', from: '', to: '', sort: 'new' })
  const [view, setView] = useState(null), [del, setDel] = useState(null)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const rows = tx.filter((t) => t.title.toLowerCase().includes(f.q.toLowerCase()) && (f.type === 'all' || t.type === f.type) && (f.cat === 'all' || t.category === f.cat) && (!f.from || t.date >= f.from) && (!f.to || t.date <= f.to))
    .sort((a, b) => ({ new: b.date.localeCompare(a.date), old: a.date.localeCompare(b.date), high: b.amount - a.amount, low: a.amount - b.amount })[f.sort])
  const allCats = [...new Set([...EXP, 'Salary', 'Freelance', 'Scholarship', 'Friend'])]
  return (
    <>
      <Head title="Transactions" sub={`${rows.length} of ${tx.length} transactions`}>
        <div className="flex gap-2">
          <button className="btn-o" onClick={() => { if (!rows.length) return toast('Nothing to export', 'warn'); exportCsv(rows); toast(`Exported ${rows.length} transactions to CSV`) }}><Download size={16} />Export CSV</button>
          <button className="btn-p" onClick={() => setForm({})}><Plus size={16} />Add</button>
        </div>
      </Head>
      <div className="card mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative lg:col-span-2"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input aria-label="Search by title" className="input pl-9" placeholder="Search title" value={f.q} onChange={set('q')} /></div>
        <select aria-label="Type" className="input" value={f.type} onChange={set('type')}><option value="all">All types</option><option value="income">Income</option><option value="expense">Expense</option></select>
        <select aria-label="Category" className="input" value={f.cat} onChange={set('cat')}><option value="all">All categories</option>{allCats.map((c) => <option key={c}>{c}</option>)}</select>
        <select aria-label="Sort" className="input" value={f.sort} onChange={set('sort')}><option value="new">Newest</option><option value="old">Oldest</option><option value="high">Highest amount</option><option value="low">Lowest amount</option></select>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-6"><input aria-label="From date" type="date" className="input" value={f.from} onChange={set('from')} /><input aria-label="To date" type="date" className="input" value={f.to} onChange={set('to')} /><button className="btn-o shrink-0" onClick={() => setF({ q: '', type: 'all', cat: 'all', from: '', to: '', sort: 'new' })}>Reset</button></div>
      </div>
      <div className="card">{rows.length ? <TxTable list={rows} hl={hl} onView={setView} onEdit={setForm} onDel={setDel} /> : <Empty title={tx.length ? 'No matching transactions' : 'No transactions yet'} text={tx.length ? 'Try changing your filters.' : 'Add your first transaction to get started.'} />}</div>
      {view && <Modal title="Transaction details" onClose={() => setView(null)}><dl className="space-y-2 text-sm">{[['Title', view.title], ['Amount', (view.type === 'income' ? '+' : '-') + inr(view.amount)], ['Type', view.type], ['Category', view.category], ['Date', fmtDate(view.date)], ['Notes', view.notes || '—']].map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-2 dark:border-slate-800"><dt className="text-slate-500">{k}</dt><dd className="text-right font-medium capitalize">{v}</dd></div>)}</dl></Modal>}
      {del && <Confirm title="Delete transaction?" text={`"${del.title}" (${inr(del.amount)}) will be permanently removed.`} onYes={() => delTx(del.id)} onClose={() => setDel(null)} />}
    </>
  )
}

export function Budgets() {
  const { tx, month, budgets, setBudgets, toast } = useApp()
  const [d, setD] = useState({ total: budgets.total ? String(budgets.total) : '', cats: Object.fromEntries(EXP.map((c) => [c, budgets.cats[c] ? String(budgets.cats[c]) : ''])) })
  const [err, setErr] = useState('')
  const list = tx.filter((t) => monthOf(t) === month && t.type === 'expense')
  const spent = (c) => list.reduce((a, t) => (!c || t.category === c ? a + t.amount : a), 0)
  const save = () => {
    const num = (v) => (v.trim() === '' ? 0 : Number(v.replace(/,/g, '')))
    const vals = [d.total, ...Object.values(d.cats)].map(num)
    if (vals.some((v) => !Number.isFinite(v) || v < 0)) return setErr('Budgets must be numbers of 0 or more.')
    setErr('')
    setBudgets({ total: num(d.total), cats: Object.fromEntries(EXP.map((c) => [c, num(d.cats[c])]).filter(([, v]) => v > 0)) })
    toast('Budgets saved')
  }
  const Row = ({ label, limit, s, color }) => (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className="flex items-center gap-2 font-medium">{color && <i className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />}{label}
        {s > limit && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">Exceeded</span>}
        {s <= limit && s / limit >= 0.8 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Over 80%</span>}</span>
        <span className="text-slate-500">{inr(s)} spent · {s > limit ? `${inr(s - limit)} over` : `${inr(limit - s)} left`} of {inr(limit)}</span></div>
      <Bar spent={s} limit={limit} />
    </div>
  )
  return (
    <>
      <Head title="Budgets" sub={`Expense budgets for ${monthLabel(month)} (income is never counted)`}><button className="btn-p" onClick={save}>Save budgets</button></Head>
      {err && <p role="alert" className="mb-3 text-sm text-red-600">{err}</p>}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-4"><h2 className="font-semibold">Set budgets</h2>
          <div><label className="lbl" htmlFor="bt">Total monthly budget (₹)</label><input id="bt" inputMode="decimal" className="input" placeholder="e.g. 40000" value={d.total} onChange={(e) => setD({ ...d, total: e.target.value })} /></div>
          <div className="grid gap-3 sm:grid-cols-2">{EXP.map((c) => <div key={c}><label className="lbl" htmlFor={'b' + c}>{c} (optional)</label><input id={'b' + c} inputMode="decimal" className="input" value={d.cats[c]} onChange={(e) => setD({ ...d, cats: { ...d.cats, [c]: e.target.value } })} /></div>)}</div>
        </div>
        <div className="card space-y-5"><h2 className="font-semibold">Usage</h2>
          {budgets.total ? <Row label="Total monthly budget" limit={budgets.total} s={spent()} /> : <p className="text-sm text-slate-500">No total budget set.</p>}
          {EXP.filter((c) => budgets.cats[c]).map((c) => <Row key={c} label={c} limit={budgets.cats[c]} s={spent(c)} color={COLORS[c]} />)}
          {!budgets.total && !Object.keys(budgets.cats).length && <Empty title="No budgets yet" text="Set a total or category budget and save." />}
        </div>
      </div>
    </>
  )
}

export function Analytics() {
  const { tx, month } = useApp()
  const list = tx.filter((t) => monthOf(t) === month)
  const prev = tx.filter((t) => monthOf(t) === shift(month, -1))
  const inc = sum(list, 'income'), exp = sum(list, 'expense'), pInc = sum(prev, 'income'), pExp = sum(prev, 'expense')
  const cats = byCat(list), sav = inc - exp, pSav = pInc - pExp
  const ch = change(exp, pExp), chS = change(sav, Math.abs(pSav) || 0)
  const fmt = (v) => (v == null ? 'No prior data' : `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`)
  return (
    <>
      <Head title="Analytics" sub={`Insights for ${monthLabel(month)} · change vs ${monthLabel(shift(month, -1))}`} />
      {tx.length === 0 ? <div className="card"><Empty title="No data to analyse" text="Add transactions to unlock analytics." /></div> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Monthly savings" value={inr(sav)} icon={PiggyBank} tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" />
            <Stat label="Average daily spending" value={inr(exp / daysIn(month))} icon={Wallet} tone="bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" />
            <Stat label="Spending vs last month" value={fmt(ch)} icon={ch != null && ch > 0 ? TrendingUp : TrendingDown} tone="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" />
            <Stat label="Savings vs last month" value={fmt(chS)} icon={TrendingUp} tone="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" />
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="card"><h2 className="mb-3 font-semibold">Spending by category</h2>{cats.length ? <Donut data={cats} /> : <Empty title="No expenses" text="Nothing spent this month." />}</div>
            <div className="card"><h2 className="mb-3 font-semibold">Income vs expenses by month</h2><IvE data={monthly(tx, month, 6)} /></div>
            <div className="card lg:col-span-2"><h2 className="mb-3 font-semibold">Highest spending categories</h2>
              {cats.length ? <ol className="space-y-3">{cats.slice(0, 5).map((c, i) => <li key={c.name}><div className="mb-1 flex justify-between text-sm"><span>{i + 1}. {c.name}</span><b>{inr(c.value)} · {Math.round((c.value / exp) * 100)}%</b></div><div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full" style={{ width: `${(c.value / cats[0].value) * 100}%`, background: COLORS[c.name] }} /></div></li>)}</ol> : <p className="text-sm text-slate-500">No expenses this month.</p>}</div>
          </div>
        </>
      )}
    </>
  )
}

export function SettingsPage() {
  const { tx, dark, setDark, resetDemo, clearAll, toast } = useApp()
  const [c, setC] = useState(null)
  const Row = ({ t, s, children }) => <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 py-4 last:border-0 dark:border-slate-800"><div><p className="font-medium">{t}</p><p className="text-sm text-slate-500">{s}</p></div>{children}</div>
  return (
    <>
      <Head title="Settings" sub="Preferences and data management" />
      <div className="card max-w-2xl">
        <Row t="Appearance" s={dark ? 'Dark mode is on' : 'Light mode is on'}><button className="btn-o" onClick={() => setDark(!dark)}>{dark ? <Sun size={16} /> : <Moon size={16} />}{dark ? 'Light mode' : 'Dark mode'}</button></Row>
        <Row t="Currency" s="Indian Rupee (₹) with Indian digit grouping"><span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold dark:bg-slate-800">INR ₹</span></Row>
        <Row t="Export data" s={`Download all ${tx.length} transactions as CSV`}><button className="btn-o" onClick={() => { if (!tx.length) return toast('Nothing to export', 'warn'); exportCsv(tx); toast('Exported all transactions to CSV') }}><Download size={16} />Export CSV</button></Row>
        <Row t="Reset demo data" s="Replace everything with the sample data and budgets"><button className="btn-o" onClick={() => setC('reset')}><RotateCcw size={16} />Reset</button></Row>
        <Row t="Clear sample data" s="Delete all transactions and start fresh"><button className="btn-d" onClick={() => setC('clear')}><Trash2 size={16} />Clear all</button></Row>
        <p className="pt-4 text-xs text-slate-500">Demo mode: all money in SpendWise is simulated. Data is stored only in this browser (LocalStorage).</p>
      </div>
      {c === 'reset' && <Confirm title="Reset demo data?" text="Your current transactions and budgets will be replaced with sample data." action="Reset" onYes={resetDemo} onClose={() => setC(null)} />}
      {c === 'clear' && <Confirm title="Clear all transactions?" text="Every transaction will be deleted. This cannot be undone." action="Clear all" onYes={clearAll} onClose={() => setC(null)} />}
    </>
  )
}
