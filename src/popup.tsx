import { H3, P } from '~components/custom/typography'
import { ThemeProvider } from '~components/theme-provider'
import '~globals.css'

function IndexPopup() {
  return (
    <ThemeProvider>
      <div className="w-96 p-4 text-base">
        <H3>Oops!</H3>
        <P>The extension has not supported this website.</P>
      </div>
    </ThemeProvider>
  )
}

export default IndexPopup
