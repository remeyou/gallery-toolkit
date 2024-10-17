import { useStorage } from '@plasmohq/storage/hook'
import { useForm } from 'react-hook-form'
import { H4 } from '~components/custom/typography'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '~components/ui/form'
import { RadioGroup, RadioGroupItem } from '~components/ui/radio-group'
import { ClickBehavior, Origins, StorageKey, Truthy } from '~constants'

export type FieldData = {
  clickBehavior: ClickBehavior
  showAllPosts: Truthy
}

type Props = { origin: string }

export default function Settings({ origin }: Props) {
  const form = useForm()

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
    <Form {...form}>
      <form className="space-y-4">
        <H4>Settings</H4>
        <FormField
          name="clickBehavior"
          control={form.control}
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>Click card behavior</FormLabel>
              <FormControl>
                <RadioGroup
                  value={formValues.clickBehavior}
                  onChange={(v) => {
                    onFieldChange('clickBehavior', v)
                  }}
                  className="flex flex-col space-y-1"
                >
                  {Object.values(ClickBehavior).map((s) => (
                    <FormItem
                      className="flex items-center space-x-3 space-y-0"
                      key={s}
                    >
                      <FormControl>
                        <RadioGroupItem value={s} />
                      </FormControl>
                      <FormLabel>{s}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        {origin === Origins.Yandere && (
          <FormField
            name="showAllPosts"
            control={form.control}
            render={() => (
              <FormItem className="space-y-3">
                <FormLabel>Hidden posts</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={String(formValues.clickBehavior)}
                    onChange={(v) => {
                      onFieldChange('showAllPosts', Number(v))
                    }}
                    className="flex flex-col space-y-1"
                  >
                    {[
                      { label: 'Hidden', value: Truthy.False },
                      { label: 'Show all', value: Truthy.True },
                    ].map(({ label, value }) => (
                      <FormItem
                        className="flex items-center space-x-3 space-y-0"
                        key={value}
                      >
                        <FormControl>
                          <RadioGroupItem value={String(value)} />
                        </FormControl>
                        <FormLabel>{label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  )
}
