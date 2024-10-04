import $ from "jquery"
import { useEffect } from "react"
import { ClickBehavior, SUPPORTED_ORIGINS, SendMessagePath } from "~constants"
import { sendMessageToExtension, stringifyFlattenElement } from "~utils"

const collectEls = (elementSelector: string): Promise<JQuery<Element>> => {
  const els = $(elementSelector)
  if (!els?.length) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(collectEls(elementSelector))
      }, 2000)
    })
  } else {
    return Promise.resolve(els)
  }
}

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

const modifyEls = (
  els: JQuery<Element>,
  defaultClickBehavior: ClickBehavior
) => {
  els.each((i, el) => {
    const $el = $(el)

    if ($el.is(".javascript-hide")) {
      $el.removeClass("javascript-hide")
    }

    const elInfo = stringifyFlattenElement(el)
    const onInspectBtnClick = (
      e: JQuery.ClickEvent<Element, undefined, Element, Element>
    ) => {
      e.preventDefault()
      e.stopPropagation()
      sendMessageToExtension({
        path: SendMessagePath.InspectArt,
        data: elInfo
      })
    }
    const $inspectBtn = $("<div>")
      .css(baseStyle)
      .text("🔍")
      .on("click", onInspectBtnClick)
    const onDownloadBtnClick = (
      e: JQuery.ClickEvent<Element, undefined, Element, Element>
    ) => {
      e.preventDefault()
      e.stopPropagation()
      sendMessageToExtension({
        path: SendMessagePath.DownloadArt,
        data: elInfo
      })
    }
    const $downloadBtn = $("<div>")
      .css({ ...baseStyle, right: `${8 + 38 * 1}px` })
      .text("💾")
      .on("click", onDownloadBtnClick)

    $el
      .off("mouseenter")
      .on("mouseenter", () => {
        $inspectBtn.css({ opacity: 1 })
        $downloadBtn.css({ opacity: 1 })
      })
      .off("mouseleave")
      .on("mouseleave", () => {
        $inspectBtn.css({ opacity: 0 })
        $downloadBtn.css({ opacity: 0 })
      })
      .css({
        position: "relative"
      })
      .append([$inspectBtn, $downloadBtn])
    switch (defaultClickBehavior) {
      case ClickBehavior.Inspect:
        $el.off("click").on("click", onInspectBtnClick)
        break
      case ClickBehavior.Download:
        $el.off("click").on("click", onDownloadBtnClick)
        break
    }
  })
}

export const useContentScript = (defaultClickBehavior: ClickBehavior) => {
  const exec = async () => {
    switch (location.origin) {
      case SUPPORTED_ORIGINS.localhost:
        modifyEls(await collectEls(".ant-card"), defaultClickBehavior)
        break
      case SUPPORTED_ORIGINS.yandere:
        modifyEls(
          await collectEls("#post-list-posts > li"),
          defaultClickBehavior
        )
        break
    }
  }

  useEffect(() => {
    exec()
  }, [defaultClickBehavior])
}
