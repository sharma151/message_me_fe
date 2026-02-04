import type { AxiosError } from 'axios'

export const handleError = (exception: AxiosError) => {
  if (exception?.response?.data) {
    const error = exception?.response?.data as Record<string, unknown>
    if (error.errors && Object.keys(error.errors).length) {
      return { ...error.errors, statusCode: error.statusCode }
    } else if (error.message) {
      return { message: error.message }
    }
  } else {
    return { message: 'Something went wrong' }
  }
}
