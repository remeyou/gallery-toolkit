import { useStorage } from '@plasmohq/storage/hook'
import { useDebouncedCallback } from 'use-debounce'
import LabelRadioGroup from '~components/custom/label-radio-group'
import LabelSlider from '~components/custom/label-slider'
import LabelSwitch from '~components/custom/label-switch'
import { H4 } from '~components/custom/typography'
import { ClickBehavior, Origins, StorageKey } from '~constants'

export type FormSchema = {
  clickBehavior: ClickBehavior
  showAllPosts: boolean
  showToolbar: boolean
  zoomCard: boolean
  zoomLevel: number
}

type Props = { origin: string }

export default function Settings({ origin }: Props) {
  const [formValues, setFormValues, { setRenderValue, setStoreValue }] =
    useStorage<FormSchema>(StorageKey.Settings, {
      clickBehavior: ClickBehavior.Default,
      showAllPosts: false,
      showToolbar: true,
      zoomCard: false,
      zoomLevel: 105,
    })
  const setStorageDebounce = useDebouncedCallback(setStoreValue, 500)

  const { clickBehavior, showAllPosts, showToolbar, zoomCard, zoomLevel } =
    formValues
  return (
    <div className="space-y-4">
      <H4>Settings</H4>
      <LabelRadioGroup
        value={clickBehavior}
        onChange={(clickBehavior) => {
          setFormValues({
            ...formValues,
            clickBehavior,
          })
        }}
        label="Click card behavior"
        options={Object.entries(ClickBehavior).map(([label, value]) => ({
          label,
          value,
        }))}
      />
      {origin === Origins.Yandere && (
        <LabelSwitch
          value={showAllPosts}
          onChange={(showAllPosts) => {
            setFormValues({
              ...formValues,
              showAllPosts,
            })
          }}
          label="Show all posts"
        />
      )}
      <LabelSwitch
        value={showToolbar}
        onChange={(showToolbar) => {
          setFormValues({
            ...formValues,
            showToolbar,
          })
        }}
        label="Show toolbar"
      />
      <LabelSwitch
        value={zoomCard}
        onChange={(zoomCard) => {
          setFormValues({
            ...formValues,
            zoomCard,
          })
        }}
        label="Zoom card"
      />
      {zoomCard && (
        <LabelSlider
          value={[zoomLevel]}
          onChange={([zoomLevel]) => {
            const v = { ...formValues, zoomLevel }
            setRenderValue(v)
            setStorageDebounce(v)
          }}
          min={105}
          max={300}
          label="Zoom level"
        />
      )}
    </div>
  )
}
