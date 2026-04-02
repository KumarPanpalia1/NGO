import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative">
      {typeof children === 'function'
        ? children({ open, setOpen })
        : children?.map
          ? children.map((child) =>
              child?.type === DropdownMenuTrigger || child?.type === DropdownMenuContent
                ? { ...child, props: { ...child.props, _open: open, _setOpen: setOpen } }
                : child
            )
          : (() => {
              // Handle React children properly
              const childArray = []
              const addChild = (c) => {
                if (!c) return
                if (Array.isArray(c)) { c.forEach(addChild); return }
                if (c.type === DropdownMenuTrigger || c.type === DropdownMenuContent) {
                  childArray.push({ ...c, props: { ...c.props, _open: open, _setOpen: setOpen, key: childArray.length } })
                } else {
                  childArray.push(c)
                }
              }
              addChild(children)
              return childArray
            })()
      }
    </div>
  )
}

export function DropdownMenuTrigger({ children, _open, _setOpen, asChild, ...props }) {
  return (
    <div onClick={() => _setOpen?.(!_open)} className="cursor-pointer" {...props}>
      {children}
    </div>
  )
}

export function DropdownMenuContent({ children, _open, _setOpen, align = 'end', className, ...props }) {
  if (!_open) return null
  return (
    <div
      className={cn(
        'dropdown-content',
        align === 'end' ? 'right-0' : 'left-0',
        className
      )}
      onClick={() => _setOpen?.(false)}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ className, ...props }) {
  return <button className={cn('dropdown-item', className)} {...props} />
}

export function DropdownMenuLabel({ className, ...props }) {
  return <div className={cn('dropdown-label', className)} {...props} />
}

export function DropdownMenuSeparator({ className, ...props }) {
  return <div className={cn('dropdown-separator', className)} {...props} />
}
