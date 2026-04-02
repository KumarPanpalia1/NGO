import { createContext, useContext, useState, useCallback } from 'react'
import * as XLSX from 'xlsx'

const DataContext = createContext(null)

// ── Category mapping from Particulars codes ──────────────────────────
// Maps the coded names in the Excel to human-friendly categories
const CATEGORY_MAP = [
  { keywords: ['salary', 'allowance'], category: 'Salary & Allowances' },
  { keywords: ['rental', 'rent'], category: 'Rent' },
  { keywords: ['books', 'stationery'], category: 'Books & Stationery' },
  { keywords: ['electrical', 'appliance'], category: 'Electrical & Appliances' },
  { keywords: ['scholarship'], category: 'Scholarships' },
  { keywords: ['skill development', 'material'], category: 'Skill Development' },
  { keywords: ['nutritional', 'food', 'snack', 'mess', 'nutrition'], category: 'Food & Nutrition' },
  { keywords: ['sports', 'activities'], category: 'Sports & Activities' },
  { keywords: ['training', 'research', 'development', 'tech', 'hr'], category: 'Training & Development' },
  { keywords: ['beautification', 'advancement'], category: 'Beautification' },
  { keywords: ['meeting', 'travel', 'tarvel', 'auto', 'bus', 'fuel', 'conveyance'], category: 'Meetings & Travel' },
  { keywords: ['office expenditure', 'administrative'], category: 'Admin & Office' },
  { keywords: ['miscellaneous', 'misc'], category: 'Miscellaneous' },
  { keywords: ['center operation'], category: 'Center Operations' },
  { keywords: ['center development'], category: 'Center Development' },
  { keywords: ['child development'], category: 'Child Development' },
]

function categorizeParticulars(text) {
  if (!text) return 'Other'
  const lower = text.toLowerCase().replace(/[\r\n]/g, '').trim()

  for (const mapping of CATEGORY_MAP) {
    if (mapping.keywords.some(kw => lower.includes(kw))) {
      return mapping.category
    }
  }
  return 'Other'
}

// ── Special rows to ignore ──────────────────────────
const SKIP_PARTICULARS = ['opening balance', 'closing balance']
function shouldSkipRow(particulars) {
  if (!particulars) return true
  const lower = particulars.toLowerCase().replace(/[\r\n]/g, '').trim()
  return SKIP_PARTICULARS.some(s => lower.includes(s))
}

// ── Parse Excel date serial numbers to YYYY-MM-DD ───
function parseExcelDate(value) {
  if (!value) return ''
  if (typeof value === 'number') {
    const date = new Date((value - 25569) * 86400 * 1000)
    if (isNaN(date.getTime())) return ''
    return date.toISOString().split('T')[0]
  }
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return ''
    return value.toISOString().split('T')[0]
  }
  if (typeof value === 'string') {
    const d = new Date(value)
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
    return ''
  }
  return ''
}

// ── Dynamically find the header row ──────────────────
// Looks for a row that has "Date" and "Debit"/"Credit" (case-insensitive)
function findHeaderRow(rawRows) {
  for (let i = 0; i < Math.min(rawRows.length, 20); i++) {
    const row = rawRows[i]
    if (!Array.isArray(row)) continue
    const joined = row.map(c => String(c).toLowerCase().trim()).join('|')
    if (joined.includes('date') && (joined.includes('debit') || joined.includes('credit'))) {
      return i
    }
  }
  return -1
}

// ── Detect column indices from header row ────────────
function detectColumns(headerRow) {
  const cols = { date: -1, particulars: -1, debit: -1, credit: -1, vchType: -1, toBy: -1 }
  headerRow.forEach((cell, idx) => {
    const val = String(cell).toLowerCase().trim()
    if (val === 'date') cols.date = idx
    if (val === 'particulars' || val === 'particular') cols.particulars = idx
    if (val === 'debit') cols.debit = idx
    if (val === 'credit') cols.credit = idx
    if (val.includes('vch type') || val.includes('voucher type')) cols.vchType = idx
  })
  return cols
}

