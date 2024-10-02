import { theme } from "antd"
import ConfigProvider from "antd/es/config-provider"
import type { ReactNode } from "react"

import { checkDarkMode } from "~utils"

export const ThemeProvider = ({ children = null as ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#a1701d"
        },
        algorithm: checkDarkMode()
          ? theme.darkAlgorithm
          : theme.defaultAlgorithm,
        components: {
          Tag: {
            marginXS: 0
          }
        }
      }}>
      {children}
    </ConfigProvider>
  )
}
