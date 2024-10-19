import type { ReactNode } from 'react'
import { Label } from '~components/ui/label'
import { RadioGroup, RadioGroupItem } from '~components/ui/radio-group'

type Props = {
  value: string
  onChange: (value: string) => void
  label?: string
  options: { label: ReactNode; value: string }[]
}

export default function LabelRadioGroup({
  value,
  onChange,
  label: radioGroupLabel,
  options,
}: Props) {
  return (
    <RadioGroup value={value} onValueChange={onChange}>
      <Label className="text-base">{radioGroupLabel}</Label>
      {options.map(({ label, value }) => (
        <div key={value} className="flex items-center space-x-2">
          <RadioGroupItem value={value} id={value} />
          <Label htmlFor={value}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}
