import { SaveOutlined } from "@ant-design/icons"
import { Button, Col, Image, Row, Typography } from "antd"
import { saveAs } from "file-saver"
import { useEffect, useState } from "react"
import { SimpleResponse } from "~constants"
import type { StringifyNode } from "~utils"

type PaintInfo = Partial<{
  title: string
  desc: string
  date: string
  img: Partial<{
    src: string
    alt: string
  }>
  url: string
}>

export default function Localhost() {
  const [paintInfo, setPaintInfo] = useState<PaintInfo>({})
  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (msg: StringifyNode[], sender, sendResp) => {
        const result: PaintInfo = msg.reduce((prev, curr) => {
          if (curr.tagName === "IMG") {
            return {
              ...prev,
              img: { src: curr.attributes.src, alt: curr.attributes.alt }
            }
          } else if (
            curr.attributes.class?.includes("title") &&
            curr.textContent?.length
          ) {
            return { ...prev, title: curr.textContent[0] }
          } else if (
            curr.attributes.class?.includes("typography") &&
            curr.textContent?.length
          ) {
            return { ...prev, desc: curr.textContent[0] }
          } else if (curr.tagName === "P" && curr.textContent?.length) {
            return { ...prev, date: curr.textContent[0] }
          }
          return prev
        }, {})
        result.url = sender.url
        setPaintInfo(result)
        sendResp(SimpleResponse.Success)
      }
    )
  }, [])

  const onSave = () => {
    const url = new URL(paintInfo.url)
    const fileName =
      (paintInfo.title ||
        paintInfo.img.alt ||
        url.hostname + url.pathname.replaceAll("/", "_") + "_" + Date.now()) +
      ".jpg"
    saveAs(paintInfo.img.src, fileName)
  }

  if (!Object.keys(paintInfo).length) {
    return (
      <Typography.Paragraph>
        Anyone who paints has not been selected, Click 🔍︎ on the top right of a
        paint to continue.
      </Typography.Paragraph>
    )
  }
  return (
    <div>
      <Row>
        {paintInfo.img && (
          <Col span={24} order={0}>
            <Image src={paintInfo.img.src} alt={paintInfo.img.alt} />
          </Col>
        )}
        {paintInfo.title && (
          <Col span={24} order={1}>
            <Typography.Title level={4}>{paintInfo.title}</Typography.Title>
          </Col>
        )}
        {paintInfo.desc && (
          <Col span={24} order={2}>
            <Typography.Text>{paintInfo.desc}</Typography.Text>
          </Col>
        )}
        {paintInfo.date && (
          <Col span={24} order={3}>
            <Typography.Paragraph type="secondary">
              {paintInfo.date}
            </Typography.Paragraph>
          </Col>
        )}
      </Row>
      {paintInfo.img?.src && (
        <Button icon={<SaveOutlined />} onClick={onSave}>
          Save
        </Button>
      )}
    </div>
  )
}