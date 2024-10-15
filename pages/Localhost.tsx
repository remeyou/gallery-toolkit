import { useEffect, useState } from 'react'
import Hint from '~components/Hint'
import SaveBtn from '~components/SaveBtn'
import { H1 } from '~components/ui/Typography'
import { LoadStatus, RequestPath, ResponseCode } from '~constants'
import type { FormattedElement, ReqParams, ReqResponse } from '~typings'
import { download } from '~utils'

type Wallpaper = Partial<{
  title: string
  desc: string
  date: string
  src: string
  alt: string
  source: string
}>

const transform = (data: FormattedElement[]) => {
  return data.reduce<Wallpaper>((prev, curr) => {
    const { tagName, attributes, textContent } = curr
    if (tagName === 'IMG') {
      return {
        ...prev,
        src: attributes.src,
        alt: attributes.alt,
      }
    } else if (textContent?.length) {
      if (attributes.class?.includes('title')) {
        return { ...prev, title: textContent[0] }
      } else if (attributes.class?.includes('typography')) {
        return { ...prev, desc: textContent[0] }
      } else if (tagName === 'P') {
        return { ...prev, date: textContent[0] }
      }
    }
    return prev
  }, {})
}

export default function Localhost() {
  const [wallpaper, setWallpaper] = useState<Wallpaper>({})
  const [loading, setLoading] = useState<LoadStatus>(LoadStatus.Init)

  const onSave = (param: Wallpaper) => {
    setLoading(LoadStatus.Loading)
    const url = new URL(param.source ?? '')
    const filename =
      param.title ||
      param.alt ||
      url.hostname + url.pathname.replaceAll('/', '_') + '_' + Date.now()
    download(param.src, filename).then(setLoading)
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (
        msg: ReqParams<FormattedElement[]>,
        sender,
        sendResp: (response: ReqResponse) => void,
      ) => {
        const result = { ...transform(msg.body ?? []), source: sender.url }
        setLoading(LoadStatus.Init)
        setWallpaper(result)
        if (msg.path === RequestPath.DownloadArt) {
          onSave(result)
        }
        sendResp({ code: ResponseCode.OK })
      },
    )
  }, [])

  if (!Object.keys(wallpaper).length) {
    return <Hint />
  }
  const { src, alt, title, desc, date } = wallpaper
  return (
    <div className="flex flex-col items-start gap-1">
      {src && <img width="100%" src={src} alt={alt} />}
      {title && <H1>{title}</H1>}
      {desc && <p>{desc}</p>}
      {date && (
        <p className="text-sm text-black/50 dark:text-white/50">{date}</p>
      )}
      {src && <SaveBtn status={loading} onClick={() => onSave(wallpaper)} />}
    </div>
  )
}
