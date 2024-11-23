import { ThemeProvider } from '~components/theme-provider'
import { H3 } from './typography'

export default function Unavailable() {
  return (
    <ThemeProvider>
      <div className="w-max p-4 text-base">
        <H3>Oops!</H3>
        <p>The extension has not supported this website.</p>
      </div>
    </ThemeProvider>
  )
}
