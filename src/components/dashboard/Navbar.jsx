import { Search, Menu } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'


export function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm md:px-6">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="hidden flex-1 md:block md:max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions, donors..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">


        {/* Profile */}
        <div className="flex items-center gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/submark.png" alt="UPAY Admin" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left md:block">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-muted-foreground">UPAY</p>
          </div>
        </div>
      </div>
    </header>
  )
}
