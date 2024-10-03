export type StringifyElement = Partial<{
  tagName: string
  attributes: Record<string, string>
  textContent: string[]
}>

export interface SendMessageParams<T = null> {
  path: string
  data?: T
}

export interface SendMessageResponse<T = null> {
  code: number
  data?: T
}
