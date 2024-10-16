import { type ReactNode } from 'react'
import { cc } from '~utils'

type Props = { children?: ReactNode; className?: string }

export default function Layout({ children, className }: Props) {
  return (
    <main
      className={cc(
        'bg-white text-base dark:bg-black/85 dark:text-white',
        className,
      )}
    >
      {children}
    </main>
  )
}