// ── Main parser for UPAY messy Excel files ───────────
function parseUPAYExcel(rawRows) {
  const headerIdx = findHeaderRow(rawRows)
  if (headerIdx === -1) return null

  const headerRow = rawRows[headerIdx]
  const cols = detectColumns(headerRow)

  // Fallback: if we can't find debit/credit by name, use last two columns
  if (cols.debit === -1) cols.debit = headerRow.length - 2
  if (cols.credit === -1) cols.credit = headerRow.length - 1

  // The "Particulars" in UPAY files spans cols 1-4 with col 1 = To/By, col 2 = description
  // If we detected col.particulars, great. Otherwise, assume col 2 for UPAY format
  const descCol = cols.particulars !== -1 ? cols.particulars : 2

  const transactions = []
  let lastDate = '' // carry forward date for continuation rows

  for (let i = headerIdx + 1; i < rawRows.length; i++) {
    const row = rawRows[i]
    if (!Array.isArray(row) || row.length < 3) continue

    const rawDate = row[cols.date !== -1 ? cols.date : 0]
    const toBy = String(row[1] || '').trim() // Column 1 is always To/By in UPAY format
    const particulars = String(row[descCol] || '').replace(/[\r\n]/g, '').trim()

    // ── Skip breakdown/sub-detail rows ──────────────────────────────────
    // These are rows with no date AND no To/By marker — they are amount breakdowns
    // of the previous row (e.g., "(as per details)" sub-items).
    // Including them would double-count amounts.
    const dateIsEmpty = rawDate === '' || rawDate === null || rawDate === undefined
    const toByIsEmpty = toBy === ''
    if (dateIsEmpty && toByIsEmpty) continue
    
    const debitVal = parseFloat(row[cols.debit]) || 0
    const creditVal = parseFloat(row[cols.credit]) || 0

    // Skip if both amounts are 0 or missing
    if (debitVal === 0 && creditVal === 0) continue

    // Skip special rows
    if (shouldSkipRow(particulars)) continue

    // Parse date, carry forward from previous row if not present
    const parsedDate = parseExcelDate(rawDate)
    if (parsedDate) lastDate = parsedDate
    const date = lastDate

    if (!date) continue // If we still don't have a date, skip

    // Determine type: Debit = money IN (donation/funds received), Credit = money OUT (expense)
    const amount = debitVal > 0 ? debitVal : creditVal
    const type = debitVal > 0 ? 'donation' : 'expense'

    // Skip Contra entries (bank transfers) from donations — they are just internal transfers
    const vchType = cols.vchType !== -1 ? String(row[cols.vchType] || '').trim() : ''
    // We still count Contra as incoming funds, user can see them

    const category = categorizeParticulars(particulars)

    transactions.push({
      id: Date.now() + i,
      date,
      description: particulars || 'Unknown',
      amount,
      type,
      category,
      vchType: vchType || (type === 'donation' ? 'Receipt' : 'Payment'),
    })
  }

  return transactions
}

// ── Default sample data (shown before upload) ────────
const defaultTransactions = [
  { id: 1, date: '2024-04-01', description: 'Opening Balance', amount: 17565, type: 'donation', category: 'Other', vchType: 'Receipt' },
  { id: 2, date: '2024-04-25', description: 'Central Zone Bank Transfer', amount: 100000, type: 'donation', category: 'Other', vchType: 'Contra' },
  { id: 3, date: '2024-04-26', description: 'Center Operation Miscellaneous', amount: 10283, type: 'expense', category: 'Miscellaneous', vchType: 'Payment' },
  { id: 4, date: '2024-04-26', description: 'Administrative Meetings & Travel', amount: 40000, type: 'expense', category: 'Meetings & Travel', vchType: 'Payment' },
  { id: 5, date: '2024-05-09', description: 'Books & Stationery Items', amount: 15161, type: 'expense', category: 'Books & Stationery', vchType: 'Payment' },
  { id: 6, date: '2024-05-23', description: 'Bank Transfer', amount: 75000, type: 'donation', category: 'Other', vchType: 'Contra' },
  { id: 7, date: '2024-05-25', description: 'Scholarship Disbursements', amount: 60000, type: 'expense', category: 'Scholarships', vchType: 'Payment' },
  { id: 8, date: '2024-06-01', description: 'Skill Development Material', amount: 5000, type: 'expense', category: 'Skill Development', vchType: 'Payment' },
  { id: 9, date: '2024-06-01', description: 'Rental Charges', amount: 28160, type: 'expense', category: 'Rent', vchType: 'Payment' },
  { id: 10, date: '2024-06-15', description: 'Bank Transfer', amount: 100000, type: 'donation', category: 'Other', vchType: 'Contra' },
  { id: 11, date: '2024-07-02', description: 'Nutritional Drives', amount: 1200, type: 'expense', category: 'Food & Nutrition', vchType: 'Payment' },
  { id: 12, date: '2024-07-09', description: 'Rental Charges', amount: 28160, type: 'expense', category: 'Rent', vchType: 'Payment' },
  { id: 13, date: '2024-08-01', description: 'Salary & Allowances', amount: 1548, type: 'expense', category: 'Salary & Allowances', vchType: 'Payment' },
  { id: 14, date: '2024-08-14', description: 'Bank Transfer', amount: 50000, type: 'donation', category: 'Other', vchType: 'Contra' },
  { id: 15, date: '2024-09-01', description: 'Sports Activities', amount: 2500, type: 'expense', category: 'Sports & Activities', vchType: 'Payment' },
]

