import type { ClassValue } from 'clsx'
import { type ReactNode } from 'react'
import { cn } from '~lib/utils'

type Props = {
  children: ReactNode
  className?: ClassValue
}

export default function Tag({ children, className }: Props) {
  return (
    <span
      className={cn(
        'inline-block break-all rounded-sm bg-black/10 px-2 dark:bg-white/10',
        className,
      )}
    >
      {children}
    </span>
  )
}
