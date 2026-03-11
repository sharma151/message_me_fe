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

  //Delete message
  const deleteMessage = useMutation({
    mutationFn: ({ msgId, chatId }: { msgId: number; chatId: number }) =>
      ChatService.deleteMessage(msgId, chatId),
    onSuccess: () => {
      chatMessagesQuery.refetch()
    },
  })
  //Edit Message
  const editMessage = useMutation({
    mutationFn: ({
      msgId,
      chatId,
      content,
    }: {
      msgId: number
      chatId: number
      content: string
    }) => {
      return ChatService.editMessage(msgId, chatId, content)
    },
    onSuccess: () => {
      chatMessagesQuery.refetch
    },
  })

  return {
    fetchAllUsers: fetchAllUsers.data,
    isFetchingAllUsers: fetchAllUsers.isFetching,
    fetchAvailableUsers: fetchAvailableUsers.data,
    isFetchingAvailableUsers: fetchAvailableUsers.isFetching,
    messages: chatMessagesQuery.data || [],
    isLoadingMessages: chatMessagesQuery.isLoading,
    createChatRoom: createChatRoomMutation.mutate,
    isCreatingChatRoom: createChatRoomMutation.isPending,
    queryClient,
    deleteMessage: deleteMessage.mutate,
    editMessage: editMessage.mutate,
  }
}
