import { handleError } from '@/utils/http.utils'
import type { AxiosError } from 'axios'
import httpBase from '@/core/services/httpBase'

class ChatService {
  // fetchAllUsers
  static async fetchAllUsers() {
    try {
      const response = await httpBase.get('/users')
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  //fetchAvailableUsers
  static async fetchAvailableUsers() {
    try {
      const response = await httpBase.get('/users/chat')
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  //Update UserName
  static async updateUserName(name: string) {
    try {
      const response = await httpBase.put('/users/update-profile', { name })
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  //fetch chats messages
  static async fetchChats(chatId: number) {
    try {
      const response = await httpBase.post('/chat/messages', { chatId })
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  //create Chat Room
  static async createChatRoom(receiverUserId: number) {
    try {
      const response = await httpBase.post('/chat/private', { receiverUserId })
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }
}
export default ChatService
