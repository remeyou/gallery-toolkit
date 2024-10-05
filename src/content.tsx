import { StyleProvider } from "@ant-design/cssinjs"
import { ToolOutlined } from "@ant-design/icons"
import { Divider, Form, Popover, Radio } from "antd"
import Button from "antd/es/button"
import antdResetCssText from "data-text:antd/dist/reset.css"
// import globalCssText from "data-text:~global.css"
import type { PlasmoCSConfig, PlasmoGetShadowHostId } from "plasmo"
import { useState } from "react"
import { ClickBehavior, SUPPORTED_ORIGINS, Truthy } from "~constants"
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

const LOCAL_STORAGE_KEY = {
  defaultClickBehavior: "GALLERY_TOOLKIT_DEFAULT_CLICK_BEHAVIOR",
  hiddenPosts: "HIDDEN_POSTS"
}

const EngageOverlay = () => {
  if (matches.every((url) => !url.includes(location.origin))) {
    return null
  }

  const [defaultClickBehavior, setDefaultClickBehavior] =
    useState<ClickBehavior>(
      (localStorage.getItem(
        LOCAL_STORAGE_KEY.defaultClickBehavior
      ) as ClickBehavior) ?? ClickBehavior.Default
    )
  const [hiddenPosts, setHiddenPosts] = useState(
    Number(localStorage.getItem(LOCAL_STORAGE_KEY.hiddenPosts))
  )

  const { locationOrigin } = useContentScript({
    defaultClickBehavior,
    hiddenPosts
  })

  const onValuesChange = (changedValues: any, values: any) => {
    if (changedValues.defaultClickBehavior) {
      setDefaultClickBehavior(changedValues.defaultClickBehavior)
      localStorage.setItem(
        LOCAL_STORAGE_KEY.defaultClickBehavior,
        changedValues.defaultClickBehavior
      )
    }
    if (changedValues.hiddenPosts) {
      setHiddenPosts(changedValues.hiddenPosts)
      localStorage.setItem(
        LOCAL_STORAGE_KEY.hiddenPosts,
        changedValues.hiddenPosts
      )
    }
  }

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
              onValuesChange={onValuesChange}
              initialValues={{ defaultClickBehavior, hiddenPosts }}>
              <Divider />
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
              {locationOrigin === SUPPORTED_ORIGINS.yandere && (
                <>
                  <Divider />
                  <Form.Item
                    name="hiddenPosts"
                    label="Hidden posts"
                    style={{ marginBottom: 0 }}>
                    <Radio.Group
                      options={[
                        { label: "Hidden", value: Truthy.False },
                        { label: "Show all", value: Truthy.True }
                      ]}
                    />
                  </Form.Item>
                </>
              )}
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
