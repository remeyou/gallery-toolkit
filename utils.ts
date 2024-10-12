import { clsx, type ClassValue } from 'clsx'
import { saveAs } from 'file-saver'
import $ from 'jquery'
import { twMerge } from 'tailwind-merge'
import { LoadStatus, ResponseCode } from '~constants'
import type { ReqParams, ReqResponse, StringifyElement } from '~typings'

/** Combine Class */
export function cc(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const stringifyElement = (el: Element): StringifyElement[] => {
  let list: StringifyElement[] = []
  const obj: StringifyElement = {
    tagName: el.tagName,
    attributes: el.attributes
      ? Object.fromEntries(
          Array.from(el.attributes).map((attr) => [attr.name, attr.value]),
        )
      : undefined,
  }
  if (el.childNodes) {
    Array.from(el.childNodes).map((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        list = [...list, ...stringifyElement(node as Element)]
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

type Response<R> = ReqResponse<R> | undefined
export const sendMessage = async <T = unknown, R = unknown>(
  msg: ReqParams<T>,
): Promise<Response<R>> => {
  try {
    return await new Promise((resolve, reject) => {
      const timeLimit = setTimeout(() => {
        reject('Gallery Toolkit: Did you open the side panel?')
      }, 500)
      chrome.runtime.sendMessage(msg, (resp: Response<R>) => {
        clearTimeout(timeLimit)
        resp?.code === ResponseCode.OK ? resolve(resp) : reject(resp)
      })
    })
  } catch (err) {
    const toast = $('<div>')
      .css({
        position: 'fixed',
        top: '32px',
        right: '32px',
        border: '1px solid red',
        padding: '16px',
        backgroundColor: 'lightgray',
        color: 'black',
      })
      .text(String(err))
      .appendTo(document.body)
    setTimeout(() => {
      toast.fadeOut('slow', () => {
        toast.remove()
      })
    }, 3000)
    return Promise.reject(err)
  }
}

export const download = async (url?: string, filename?: string) => {
  try {
    if (!url) {
      throw new Error('The url did not exist.')
    }
    const resp = await fetch(url)
    const blob = await resp.blob()
    saveAs(blob, filename)
    return LoadStatus.Success
  } catch (r) {
    console.error(`download() failed:
      The params are: ${url}, ${filename}.
      The reason was: ${r}`)
    return LoadStatus.Error
  }
}
