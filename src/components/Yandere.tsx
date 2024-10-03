import { SaveOutlined } from "@ant-design/icons"
import {
  Button,
  Col,
  Image,
  message,
  Modal,
  Row,
  Space,
  Tag,
  Typography
} from "antd"
import saveAs from "file-saver"
import { useEffect, useState } from "react"
import { SendMessagePath } from "~constants"
import type { SendMessageParams, StringifyElement } from "~typings"
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
  url: string
}>

const onSave = (post: Post) => {
  if (!post.directLink) {
    Modal.error({
      title: "Download error",
      content: "The download link was not existing."
    })
    return
  }
  const url = new URL(post.url ?? "")
  const filename =
    post.thumbPath?.replace("/", "_") ||
    url.hostname + url.pathname.replaceAll("/", "_")
  message.info("Staring download...")
  saveAs(post.directLink, filename)
}

const transformInfo = (data: StringifyElement[]): Post => {
  return (data ?? []).reduce((prev, curr): Post => {
    if (curr.tagName === "IMG" && curr.attributes?.class === "preview") {
      const infoList = curr.attributes.title.split(" ")
      const ratingIdx = infoList.indexOf("Rating:")
      const scoreIdx = infoList.indexOf("Score:")
      const tagsIdx = infoList.indexOf("Tags:")
      const userIdx = infoList.indexOf("User:")
      return {
        ...prev,
        preview: curr.attributes.src,
        rating: infoList[ratingIdx + 1],
        score: Number(infoList[scoreIdx + 1]),
        tags: infoList.slice(tagsIdx + 1, userIdx),
        user: infoList[userIdx + 1]
      }
    } else if (curr.tagName === "A" && curr.attributes?.class === "thumb") {
      return {
        ...prev,
        thumbPath: curr.attributes.href
      }
    } else if (
      curr.tagName === "SPAN" &&
      curr.attributes?.class === "directlink-res"
    ) {
      return {
        ...prev,
        resolution: curr.textContent?.[0]
      }
    } else if (
      curr.tagName === "A" &&
      curr.attributes?.class === "directlink largeimg"
    ) {
      return {
        ...prev,
        directLink: curr.attributes.href.replace(
          "files.yande.re/jpeg",
          "files.yande.re/image"
        )
      }
    }
    return prev
  }, {})
}

export default function Yandere() {
  const [postInfo, setPostInfo] = useState<Post>({})
  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (msg: SendMessageParams<StringifyElement[]>, sender, sendResp) => {
        switch (msg.path) {
          case SendMessagePath.InspectArt:
            setPostInfo({ ...transformInfo(msg.data ?? []), url: sender.url })
            break
          case SendMessagePath.DownloadArt:
            const post = transformInfo(msg.data ?? [])
            post.url = sender.url
            setPostInfo(post)
            onSave(post)
            break
        }
        sendResp()
      }
    )
  }, [])

  if (!Object.keys(postInfo).length) {
    return <Fallback />
  }
  return (
    <div>
      <Row>
        {postInfo.preview && (
          <Col span={24} order={0}>
            <Image
              src={postInfo.preview}
              alt={postInfo.thumbPath}
              width="100%"
            />
          </Col>
        )}
        {postInfo.thumbPath && (
          <Col span={24} order={1}>
            <Typography.Title level={4}>{postInfo.thumbPath}</Typography.Title>
          </Col>
        )}
        {postInfo.resolution && (
          <Col span={24} order={2}>
            <Space>
              <Typography.Text type="secondary">Resolution:</Typography.Text>
              <Typography.Text>{postInfo.resolution}</Typography.Text>
            </Space>
          </Col>
        )}
        {postInfo.rating && (
          <Col span={24} order={3}>
            <Space>
              <Typography.Text type="secondary">Rating:</Typography.Text>
              <Tag>{postInfo.rating}</Tag>
            </Space>
          </Col>
        )}
        {postInfo.score && (
          <Col span={24} order={4}>
            <Space>
              <Typography.Text type="secondary">Score:</Typography.Text>
              <Typography.Text>{postInfo.score}</Typography.Text>
            </Space>
          </Col>
        )}
        {postInfo.tags && (
          <Col span={24} order={5}>
            <Space wrap>
              <Typography.Text type="secondary">Tags:</Typography.Text>
              {postInfo.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          </Col>
        )}
        {postInfo.user && (
          <Col span={24} order={6}>
            <Space>
              <Typography.Text type="secondary">User:</Typography.Text>
              <Typography.Text>{postInfo.user}</Typography.Text>
            </Space>
          </Col>
        )}
        <Col span={24} order={7}>
          &nbsp;
        </Col>
        {postInfo.directLink && (
          <Col span={24} order={8}>
            <Button icon={<SaveOutlined />} onClick={() => onSave(postInfo)}>
              Save
            </Button>
          </Col>
        )}
      </Row>
    </div>
  )
}
