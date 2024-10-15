import { clsx, type ClassValue } from 'clsx'
import { saveAs } from 'file-saver'
import $ from 'jquery'
import { twMerge } from 'tailwind-merge'
import { LoadStatus, ResponseCode } from '~constants'
import type { FormattedElement, ReqParams, ReqResponse } from '~typings'

/** Combine Class */
export function cc(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatElement = (el: Element): FormattedElement[] => {
  let list: FormattedElement[] = []
  const obj: FormattedElement = {
    tagName: el.tagName,
    attributes: Object.fromEntries(
      Array.from(el.attributes).map((attr) => [attr.name, attr.value]),
    ),
  }
  if (el.childNodes) {
    Array.from(el.childNodes).map((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        obj.textContent
          ? obj.textContent.push(node.textContent)
          : (obj.textContent = [node.textContent])
      }
    })
  }
  if (el.children) {
    Array.from(el.children).forEach((child) => {
      list = [...list, ...formatElement(child)]
    })
  }
  list.push(obj)
  return list
}

export const sendMessage = async <T = unknown, R = unknown>(
  msg: ReqParams<T>,
): Promise<ReqResponse<R> | undefined> => {
  try {
    return await new Promise((resolve, reject) => {
      const timeLimit = setTimeout(() => {
        reject('Gallery Toolkit: Did you open the side panel?')
      }, 500)
      chrome.runtime.sendMessage(msg, (resp: ReqResponse<R>) => {
        clearTimeout(timeLimit)
        resp?.code === ResponseCode.OK ? resolve(resp) : reject(resp)
      })
    })
  } catch (error) {
    console.error('sendMessage error: ', error)
    const toast = $('<div>')
      .css({
        position: 'fixed',
        top: '32px',
        right: '32px',
        border: '1px solid red',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      })
      .text(typeof error === 'string' ? error : JSON.stringify(error, null, 2))
      .appendTo(document.body)
    setTimeout(() => {
      toast.fadeOut('slow', () => {
        toast.remove()
      })
    }, 3000)
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

export const includes = <T = unknown>(
  array: T[],
  element: any,
): element is T => {
  return array.includes(element)
}
