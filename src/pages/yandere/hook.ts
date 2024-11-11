import { useEffect, useState } from 'react'
import { LoadStatus, Origins, RequestPath, ResponseCode } from '~constants'
import { download } from '~lib/utils'
import type { ReqParams, ReqResponse } from '~typings'
import { getFilename, transform } from './util'

export type Post = Partial<{
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

export type Pool = (Post & {
  status?: LoadStatus
})[]

export function useData() {
  const [post, setPost] = useState<Post>({})
  const [postLoading, setPostLoading] = useState<LoadStatus>(LoadStatus.Init)
  const onSave = (param: Post) => {
    setPostLoading(LoadStatus.Loading)
    const filename = getFilename(param)
    return download(param.directLink, filename).then(setPostLoading)
  }

  const [pool, setPool] = useState<Pool>([])
  const [poolLoading, setPoolLoading] = useState<LoadStatus>(LoadStatus.Init)
  const onSavePool = async (idx: number, once?: boolean) => {
    setPoolLoading(LoadStatus.Loading)
    const curr = pool[idx]
    const filename = getFilename(curr)
    const status = await download(curr.directLink, filename)
    setPool((prev) => {
      const next = [...prev]
      next[idx].status = status
      return next
    })
    if (idx < pool.length - 1 && !once) {
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

  return {
    post,
    postLoading,
    pool,
    poolLoading,
    onSave,
    onSavePool,
  }
}
