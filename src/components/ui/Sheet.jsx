import { useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

export function Sheet({ open, onOpenChange, children }) {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onOpenChange(false)
  }, [onOpenChange])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, handleEscape])

  if (!open) return null

  return (
    <>
      <div
        className="sheet-overlay"
        onClick={() => onOpenChange(false)}
      />
      <div className="sheet-content">
        {children}
      </div>
    </>
  )
}

export function SheetContent({ className, children, ...props }) {
  return (
    <div
      className={cn('h-full flex flex-col', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SheetHeader({ className, ...props }) {
  return (
    <div
      className={cn('flex flex-col space-y-2', className)}
      {...props}
    />
  )
}

export function SheetTitle({ className, ...props }) {
  return (
    <h2
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  )
}
