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
  const [loading, setLoading] = useState<LoadStatus>(LoadStatus.Init)

  const onSave = (param: Post) => {
    setLoading(LoadStatus.Loading)
    const url = new URL(param.source ?? '')
    const filename =
      param.thumbPath?.replace('/', '_') ||
      url.hostname + url.pathname.replaceAll('/', '_')
    download(param.directLink, filename).then(setLoading)
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (
        msg: ReqParams<FormattedElement[]>,
        sender,
        sendResp: (response: ReqResponse) => void,
      ) => {
        if (!sender.url?.includes(Origins.Yandere)) {
          return
        }
        const result = { ...transform(msg.body ?? []), source: sender.url }
        setLoading(LoadStatus.Init)
        setPost(result)
        if (msg.path === RequestPath.Download) {
          onSave(result)
        }
        sendResp({ code: ResponseCode.OK })
      },
    )
    return () => chrome.runtime.onMessage.removeListener(() => null)
  }, [])

  if (!Object.keys(post).length) {
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
      {!Number.isNaN(score) && (
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
      {directLink && <SaveBtn status={loading} onClick={() => onSave(post)} />}
    </div>
  )
}
