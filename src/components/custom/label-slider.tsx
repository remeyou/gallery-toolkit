import { Label } from '~components/ui/label'
import { Slider } from '~components/ui/slider'

type Props = {
  value: number[]
  onChange: (value: number[]) => void
  label?: string
  min?: number
  max?: number
}

export default function LabelSlider({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
}: Props) {
  return (
    <div>
      <Label className="text-base">{label}</Label>
      <div className="mt-2 flex items-center gap-2">
        <Slider value={value} min={min} max={max} onValueChange={onChange} />
        <Label>{value}%</Label>
      </div>
    </div>
  )
}
