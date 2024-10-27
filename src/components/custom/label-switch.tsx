import { Label } from '~components/ui/label'
import { Switch } from '~components/ui/switch'

type Props = {
  value: boolean
  onChange: (value: boolean) => void
  label?: string
}

export default function LabelSwitch({ value, onChange, label }: Props) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-base" htmlFor={label}>
        {label}
      </Label>
      <Switch id={label} checked={value} onCheckedChange={onChange} />
    </div>
  )
}
