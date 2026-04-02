import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { KPICards } from '@/components/dashboard/KPICards'
import { DonationChart } from '@/components/dashboard/DonationChart'
import { FundAllocationChart } from '@/components/dashboard/FundAllocationChart'
import { FundCards } from '@/components/dashboard/FundCards'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { ExcelUpload } from '@/components/dashboard/ExcelUpload'

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of UPAY&apos;s financial activity.
          </p>
        </div>

        {/* KPI Cards */}
        <KPICards />

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <DonationChart />
          </div>
          <div className="lg:col-span-2">
            <FundAllocationChart />
          </div>
        </div>

        {/* Excel Upload */}
        <ExcelUpload />

        {/* Fund Progress Cards */}
        <FundCards />

        {/* Recent Transactions */}
        <RecentTransactions />
      </div>
    </DashboardLayout>
  )
}
