export const SUPPORTED_ORIGINS = {
  localhost: "http://localhost:8000",
  yandere: "https://yande.re"
} as const

export const enum SendMessageResponseCode {
  OK = 200,
  InternalServerError = 500
}

export const enum SendMessagePath {
  DownloadArt = "/downloadArt",
  InspectArt = "/inspectArt"
}

export const enum ClickBehavior {
  Default = "Default",
  Inspect = "Inspect",
  Download = "Download"
}

export const enum Truthy {
  False,
  True
}
