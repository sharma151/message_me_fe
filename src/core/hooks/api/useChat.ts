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

  //fetch chats message
  const fetchChats = useMutation({
    mutationFn: async (chatId: number) => {
      await ChatService.fetchChats(chatId)
    },
  })

  const chatMessagesQuery = useQuery({
    // The queryKey is vital; it acts as the "ID" for this specific chat's data
    queryKey: ['chats', chatId],
    queryFn: () => ChatService.fetchChats(chatId!),
    enabled: !!chatId,
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 mins
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
    fetchChats: fetchChats.mutate,
    isFetchingChats: fetchChats.isPending,
    messages: chatMessagesQuery.data || [],
    isLoadingMessages: chatMessagesQuery.isLoading,
    createChatRoom: createChatRoomMutation.mutate,
    isCreatingChatRoom: createChatRoomMutation.isPending,
    queryClient,
  }
}
