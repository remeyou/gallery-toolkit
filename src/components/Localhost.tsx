import { SaveOutlined } from "@ant-design/icons"
import { Button, Col, Image, Row, Typography } from "antd"
import { saveAs } from "file-saver"
import { useEffect, useState } from "react"
import { SendMessagePath } from "~constants"
import type { SendMessageParams, StringifyElement } from "~typings"
import Fallback from "./Fallback"

type WallpaperInfo = Partial<{
  title: string
  desc: string
  date: string
  img: Partial<{
    src: string
    alt: string
  }>
  url: string
}>

const onSave = (wallpaper: WallpaperInfo) => {
  const url = new URL(wallpaper.url ?? "")
  const fileName =
    (wallpaper.title ||
      wallpaper.img?.alt ||
      url.hostname + url.pathname.replaceAll("/", "_") + "_" + Date.now()) +
    ".jpg"
  saveAs(wallpaper.img?.src ?? "", fileName)
}

const transformInfo = (data: StringifyElement[]): WallpaperInfo => {
  return data.reduce((prev, curr) => {
    if (curr.tagName === "IMG") {
      return {
        ...prev,
        img: { src: curr.attributes?.src, alt: curr.attributes?.alt }
      }
    } else if (
      curr.attributes?.class?.includes("title") &&
      curr.textContent?.length
    ) {
      return { ...prev, title: curr.textContent[0] }
    } else if (
      curr.attributes?.class?.includes("typography") &&
      curr.textContent?.length
    ) {
      return { ...prev, desc: curr.textContent[0] }
    } else if (curr.tagName === "P" && curr.textContent?.length) {
      return { ...prev, date: curr.textContent[0] }
    }
    return prev
  }, {})
}

export default function Localhost() {
  const [wallpaper, setWallpaperInfo] = useState<WallpaperInfo>({})
  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (msg: SendMessageParams<StringifyElement[]>, sender, sendResp) => {
        switch (msg.path) {
          case SendMessagePath.InspectArt:
            setWallpaperInfo({
              ...transformInfo(msg.data ?? []),
              url: sender.url
            })
            break
          case SendMessagePath.DownloadArt:
            const result = transformInfo(msg.data ?? [])
            result.url = sender.url
            setWallpaperInfo(result)
            onSave(result)
            break
        }
        sendResp()
      }
    )
  }, [])

  if (!Object.keys(wallpaper).length) {
    return <Fallback />
  }
  return (
    <div>
      <Row>
        {wallpaper.img && (
          <Col span={24} order={0}>
            <Image src={wallpaper.img.src} alt={wallpaper.img.alt} />
          </Col>
        )}
        {wallpaper.title && (
          <Col span={24} order={1}>
            <Typography.Title level={4}>{wallpaper.title}</Typography.Title>
          </Col>
        )}
        {wallpaper.desc && (
          <Col span={24} order={2}>
            <Typography.Text>{wallpaper.desc}</Typography.Text>
          </Col>
        )}
        {wallpaper.date && (
          <Col span={24} order={3}>
            <Typography.Paragraph type="secondary">
              {wallpaper.date}
            </Typography.Paragraph>
          </Col>
        )}
      </Row>
      {wallpaper.img?.src && (
        <Button icon={<SaveOutlined />} onClick={() => onSave(wallpaper)}>
          Save
        </Button>
      )}
    </div>
  )
}
