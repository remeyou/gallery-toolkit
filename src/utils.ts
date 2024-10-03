import { message, Modal } from "antd"
import saveAs from "file-saver"
import { SendMessageResponseCode } from "~constants"
import type {
  SendMessageParams,
  SendMessageResponse,
  StringifyElement
} from "~typings"

export function checkDarkMode() {
  // Check if the browser supports prefers-color-scheme
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    console.log("Dark mode is supported and active.")
    return true
  } else {
    console.log("Dark mode is either not supported or not active.")
    return false
  }
}

export const stringifyFlattenElement = (el: Element): StringifyElement[] => {
  let list: StringifyElement[] = []
  const obj: StringifyElement = {
    tagName: el.tagName,
    attributes: el.attributes
      ? Object.fromEntries(
          Array.from(el.attributes).map((attr) => [attr.name, attr.value])
        )
      : undefined
  }
  if (el.childNodes) {
    Array.from(el.childNodes).map((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        list = [...list, ...stringifyFlattenElement(node as Element)]
      }
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        obj.textContent
          ? obj.textContent.push(node.textContent)
          : (obj.textContent = [node.textContent])
      }
    })
  }
  list.push(obj)
  return list
}

type Response<R> = SendMessageResponse<R> | undefined
export const sendMessageToExtension = <T = unknown, R = unknown>(
  msg: SendMessageParams<T>
): Promise<Response<R>> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, (resp: Response<R>) => {
      if (resp?.code === SendMessageResponseCode.OK) {
        resolve(resp)
      }
      reject(resp)
    })
  })
    .then((v) => {
      return v as Response<R>
    })
    .catch((r) => {
      if (!r) {
        message.warning(
          "Gallery Toolkit: sendMessageToExtension responds nothing; did you open the side panel?"
        )
      }
      return Promise.reject(r)
    })
}

export const downloadContent = (
  data?: Blob | string,
  filename?: string,
  errorInfo?: unknown
) => {
  if (!data) {
    Modal.error({
      title: "Download error",
      content:
        "The download link was not existing; check the browser developer tool console for more info."
    })
    console.error("Download error", errorInfo)
    return
  }
  message.info("Staring download...")
  saveAs(data, filename)
}
