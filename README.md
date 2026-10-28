# SpendWise

A modern personal finance dashboard built with React, Vite, Tailwind CSS and Recharts. Everything runs in the browser and is saved in LocalStorage: no backend, database or API key.

> **Demo mode:** all money in SpendWise is simulated. The Quick Pay wallet is a demo tool, not a real payment system.

## Features
- **Quick Pay panel**: Credit (money in) and Spend (money out) popups with quick-amount chips, plus Random Credit / Random Spend buttons for instant demos. Bank-style alerts such as "₹420 debited · Food & Dining". Sidebar on desktop, floating button and bottom sheet on mobile, always-visible wallet balance.
- **Live updates**: balance, cards, charts, budget bars and the recent list change the moment data changes; the newest row is highlighted.
- **Budget alerts**: toasts when a spend crosses 80% or 100% of the monthly or a category budget.
- **Transactions**: add, edit, delete (with confirmation), view details, search, filter by type/category/date range, sort, export CSV.
- **Budgets**: total and per-category budgets with progress bars (expenses only).
- **Analytics**: category breakdown, income vs expenses, top categories, average daily spending, savings, change vs previous month, month selector.
- **Settings**: light/dark mode, reset demo data, clear sample data, CSV export.
- Indian Rupee formatting (₹1,00,000), accessible forms, keyboard-friendly dialogs.

## Tech stack
React 18, Vite, Tailwind CSS 3, Recharts, Lucide React, LocalStorage.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # preview the build
```

## Deploy
**Vercel:** push to GitHub, import the repo on vercel.com. Framework preset: Vite (build `npm run build`, output `dist`).

**Netlify:** import the repo. Build command `npm run build`, publish directory `dist`.

## Data model
`{ id, title, amount, type: 'income' | 'expense', category, date: 'YYYY-MM-DD', notes }`
stored under `sw_tx`, with budgets in `sw_budgets` and the theme in `sw_dark`.
