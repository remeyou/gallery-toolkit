import { CountButton } from "~features/count-button"

import "~style.css"

function IndexSidePanel() {
  return (
    <div className="flex items-center justify-center h-16 w-40">
      <CountButton />
    </div>
  )
}

export default IndexSidePanel
