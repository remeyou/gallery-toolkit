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

export type StringifyNode = {
  tagName: string
  attributes: Record<string, string>
  textContent?: string[]
}

export function stringifyNode(el: Element): StringifyNode[] {
  let list = []
  const obj: StringifyNode = {
    tagName: el.tagName,
    attributes: el.attributes
      ? Object.fromEntries(
          Array.from(el.attributes).map((attr) => [attr.name, attr.value])
        )
      : null
  }
  if (el.childNodes) {
    Array.from(el.childNodes).map((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        list = [...list, ...stringifyNode(node as Element)]
      }
      if (node.nodeType === Node.TEXT_NODE) {
        obj.textContent
          ? obj.textContent.push(node.textContent)
          : (obj.textContent = [node.textContent])
      }
    })
  }
  list.push(obj)
  return list
}