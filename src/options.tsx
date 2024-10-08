import { Layout, Typography } from "antd"
import "~tailwind.css"
import { ThemeProvider } from "~theme"

function IndexOption() {
  return (
    <ThemeProvider>
      <Layout className="min-h-screen p-4">
        <Typography.Title>Gallery toolkit options</Typography.Title>
      </Layout>
    </ThemeProvider>
  )
}

export default IndexOption
