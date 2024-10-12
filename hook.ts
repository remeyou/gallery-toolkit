import $ from 'jquery'
import { useEffect } from 'react'
import { ClickBehavior, ORIGINS, RequestPath } from '~constants'
import type { FieldData } from '~pages/Settings'
import { sendMessage, stringifyElement } from '~utils'

const collect = (elementSelector: string): Promise<JQuery<Element>> => {
  const els = $(elementSelector)
  if (!els?.length) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(collect(elementSelector))
      }, 2000)
    })
  } else {
    return Promise.resolve(els)
  }
}

const baseStyle = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  padding: '4px 6px',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: '25%',
  opacity: 0,
  cursor: 'pointer',
}

const modify = (els: JQuery<Element>, options: FieldData) => {
  els.each((i, el) => {
    const $el = $(el)

    if (options.showAllPosts && $el.is('.javascript-hide')) {
      $el.removeClass('javascript-hide')
    }

    const elInfo = stringifyElement(el)
    const onInspectBtnClick = (
      e: JQuery.ClickEvent<Element, undefined, Element, Element>,
    ) => {
      e.preventDefault()
      e.stopPropagation()
      sendMessage({
        path: RequestPath.InspectArt,
        body: elInfo,
      })
    }
    const $inspectBtn = $('<div>')
      .css(baseStyle)
      .text('🔍')
      .on('click', onInspectBtnClick)
    const onDownloadBtnClick = (
      e: JQuery.ClickEvent<Element, undefined, Element, Element>,
    ) => {
      e.preventDefault()
      e.stopPropagation()
      sendMessage({
        path: RequestPath.DownloadArt,
        body: elInfo,
      })
    }
    const $downloadBtn = $('<div>')
      .css({ ...baseStyle, right: `${8 + 38 * 1}px` })
      .text('💾')
      .on('click', onDownloadBtnClick)

    $el
      .off('mouseenter')
      .on('mouseenter', () => {
        $inspectBtn.css({ opacity: 1 })
        $downloadBtn.css({ opacity: 1 })
      })
      .off('mouseleave')
      .on('mouseleave', () => {
        $inspectBtn.css({ opacity: 0 })
        $downloadBtn.css({ opacity: 0 })
      })
      .css({
        position: 'relative',
      })
      .append([$inspectBtn, $downloadBtn])
    switch (options.clickBehavior) {
      case ClickBehavior.Inspect:
        $el.off('click').on('click', onInspectBtnClick)
        break
      case ClickBehavior.Download:
        $el.off('click').on('click', onDownloadBtnClick)
        break
    }
  })
}

export const useContentScript = (options: FieldData) => {
  const exec = async () => {
    switch (location.origin) {
      case ORIGINS.localhost:
        modify(await collect('.ant-card'), options)
        break
      case ORIGINS.yandere:
        modify(await collect('#post-list-posts > li'), options)
        break
    }
  }

  useEffect(() => {
    exec()
  }, [options])
}
