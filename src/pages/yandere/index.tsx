import { CircleCheck, CircleX } from 'lucide-react'
import { useEffect, useState } from 'react'
import Cover from '~components/custom/cover'
import SaveBtn from '~components/custom/save-btn'
import { H4, Muted } from '~components/custom/typography'
import { Badge } from '~components/ui/badge'
import { LoadStatus, Origins, RequestPath, ResponseCode } from '~constants'
import { download } from '~lib/utils'
import type { FormattedElement, ReqParams, ReqResponse } from '~typings'

type Post = Partial<{
  preview: string
  rating: string
  score: number
  tags: string[]
  user: string
  thumbPath: string
  resolution: string
  directLink: string
  source: string
}>

const transform = (data: FormattedElement[]) => {
  return data.reduce<Post>((prev, curr) => {
    const { tagName, attributes, textContent } = curr
    if (
      tagName === 'IMG' &&
      attributes.class === 'preview' &&
      attributes.title
    ) {
      const infos = attributes.title.split(' ')
      const ratingIdx = infos.indexOf('Rating:')
      const scoreIdx = infos.indexOf('Score:')
      const tagsIdx = infos.indexOf('Tags:')
      const userIdx = infos.indexOf('User:')
      return {
        ...prev,
        preview: attributes.src,
        rating: infos[ratingIdx + 1],
        score: Number(infos[scoreIdx + 1]),
        tags: infos.slice(tagsIdx + 1, userIdx),
        user: infos[userIdx + 1],
      }
    } else if (tagName === 'A' && attributes.class === 'thumb') {
      return {
        ...prev,
        thumbPath: attributes.href,
      }
    } else if (
      tagName === 'SPAN' &&
      attributes.class === 'directlink-res' &&
      textContent?.length
    ) {
      return {
        ...prev,
        resolution: textContent[0],
      }
    } else if (
      tagName === 'A' &&
      attributes.class === 'directlink largeimg' &&
      attributes.href
    ) {
      return {
        ...prev,
        directLink: attributes.href.replace(
          'files.yande.re/jpeg',
          'files.yande.re/image',
        ),
      }
    }
    return prev
  }, {})
}

export default function Yandere() {
  const [post, setPost] = useState<Post>({})
  const [postLoading, setPostLoading] = useState<LoadStatus>(LoadStatus.Init)
  const [pool, setPool] = useState<(Post & { status?: LoadStatus })[]>([])
  const [poolLoading, setPoolLoading] = useState<LoadStatus>(LoadStatus.Init)

  const onSave = (param: Post) => {
    setPostLoading(LoadStatus.Loading)
    const filename = getFilename(param)
    return download(param.directLink, filename).then(setPostLoading)
  }

  const onSavePool = async (idx: number) => {
    setPoolLoading(LoadStatus.Loading)
    const curr = pool[idx]
    const filename = getFilename(curr)
    const status = await download(curr.directLink, filename)
    setPool((prev) => {
      const next = [...prev]
      next[idx].status = status
      return next
    })
    if (idx < pool.length - 1) {
      onSavePool(idx + 1)
    } else {
      setPoolLoading(
        pool.some((p) => p.status === LoadStatus.Error)
          ? LoadStatus.Error
          : LoadStatus.Success,
      )
    }
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (msg: ReqParams, sender, sendResp: (response: ReqResponse) => void) => {
        if (!sender.url?.includes(Origins.Yandere)) {
          return
        }
        if (
          [RequestPath.Inspect, RequestPath.Download].includes(msg.path) &&
          Array.isArray(msg.body)
        ) {
          const result = { ...transform(msg.body), source: sender.url }
          setPostLoading(LoadStatus.Init)
          setPost(result)
          msg.path === RequestPath.Download && onSave(result)
        }
        if (
          RequestPath.List === msg.path &&
          sender.url.includes('pool') &&
          Array.isArray(msg.body)
        ) {
          setPoolLoading(LoadStatus.Init)
          setPool(
            msg.body.map((v) => ({
              ...transform(v),
              source: sender.url,
            })),
          )
        }
        sendResp({ code: ResponseCode.OK })
      },
    )
    return () => chrome.runtime.onMessage.removeListener(() => null)
  }, [])

  if (!Object.keys(post).length && !pool.length) {
    return <Cover />
  }
  const {
    preview,
    thumbPath,
    resolution,
    rating,
    tags,
    score,
    user,
    directLink,
  } = post
  return (
    <div className="flex flex-col items-start gap-1">
      {preview && <img src={preview} alt={thumbPath} width="100%" />}
      {thumbPath && <H4>{thumbPath}</H4>}
      {resolution && (
        <div className="space-x-2">
          <Muted>Resolution:</Muted>
          <span>{resolution}</span>
        </div>
      )}
      {rating && (
        <div className="space-x-2">
          <Muted>Rating:</Muted>
          <Badge variant="secondary">{rating}</Badge>
        </div>
      )}
      {score && !Number.isNaN(score) && (
        <div className="space-x-2">
          <Muted>Score:</Muted>
          <span>{score}</span>
        </div>
      )}
      {tags && (
        <div className="space-x-2 space-y-2">
          <Muted>Tags:</Muted>
          {tags.map((tag) => (
            <Badge variant="secondary" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
      )}
      {user && (
        <div className="space-x-2">
          <Muted>User:</Muted>
          <span>{user}</span>
        </div>
      )}
      {directLink && (
        <SaveBtn status={postLoading} onClick={() => onSave(post)} />
      )}
      {Boolean(Object.keys(post).length) && <div className="mb-4" />}
      {Boolean(pool.length) && (
        <>
          {pool.map((p) => (
            <p className="flex gap-2 align-middle">
              {p.thumbPath}
              {p.status === LoadStatus.Success && <CircleCheck />}
              {p.status === LoadStatus.Error && <CircleX />}
            </p>
          ))}
          {pool.every((p) => p.directLink) && (
            <SaveBtn
              status={poolLoading}
              onClick={onSavePool.bind(null, 0)}
              initText="Save Pool"
              savingText={`${pool.filter((p) => p.status === LoadStatus.Success).length}/${pool.length} Saving...`}
            />
          )}
        </>
      )}
    </div>
  )
}

function getFilename(param: Post) {
  const url = new URL(param.source ?? '')
  const filename =
    param.thumbPath?.replace('/', '_') ||
    url.hostname + url.pathname.replaceAll('/', '_')
  return filename
}
