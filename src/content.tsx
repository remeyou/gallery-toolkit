import { StyleProvider } from "@ant-design/cssinjs"
import { ToolOutlined } from "@ant-design/icons"
import { Popover } from "antd"
import Button from "antd/es/button"
import antdResetCssText from "data-text:antd/dist/reset.css"
// import globalCssText from "data-text:~global.css"
import type { PlasmoCSConfig, PlasmoGetShadowHostId } from "plasmo"
import { SUPPORTED_ORIGINS } from "~constants"
import { useContentScript } from "~hooks"
import { ThemeProvider } from "~theme"

const matches = Object.values(SUPPORTED_ORIGINS)
  .map((s) => s + "/*")
  .concat(["https://developer.chrome.google.cn/*"])
export const config: PlasmoCSConfig = {
  matches
}

const HOST_ID = "engage-csui"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

const customCssText = `
.trigger {
  position: fixed;
  right: 16px;
  bottom: 16px;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
}
`

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = antdResetCssText + customCssText
  return style
}

const EngageOverlay = () => {
  useContentScript()

  return (
    <ThemeProvider>
      <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
        <Popover
          trigger="click"
          placement="topRight"
          getPopupContainer={(trigger) => trigger}
          title={<div>Have a nice day!</div>}>
          <Button className="trigger" shape="circle" size="large">
            <ToolOutlined />
          </Button>
        </Popover>
      </StyleProvider>
    </ThemeProvider>
  )
}

export default EngageOverlay
