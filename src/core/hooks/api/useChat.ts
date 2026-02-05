import { useMutation, useQuery } from '@tanstack/react-query'
import ChatService from '@/core/services/chat.service'
export const useChat = () => {
  //FetchAllUsers
  const fetchAllUsers = useQuery({
    queryKey: ['AllUsers'],
    queryFn: ChatService.fetchAllUsers,
  })

  //FetchAvailableUsers
  const fetchAvailableUsers = useQuery({
    queryKey: ['available-users'],
    queryFn: ChatService.fetchAvailableUsers,
  })

  //Update UserName
  const updateUserName = useMutation({
    mutationFn: async (name: string) => {
      await ChatService.updateUserName(name)
    },
  })

  //fetch chats message
  const fetchChats = useMutation({
    mutationFn: async (chatId: number) => {
      await ChatService.fetchChats(chatId)
    },
  })

  //create Chat Room
  const createChatRoomMutation = useMutation({
    mutationFn: async (receiverUserId: number) => {
      await ChatService.createChatRoom(receiverUserId)
    },
    onSuccess: () => {
      fetchAvailableUsers.refetch()
    }
  })

  return {
    fetchAllUsers: fetchAllUsers.data,
    isFetchingAllUsers: fetchAllUsers.isFetching,
    fetchAvailableUsers: fetchAvailableUsers.data,
    isFetchingAvailableUsers: fetchAvailableUsers.isFetching,
    updateUserName: updateUserName.mutate,
    isUpdatingUserName: updateUserName.isPending,
    fetchChats: fetchChats.mutate,
    isFetchingChats: fetchChats.isPending,
    createChatRoom: createChatRoomMutation.mutate,
    isCreatingChatRoom: createChatRoomMutation.isPending,
  }
}
