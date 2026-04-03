# UPAY — Financial Transparency Portal

A modern, open-source finance dashboard built for **UPAY NGO** to digitally manage donations, expenses, and fund allocations with full financial transparency.

> Upload real-world Tally/Excel ledger files and instantly see KPIs, charts, and categorized transactions — no manual data entry required.

---

## ✨ Features

| Area | Highlights |
|---|---|
| **Dashboard** | KPI cards (total donations, expenses, balance, transaction count), monthly trend chart, fund allocation pie chart, recent transactions list |
| **Donations** | Filterable & searchable donation table, monthly bar chart, category pie breakdown, CSV export |
| **Expenses** | Filterable & searchable expense table, monthly bar chart, category pie breakdown, CSV export |
| **Fund Allocation** | Allocated vs Spent comparison chart, per-program progress cards with utilization %, CSV export |
| **Excel Upload** | Drag-and-drop or click-to-upload `.xlsx` files; auto-detects headers, parses Tally-style ledgers, categorizes transactions, and populates the entire dashboard |
| **Responsive UI** | Sidebar navigation on desktop, slide-out mobile sidebar, fully responsive layout |

---

## 📊 Excel Format Guide

To ensure your data is parsed correctly, the Excel file (e.g., Tally ledgers like `Upay_Ledger_FY_2024_25`) must follow a specific structure. The parser automatically skips metadata rows (organization name, report dates) at the top and looks for a header row containing specific columns.

### Required Column Structure

Your file must contain a header row with these columns (in any order):

| Column | Required | Description |
|---|---|---|
| **Date** | Yes | Transaction date (e.g., `1-Apr-2024`, `01/04/2024`, or Excel serial numbers) |
| **Particulars** | Yes | Description of the transaction. Usually prefixed with "To" (expense) or "By" (receipt). Can contain Tally-style codes. |
| **Vch Type** | Optional | Voucher type (e.g., `Payment`, `Receipt`, `Contra`) |
| **Debit** | Yes | Amount received (donations/funds coming **IN**). Leave blank for expenses. |
| **Credit** | Yes | Amount spent (expenses/funds going **OUT**). Leave blank for receipts. |

### Key Rules
- **Header Autodetection:** Rows above the actual data (like "UPAY Nagpur Centre", address, etc.) are skipped automatically.
- **Skipped Rows:** Breakdown rows (empty date and empty To/By prefix) and special rows containing `"Opening Balance"` or `"Closing Balance"` are automatically ignored to prevent double-counting.
- **Multi-sheet support:** If your workbook has multiple sheets, the parser will process all of them.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev/) with [Vite 6](https://vitejs.dev/) |
| **Routing** | [React Router v6](https://reactrouter.com/) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) · [Inter font](https://fonts.google.com/specimen/Inter) |
| **Charts** | [Recharts](https://recharts.org/) (Bar, Pie, Area) |
| **Excel Parsing** | [SheetJS (xlsx)](https://sheetjs.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Currency** | Indian Rupees (₹) via `Intl.NumberFormat('en-IN')` with compact Lakh/K notation |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/KumarPanpalia1/NGO.git
cd NGO

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173** (default Vite port).

---

## 📁 Project Structure

```
upay/
├── index.html                  # HTML entry point (Inter font, meta tags)
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite config with React plugin & @ alias
├── tailwind.config.js          # Tailwind theme (UPAY brand colors)
├── postcss.config.js           # PostCSS with Tailwind & Autoprefixer
│
├── public/                     # Static assets (icons, favicons)
│
├── src/
│   ├── main.jsx                # App bootstrap (React DOM, Router, DataProvider)
│   ├── App.jsx                 # Route definitions
│   ├── index.css               # Global styles & Tailwind directives
│   │
│   ├── context/
│   │   └── DataContext.jsx     # Central state: Excel parser, transactions, derived data
│   │
│   ├── lib/
│   │   └── utils.js            # cn(), formatCurrency(), formatCurrencyCompact()
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx       # Main dashboard with KPIs & charts
│   │   ├── Donations.jsx       # Donations management page
│   │   ├── Expenses.jsx        # Expenses management page
│   │   └── Funds.jsx           # Fund allocation & utilization page
│   │
│   └── components/
│       ├── dashboard/          # Feature components
│       │   ├── DashboardLayout.jsx
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── MobileSidebar.jsx
│       │   ├── KPICards.jsx
│       │   ├── DonationChart.jsx
│       │   ├── FundAllocationChart.jsx
│       │   ├── FundCards.jsx
│       │   ├── RecentTransactions.jsx
│       │   └── ExcelUpload.jsx
│       │
│       └── ui/                 # Reusable UI primitives
│           ├── Avatar.jsx
│           ├── Badge.jsx
│           ├── Button.jsx
│           ├── Card.jsx
│           ├── DropdownMenu.jsx
│           ├── Progress.jsx
│           ├── Sheet.jsx
│           └── Table.jsx
│
└── Nagpur Expenses - FY 25.xlsx   # Sample Excel data file
```

---



## 📄 Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Financial overview with KPIs, charts, and recent activity |
| `/donations` | Donations | Donation records, monthly trend, category breakdown |
| `/expenses` | Expenses | Expense records, monthly trend, category breakdown |
| `/funds` | Fund Allocation | Budget allocation vs spending per program |

---


<p align="center">
  <strong>THANK YOU</strong>
</p>
