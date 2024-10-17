import { useStorage } from '@plasmohq/storage/hook'
import cssText from 'data-text:~globals.css'
import type { PlasmoCSConfig } from 'plasmo'
import { ThemeProvider } from '~components/theme-provider'
import { ClickBehavior, Origins, StorageKey, Truthy } from '~constants'
import { type FieldData } from '~pages/settingsA'
import { useContentScript } from './hooks/content'

const matches = Object.values(Origins).map((s) => s + '/*')
export const config: PlasmoCSConfig = {
  matches,
}

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  if (matches.every((url) => !url.includes(location.origin))) {
    return null
  }

  const [formValues] = useStorage<FieldData>(StorageKey.OptionsFormData, {
    clickBehavior: ClickBehavior.Default,
    showAllPosts: Truthy.False,
  })

  useContentScript(formValues)

  return (
    <ThemeProvider>
      <div></div>
    </ThemeProvider>
  )
}

export default PlasmoOverlay
