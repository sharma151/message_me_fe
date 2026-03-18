import type { UserProfileResponse } from '@/@types/forms/auth'
import { useNavigate } from '@tanstack/react-router'
import { useChat } from '@/core/hooks/api/useChat'
import { FaArrowLeft } from 'react-icons/fa'
import DefaultUserIcon from '@/components/DefaultUserIcon'
import { RiLoader2Line } from 'react-icons/ri'
import { useModalStore } from '@/store/modal.store'
import { MdGroups } from 'react-icons/md'

interface AllUsersListProps {
  onBack?: () => void
}

const AllUserList = ({ onBack }: AllUsersListProps) => {
  const { fetchAllUsers, isFetchingAllUsers, createChatRoom } = useChat()
  const { onCreateGroupOpen } = useModalStore()

  const navigate = useNavigate()
  const handleRowClick = ({ chatID }: { chatID: number }) => {
    onBack?.()
    createChatRoom(chatID)
    navigate({
      to: '/chats',
    })
  }

  if (isFetchingAllUsers) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-800">
        <RiLoader2Line size={25} color="gray" className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-800 overflow-hidden font-sans animate-in slide-in-from-right duration-200">
      {/* --- FIXED HEADER SECTION --- */}
      <div className="flex-none px-2">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors text-white"
          >
            <FaArrowLeft size={16} />
          </button>
          <h3 className="font-semibold text-lg text-white">All Users</h3>
        </div>

        <div
          className="mx-2 mb-2 border-gray-200 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
          onClick={onCreateGroupOpen}
        >
          <div className="p-3 text-white flex items-center gap-4">
            <DefaultUserIcon Icon={MdGroups} size={40} />
            <span className="font-medium">Create Group</span>
          </div>
        </div>
      </div>

      {/* --- SCROLLABLE USER LIST --- */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        <p className="py-2 text-xs font-bold text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-800 z-10">
          Users
        </p>

        <div className="space-y-1">
          {fetchAllUsers && fetchAllUsers.length > 0 ? (
            fetchAllUsers.map((user: UserProfileResponse) => (
              <div
                key={user.id}
                onClick={() => handleRowClick({ chatID: user.id })}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <DefaultUserIcon />
                <span className="font-medium text-white">{user.name}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 p-4">No users found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllUserList
