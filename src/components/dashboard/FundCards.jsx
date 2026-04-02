import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { GraduationCap, Stethoscope, Utensils, Building, AlertTriangle, Wallet } from 'lucide-react'
import { useData } from '@/context/DataContext'

const fundIcons = {
  'Education': GraduationCap,
  'Education Program': GraduationCap,
  'Healthcare': Stethoscope,
  'Healthcare Initiative': Stethoscope,
  'Food & Nutrition': Utensils,
  'Infrastructure': Building,
  'Emergency Relief': AlertTriangle,
}

const fundColors = {
  'Education': '#003C64',
  'Education Program': '#003C64',
  'Healthcare': '#F7AC2D',
  'Healthcare Initiative': '#F7AC2D',
  'Food & Nutrition': '#10b981',
  'Infrastructure': '#6366f1',
  'Emergency Relief': '#ec4899',
}

function FundCard({ name, spent, share, category }) {
  const Icon = fundIcons[category] || fundIcons[name] || Wallet
  const color = fundColors[category] || fundColors[name] || '#003C64'

  return (
    <Card className="border-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {name}
        </CardTitle>
        <div className="rounded-lg p-2" style={{ backgroundColor: `${color}15` }}>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">₹{(spent / 1000).toFixed(1)}k</span>
          <span className="text-sm font-medium" style={{ color }}>
            {share}% of expenses
          </span>
        </div>
        <Progress value={share} className="h-2" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>₹{spent.toLocaleString()} spent</span>
          <span>{share}% share</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function FundCards() {
  const { funds } = useData()

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {funds.map((fund) => (
            <FundCard key={fund.id} {...fund} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
