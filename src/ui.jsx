import { useEffect } from 'react'
import { X, ArrowDownLeft, ArrowUpRight, AlertTriangle, CheckCircle2, Pencil, Trash2, Eye, Inbox } from 'lucide-react'
import { ICONS, COLORS, inr, fmtDate } from './lib'
import { useApp } from './store'

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl dark:bg-slate-900 sm:max-w-md sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="icon-btn h-9 w-9"><X size={17} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const Confirm = ({ title, text, action = 'Delete', onYes, onClose }) => (
  <Modal title={title} onClose={onClose}>
    <p className="mb-5 text-sm text-slate-600 dark:text-slate-300">{text}</p>
    <div className="flex justify-end gap-2">
      <button className="btn-o" onClick={onClose}>Cancel</button>
      <button className="btn-d" onClick={() => { onYes(); onClose() }}>{action}</button>
    </div>
  </Modal>
)

export const Field = ({ label, error, id, children }) => (
  <div>
    <label className="lbl" htmlFor={id}>{label}</label>
    {children}
    {error && <p id={id + '-err'} className="mt-1 text-xs text-red-600" role="alert">{error}</p>}
  </div>
)

export const Empty = ({ title, text, children }) => (
  <div className="flex flex-col items-center gap-2 py-10 text-center">
    <Inbox className="text-slate-400" size={36} />
    <p className="font-semibold">{title}</p>
    <p className="max-w-sm text-sm text-slate-500">{text}</p>
    {children}
  </div>
)

export const Bar = ({ spent, limit }) => {
  const p = limit ? (spent / limit) * 100 : 0
  const c = p > 100 ? 'bg-red-500' : p >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" role="progressbar" aria-valuenow={Math.round(p)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full transition-all duration-500 ${c}`} style={{ width: `${Math.min(p, 100)}%` }} />
    </div>
  )
}

export function Toasts() {
  const { toasts } = useApp()
  const S = {
    credit: ['bg-emerald-600', ArrowDownLeft], debit: ['bg-slate-900 dark:bg-slate-700', ArrowUpRight],
    warn: ['bg-amber-500', AlertTriangle], danger: ['bg-red-600', AlertTriangle], ok: ['bg-slate-900 dark:bg-slate-700', CheckCircle2],
  }
  return (
    <div className="pointer-events-none fixed right-3 top-3 z-[60] flex w-[calc(100%-1.5rem)] max-w-sm flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((t) => { const [bg, I] = S[t.kind]; return (
        <div key={t.id} className={`toast flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${bg}`}><I size={18} />{t.msg}</div>
      ) })}
    </div>
  )
}

export function TxTable({ list, hl, onView, onEdit, onDel }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="text-left text-xs text-slate-500">
          <th className="py-2 pr-3 font-medium">Transaction</th><th className="hidden px-3 font-medium sm:table-cell">Category</th>
          <th className="px-3 font-medium">Date</th><th className="px-3 text-right font-medium">Amount</th>{onEdit && <th className="w-24" />}
        </tr></thead>
        <tbody>
          {list.map((t) => { const I = ICONS[t.category] || ICONS.Other; return (
            <tr key={t.id} className={`border-t border-slate-100 transition-colors duration-700 dark:border-slate-800 ${hl === t.id ? 'bg-emerald-50 dark:bg-emerald-900/30' : ''}`}>
              <td className="py-3 pr-3"><div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: COLORS[t.category] + '22', color: COLORS[t.category] }}><I size={16} /></span>
                <span className="font-medium">{t.title}</span></div></td>
              <td className="hidden px-3 text-slate-500 sm:table-cell">{t.category}</td>
              <td className="whitespace-nowrap px-3 text-slate-500">{fmtDate(t.date)}</td>
              <td className={`whitespace-nowrap px-3 text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : ''}`}>{t.type === 'income' ? '+' : '-'}{inr(t.amount)}</td>
              {onEdit && <td className="whitespace-nowrap px-1 text-right">
                <button className="icon-btn h-8 w-8 rounded-lg" aria-label={`View ${t.title}`} onClick={() => onView(t)}><Eye size={15} /></button>
                <button className="icon-btn h-8 w-8 rounded-lg" aria-label={`Edit ${t.title}`} onClick={() => onEdit(t)}><Pencil size={15} /></button>
                <button className="icon-btn h-8 w-8 rounded-lg border-red-100 text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/30" aria-label={`Delete ${t.title}`} onClick={() => onDel(t)}><Trash2 size={15} /></button></td>}
            </tr>
          ) })}
        </tbody>
      </table>
    </div>
  )
}
