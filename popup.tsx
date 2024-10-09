import { useReducer } from "react"

import "./style.css"

import { Button } from "@headlessui/react"

function IndexPopup() {
  const [count, increase] = useReducer((c) => c + 1, 0)

  return (
    <Button
      onClick={() => increase()}
      className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
    >
      Count:
      <span>{count}</span>
    </Button>
  )
}

export default IndexPopup
