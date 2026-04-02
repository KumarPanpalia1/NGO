import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/Table'
import { ExcelUpload } from '@/components/dashboard/ExcelUpload'
import { useData } from '@/context/DataContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import {
  Receipt, TrendingDown, AlertTriangle, ShoppingCart, Search, Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const COLORS = ['#003C64', '#F7AC2D', '#10b981', '#6366f1', '#ec4899', '#f59e0b', '#8b5cf6']

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{label || payload[0].name}</p>
        <p className="value">₹{Number(payload[0].value).toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function Expenses() {
  const { expenses, totalExpenses } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')

  const categories = ['All', ...new Set(expenses.map(e => e.category))]

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = !searchTerm ||
      e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCategory === 'All' || e.category === filterCategory
    return matchesSearch && matchesFilter
  })

  // Monthly chart data
  const monthlyData = (() => {
    const months = {}
    expenses.forEach(e => {
      if (!e.date) return
      const date = new Date(e.date)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const label = date.toLocaleString('en-US', { month: 'short' })
      months[key] = months[key] || { month: label, amount: 0, key }
      months[key].amount += e.amount
    })
    return Object.values(months).sort((a, b) => a.key.localeCompare(b.key))
  })()

  // Category pie data
  const categoryData = (() => {
    const cats = {}
    expenses.forEach(e => {
      cats[e.category] = (cats[e.category] || 0) + e.amount
    })
    return Object.entries(cats).map(([name, value]) => ({ name, value }))
  })()

  const pendingCount = expenses.filter(e => e.status === 'Pending').length
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0
  const highestExpense = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Vendor', 'Status']
    const rows = filteredExpenses.map(e => [e.date, e.description, e.amount, e.category, e.vendor, e.status])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'expenses_export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">Track and manage all outgoing expenses</p>
          </div>
          <Button onClick={exportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</p>
                </div>
                <div className="rounded-xl p-3 bg-red-50">
                  <Receipt className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold">{expenses.length}</p>
                </div>
                <div className="rounded-xl p-3 bg-primary/10">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
                <div className="rounded-xl p-3 bg-amber-50">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Highest Expense</p>
                  <p className="text-2xl font-bold">₹{highestExpense.toLocaleString()}</p>
                </div>
                <div className="rounded-xl p-3 bg-indigo-50">
                  <TrendingDown className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="border-0 shadow-sm lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Expenses by Month</CardTitle>
              <CardDescription>Monthly expense breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e4e7" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={v => `₹${v / 1000}k`} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ef444410' }} />
                  <Bar dataKey="amount" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">By Category</CardTitle>
              <CardDescription>Expense breakdown by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2} strokeWidth={0}>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-full space-y-2">
                  {categoryData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium">₹{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <ExcelUpload />

        {/* Expenses Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg font-semibold">All Expenses</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-64"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Date</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Description</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Category</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Vendor</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase text-muted-foreground">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No expenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(e.date)}</TableCell>
                      <TableCell className="font-medium">{e.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">{e.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.vendor}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn(
                          e.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        )}>
                          {e.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-red-600">
                        -₹{e.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
