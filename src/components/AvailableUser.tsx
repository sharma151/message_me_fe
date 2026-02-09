import type { AvailableUsersResponse } from '@/@types/response/api-response'
import { useChat } from '@/core/hooks/api/useChat'
import { useNavigate, useParams } from '@tanstack/react-router'
import DefaultUser from '@/components/DefaultUser'

const AvailableUser = () => {
  const { fetchAvailableUsers, isFetchingAvailableUsers } = useChat()
  const navigate = useNavigate()

  const { chatId } = useParams({ strict: false })

  const handleRowClick = (chatID: number) => {
    navigate({
      to: '/chats/$chatId',
      params: { chatId: chatID.toString() },
    })
  }

  if (isFetchingAvailableUsers) {
    return <div className="p-2 text-gray-400">Loading...</div>
  }

  return (
    <div className="px-2">
      <h2 className="text-lg font-semibold p-2 text-white">Available user</h2>

      <div className="space-y-1 overflow-y-auto max-h-96">
        {fetchAvailableUsers?.map((user: AvailableUsersResponse) => {
          const isActive = chatId === user.chatId.toString()

          return (
            <div
              key={user.chatId}
              onClick={() => handleRowClick(user.chatId)}
              className={`
                flex items-center space-x-3 p-2 rounded-lg cursor-pointer
                transition-colors
                hover:bg-gray-300
                ${isActive ? 'bg-gray-300' : ''}
              `}
            >
              <span>
                <DefaultUser />
              </span>

              <div className="flex flex-col overflow-hidden">
                <span className="font-medium text-white">
                  {user.receiverName}
                </span>
                <span className="text-sm text-gray-200 truncate max-w-25">
                  {user.message}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AvailableUser
