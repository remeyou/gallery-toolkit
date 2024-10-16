import { useStorage } from '@plasmohq/storage/hook'
import Field from '~components/ui/Field'
import Fieldset from '~components/ui/Fieldset'
import RadioGroup from '~components/ui/RadioGroup'
import { ClickBehavior, ORIGINS, StorageKey, Truthy } from '~constants'

export type FieldData = {
  clickBehavior: ClickBehavior
  showAllPosts: Truthy
}

type Props = { origin: string }

export default function Settings({ origin }: Props) {
  const [formValues, setFormValues] = useStorage<FieldData>(
    StorageKey.OptionsFormData,
    {
      clickBehavior: ClickBehavior.Default,
      showAllPosts: Truthy.False,
    },
  )

  const onFieldChange = (name: keyof FieldData, value: any) => {
    setFormValues({
      ...formValues,
      [name]: value,
    })
  }

  return (
    <Fieldset legend="Settings" className="min-w-48">
      <Field label="Click card behavior">
        <RadioGroup
          value={formValues.clickBehavior}
          onChange={(v) => {
            onFieldChange('clickBehavior', v)
          }}
          options={Object.values(ClickBehavior).map((s) => ({
            label: s,
            value: s,
          }))}
        />
      </Field>
      {origin === ORIGINS.Yandere && (
        <Field label="Hidden posts">
          <RadioGroup
            value={formValues.showAllPosts}
            onChange={(v) => {
              onFieldChange('showAllPosts', v)
            }}
            options={[
              { label: 'Hidden', value: Truthy.False },
              { label: 'Show all', value: Truthy.True },
            ]}
          />
        </Field>
      )}
    </Fieldset>
  )
}
