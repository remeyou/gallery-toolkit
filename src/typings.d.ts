export type FormattedElement = {
  tagName: string
  attributes: Record<string, string | undefined>
  textContent?: string[]
}

export interface ReqParams<T = null> {
  path: number
  body?: T
}

export interface ReqResponse<T = null> {
  code: number
  data?: T
}
