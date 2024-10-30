import { useStorage } from '@plasmohq/storage/hook'
import $ from 'jquery'
import { useEffect } from 'react'
import {
  ClickBehavior,
  Origins,
  RequestPath,
  StorageKey,
  Z_INDEX_MAX,
} from '~constants'
import { formatElement, sendMessage } from '~lib/utils'
import type { FormSchema } from '~pages/settings'
import type { FormattedElement } from '~typings'

const collect = (elementSelector: string): Promise<JQuery<HTMLElement>> => {
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

const btnBaseStyle = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  padding: '4px 4px 4px 8px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '25%',
  opacity: 0,
  cursor: 'pointer',
}

const onBtnClick = (
  path: RequestPath,
  body: FormattedElement[],
  e: JQuery.ClickEvent,
) => {
  e.preventDefault()
  e.stopPropagation()
  sendMessage({
    path,
    body,
  })
}

const modify = (settings: FormSchema, els: JQuery) => {
  els.each((i, el) => {
    const $el = $(el)

    if (settings.showAllPosts && $el.is('.javascript-hide')) {
      $el.removeClass('javascript-hide')
    }

    const elInfo = formatElement(el)

    const $inspectBtn = $('<div>')
      .css(btnBaseStyle)
      .text('🔍')
      .on('click', onBtnClick.bind(null, RequestPath.Inspect, elInfo))
    const $downloadBtn = $('<div>')
      .css({ ...btnBaseStyle, right: `${8 + 38 * 1}px` })
      .text('💾')
      .on('click', onBtnClick.bind(null, RequestPath.Download, elInfo))

    const originalCSS = $el.css(['position', 'z-index'])
    const originalTransform = $el.css(['transform'])

    $el
      .off('mouseenter')
      .on('mouseenter', () => {
        $inspectBtn.css({ opacity: 1 })
        $downloadBtn.css({ opacity: 1 })
        if (settings.zoomCard) {
          const { width, height, top, left, right } = el.getBoundingClientRect()
          const ratio = document.documentElement.clientHeight / height
          const scaledTopOffset = (height / 2) * (ratio - 1) - top
          let scaledXOffset = 0
          const scaledWidthDiff = (width / 2) * (ratio - 1)
          if (scaledWidthDiff > left) {
            scaledXOffset = scaledWidthDiff - left
          } else if (
            scaledWidthDiff - (document.documentElement.clientWidth - right) >
            0
          ) {
            scaledXOffset =
              document.documentElement.clientWidth - right - scaledWidthDiff
          }
          $el.css({
            position: 'relative',
            'z-index': Z_INDEX_MAX,
            transform: `translate(${scaledXOffset}px, ${scaledTopOffset}px) scale(${ratio})`,
            transition: 'transform .25s .5s',
          })
        }
      })
      .off('mouseleave')
      .on('mouseleave', () => {
        $inspectBtn.css({ opacity: 0 })
        $downloadBtn.css({ opacity: 0 })
        if (settings.zoomCard) {
          $el.css({
            ...originalTransform,
            transition: 'transform .25s',
          })
          setTimeout(() => {
            $el.css(originalCSS)
          }, 250)
        }
      })
      .append(settings.showToolbar ? [$inspectBtn, $downloadBtn] : [])

    $el.off('click')
    switch (settings.clickBehavior) {
      case ClickBehavior.Inspect:
        $el.on('click', onBtnClick.bind(null, RequestPath.Inspect, elInfo))
        break
      case ClickBehavior.Download:
        $el.on('click', onBtnClick.bind(null, RequestPath.Download, elInfo))
        break
    }
  })
}

export const useContentScript = () => {
  const [formValues] = useStorage<FormSchema>(StorageKey.Settings, {
    clickBehavior: ClickBehavior.Default,
    showAllPosts: false,
    showToolbar: true,
    zoomCard: false,
  })

  useEffect(() => {
    switch (location.origin) {
      case Origins.Localhost:
        collect('.ant-card').then(modify.bind(null, formValues))
        break
      case Origins.Yandere:
        collect('#post-list-posts > li').then(modify.bind(null, formValues))
        break
    }
  }, [formValues])
}
