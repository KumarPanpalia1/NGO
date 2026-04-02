import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useData } from '@/context/DataContext'

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function RecentTransactions() {
  const { recentTransactions } = useData()

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                Date
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                Description
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                Category
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                Type
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase text-muted-foreground">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No transactions yet
                </TableCell>
              </TableRow>
            ) : (
              recentTransactions.map((transaction) => (
                <TableRow key={`${transaction.type}-${transaction.id}`} className="group">
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-muted text-muted-foreground"
                    >
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {transaction.type === 'donation' ? (
                        <>
                          <div className="rounded-full bg-emerald-100 p-1">
                            <ArrowDownLeft className="h-3 w-3 text-emerald-600" />
                          </div>
                          <span className="text-sm text-emerald-600">Donation</span>
                        </>
                      ) : (
                        <>
                          <div className="rounded-full bg-red-100 p-1">
                            <ArrowUpRight className="h-3 w-3 text-red-600" />
                          </div>
                          <span className="text-sm text-red-600">Expense</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-semibold',
                      transaction.type === 'donation'
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    )}
                  >
                    {transaction.type === 'donation' ? '+' : '-'}₹
                    {transaction.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
