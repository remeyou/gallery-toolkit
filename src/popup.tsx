import { H1 } from '~components/custom/Typography'
import { ThemeProvider } from '~components/theme-provider'
import '~globals.css'

function IndexPopup() {
  return (
    <ThemeProvider>
      <div className="w-96 p-4 text-base">
        <H1>Oops!</H1>
        <p>The extension has not supported this website.</p>
      </div>
    </ThemeProvider>
  )
}

export default IndexPopup
