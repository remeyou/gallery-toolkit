import { Settings as SettingsIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import Greeting from '~components/custom/Greeting'
import Popover from '~components/custom/Popover'
import { ThemeProvider } from '~components/theme-provider'
import { ORIGINS } from '~constants'
import '~globals.css'
import Localhost from '~pages/Localhost'
import Settings from '~pages/Settings'
import Yandere from '~pages/Yandere'

function IndexSidePanel() {
  const [origin, setOrigin] = useState('')
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      const url = tab[0].url
      url ? setOrigin(new URL(url).origin) : setOrigin(ORIGINS.Localhost)
    })
  }, [])

  return (
    <ThemeProvider>
      <div className="min-h-screen space-y-2 p-3 text-base">
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
        {origin === ORIGINS.Localhost && <Localhost />}
        {origin === ORIGINS.Yandere && <Yandere />}
      </div>
    </ThemeProvider>
  )
}

export default IndexSidePanel
