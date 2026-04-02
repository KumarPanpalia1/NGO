import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { MobileSidebar } from './MobileSidebar'

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main Content */}
      <div className="md:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
