import { useMemo } from 'react'
import { useParams } from '@tanstack/react-router'
import { useChat } from '@/core/hooks/api/useChat'
import { useAuthStore } from '@/store/auth.store'

export const useActiveChat = () => {
  const { chatId } = useParams({ strict: false })

  const { fetchAvailableUsers, isFetchingAvailableUsers } = useChat()
  const loggedInUserId = useAuthStore((state) => state.user?.id)
  const activeChat = useMemo(() => {
    if (!fetchAvailableUsers || !chatId) return null

    const rawChat = fetchAvailableUsers.find(
      (c: any) => String(c.chatId) === String(chatId),
    )
    return rawChat
  }, [fetchAvailableUsers, chatId, loggedInUserId])

  return {
    activeChat,
    isLoading: isFetchingAvailableUsers && !activeChat,
  }
}
