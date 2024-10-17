import { Moon, Sun, Sunrise, Sunset } from 'lucide-react'
import { H3 } from './typographyA'

const titleClass = 'flex items-center gap-1'

export default function Greeting() {
  const hour = new Date().getHours()
  if (hour > 18) {
    return (
      <H3 className={titleClass}>
        Good Evening
        <Sunset />
      </H3>
    )
  } else if (hour > 12) {
    return (
      <H3 className={titleClass}>
        Good Afternoon
        <Sun />
      </H3>
    )
  } else if (hour > 6) {
    return (
      <H3 className={titleClass}>
        Good Morning
        <Sunrise />
      </H3>
    )
  } else {
    return (
      <H3 className={titleClass}>
        Good Night
        <Moon />
      </H3>
    )
  }
}
