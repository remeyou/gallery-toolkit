import { Button, Layout } from "antd"

import { ThemeProvider } from "~theme"

import "~global.css"

function IndexSidePanel() {
  return (
    <ThemeProvider>
      <Layout className="min-h-screen">
        <Button>Button</Button>
      </Layout>
    </ThemeProvider>
  )
}

export default IndexSidePanel
