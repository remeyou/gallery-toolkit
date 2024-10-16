import { Moon, Sun, Sunrise, Sunset } from 'lucide-react'
import { H1 } from './Typography'

const titleClass = 'flex items-center gap-1'

export default function Greeting() {
  const hour = new Date().getHours()
  if (hour > 18) {
    return (
      <H1 className={titleClass}>
        Good Evening
        <Sunset />
      </H1>
    )
  } else if (hour > 12) {
    return (
      <H1 className={titleClass}>
        Good Afternoon
        <Sun />
      </H1>
    )
  } else if (hour > 6) {
    return (
      <H1 className={titleClass}>
        Good Morning
        <Sunrise />
      </H1>
    )
  } else {
    return (
      <H1 className={titleClass}>
        Good Night
        <Moon />
      </H1>
    )
  }
}
