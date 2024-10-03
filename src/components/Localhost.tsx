import { SaveOutlined } from "@ant-design/icons"
import { Button, Col, Image, Row, Typography } from "antd"
import { useEffect, useState } from "react"
import { SendMessagePath, SendMessageResponseCode } from "~constants"
import type {
  SendMessageParams,
  SendMessageResponse,
  StringifyElement
} from "~typings"
import { downloadContent } from "~utils"
import Fallback from "./Fallback"

type WallpaperInfo = Partial<{
  title: string
  desc: string
  date: string
  src: string
  alt: string
  source: string
}>

const onSave = (wallpaper: WallpaperInfo) => {
  const url = new URL(wallpaper.source ?? "")
  const filename =
    wallpaper.title ||
    wallpaper.alt ||
    url.hostname + url.pathname.replaceAll("/", "_") + "_" + Date.now()
  downloadContent(wallpaper.src, filename, wallpaper)
}

const transformInfo = (data: StringifyElement[]) => {
  return data.reduce((prev, curr) => {
    const { tagName, attributes, textContent } = curr
    if (tagName === "IMG") {
      return {
        ...prev,
        src: attributes?.src,
        alt: attributes?.alt
      }
    } else if (attributes?.class?.includes("title") && textContent?.length) {
      return { ...prev, title: textContent[0] }
    } else if (
      attributes?.class?.includes("typography") &&
      textContent?.length
    ) {
      return { ...prev, desc: textContent[0] }
    } else if (tagName === "P" && textContent?.length) {
      return { ...prev, date: textContent[0] }
    }
    return prev
  }, {}) as WallpaperInfo
}

export default function Localhost() {
  const [wallpaper, setWallpaper] = useState<WallpaperInfo>({})
  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (
        msg: SendMessageParams<StringifyElement[]>,
        sender,
        sendResp: (response: SendMessageResponse) => void
      ) => {
        const result = { ...transformInfo(msg.data ?? []), source: sender.url }
        switch (msg.path) {
          case SendMessagePath.InspectArt:
            setWallpaper(result)
            break
          case SendMessagePath.DownloadArt:
            setWallpaper(result)
            onSave(result)
            break
        }
        sendResp({ code: SendMessageResponseCode.OK })
      }
    )
  }, [])

  if (!Object.keys(wallpaper).length) {
    return <Fallback />
  }
  const { src, alt, title, desc, date } = wallpaper
  return (
    <div>
      <Row>
        {src && (
          <Col span={24} order={0}>
            <Image src={src} alt={alt} />
          </Col>
        )}
        {title && (
          <Col span={24} order={1}>
            <Typography.Title level={4}>{title}</Typography.Title>
          </Col>
        )}
        {desc && (
          <Col span={24} order={2}>
            <Typography.Text>{desc}</Typography.Text>
          </Col>
        )}
        {date && (
          <Col span={24} order={3}>
            <Typography.Paragraph type="secondary">{date}</Typography.Paragraph>
          </Col>
        )}
      </Row>
      {src && (
        <Button icon={<SaveOutlined />} onClick={() => onSave(wallpaper)}>
          Save
        </Button>
      )}
    </div>
  )
}
