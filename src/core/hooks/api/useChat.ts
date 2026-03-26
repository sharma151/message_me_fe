import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ChatService from '@/core/services/chat.service'
import { useState } from 'react'
export const useChat = (chatId?: number) => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  //FetchAllUsers
  const fetchAllUsers = useQuery({
    queryKey: ['AllUsers'],
    queryFn: ChatService.fetchAllUsers,
  })

  //FetchAvailableUsers
  const fetchAvailableUsers = useQuery({
    queryKey: ['available-users', search],
    queryFn: () => ChatService.fetchAvailableUsers(search),
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

  //create Group chat Room
  const createGroupChatMutation = useMutation({
    mutationFn: async (payload: {
      chatName: string
      receiverUserId: number[]
    }) => {
      return await ChatService.createGroupChatRoom(payload)
    },
    onSuccess: () => {
      fetchAvailableUsers.refetch()
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

  const archieveChat = useMutation({
    mutationFn: ({ chatId }: { chatId: number }) => {
      return ChatService.archieveChat(chatId)
    },
    onSuccess: () => {
      fetchAvailableUsers.refetch()
    },
  })

  const unarchieveChat = useMutation({
    mutationFn: ({ chatId }: { chatId: number }) => {
      return ChatService.unarchieveChat(chatId)
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
    searchAvailableUsers: setSearch,
    messages: chatMessagesQuery.data || [],
    isLoadingMessages: chatMessagesQuery.isLoading,
    createChatRoom: createChatRoomMutation.mutate,
    createGroupChatMutation: createGroupChatMutation.mutate,
    iscreateGroupChatPending: createGroupChatMutation.isPending,
    isCreatingChatRoom: createChatRoomMutation.isPending,
    queryClient,
    deleteMessage: deleteMessage.mutate,
    editMessage: editMessage.mutate,
    archieveChat: archieveChat.mutate,
    unarchievechat: unarchieveChat.mutate,
  }
}
