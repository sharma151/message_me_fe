import { handleError } from '@/utils/http.utils'
import type { AxiosError } from 'axios'
import httpBase from '@/core/services/httpBase'
interface CreateGroupChatData {
  chatName: string
  receiverUserId: number[]
}

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
  static async fetchAvailableUsers(search?: string) {
    try {
      const response = await httpBase.get('/users/chat/available', {
        params: { search },
      })
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  static async fetchArchivedUsers() {
    try {
      const response = await httpBase.get('/chat/archived')
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
  //Delete Chat
  static async deleteChat(chatId: number) {
    try {
      const response = await httpBase.delete(`/chat/${chatId}`)
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

  //create Group chat Room

  static async createGroupChatRoom(data: CreateGroupChatData) {
    try {
      // We pass 'data' as the second argument
      const response = await httpBase.post('/chat/group', data)
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  //Delete Message
  static async deleteMessage(msgId: number, chatId: number) {
    try {
      const response = await httpBase.delete(`/chat/${msgId}/${chatId}`)
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }
  //Edit Message

  static async editMessage(msgId: number, chatId: number, content: string) {
    try {
      const response = await httpBase.patch(`/chat/${msgId}/${chatId}`, {
        content,
      })
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  //Archieve Chat
  static async archieveChat(chatId: number) {
    try {
      const response = await httpBase.patch(`/chat/${chatId}/archive`)
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }
  //Unarchieve Chat
  static async unarchieveChat(chatId: number) {
    try {
      const response = await httpBase.patch(`/chat/${chatId}/unarchive`)
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }
  //Add User to Group Chat
  static async addUserToGroupChat(chatId: number, userId: number) {
    try {
      const response = await httpBase.post(`/chat/${chatId}/members`, {
        userId,
      })
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  //Remove User from Group Chat
  static async removeUserFromGroupChat(chatId: number, userId: number) {
    try {
      const response = await httpBase.delete(
        `/chat/${chatId}/members/${userId}`,
      )
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }
}
export default ChatService
