import { cn } from '@/lib/utils'

export function Avatar({ className, ...props }) {
  return (
    <span
      className={cn(
        'relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    />
  )
}

export function AvatarImage({ className, src, alt, ...props }) {
  if (!src) return null
  return (
    <img
      src={src}
      alt={alt}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...props}
    />
  )
}

export function AvatarFallback({ className, ...props }) {
  return (
    <span
      className={cn(
        'bg-muted flex h-full w-full items-center justify-center rounded-full text-xs font-medium',
        className
      )}
      {...props}
    />
  )
}
