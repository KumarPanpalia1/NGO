import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useData } from '@/context/DataContext'

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p>
        <p className="value">₹{Number(payload[0].value).toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export function DonationChart() {
  const { monthlyDonations } = useData()

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Donations Over Time</CardTitle>
        <CardDescription>Financial Transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={monthlyDonations}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillDonations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#003C64" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#003C64" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e4e7" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `₹${value / 1000}k`}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#003C64', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="donations"
              stroke="#003C64"
              strokeWidth={2}
              fill="url(#fillDonations)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
