import { Description, Field as HeadlessField, Label } from "@headlessui/react"
import type { ReactNode } from "react"

type Props = { children: ReactNode; label: ReactNode; description?: ReactNode }

export default function Field({ children, label, description }: Props) {
  return (
    <HeadlessField>
      <Label className="text-sm/6 font-medium">{label}</Label>
      <Description className="mb-1 text-sm/6 text-white/50">
        {description}
      </Description>
      {children}
    </HeadlessField>
  )
}
