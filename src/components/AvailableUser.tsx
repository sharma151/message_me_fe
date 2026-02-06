import type { AvailableUsersResponse } from '@/@types/response/api-response'
import defaultimage from '@/assets/default-user.webp'
import { useChat } from '@/core/hooks/api/useChat'
import { useNavigate } from '@tanstack/react-router'
const AvailableUser = () => {
  const { fetchAvailableUsers, isFetchingAvailableUsers } = useChat()

  const navigate = useNavigate()
  const handleRowClick = ({ chatID }: { chatID: number }) => {
    navigate({
      to: '/chats/$chatId',
      params: { chatId: chatID.toString() },
    })
  }

  if (isFetchingAvailableUsers) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="px-2">
        <h2 className="text-lg font-semibold p-2">Available user</h2>
        <div className="space-y-1 overflow-y-auto max-h-96">
          {fetchAvailableUsers?.map((user: AvailableUsersResponse) => (
            <div
              key={user.chatId}
              onClick={() => handleRowClick({ chatID: user.chatId })}
              className=" flex items-center border-b  border-gray-200 space-x-3 p-2 hover:rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <span>
                <img
                  src={defaultimage || '/default-avatar.png'}
                  className="w-10 h-10 rounded-full"
                />
              </span>
              <span className="font-medium">{user.receiverName}</span>{' '}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default AvailableUser
