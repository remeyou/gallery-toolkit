import { SaveOutlined } from "@ant-design/icons"
import { Button, Col, Image, Row, Space, Tag, Typography } from "antd"
import { useEffect, useState } from "react"
import { SendMessagePath, SendMessageResponseCode } from "~constants"
import type {
  SendMessageParams,
  SendMessageResponse,
  StringifyElement
} from "~typings"
import { downloadContent } from "~utils"
import Fallback from "./Fallback"

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

const onSave = (post: Post) => {
  const url = new URL(post.source ?? "")
  const filename =
    post.thumbPath?.replace("/", "_") ||
    url.hostname + url.pathname.replaceAll("/", "_")
  downloadContent(post.directLink, filename, post)
}

const transformInfo = (data: StringifyElement[]) => {
  return (data ?? []).reduce((prev, curr) => {
    const { tagName, attributes, textContent } = curr
    if (tagName === "IMG" && attributes?.class === "preview") {
      const infoList = attributes.title.split(" ")
      const ratingIdx = infoList.indexOf("Rating:")
      const scoreIdx = infoList.indexOf("Score:")
      const tagsIdx = infoList.indexOf("Tags:")
      const userIdx = infoList.indexOf("User:")
      return {
        ...prev,
        preview: attributes.src,
        rating: infoList[ratingIdx + 1],
        score: Number(infoList[scoreIdx + 1]),
        tags: infoList.slice(tagsIdx + 1, userIdx),
        user: infoList[userIdx + 1]
      }
    } else if (tagName === "A" && attributes?.class === "thumb") {
      return {
        ...prev,
        thumbPath: attributes.href
      }
    } else if (tagName === "SPAN" && attributes?.class === "directlink-res") {
      return {
        ...prev,
        resolution: textContent?.[0]
      }
    } else if (tagName === "A" && attributes?.class === "directlink largeimg") {
      return {
        ...prev,
        directLink: attributes.href.replace(
          "files.yande.re/jpeg",
          "files.yande.re/image"
        )
      }
    }
    return prev
  }, {}) as Post
}

export default function Yandere() {
  const [post, setPost] = useState<Post>({})
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
            setPost(result)
            break
          case SendMessagePath.DownloadArt:
            setPost(result)
            onSave(result)
            break
        }
        sendResp({ code: SendMessageResponseCode.OK })
      }
    )
  }, [])

  if (!Object.keys(post).length) {
    return <Fallback />
  }
  const {
    preview,
    thumbPath,
    resolution,
    rating,
    tags,
    score,
    user,
    directLink
  } = post
  return (
    <div>
      <Row>
        {preview && (
          <Col span={24} order={0}>
            <Image src={preview} alt={thumbPath} width="100%" />
          </Col>
        )}
        {thumbPath && (
          <Col span={24} order={1}>
            <Typography.Title level={4}>{thumbPath}</Typography.Title>
          </Col>
        )}
        {resolution && (
          <Col span={24} order={2}>
            <Space>
              <Typography.Text type="secondary">Resolution:</Typography.Text>
              <Typography.Text>{resolution}</Typography.Text>
            </Space>
          </Col>
        )}
        {rating && (
          <Col span={24} order={3}>
            <Space>
              <Typography.Text type="secondary">Rating:</Typography.Text>
              <Tag>{rating}</Tag>
            </Space>
          </Col>
        )}
        {!Number.isNaN(score) && (
          <Col span={24} order={4}>
            <Space>
              <Typography.Text type="secondary">Score:</Typography.Text>
              <Typography.Text>{score}</Typography.Text>
            </Space>
          </Col>
        )}
        {tags && (
          <Col span={24} order={5}>
            <Space wrap>
              <Typography.Text type="secondary">Tags:</Typography.Text>
              {tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          </Col>
        )}
        {user && (
          <Col span={24} order={6}>
            <Space>
              <Typography.Text type="secondary">User:</Typography.Text>
              <Typography.Text>{user}</Typography.Text>
            </Space>
          </Col>
        )}
        <Col span={24} order={7}>
          &nbsp;
        </Col>
        {directLink && (
          <Col span={24} order={8}>
            <Button icon={<SaveOutlined />} onClick={() => onSave(post)}>
              Save
            </Button>
          </Col>
        )}
      </Row>
    </div>
  )
}
