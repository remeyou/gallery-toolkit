/** The origins what extension available */
export enum Origins {
  Localhost = 'http://localhost:8000',
  Yandere = 'https://yande.re',
}

export const enum ResponseCode {
  OK = 200,
  Error = 500,
}

export const enum RequestPath {
  DownloadArt = '/downloadArt',
  InspectArt = '/inspectArt',
}

export enum ClickBehavior {
  Default = 'Default',
  Inspect = 'Inspect',
  Download = 'Download',
}

export const enum Truthy {
  False,
  True,
}

export const enum StorageKey {
  OptionsFormData = 'optionsFormData',
  UiTheme = 'uiTheme',
}

export const enum LoadStatus {
  Error,
  Success,
  Init,
  Loading,
}
