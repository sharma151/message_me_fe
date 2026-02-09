import type { UserProfileResponse } from '@/@types/forms/auth'
import { useNavigate } from '@tanstack/react-router'
import { useChat } from '@/core/hooks/api/useChat'
import { FaArrowLeft } from 'react-icons/fa'
import DefaultUser from './DefaultUser'

interface AllUsersListProps {
  onBack?: () => void
}
const AllUserList = ({ onBack }: AllUsersListProps) => {
  const { fetchAllUsers, isFetchingAllUsers, createChatRoom } = useChat()

  const navigate = useNavigate()
  const handleRowClick = ({ chatID }: { chatID: number }) => {
    onBack?.()
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
      <div className="px-2 bg-gray-800 h-full">
        <div className="flex items-center  gap-1 p-2">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-300 rounded-full transition-colors"
          >
            <FaArrowLeft size={16} color="white" />
          </button>
          <h2 className="text-lg font-semibold text-white">All Users</h2>
        </div>
        <div className="space-y-1 overflow-y-auto max-h-96">
          {fetchAllUsers ? (
            fetchAllUsers.map((user: UserProfileResponse) => (
              <div
                key={user.id}
                onClick={() => handleRowClick({ chatID: user.id })}
                className=" flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-300 cursor-pointer transition-colors"
              >
                <DefaultUser />
                <span className="font-medium text-white">{user.name}</span>{' '}
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
