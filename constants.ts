/** The origins what extension available */
export const ORIGINS = {
  localhost: 'http://localhost:8000',
  yandere: 'https://yande.re',
}

export const enum ResponseCode {
  OK = 200,
  InternalServerError = 500,
}

export const enum RequestPath {
  DownloadArt = '/downloadArt',
  InspectArt = '/inspectArt',
}

export const enum ClickBehavior {
  Default = 'Default',
  Inspect = 'Inspect',
  Download = 'Download',
}

export const enum Truthy {
  False,
  True,
}

export const enum StorageKey {
  OptionsFormData = 'OPTIONS_FORM_DATA',
}

export const enum LoadStatus {
  Error,
  Success,
  Init,
  Loading,
}
