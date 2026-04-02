import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { ExcelUpload } from '@/components/dashboard/ExcelUpload'
import { useData } from '@/context/DataContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  Wallet, TrendingUp, Target, Download, BarChart3,
  GraduationCap, Stethoscope, Utensils, Building, AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const fundIcons = {
  'Education': GraduationCap,
  'Healthcare': Stethoscope,
  'Food & Nutrition': Utensils,
  'Infrastructure': Building,
  'Emergency Relief': AlertTriangle,
}

const fundColors = {
  'Education': '#003C64',
  'Healthcare': '#F7AC2D',
  'Food & Nutrition': '#10b981',
  'Infrastructure': '#6366f1',
  'Emergency Relief': '#ec4899',
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="value" style={{ color: entry.color }}>
            {entry.name}: ₹{Number(entry.value).toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Funds() {
  const { funds, totalSpent, totalDonations, totalExpenses, remainingBalance } = useData()

  const activeFunds = funds.filter(f => f.status === 'Active').length

  // Chart data — spending per category
  const chartData = funds.map(f => ({
    name: f.name.length > 12 ? f.name.substring(0, 12) + '...' : f.name,
    fullName: f.name,
    spent: f.spent,
    share: f.share,
  }))

  const exportCSV = () => {
    const headers = ['Category', 'Spent', 'Share %', 'Status']
    const rows = funds.map(f => [
      f.name,
      f.spent,
      f.share,
      f.status,
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'expense_breakdown_export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Expense Breakdown</h1>
            <p className="text-muted-foreground">Spending analysis across program categories</p>
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
                  <p className="text-sm text-muted-foreground">Total Donations</p>
                  <p className="text-2xl font-bold">₹{totalDonations.toLocaleString()}</p>
                </div>
                <div className="rounded-xl p-3 bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
                </div>
                <div className="rounded-xl p-3 bg-red-50">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Remaining Balance</p>
                  <p className="text-2xl font-bold">₹{remainingBalance.toLocaleString()}</p>
                </div>
                <div className="rounded-xl p-3 bg-emerald-50">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{funds.length}</p>
                </div>
                <div className="rounded-xl p-3 bg-accent/10">
                  <Target className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spending by Category Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
            <CardDescription>Expense distribution across program categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e4e7" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={v => `₹${v / 1000}k`} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#003C6408' }} />
                <Legend />
                <Bar dataKey="spent" name="Spent" fill="#003C64" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <ExcelUpload />

        {/* Fund Cards Grid */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Category Details</CardTitle>
            <CardDescription>Individual category spending and share of total expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {funds.map((fund) => {
                const Icon = fundIcons[fund.category] || Wallet
                const color = fundColors[fund.category] || '#003C64'

                return (
                  <Card key={fund.id} className="border shadow-sm transition-shadow duration-200 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-sm font-semibold">{fund.name}</CardTitle>
                      </div>
                      <div className="rounded-lg p-2" style={{ backgroundColor: `${color}15` }}>
                        <Icon className="h-5 w-5" style={{ color }} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold">₹{(fund.spent / 1000).toFixed(1)}k</span>
                        <span className="text-sm font-medium" style={{ color }}>
                          {fund.share}% share
                        </span>
                      </div>
                      <Progress value={fund.share} className="h-2.5" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          ₹{fund.spent.toLocaleString()} spent
                        </span>
                        <span className="font-medium text-muted-foreground">
                          {fund.share}% of total expenses
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-border">
                        <Badge variant="secondary" className={cn(
                          'text-xs',
                          fund.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
                        )}>
                          {fund.status}
                        </Badge>
                        {fund.startDate && (
                          <span className="text-xs text-muted-foreground">
                            Since {new Date(fund.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
