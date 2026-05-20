import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ChatService from '@/core/services/chat.service'
import { QueryKeys } from '@/config/query-keys'
export const useChat = (chatId?: number) => {
  const queryClient = useQueryClient()

  //fetch Archived Users
  const fetchArchivedUsers = useQuery({
    queryKey: [QueryKeys.ARCHIVED_USERS],
    queryFn: ChatService.fetchArchivedUsers,
  })

  //Fetch Chats Messages
  const chatMessagesQuery = useQuery({
    queryKey: [QueryKeys.CHATS, chatId],
    queryFn: () => ChatService.fetchChats(chatId!),
    enabled: !!chatId,
    staleTime: 1000 * 60 * 5,
  })

  //Delete Message
  const deleteChat = useMutation({
    mutationFn: ({ chatId }: { chatId: number }) =>
      ChatService.deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AVAILABLE_USERS] })
    },
  })

  //create Chat Room
  const createChatRoomMutation = useMutation({
    mutationFn: async (receiverUserId: number) => {
      await ChatService.createChatRoom(receiverUserId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AVAILABLE_USERS] })
    },
  })

  //create Group chat Room
  const createGroupChatMutation = useMutation({
    mutationFn: async (payload: {
      chatName: string
      receiverUserId: number[]
    }) => {
      return await ChatService.createGroupChatRoom(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AVAILABLE_USERS] })
    },
    onError: (error) => {
      console.error('Group creation failed:', error)
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

  //Archieve Chat
  const archieveChat = useMutation({
    mutationFn: ({ chatId }: { chatId: number }) => {
      return ChatService.archieveChat(chatId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AVAILABLE_USERS] })
    },
  })

  //Unarchieve Chat
  const unarchieveChat = useMutation({
    mutationFn: ({ chatId }: { chatId: number }) => {
      return ChatService.unarchieveChat(chatId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ARCHIVED_USERS] })
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AVAILABLE_USERS] })
    },
  })

  //Add User to Group Chat
  const addUserToGroupChat = useMutation({
    mutationFn: ({ chatId, userId }: { chatId: number; userId: number }) => {
      return ChatService.addUserToGroupChat(chatId, userId)
    },
    onSuccess: () => {
      chatMessagesQuery.refetch()
    },
  })

  //Remove User from Group Chat
  const removeUserFromGroupChat = useMutation({
    mutationFn: ({ chatId, userId }: { chatId: number; userId: number }) => {
      return ChatService.removeUserFromGroupChat(chatId, userId)
    },
    onSuccess: () => {
      chatMessagesQuery.refetch()
    },
  })

  return {
    fetchArchivedUsers: fetchArchivedUsers.data,
    isFetchingArchivedUsers: fetchArchivedUsers.isFetching,
    messages: chatMessagesQuery.data || [],
    isLoadingMessages: chatMessagesQuery.isLoading,
    createChatRoom: createChatRoomMutation.mutate,
    createGroupChatMutation: createGroupChatMutation.mutate,
    iscreateGroupChatPending: createGroupChatMutation.isPending,
    isCreatingChatRoom: createChatRoomMutation.isPending,
    queryClient,
    deleteMessage: deleteMessage.mutate,
    editMessage: editMessage.mutate,
    deleteChat: deleteChat.mutate,
    archieveChat: archieveChat.mutate,
    unarchievechat: unarchieveChat.mutate,
    addUserToGroupChat: addUserToGroupChat.mutate,
    removeUserFromGroupChat: removeUserFromGroupChat.mutate,
  }
}
