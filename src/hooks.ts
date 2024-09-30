import { message } from "antd"
import { saveAs } from "file-saver"
import $ from "jquery"
import { useEffect } from "react"
import { SUPPORTED_ORIGINS, SimpleResponse } from "~constants"
import { stringifyNode } from "~utils"

export const useContentScript = () => {
  const collectEls = (): Promise<NodeListOf<Element>> => {
    if (location.origin === SUPPORTED_ORIGINS.localhost) {
      const els = document.querySelectorAll(".ant-card")
      if (!els.length) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(collectEls())
          }, 2000)
        })
      } else {
        return Promise.resolve(els)
      }
    }
  }
  const modifyEls = (els: NodeListOf<Element>) => {
    els.forEach((el) => {
      const baseStyle = {
        position: "absolute",
        top: "8px",
        right: "8px",
        padding: "4px 6px",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: "50%",
        opacity: 0,
        cursor: "pointer"
      }
      const elContentList = stringifyNode(el)

      const $inspectBtn = $("<div>")
        .css(baseStyle)
        .text("🔍︎")
        .on("click", () => {
          const flag = setTimeout(() => {
            message.warning("Please open side panel first.")
          }, 1000)
          chrome.runtime.sendMessage(elContentList, (resp) => {
            if (resp === SimpleResponse.Success) {
              clearTimeout(flag)
            }
          })
        })

      const $downloadBtn = $("<div>")
        .css({ ...baseStyle, right: `${8 + 38 * 1}px` })
        .text("📥")
        .on("click", () => {
          const img = elContentList.find((o) => o.tagName === "IMG")
          const fileName =
            (img.attributes.title ||
              img.attributes.alt ||
              location.hostname +
                location.pathname.replaceAll("/", "_") +
                "_" +
                Date.now()) + ".jpg"
          saveAs(img.attributes.src, fileName)
        })

      $(el)
        .on("mouseenter", () => {
          $inspectBtn.css({ opacity: 1 })
          $downloadBtn.css({ opacity: 1 })
        })
        .on("mouseleave", () => {
          $inspectBtn.css({ opacity: 0 })
          $downloadBtn.css({ opacity: 0 })
        })
        .css({
          position: "relative"
        })
        .append([$inspectBtn, $downloadBtn])
    })
  }
  const exec = async () => {
    try {
      const els = await collectEls()
      modifyEls(els)
    } catch (error) {
      console.error("useContentScript error", error)
    }
  }
  useEffect(() => {
    exec()
  }, [])
}
