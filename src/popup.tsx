import { Layout, Typography } from "antd"

import { ThemeProvider } from "~theme"

import "~global.css"

const { Title, Paragraph } = Typography

function IndexPopup() {
  return (
    <ThemeProvider>
      <Layout className="w-96 p-4">
        <Title level={5}>Oops!</Title>
        <Paragraph>The extension has not supported this website.</Paragraph>
      </Layout>
    </ThemeProvider>
  )
}

export default IndexPopup
