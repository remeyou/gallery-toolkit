import { StyleProvider } from "@ant-design/cssinjs"
import { ToolOutlined } from "@ant-design/icons"
import { useLocalStorageState } from "ahooks"
import { Divider, Form, Popover, Radio } from "antd"
import Button from "antd/es/button"
import antdResetCssText from "data-text:antd/dist/reset.css"
// import tailwindCssText from "data-text:~tailwind.css"
import type { PlasmoCSConfig, PlasmoGetShadowHostId } from "plasmo"
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

const EngageOverlay = () => {
  if (matches.every((url) => !url.includes(location.origin))) {
    return null
  }

  const [defaultClickBehavior, setDefaultClickBehavior] =
    useLocalStorageState<ClickBehavior>(
      "GALLERY_TOOLKIT_DEFAULT_CLICK_BEHAVIOR",
      { defaultValue: ClickBehavior.Default }
    )
  const [hiddenPosts, setHiddenPosts] = useLocalStorageState("HIDDEN_POSTS", {
    defaultValue: Truthy.False,
    deserializer(value) {
      return Number(JSON.parse(value))
    }
  })

  const { locationOrigin } = useContentScript({
    defaultClickBehavior,
    hiddenPosts
  })

  const onValuesChange = (changedValues: Record<string, any>) => {
    if (changedValues.defaultClickBehavior) {
      setDefaultClickBehavior(changedValues.defaultClickBehavior)
    }
    if (changedValues.hiddenPosts) {
      setHiddenPosts(changedValues.hiddenPosts)
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
