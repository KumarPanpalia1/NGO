import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useData } from '@/context/DataContext'

const COLORS = ['#003C64', '#F7AC2D', '#10b981', '#6366f1', '#ec4899', '#f59e0b', '#8b5cf6']

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{payload[0].name}</p>
        <p className="value">₹{Number(payload[0].value).toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export function FundAllocationChart() {
  const { fundAllocation } = useData()

  const total = fundAllocation.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Fund Allocation</CardTitle>
        <CardDescription>Breakdown of expenses by program</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 lg:flex-row">
          <div className="h-[200px] w-full max-w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={fundAllocation}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {fundAllocation.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            {fundAllocation.map((item, index) => {
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0'
              return (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      ₹{(item.value / 1000).toFixed(1)}k
                    </span>
                    <span className="w-12 text-right text-xs text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
