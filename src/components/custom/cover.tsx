import { useEffect, useState } from 'react'
import { H5, Muted } from './typography'

interface Wallpaper {
  startdate: string
  fullstartdate: string
  enddate: string
  url: string
  urlbase: string
  copyright: string
  copyrightlink: string
  title: string
  quiz: string
  wp: boolean
  hsh: string
  drk: number
  top: number
  bot: number
  hs: any[]
}

export default function Cover() {
  const [wallpaper, setWallpaper] = useState<Wallpaper>()
  useEffect(() => {
    fetch(
      'http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=2222&mkt=en-WW',
    )
      .then((stream) => {
        return stream.json()
      })
      .then((json) => {
        setWallpaper(json.images[0])
      })
  }, [])
  if (!wallpaper) {
    return null
  }
  const { url, title, copyright, copyrightlink } = wallpaper
  return (
    <div
      className="group relative h-1/2 bg-cover bg-center"
      style={{ backgroundImage: `url("https://www.bing.com${url}")` }}
    >
      <div className="absolute bottom-0 bg-white/70 p-2 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-black/70">
        {<H5>{title}</H5>}
        {
          <Muted>
            <a className="hover:underline" href={copyrightlink} target="_blank">
              {copyright}
            </a>
          </Muted>
        }
      </div>
    </div>
  )
}