// ── Helper: compute all derived data from transactions ──
function computeDerivedData(transactions) {
  const donations = transactions.filter(t => t.type === 'donation')
  const expenses = transactions.filter(t => t.type === 'expense')

  const totalDonations = donations.reduce((s, d) => s + d.amount, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const remainingBalance = totalDonations - totalExpenses

  // Monthly aggregation
  const monthMap = {}
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  transactions.forEach(t => {
    if (!t.date) return
    const d = new Date(t.date)
    if (isNaN(d.getTime())) return
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = monthNames[d.getMonth()]
    if (!monthMap[key]) {
      monthMap[key] = { month: label, key, donations: 0, expenses: 0, balance: 0 }
    }
    if (t.type === 'donation') {
      monthMap[key].donations += t.amount
    } else {
      monthMap[key].expenses += t.amount
    }
  })

  const monthlyData = Object.values(monthMap)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(m => ({ ...m, balance: m.donations - m.expenses }))

  // Category breakdown (expenses only)
  const catMap = {}
  expenses.forEach(e => {
    catMap[e.category] = (catMap[e.category] || 0) + e.amount
  })
  const categoryData = Object.entries(catMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // monthlyDonations — used by DonationChart
  const monthlyDonations = monthlyData.map(m => ({ month: m.month, donations: m.donations, key: m.key }))

  // fundAllocation — same as categoryData, used by FundAllocationChart pie
  const fundAllocation = categoryData.map(c => ({ name: c.name, value: c.value }))

  // funds — derived from expense categories, used by FundCards and Funds page
  const funds = categoryData.map((cat, idx) => ({
    id: idx + 1,
    name: cat.name,
    category: cat.name,
    spent: cat.value,
    share: totalExpenses > 0 ? Math.round((cat.value / totalExpenses) * 100) : 0,
    status: 'Active',
    startDate: transactions.find(t => t.type === 'expense' && t.category === cat.name)?.date || null,
  }))

  const totalSpent = totalExpenses

  // Recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 15)

  return {
    donations,
    expenses,
    totalDonations,
    totalExpenses,
    remainingBalance,
    monthlyData,
    monthlyDonations,
    categoryData,
    fundAllocation,
    funds,
    totalSpent,
    recentTransactions,
    transactionCount: transactions.length,
    donationCount: donations.length,
    expenseCount: expenses.length,
  }
}

// ── Provider Component ──────────────────────────────
export function DataProvider({ children }) {
  const [transactions, setTransactions] = useState(defaultTransactions)
  const [uploadHistory, setUploadHistory] = useState([])
  const [uploadStatus, setUploadStatus] = useState({ loading: false, error: null, success: null })

  const parseExcelFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      setUploadStatus({ loading: true, error: null, success: null })

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })

          let allTransactions = []

          for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName]
            const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })

            if (rawRows.length < 2) continue

            // Try UPAY-specific parser first
            const parsed = parseUPAYExcel(rawRows)
            if (parsed && parsed.length > 0) {
              allTransactions = [...allTransactions, ...parsed]
            }
          }

          if (allTransactions.length === 0) {
            throw new Error('No valid financial data found. Make sure the file has Date, Debit, and Credit columns.')
          }

          // Replace existing transactions with uploaded data
          setTransactions(allTransactions)

          const expCount = allTransactions.filter(t => t.type === 'expense').length
          const donCount = allTransactions.filter(t => t.type === 'donation').length

          setUploadHistory(prev => [{
            id: Date.now(),
            fileName: file.name,
            date: new Date().toISOString(),
            totalRows: allTransactions.length,
            details: `${donCount} receipts, ${expCount} expenses`,
          }, ...prev])

          setUploadStatus({
            loading: false,
            error: null,
            success: `Successfully imported ${allTransactions.length} transactions (${donCount} receipts, ${expCount} expenses) from "${file.name}"`
          })

          resolve(allTransactions)
        } catch (err) {
          setUploadStatus({ loading: false, error: err.message, success: null })
          reject(err)
        }
      }
      reader.onerror = () => {
        setUploadStatus({ loading: false, error: 'Failed to read file', success: null })
        reject(new Error('Failed to read file'))
      }
      reader.readAsArrayBuffer(file)
    })
  }, [])

  const clearUploadStatus = useCallback(() => {
    setUploadStatus({ loading: false, error: null, success: null })
  }, [])

  // All derived data is computed from the single transactions array
  const derived = computeDerivedData(transactions)

  return (
    <DataContext.Provider value={{
      // Raw data
      transactions,
      uploadHistory,
      uploadStatus,

      // Actions
      setTransactions,
      parseExcelFile,
      clearUploadStatus,

      // Computed
      ...derived,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
