import type { ClassValue } from 'clsx'
import { type ReactNode } from 'react'
import { cn } from '~lib/utils'

type HProps = {
  children: ReactNode
  className?: ClassValue
}
export const H3 = ({ children, className }: HProps) => {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h3>
  )
}
export const H4 = ({ children, className }: HProps) => {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h4>
  )
}

type PProps = {
  children: ReactNode
  className?: ClassValue
}
export const P = ({ children, className }: PProps) => {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>
      {children}
    </p>
  )
}

type MutedProps = {
  children: ReactNode
  className?: ClassValue
}
export const Muted = ({ children, className }: MutedProps) => {
  return (
    <span className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </span>
  )
}
