/** The origins that extension is available */
export enum Origins {
  Localhost = 'http://localhost:8000',
  Yandere = 'https://yande.re',
}

export const enum ResponseCode {
  Error,
  OK,
}

export const enum RequestPath {
  Inspect = '/inspect',
  Download = '/download',
}

export enum ClickBehavior {
  Default = 'default',
  Inspect = 'inspect',
  Download = 'download',
}

export const enum Truthy {
  False,
  True,
}

export const enum StorageKey {
  OptionsFormData = 'optionsFormData',
  UITheme = 'UITheme',
}

export const enum LoadStatus {
  Error,
  Success,
  Init,
  Loading,
}
