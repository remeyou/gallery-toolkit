import { CircleCheck, CircleX, ImageDown, LoaderCircle } from 'lucide-react'
import React, { type ReactNode } from 'react'
import { LoadStatus } from '~constants'
import { Button } from '../ui/button'

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  status: LoadStatus
  initText?: ReactNode
  savingText?: ReactNode
}

export default function SaveBtn({
  onClick,
  status,
  initText,
  savingText,
}: Props) {
  switch (status) {
    case LoadStatus.Loading:
      return (
        <Button disabled>
          <LoaderCircle className="animate-spin" />
          <span>{savingText ?? 'Saving'}</span>
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
          <span>{initText ?? 'Save'}</span>
        </Button>
      )
  }
}
