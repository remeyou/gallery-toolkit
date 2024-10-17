import { CircleCheck, CircleX, ImageDown, LoaderCircle } from 'lucide-react'
import React from 'react'
import { LoadStatus } from '~constants'
import { Button } from '../ui/button'

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  status: LoadStatus
}

export default function SaveBtn({ onClick, status }: Props) {
  switch (status) {
    case LoadStatus.Loading:
      return (
        <Button disabled>
          <LoaderCircle className="animate-spin" />
          <span>Saving</span>
        </Button>
      )

    case LoadStatus.Success:
      return (
        <Button onClick={onClick}>
          <CircleCheck />
          <span>Success</span>
        </Button>
      )

    case LoadStatus.Error:
      return (
        <Button onClick={onClick}>
          <CircleX />
          <span>Retry</span>
        </Button>
      )

    default:
      return (
        <Button onClick={onClick}>
          <ImageDown />
          <span>Save</span>
        </Button>
      )
  }
}
