import Layout from '~components/ui/Layout'
import { H1 } from '~components/ui/Typography'
import './style.css'

function IndexPopup() {
  return (
    <Layout className="w-96 p-4">
      <H1>Oops!</H1>
      <p>The extension has not supported this website.</p>
    </Layout>
  )
}

export default IndexPopup
