import type { UserProfileResponse } from '@/@types/forms/auth'
import defaultimage from '@/assets/default-user.webp'
import { useNavigate } from '@tanstack/react-router'
import { useChat } from '@/core/hooks/api/useChat'
import { FaArrowLeft } from 'react-icons/fa'

interface AllUsersListProps {
  onBack?: () => void
}
const AllUserList = ({ onBack }: AllUsersListProps) => {
  const { fetchAllUsers, isFetchingAllUsers, createChatRoom } = useChat()

  const navigate = useNavigate()
  const handleRowClick = ({ chatID }: { chatID: number }) => {
    createChatRoom(chatID)
    navigate({
      to: '/chats',
    })
  }

  if (isFetchingAllUsers) {
    return <div>Loading users...</div>
  }
  return (
    <>
      <div className="px-2 ">
        <div className="flex items-center  gap-1 p-2">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <FaArrowLeft size={16} />
          </button>
          <h2 className="text-lg font-semibold ">All Users</h2>
        </div>
        <div className="space-y-1 overflow-y-auto max-h-96">
          {fetchAllUsers ? (
            fetchAllUsers.map((user: UserProfileResponse) => (
              <div
                key={user.id}
                onClick={() => handleRowClick({ chatID: user.id })}
                className=" flex items-center border-b  border-gray-200 space-x-3 p-2 hover:rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <span>
                  <img
                    src={defaultimage || '/default-avatar.png'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                </span>
                <span className="font-medium">{user.name}</span>{' '}
              </div>
            ))
          ) : (
            <li>No users found.</li>
          )}
        </div>
      </div>
    </>
  )
}

export default AllUserList
