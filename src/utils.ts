import type { SendMessageParams, StringifyElement } from "~typings"

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

export const sendMessageToExtension = <T = unknown>(
  msg: SendMessageParams<T>,
  timeout: number = 1000
) => {
  return new Promise((resolve, reject) => {
    const flag = setTimeout(() => {
      reject("Gallery Toolkit: sendMessageToExtension timeout.")
    }, timeout)
    chrome.runtime.sendMessage(msg, (resp) => {
      clearTimeout(flag)
      resolve(resp)
    })
  })
}
