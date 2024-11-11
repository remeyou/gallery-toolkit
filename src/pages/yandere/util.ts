import type { FormattedElement } from '~typings'
import type { Post } from './hook'

export function getFilename(param: Post) {
  const url = new URL(param.source ?? '')
  const filename =
    param.thumbPath?.replace('/', '_') ||
    url.hostname + url.pathname.replaceAll('/', '_')
  return filename
}

export const transform = (data: FormattedElement[]) => {
  return data.reduce<Post>((prev, curr) => {
    const { tagName, attributes, textContent } = curr
    if (
      tagName === 'IMG' &&
      attributes.class === 'preview' &&
      attributes.title
    ) {
      const infos = attributes.title.split(' ')
      const ratingIdx = infos.indexOf('Rating:')
      const scoreIdx = infos.indexOf('Score:')
      const tagsIdx = infos.indexOf('Tags:')
      const userIdx = infos.indexOf('User:')
      return {
        ...prev,
        preview: attributes.src,
        rating: infos[ratingIdx + 1],
        score: Number(infos[scoreIdx + 1]),
        tags: infos.slice(tagsIdx + 1, userIdx),
        user: infos[userIdx + 1],
      }
    } else if (tagName === 'A' && attributes.class === 'thumb') {
      return {
        ...prev,
        thumbPath: attributes.href,
      }
    } else if (
      tagName === 'SPAN' &&
      attributes.class === 'directlink-res' &&
      textContent?.length
    ) {
      return {
        ...prev,
        resolution: textContent[0],
      }
    } else if (
      tagName === 'A' &&
      attributes.class === 'directlink largeimg' &&
      attributes.href
    ) {
      return {
        ...prev,
        directLink: attributes.href.replace(
          'files.yande.re/jpeg',
          'files.yande.re/image',
        ),
      }
    }
    return prev
  }, {})
}
