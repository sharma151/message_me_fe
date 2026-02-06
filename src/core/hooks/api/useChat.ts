import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ChatService from '@/core/services/chat.service'
export const useChat = (chatId?: number) => {
  const queryClient = useQueryClient()
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

  //Fetch Chats History
  const chatMessagesQuery = useQuery({
    queryKey: ['chats', chatId],
    queryFn: () => ChatService.fetchChats(chatId!),
    enabled: !!chatId,
    staleTime: 1000 * 60 * 5,
  })

  //create Chat Room
  const createChatRoomMutation = useMutation({
    mutationFn: async (receiverUserId: number) => {
      await ChatService.createChatRoom(receiverUserId)
    },
    onSuccess: () => {
      fetchAvailableUsers.refetch()
    },
  })

  return {
    fetchAllUsers: fetchAllUsers.data,
    isFetchingAllUsers: fetchAllUsers.isFetching,
    fetchAvailableUsers: fetchAvailableUsers.data,
    isFetchingAvailableUsers: fetchAvailableUsers.isFetching,
    updateUserName: updateUserName.mutate,
    isUpdatingUserName: updateUserName.isPending,
    messages: chatMessagesQuery.data || [],
    isLoadingMessages: chatMessagesQuery.isLoading,
    createChatRoom: createChatRoomMutation.mutate,
    isCreatingChatRoom: createChatRoomMutation.isPending,
    queryClient,
  }
}
