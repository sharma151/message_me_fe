import { AxiosResponse } from 'axios'
export interface AxiosResponseInterface<T> {
  data: AxioxInterface<T>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: any
}
export interface AxioxInterface<T> extends AxiosResponse<T> {
  message: string
}
