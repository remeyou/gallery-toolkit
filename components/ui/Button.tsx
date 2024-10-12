import { Button as HeadlessButton, type ButtonProps } from "@headlessui/react"
import { cc } from "~utils"

export default function Button({ children, onClick, className }: ButtonProps) {
  return (
    <HeadlessButton
      onClick={onClick}
      className={cc(
        "inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white",
        className
      )}>
      {children}
    </HeadlessButton>
  )
}
