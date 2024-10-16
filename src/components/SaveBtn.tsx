import { CircleCheck, CircleX, ImageDown, LoaderCircle } from "lucide-react"
import React from "react"
import { LoadStatus } from "~constants"
import Button from "./ui/Button"

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  status: LoadStatus
}

export default function SaveBtn({ onClick, status }: Props) {
  switch (status) {
    case LoadStatus.Loading:
      return (
        <Button>
          <LoaderCircle className="h-5 w-5 animate-spin" />
          <span>Saving</span>
        </Button>
      )

    case LoadStatus.Success:
      return (
        <Button onClick={onClick}>
          <CircleCheck className="h-5 w-5" />
          <span>Success</span>
        </Button>
      )

    case LoadStatus.Error:
      return (
        <Button onClick={onClick}>
          <CircleX className="h-5 w-5" />
          <span>Retry</span>
        </Button>
      )

    default:
      return (
        <Button onClick={onClick}>
          <ImageDown className="h-5 w-5" />
          <span>Save</span>
        </Button>
      )
  }
}
