import type { ReactNode } from 'react'
import { Label } from '~components/ui/label'
import { RadioGroup, RadioGroupItem } from '~components/ui/radio-group'

type Props<T> = {
  value: T
  onChange: (value: T) => void
  label?: string
  options: { label: ReactNode; value: T }[]
}

export default function LabelRadioGroup<T extends string>({
  value,
  onChange,
  label,
  options,
}: Props<T>) {
  return (
    <RadioGroup value={value} onValueChange={onChange}>
      <Label className="text-base">{label}</Label>
      {options.map(({ label: l, value: v }) => (
        <div key={v} className="flex items-center space-x-2">
          <RadioGroupItem value={v} id={v} />
          <Label htmlFor={v}>{l}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}
