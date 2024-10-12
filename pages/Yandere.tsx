import { useEffect, useState } from 'react'
import Hint from '~components/Hint'
import SaveBtn from '~components/SaveBtn'
import Tag from '~components/ui/Tag'
import { H1, Text } from '~components/ui/Typography'
import { LoadStatus, RequestPath, ResponseCode } from '~constants'
import type { ReqParams, ReqResponse, StringifyElement } from '~typings'
import { download } from '~utils'

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

const transform = (data: StringifyElement[]) => {
  return (data ?? []).reduce((prev, curr) => {
    const { tagName, attributes, textContent } = curr
    if (
      tagName === 'IMG' &&
      attributes?.class === 'preview' &&
      attributes.title
    ) {
      const infoList = attributes.title.split(' ')
      const ratingIdx = infoList.indexOf('Rating:')
      const scoreIdx = infoList.indexOf('Score:')
      const tagsIdx = infoList.indexOf('Tags:')
      const userIdx = infoList.indexOf('User:')
      return {
        ...prev,
        preview: attributes.src,
        rating: infoList[ratingIdx + 1],
        score: Number(infoList[scoreIdx + 1]),
        tags: infoList.slice(tagsIdx + 1, userIdx),
        user: infoList[userIdx + 1],
      }
    } else if (tagName === 'A' && attributes?.class === 'thumb') {
      return {
        ...prev,
        thumbPath: attributes.href,
      }
    } else if (tagName === 'SPAN' && attributes?.class === 'directlink-res') {
      return {
        ...prev,
        resolution: textContent?.[0],
      }
    } else if (tagName === 'A' && attributes?.class === 'directlink largeimg') {
      return {
        ...prev,
        directLink: attributes.href?.replace(
          'files.yande.re/jpeg',
          'files.yande.re/image',
        ),
      }
    }
    return prev
  }, {}) as Post
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
    download(param.directLink, filename).then(setLoading).catch(setLoading)
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (
        msg: ReqParams<StringifyElement[]>,
        sender,
        sendResp: (response: ReqResponse) => void,
      ) => {
        const result = { ...transform(msg.body ?? []), source: sender.url }
        setLoading(LoadStatus.Init)
        setPost(result)
        if (msg.path === RequestPath.DownloadArt) {
          onSave(result)
        }
        sendResp({ code: ResponseCode.OK })
      },
    )
  }, [])

  if (!Object.keys(post).length) {
    return <Hint />
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
      {thumbPath && <H1>{thumbPath}</H1>}
      {resolution && (
        <div className="space-x-2">
          <Text type="secondary">Resolution:</Text>
          <span>{resolution}</span>
        </div>
      )}
      {rating && (
        <div className="space-x-2">
          <Text type="secondary">Rating:</Text>
          <Tag>{rating}</Tag>
        </div>
      )}
      {!Number.isNaN(score) && (
        <div className="space-x-2">
          <Text type="secondary">Score:</Text>
          <span>{score}</span>
        </div>
      )}
      {tags && (
        <div className="space-x-2 space-y-2">
          <Text type="secondary">Tags:</Text>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
      {user && (
        <div className="space-x-2">
          <Text type="secondary">User:</Text>
          <span>{user}</span>
        </div>
      )}
      {directLink && <SaveBtn status={loading} onClick={() => onSave(post)} />}
    </div>
  )
}
