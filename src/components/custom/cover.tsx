import { useEffect, useState } from 'react'
import { H4, Muted } from './typography'

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
      className="relative h-1/2 bg-cover bg-center"
      style={{ backgroundImage: `url("https://www.bing.com${url}")` }}
    >
      <div className="absolute bottom-0 m-4 mb-0 bg-black/30 p-2">
        {<H4>{title}</H4>}
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
