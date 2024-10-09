import { useReducer } from 'react'
import Button from '~components/Button'
import './style.css'

function IndexPopup() {
  const [count, increase] = useReducer((c) => c + 1, 0)

  return (
    <Button onClick={() => increase()}>
      Count:
      <span>{count}</span>
    </Button>
  )
}

export default IndexPopup
