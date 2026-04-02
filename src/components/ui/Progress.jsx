import { cn } from '@/lib/utils'

export function Progress({ className, value = 0, ...props }) {
  return (
    <div
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        className
      )}
      {...props}
    >
      <div
        className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
