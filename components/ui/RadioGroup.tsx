import { RadioGroup as HeadlessRadioGroup, Radio } from "@headlessui/react"
import { Circle, CircleCheckBig } from "lucide-react"
import { type ReactNode } from "react"

type Value = string | number

interface Option {
  label: ReactNode
  value: Value
  desc?: ReactNode
}

type Props = {
  value?: Value
  onChange?: (value: Value) => void
  options: Option[]
}

export default function RadioGroup({ value, onChange, options }: Props) {
  return (
    <HeadlessRadioGroup
      by="value"
      value={options.find((o) => o.value === value)}
      onChange={(v) => onChange?.(v.value)}
      aria-label="Server size"
      className="space-y-2">
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option}
          className="group relative flex cursor-pointer rounded-lg bg-white/5 px-5 py-4 shadow-md transition focus:outline-none data-[checked]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
          <div className="flex w-full items-center justify-between">
            <div className="text-sm/6">
              <p className="font-semibold">{option.label}</p>
              <div className="flex gap-2">{option.desc}</div>
            </div>
            <Circle className="size-6 transition group-data-[checked]:hidden" />
            <CircleCheckBig className="hidden size-6 transition group-data-[checked]:block" />
          </div>
        </Radio>
      ))}
    </HeadlessRadioGroup>
  )
}
