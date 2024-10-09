import cssText from 'data-text:~style.css'
import { useReducer } from 'react'
import Button from '~components/Button'

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const [count, increase] = useReducer((c) => c + 1, 0)

  return (
    <Button onClick={() => increase()}>
      Count:
      <span>{count}</span>
    </Button>
  )
}

export default PlasmoOverlay
