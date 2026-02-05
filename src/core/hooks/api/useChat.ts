import { useMutation } from '@tanstack/react-query'
import ChatService from '@/core/services/chat.service'
export const useChat = () => {
  const createChatRoomMutation = useMutation({
    mutationFn: async (userId: number) => {
      await ChatService.createChatRoom(userId)
    },
  })

  //fetch chats message
  const fetchChats = useMutation({
    mutationFn: async (chatId: number) => {
      await ChatService.fetchChats(chatId)
    },
  })

  return {
    createChatRoom: createChatRoomMutation.mutate,
    isCreatingChatRoom: createChatRoomMutation.isPending,
    fetchChats: fetchChats.mutate,
    isFetchingChats: fetchChats.isPending,
  }
}
