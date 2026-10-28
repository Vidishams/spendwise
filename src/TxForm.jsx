import { useState } from 'react'
import { useApp } from './store'
import { Modal, Field } from './ui'
import { EXP, INC, today, parseAmount } from './lib'

export function TxForm() {
  const { form, setForm, addTx, updateTx } = useApp()
  const edit = !!form.id
  const [f, setF] = useState({
    title: form.title || '', amount: form.amount ?? '', type: form.type || 'expense',
    category: form.category || EXP[0], date: form.date || today(), notes: form.notes || '',
  })
  const [e, setE] = useState({})
  const set = (k, v) => setF((p) => ({ ...p, [k]: v, ...(k === 'type' ? { category: v === 'income' ? INC[0] : EXP[0] } : {}) }))
  const submit = (ev) => {
    ev.preventDefault()
    const er = {}
    const a = parseAmount(f.amount)
    if (!f.title.trim()) er.title = 'Title is required'
    else if (f.title.length > 60) er.title = 'Keep the title under 60 characters'
    if (a == null) er.amount = 'Enter a number greater than 0'
    if (!f.date || isNaN(new Date(f.date))) er.date = 'Pick a valid date'
    setE(er)
    if (Object.keys(er).length) return
    const d = { ...f, title: f.title.trim(), amount: a, notes: f.notes.trim() }
    edit ? updateTx({ ...form, ...d }) : addTx(d)
    setForm(null)
  }
  const cats = f.type === 'income' ? INC : EXP
  return (
    <Modal title={edit ? 'Edit transaction' : 'Add transaction'} onClose={() => setForm(null)}>
      <form onSubmit={submit} className="space-y-3" noValidate>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800" role="radiogroup" aria-label="Type">
          {['expense', 'income'].map((t) => (
            <button type="button" key={t} role="radio" aria-checked={f.type === t} onClick={() => set('type', t)}
              className={`rounded-lg py-2 text-sm font-semibold capitalize ${f.type === t ? 'bg-white shadow dark:bg-slate-900' : 'text-slate-500'}`}>{t}</button>
          ))}
        </div>
        <Field label="Title" id="t" error={e.title}><input id="t" className="input" value={f.title} onChange={(x) => set('title', x.target.value)} aria-invalid={!!e.title} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount (₹)" id="a" error={e.amount}><input id="a" inputMode="decimal" className="input" value={f.amount} onChange={(x) => set('amount', x.target.value)} aria-invalid={!!e.amount} /></Field>
          <Field label="Date" id="d" error={e.date}><input id="d" type="date" className="input" value={f.date} onChange={(x) => set('date', x.target.value)} /></Field>
        </div>
        <Field label="Category" id="c"><select id="c" className="input" value={f.category} onChange={(x) => set('category', x.target.value)}>{cats.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Notes (optional)" id="n"><textarea id="n" rows={2} className="input" value={f.notes} onChange={(x) => set('notes', x.target.value)} /></Field>
        <button className="btn-p w-full">{edit ? 'Save changes' : 'Add transaction'}</button>
      </form>
    </Modal>
  )
}
