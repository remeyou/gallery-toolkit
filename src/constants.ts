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

export const enum StorageKey {
  Settings = 'settings',
  Theme = 'theme',
}

export const enum LoadStatus {
  Error,
  Success,
  Init,
  Loading,
}

// 2**31 - 1
export const Z_INDEX_MAX = 2147483647
