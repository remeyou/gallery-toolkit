import { Settings as SettingsIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import Greeting from '~components/ui/Greeting'
import Layout from '~components/ui/Layout'
import Popover from '~components/ui/Popover'
import { ORIGINS } from '~constants'
import Localhost from '~pages/Localhost'
import Settings from '~pages/Settings'
import Yandere from '~pages/Yandere'
import '~style.css'
console.log('🚀 ~ ORIGINS:', ORIGINS)

function IndexSidePanel() {
  const [origin, setOrigin] = useState('')
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      const url = tab[0].url
      url ? setOrigin(new URL(url).origin) : setOrigin(ORIGINS['Localhost'])
    })
  }, [])

  return (
    <Layout className="min-h-screen space-y-2 p-3">
      <div className="flex items-center justify-between">
        <Greeting />
        <Popover
          anchor="bottom end"
          trigger={
            <div className="rounded-full p-2 transition-colors ease-in-out hover:bg-black/5 dark:hover:bg-white/5">
              <SettingsIcon />
            </div>
          }
        >
          <Settings origin={origin} />
        </Popover>
      </div>
      {origin === ORIGINS['Localhost'] && <Localhost />}
      {origin === ORIGINS['Yandere'] && <Yandere />}
    </Layout>
  )
}

export default IndexSidePanel
