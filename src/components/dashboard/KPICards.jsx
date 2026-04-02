import { Card, CardContent } from '@/components/ui/Card'
import { IndianRupee, Receipt, PiggyBank, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useData } from '@/context/DataContext'

function KPICard({ title, value, icon: Icon, iconColor, iconBgColor }) {
  return (
    <Card className="border-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={cn('rounded-xl p-3', iconBgColor)}>
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function KPICards() {
  const { totalDonations, totalExpenses, remainingBalance, transactionCount } = useData()

  const formatCurrency = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`
    return `₹${val.toLocaleString('en-IN')}`
  }

  const kpis = [
    {
      title: 'Total Receipts',
      value: formatCurrency(totalDonations),
      icon: IndianRupee,
      iconColor: 'text-emerald-600',
      iconBgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: Receipt,
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-50',
    },
    {
      title: 'Remaining Balance',
      value: formatCurrency(remainingBalance),
      icon: PiggyBank,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10',
    },
    {
      title: 'Total Transactions',
      value: transactionCount.toString(),
      icon: FileText,
      iconColor: 'text-accent',
      iconBgColor: 'bg-accent/10',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  )
}
