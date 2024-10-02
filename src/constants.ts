export const SUPPORTED_ORIGINS = {
  localhost: "http://localhost:8000",
  yandere: "https://yande.re"
}

export const enum SimpleResponse {
  Success = 1,
  Error
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
