import { Layout } from "antd"
import { useEffect, useState } from "react"
import Localhost from "~components/Localhost"
import { SUPPORTED_ORIGINS } from "~constants"
import "~global.css"
import { ThemeProvider } from "~theme"

function IndexSidePanel() {
  const [origin, setOrigin] = useState<string>()
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      const url = tab[0].url
      if (url) {
        setOrigin(new URL(url).origin)
      } else {
        setOrigin(SUPPORTED_ORIGINS.localhost)
      }
    })
  }, [])

  return (
    <ThemeProvider>
      <Layout className="min-h-screen p-2">
        {origin === SUPPORTED_ORIGINS.localhost && <Localhost />}
      </Layout>
    </ThemeProvider>
  )
}

export default IndexSidePanel