import { useStorage } from '@plasmohq/storage/hook'
import $ from 'jquery'
import { useEffect } from 'react'
import { ClickBehavior, Origins, RequestPath, StorageKey } from '~constants'
import { formatElement, sendMessage } from '~lib/utils'
import type { FormSchema } from '~pages/settings'

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
  padding: '4px 6px',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  borderRadius: '25%',
  opacity: 0,
  cursor: 'pointer',
}

const modify = (els: JQuery<HTMLElement>, settings: FormSchema) => {
  els.each((i, el) => {
    const $el = $(el)

    if (settings.showAllPosts && $el.is('.javascript-hide')) {
      $el.removeClass('javascript-hide')
    }

    const elInfo = formatElement(el)
    const onInspectBtnClick = (
      e: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>,
    ) => {
      e.preventDefault()
      e.stopPropagation()
      sendMessage({
        path: RequestPath.Inspect,
        body: elInfo,
      })
    }
    const $inspectBtn = $('<div>')
      .css(btnBaseStyle)
      .text('🔍')
      .on('click', onInspectBtnClick)
    const onDownloadBtnClick = (
      e: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>,
    ) => {
      e.preventDefault()
      e.stopPropagation()
      sendMessage({
        path: RequestPath.Download,
        body: elInfo,
      })
    }
    const $downloadBtn = $('<div>')
      .css({ ...btnBaseStyle, right: `${8 + 38 * 1}px` })
      .text('💾')
      .on('click', onDownloadBtnClick)

    $el
      .off('mouseenter')
      .on('mouseenter', () => {
        $inspectBtn.css({ opacity: 1 })
        $downloadBtn.css({ opacity: 1 })
        if (settings.zoomCard) {
          $el.css({
            'z-index': Number.MAX_SAFE_INTEGER,
            transform: `scale(${settings.zoomLevel / 100})`,
            transition: 'transform .25s .5s',
          })
        }
      })
      .off('mouseleave')
      .on('mouseleave', () => {
        $inspectBtn.css({ opacity: 0 })
        $downloadBtn.css({ opacity: 0 })
        $el.css({
          'z-index': 'unset',
          transform: 'scale(1)',
          transition: 'none',
        })
      })
      .css({
        position: 'relative',
        'transform-origin': 'center center',
      })
      .append(settings.showToolbar ? [$inspectBtn, $downloadBtn] : [])
    switch (settings.clickBehavior) {
      case ClickBehavior.Inspect:
        $el.off('click').on('click', onInspectBtnClick)
        break
      case ClickBehavior.Download:
        $el.off('click').on('click', onDownloadBtnClick)
        break
      default:
        $el.off('click')
    }
  })
}

export const useContentScript = () => {
  const [formValues] = useStorage<FormSchema>(StorageKey.Settings, {
    clickBehavior: ClickBehavior.Default,
    showAllPosts: false,
    showToolbar: true,
    zoomCard: false,
    zoomLevel: 105,
  })

  const exec = async () => {
    switch (location.origin) {
      case Origins.Localhost:
        modify(await collect('.ant-card'), formValues)
        break
      case Origins.Yandere:
        modify(await collect('#post-list-posts > li'), formValues)
        break
    }
  }

  useEffect(() => {
    exec()
  }, [formValues])
}
