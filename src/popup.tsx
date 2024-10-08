import { Layout, Typography } from "antd"
import "~tailwind.css"
import { ThemeProvider } from "~theme"

const { Title, Text } = Typography

function IndexPopup() {
  return (
    <ThemeProvider>
      <Layout className="w-96 p-4">
        <Title level={5}>Oops!</Title>
        <Text>The extension has not supported this website.</Text>
      </Layout>
    </ThemeProvider>
  )
}

export default IndexPopup
