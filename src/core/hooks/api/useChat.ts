import { useMutation, useQuery } from '@tanstack/react-query'
import ChatService from '@/core/services/chat.service'
import AuthService from '@/core/services/auth.service'
export const useChat = () => {
  const createChatRoomMutation = useMutation({
    mutationFn: async (receiverUserId: number) => {
      await ChatService.createChatRoom(receiverUserId)
    },
  })

  //FetchAllUsers
  const fetchAllUsers = useQuery({
    queryKey: ['users'],
    queryFn: ChatService.fetchAllUsers,
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
    fetchAllUsers: fetchAllUsers.data?.data,
    isFetchingAllUsers: fetchAllUsers.isFetching,
  }
}
