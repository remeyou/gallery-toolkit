import { useStorage } from '@plasmohq/storage/hook'
import LabelRadioGroup from '~components/custom/label-radio-group'
import { H4 } from '~components/custom/typography'
import { ClickBehavior, Origins, StorageKey, Truthy } from '~constants'

export type FormSchema = {
  clickBehavior: ClickBehavior
  showAllPosts: Truthy
}

type Props = { origin: string }

export default function Settings({ origin }: Props) {
  const [formValues, setFormValues] = useStorage<FormSchema>(
    StorageKey.OptionsFormData,
    {
      clickBehavior: ClickBehavior.Default,
      showAllPosts: Truthy.False,
    },
  )

  return (
    <div className="space-y-4">
      <H4>Settings</H4>
      <LabelRadioGroup
        value={formValues.clickBehavior}
        onChange={(v) => {
          setFormValues({
            ...formValues,
            clickBehavior: v as ClickBehavior,
          })
        }}
        label="Click card behavior"
        options={Object.values(ClickBehavior).map((s) => ({
          label: s,
          value: s,
        }))}
      />
      {origin === Origins.Yandere && (
        <LabelRadioGroup
          value={String(formValues.showAllPosts)}
          onChange={(v) => {
            setFormValues({
              ...formValues,
              showAllPosts: Number(v),
            })
          }}
          label="Hidden posts"
          options={[
            { label: 'Hidden', value: String(Truthy.False) },
            { label: 'Show all', value: String(Truthy.True) },
          ]}
        />
      )}
    </div>
  )
}
