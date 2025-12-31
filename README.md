# Expense-Tracker-App
A React app to track expenses and trips by team and category. Add receipts, approve/reject them, export CSV reports, and view dashboards 

## Features ✅
- Add, edit, and delete expenses and trips
- Manual receipt entry: text, amount, category (no image uploads)
- Approval workflow with Approve / Reject and **Undo** action
- CSV export for selected items and report generation (date & team filters)
- Dashboard charts for team and category spending
- Toast notifications and small, responsive UI

---

## Quick Start 🔧
Prerequisites: Node.js (v14+), npm or yarn

1. Clone the repository

```bash
git clone https://github.com/your-username/expense-tracker-app.git
cd expense-tracker-app
```

2. Install dependencies

```bash
npm install
# or
# yarn install
```

3. Start the dev server

```bash
npm start
```

4. Open `http://localhost:3000`

---

## How to Use ✨
- Expenses: Add new expenses, set team & category, and search or filter by date/team/text.
- Receipts: Use **Add Receipt** (manual entry) to attach details or create a new expense.
- Approvals: Manage pending approvals and view processed items; use **Undo** to revert decisions.
- Reports: Open **Dashboard → Create Expense Report** to export a CSV filtered by date/team.

---

## Project Structure 📁
Key files:
- `src/context/AppContext.js` — global state & helpers (add/update/delete, approvals, teams, categories)
- `src/pages/ExpensePage.js` — expenses list & receipt modal
- `src/pages/DashboardPage.js` — charts and report export
- `src/pages/ApprovalsPage.js` — approval workflows and processed view
- `src/components/*` — forms, lists, and UI components
- `src/utils/localStorage.js` — safe persistence helpers

---

## Notes & Troubleshooting ⚠️
- Data is stored in browser localStorage; clearing site data will erase it.
- If dropdowns (teams/categories) are missing, check `AppContext` defaults.
- To switch to a backend or multi-user setup, replace localStorage calls in `AppContext` with an API client.

