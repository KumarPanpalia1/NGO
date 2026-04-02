import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Heart,
  Receipt,
  Wallet,
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Donations', href: '/donations', icon: Heart },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Funds', href: '/funds', icon: Wallet },
]



export function Sidebar() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-sidebar text-sidebar-foreground md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <img src="/logo.png" alt="UPAY – Underprivileged's Advancement by Youth" className="h-12 w-auto object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
              {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-accent" />
              )}
            </Link>
          )
        })}
      </nav>


    </aside>
  )
}
