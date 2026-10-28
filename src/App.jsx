import { useEffect, useState } from 'react'
import { LayoutDashboard, ArrowLeftRight, PiggyBank, BarChart3, Settings as Cog, Menu, X, Sun, Moon, Plus, Zap } from 'lucide-react'
import { useApp } from './store'
import { Toasts, Modal } from './ui'
import { QuickPanel, QuickModal } from './QuickPay'
import { TxForm } from './TxForm'
import { Dashboard, Transactions, Budgets, Analytics, SettingsPage } from './pages'

const NAV = [['dashboard', 'Dashboard', LayoutDashboard], ['transactions', 'Transactions', ArrowLeftRight], ['budgets', 'Budgets', PiggyBank], ['analytics', 'Analytics', BarChart3], ['settings', 'Settings', Cog]]
const PAGES = { dashboard: Dashboard, transactions: Transactions, budgets: Budgets, analytics: Analytics, settings: SettingsPage }

export default function App() {
  const ctx = useApp()
  const { dark, setDark, month, setMonth, quick, form, setForm } = ctx
  const read = () => (PAGES[location.hash.slice(1)] ? location.hash.slice(1) : 'dashboard')
  const [page, setPage] = useState(read)
  const [menu, setMenu] = useState(false)
  const [sheet, setSheet] = useState(false)
  useEffect(() => { const h = () => setPage(read()); window.addEventListener('hashchange', h); return () => window.removeEventListener('hashchange', h) }, [])
  const go = (p) => { ctx.setPage(p); setMenu(false) }
  const Page = PAGES[page]
  const Nav = () => NAV.map(([k, l, I]) => (
    <button key={k} onClick={() => go(k)} aria-current={page === k ? 'page' : undefined}
      className={`sidebar-link flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${page === k ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}><span className="nav-icon grid h-9 w-9 shrink-0 place-items-center rounded-xl"><I size={18} strokeWidth={2} /></span>{l}</button>
  ))
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-5 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:flex">
        <div className="flex items-center gap-2 px-2 text-xl font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white"><PiggyBank size={20} /></span>SpendWise</div>
        <nav className="space-y-1" aria-label="Main"><Nav /></nav>
        <div className="mt-auto"><p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400"><Zap size={12} />Quick Pay</p><QuickPanel /></div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-2 px-4 py-3 sm:px-6">
            <button className="icon-btn lg:hidden" aria-label="Toggle menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={19} /> : <Menu size={19} />}</button>
            <span className="font-bold lg:hidden">SpendWise</span>
            <div className="ml-auto flex items-center gap-2">
              <input type="month" aria-label="Select month" className="input !w-auto" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} />
              <button className="btn-p hidden sm:inline-flex" onClick={() => setForm({})}><Plus size={16} />Add</button>
              <button className="icon-btn" aria-label="Toggle dark mode" onClick={() => setDark(!dark)}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
            </div>
          </div>
          {menu && <nav className="space-y-1 border-t border-slate-200 p-3 dark:border-slate-800 lg:hidden" aria-label="Mobile"><Nav /></nav>}
        </header>
        <main className="mx-auto max-w-6xl p-4 pb-28 sm:p-6"><Page /></main>
      </div>
      <button className="floating-action fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800 lg:hidden" aria-label="Open Quick Pay" onClick={() => setSheet(true)}><Zap size={23} strokeWidth={2.2} /></button>
      {sheet && <Modal title="Quick Pay" onClose={() => setSheet(false)}><QuickPanel onAction={() => setSheet(false)} /></Modal>}
      {quick && <QuickModal key={quick} />}
      {form && <TxForm key={form.id || 'new'} />}
      <Toasts />
    </div>
  )
}
