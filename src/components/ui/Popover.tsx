import {
  Popover as HeadlessPopover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'
import type { AnchorProps } from '@headlessui/react/dist/internal/floating'
import { type ReactNode } from 'react'

type Props = {
  children: ReactNode
  anchor?: AnchorProps
  trigger: ReactNode
}

export default function Popover({ trigger, children, anchor }: Props) {
  return (
    <HeadlessPopover>
      <PopoverButton>{trigger}</PopoverButton>
      <PopoverPanel
        transition
        anchor={anchor}
        className="divide-y divide-black/5 rounded-xl bg-white text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0 dark:divide-white/5 dark:bg-black/90 dark:text-white"
      >
        {children}
      </PopoverPanel>
    </HeadlessPopover>
  )
}
