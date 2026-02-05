import { handleError } from '@/utils/http.utils'
import type { AxiosError } from 'axios'
import httpBase from '@/core/services/httpBase'

class ChatService {
  //fetch chats messages
  static async fetchChats(chatId: number) {
    try {
      const response = await httpBase.post('/chats', { chatId })
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  //create Chat Room
  static async createChatRoom(userId: number) {
    try {
      const response = await httpBase.post('/chat/private', { userId })
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }
}
export default ChatService
