import { Fieldset as HeadlessFieldset, Legend } from '@headlessui/react'
import type { ClassValue } from 'clsx'
import type { ReactNode } from 'react'
import { cn } from '~lib/utils'

type Props = { legend: string; children: ReactNode; className: ClassValue }

function Fieldset({ legend, children, className }: Props) {
  return (
    <HeadlessFieldset
      className={cn(
        'space-y-3 rounded-xl bg-black/5 p-3 dark:bg-white/5',
        className,
      )}
    >
      <Legend className="text-base/7 font-semibold">{legend}</Legend>
      {children}
    </HeadlessFieldset>
  )
}

export default Fieldset
