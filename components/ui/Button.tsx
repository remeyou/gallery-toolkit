import { Button as HeadlessButton, type ButtonProps } from '@headlessui/react'
import { cc } from '~utils'

export default function Button({ children, onClick, className }: ButtonProps) {
  return (
    <HeadlessButton
      onClick={onClick}
      className={cc(
        'inline-flex items-center gap-2 rounded-md bg-black/90 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-black/80 dark:bg-white/90 dark:text-black dark:hover:bg-white/80',
        className,
      )}
    >
      {children}
    </HeadlessButton>
  )
}
