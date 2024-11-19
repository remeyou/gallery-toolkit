import { Settings as SettingsIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import Greeting from '~components/custom/greeting'
import { ThemeProvider } from '~components/theme-provider'
import { Popover, PopoverContent, PopoverTrigger } from '~components/ui/popover'
import { ScrollArea } from '~components/ui/scroll-area'
import { Origins } from '~constants'
import '~globals.css'
import Localhost from '~pages/localhost'
import Settings from '~pages/settings'
import Yandere from '~pages/yandere'

function IndexSidePanel() {
  const [origin, setOrigin] = useState('')
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      const url = tab[0].url
      url ? setOrigin(new URL(url).origin) : setOrigin(Origins.Localhost)
    })
  }, [])

  return (
    <ThemeProvider>
      <ScrollArea className="h-screen p-3 text-base">
        <div className="flex items-center justify-between">
          <Greeting />
          <Popover>
            <PopoverTrigger>
              <div className="rounded-full p-2 transition-colors duration-300 hover:bg-black/5 dark:hover:bg-white/5">
                <SettingsIcon />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <Settings origin={origin} />
            </PopoverContent>
          </Popover>
        </div>
        {origin === Origins.Localhost && <Localhost />}
        {origin === Origins.Yandere && <Yandere />}
      </ScrollArea>
    </ThemeProvider>
  )
}

export default IndexSidePanel
