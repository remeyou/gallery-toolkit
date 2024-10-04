import { StyleProvider } from "@ant-design/cssinjs"
import { ToolOutlined } from "@ant-design/icons"
import { Form, Popover, Radio } from "antd"
import Button from "antd/es/button"
import antdResetCssText from "data-text:antd/dist/reset.css"
// import globalCssText from "data-text:~global.css"
import type { PlasmoCSConfig, PlasmoGetShadowHostId } from "plasmo"
import { useState } from "react"
import { ClickBehavior, SUPPORTED_ORIGINS } from "~constants"
import { useContentScript } from "~hooks"
import { ThemeProvider } from "~theme"

const matches = Object.values(SUPPORTED_ORIGINS).map((s) => s + "/*")
export const config: PlasmoCSConfig = {
  matches
}

const HOST_ID = "engage-csui"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

const customCssText = `
#gallery-toolkit-trigger {
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

const LOCAL_STORAGE_KEY = "GALLERY_TOOLKIT_DEFAULT_CLICK_BEHAVIOR"

const EngageOverlay = () => {
  if (matches.every((url) => !url.includes(location.origin))) {
    return null
  }

  const [defaultClickBehavior, setDefaultClickBehavior] =
    useState<ClickBehavior>(
      (localStorage.getItem(LOCAL_STORAGE_KEY) as ClickBehavior) ??
        ClickBehavior.Default
    )

  useContentScript(defaultClickBehavior)

  return (
    <ThemeProvider>
      <StyleProvider container={document.getElementById(HOST_ID)!.shadowRoot!}>
        <Popover
          trigger="click"
          placement="topRight"
          getPopupContainer={(trigger) => trigger}
          title="Settings"
          overlayStyle={{ width: "300px" }}
          content={
            <Form
              layout="vertical"
              onValuesChange={(changed) => {
                if (changed.defaultClickBehavior) {
                  setDefaultClickBehavior(changed.defaultClickBehavior)
                  localStorage.setItem(
                    LOCAL_STORAGE_KEY,
                    changed.defaultClickBehavior
                  )
                }
              }}
              initialValues={{ defaultClickBehavior }}>
              <Form.Item
                name="defaultClickBehavior"
                label="Default click behavior"
                style={{ marginBottom: 0 }}>
                <Radio.Group
                  options={[
                    ClickBehavior.Default,
                    ClickBehavior.Inspect,
                    ClickBehavior.Download
                  ].map((label) => ({ label, value: label }))}
                />
              </Form.Item>
            </Form>
          }>
          <Button id="gallery-toolkit-trigger" shape="circle" size="large">
            <ToolOutlined />
          </Button>
        </Popover>
      </StyleProvider>
    </ThemeProvider>
  )
}

export default EngageOverlay
