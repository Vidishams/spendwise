
# SpendWise - Personal Finance Dashboard

SpendWise is a modern and responsive personal finance dashboard built using React, Vite, Tailwind CSS, and Recharts. It helps users track income and expenses, manage budgets, and visualize spending habits through interactive charts.

> **Note:** SpendWise is a demo application. All transactions and wallet balances are simulated. No real payments are processed.

## Features

- **Quick Pay:** Add simulated income and expenses with quick-amount options.
- **Dashboard:** View balance, total income, expenses, and recent transactions.
- **Transaction Management:** Add, edit, delete, search, filter, and sort transactions.
- **CSV Export:** Export transaction records as CSV files.
- **Budget Management:** Set monthly and category-wise budgets with progress bars.
- **Budget Alerts:** Receive notifications when spending reaches 80% or 100% of a budget.
- **Analytics:** Visualize category-wise spending, income vs. expenses, savings, and monthly trends.
- **Settings:** Switch between light and dark themes and reset demo data.
- **Responsive Design:** Works on desktop and mobile devices.
- **Local Storage:** Saves transactions, budgets, and theme preferences in the browser.
- **Indian Currency:** Displays amounts in Indian Rupees (₹).

## Tech Stack

- **Frontend:** React 18, JavaScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 3
- **Charts:** Recharts
- **Icons:** Lucide React
- **Storage:** Browser LocalStorage

## Installation and Setup

### Prerequisites

- Node.js
- npm

### Steps

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd SpendWise
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the URL displayed in the terminal, usually:

   `http://localhost:5173`

## Build for Production

Run the following command to create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

The production files will be generated in the `dist/` directory.

## Data Storage

SpendWise uses browser LocalStorage to store application data.

- `sw_tx` - Transaction records
- `sw_budgets` - Budget settings
- `sw_dark` - Theme preference

No backend, database, or API key is required. Data remains in the browser and is not automatically synchronized across devices.

## Deployment

SpendWise can be deployed using **Vercel** or **Netlify**.

- **Build Command:** `npm run build`
- **Output Directory:** `dist`

## Future Enhancements

- User authentication
- Cloud data synchronization
- Recurring transactions
- Savings goals
- Advanced financial insights
- Monthly financial reports
---

**SpendWise - Track smarter. Budget better. Spend wisely.**
