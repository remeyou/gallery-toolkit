import { CircleCheck, CircleX } from 'lucide-react'
import SaveBtn from '~components/custom/save-btn'
import { Button } from '~components/ui/button'
import { LoadStatus } from '~constants'
import type { Pool } from './hook'

type Props = {
  pool: Pool
  poolLoading: LoadStatus
  onSavePool: (idx: number, once?: boolean) => void
}

export default function Pool({ pool, poolLoading, onSavePool }: Props) {
  return (
    <div className="flex flex-col items-start gap-1">
      {pool.map((p, idx) => (
        <p className="flex h-9 gap-2 align-middle leading-9" key={p.thumbPath}>
          {p.thumbPath}
          {p.status === LoadStatus.Success && <CircleCheck />}
          {p.status === LoadStatus.Error && (
            <Button
              size={'sm'}
              variant={'secondary'}
              disabled={poolLoading === LoadStatus.Loading}
              onClick={() => onSavePool(idx, true)}
            >
              <CircleX />
              Retry
            </Button>
          )}
        </p>
      ))}
      {pool.every((p) => p.directLink) && (
        <SaveBtn
          status={poolLoading}
          onClick={() => onSavePool(0)}
          initText="Save Pool"
          savingText={`${pool.filter((p) => p.status === LoadStatus.Success).length}/${pool.length} Saving...`}
        />
      )}
    </div>
  )
}