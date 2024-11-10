export type FormattedElement = {
  tagName: string
  attributes: Record<string, string | undefined>
  textContent?: string[]
}

export interface ReqParams<T = unknown> {
  path: number
  body?: T
}

export interface ReqResponse<T = unknown> {
  code: number
  data?: T
}
