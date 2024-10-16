import { useStorage } from '@plasmohq/storage/hook'
import cssText from 'data-text:~style.css'
import type { PlasmoCSConfig } from 'plasmo'
import Layout from '~components/ui/Layout'
import { ClickBehavior, ORIGINS, StorageKey, Truthy } from '~constants'
import { type FieldData } from '~pages/Settings'
import { useContentScript } from './hook'

const matches = Object.values(ORIGINS).map((s) => s + '/*')
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

  return <Layout></Layout>
}

export default PlasmoOverlay
