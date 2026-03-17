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
      <div className="flex justify-center items-center h-full  bg-gray-800 ">
        <RiLoader2Line size={25} color="gray" className="animate-spin" />
      </div>
    )
  }
  return (
    <>
      <div className="px-2 bg-gray-800 h-full  ">
        <div className="flex items-center gap-3 p-4 bg-gray-800">
          <button
            onClick={onBack}
            className="p-2  hover:bg-gray-300  rounded-full transition-colors text-white"
          >
            <FaArrowLeft size={16} />
          </button>
          <div className="flex flex-col ">
            <h3 className="font-semibold text-lg text-white">All Users</h3>
          </div>
        </div>
        <div
          className=" border-gray-200  hover:bg-gray-300 rounded-lg cursor-pointer"
          onClick={onCreateGroupOpen}
        >
          <div className=" p-3 text-white flex items-center gap-4">
            <DefaultUserIcon Icon={MdGroups}  size={40}/>
            <span className="font-medium">Create Group</span>
          </div>
        </div>
        <div className="space-y-1 overflow-y-auto max-h-full custom-scrollbar">
          <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Users
          </p>
          {fetchAllUsers ? (
            fetchAllUsers.map((user: UserProfileResponse) => (
              <div
                key={user.id}
                onClick={() => handleRowClick({ chatID: user.id })}
                className=" flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-300 cursor-pointer transition-colors"
              >
                <DefaultUserIcon />
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
