import { useState } from 'react'
import { Wallet, ArrowDownLeft, ArrowUpRight, Shuffle } from 'lucide-react'
import { useApp } from './store'
import { Modal, Field } from './ui'
import { EXP, INC, inr, sum, parseAmount, today, randomTx } from './lib'

export function QuickPanel({ onAction = () => {} }) {
  const { tx, setQuick, addTx } = useApp()
  const bal = sum(tx, 'income') - sum(tx, 'expense')
  const go = (fn) => () => { fn(); onAction() }
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-slate-900 p-4 text-white dark:bg-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1.5"><Wallet size={14} />Wallet balance</span>
          <span className="rounded-full bg-amber-400/20 px-2 py-0.5 font-medium text-amber-300">Demo mode</span>
        </div>
        <div className="mt-1 text-2xl font-bold">{inr(bal)}</div>
        <p className="mt-1 text-[11px] text-slate-400">Simulated money. Nothing is real.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="btn-p flex-col py-4" onClick={go(() => setQuick('income'))}><ArrowDownLeft size={20} />Credit</button>
        <button className="btn-n flex-col py-4" onClick={go(() => setQuick('expense'))}><ArrowUpRight size={20} />Spend</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="btn-o px-2 text-xs" onClick={go(() => addTx(randomTx('income')))}><Shuffle size={14} />Random credit</button>
        <button className="btn-o px-2 text-xs" onClick={go(() => addTx(randomTx('expense')))}><Shuffle size={14} />Random spend</button>
      </div>
    </div>
  )
}

export function QuickModal() {
  const { quick, setQuick, addTx } = useApp()
  const inc = quick === 'income'
  const opts = inc ? INC : EXP
  const [amt, setAmt] = useState('')
  const [cat, setCat] = useState(opts[0])
  const [note, setNote] = useState('')
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    const a = parseAmount(amt)
    if (a == null) return setErr('Enter a valid amount greater than ₹0')
    addTx({ title: note.trim() || cat, amount: a, type: quick, category: cat, date: today(), notes: 'Quick Pay' })
    setQuick(null)
  }
  return (
    <Modal title={inc ? 'Credit money' : 'Spend money'} onClose={() => setQuick(null)}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Amount (₹)" id="qa" error={err}>
          <input id="qa" autoFocus inputMode="decimal" className="input text-lg font-semibold" placeholder="0" value={amt} onChange={(e) => { setAmt(e.target.value); setErr('') }} aria-invalid={!!err} />
          <div className="mt-2 flex flex-wrap gap-2">
            {[100, 500, 1000, 5000].map((v) => (
              <button type="button" key={v} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700" onClick={() => { setAmt(String(v)); setErr('') }}>{inr(v)}</button>
            ))}
          </div>
        </Field>
        <Field label={inc ? 'Source' : 'Category'} id="qc">
          <select id="qc" className="input" value={cat} onChange={(e) => setCat(e.target.value)}>{opts.map((c) => <option key={c}>{c}</option>)}</select>
        </Field>
        <Field label={inc ? 'Name or note (optional)' : 'Merchant or note (optional)'} id="qn">
          <input id="qn" className="input" maxLength={60} placeholder={inc ? 'e.g. Rahul' : 'e.g. Swiggy, Uber'} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <button className={inc ? 'btn-p w-full' : 'btn-n w-full'}>{inc ? 'Credit' : 'Spend'}</button>
      </form>
    </Modal>
  )
}
