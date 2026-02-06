import { AxiosResponse } from 'axios'
export interface AxiosResponseInterface<T> {
  data: AxiosInterface<T>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: any
}
export interface AxiosInterface<T> extends AxiosResponse<T> {
  message: string
}

export interface AvailableUsersResponse {
  chatId: number
  name: null | string
  isGroup: boolean
  receiverId: null | number
  receiverName: null | string
  message: null | string
}
