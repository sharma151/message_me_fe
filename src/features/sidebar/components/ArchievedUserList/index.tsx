import { useNavigate } from '@tanstack/react-router'
import { useChat } from '@/core/hooks/api/useChat'
import { FaArrowLeft } from 'react-icons/fa'
import { RiLoader2Line } from 'react-icons/ri'
import { IoIosArrowDown } from 'react-icons/io'
import { MdUnarchive } from 'react-icons/md' // Better icon for unarchiving
import DefaultUserIcon from '@/features/user/components/DefaultUserIcon'
import CustomDropdown from '@/components/CustomDropdown/index'
import { formatChatTimestamp } from '@/utils/helper.utils'

import type { UserProfileResponse } from '@/@types/forms/auth'
import type { DropdownItem } from '../AvailableUsers'

interface AllUsersListProps {
  onBack?: () => void
}

const ArchievedUserList = ({ onBack }: AllUsersListProps) => {
  const { fetchArchivedUsers, isFetchingArchivedUsers, unarchievechat } =
    useChat()
  const navigate = useNavigate()

  const handleRowClick = (chatId: number) => {
    navigate({
      to: `/chats/${chatId}`,
    })
  }

  if (isFetchingArchivedUsers) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-800">
        <RiLoader2Line size={25} color="gray" className="animate-spin" />
      </div>
    )
  }

  const menuItems: DropdownItem[] = [
    {
      key: 'unarchive',
      label: 'Unarchive chat',
      icon: <MdUnarchive size={18} />,
    },
  ]

  return (
    <div className="h-screen w-full flex flex-col bg-gray-800 overflow-hidden font-sans animate-in slide-in-from-right duration-200">
      {/* --- FIXED HEADER SECTION --- */}
      <div className="flex-none px-2 border-b border-gray-700">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors text-white"
          >
            <FaArrowLeft size={16} />
          </button>
          <h3 className="font-semibold text-lg text-white">Archived Chats</h3>
        </div>
      </div>

      {/* --- SCROLLABLE USER LIST --- */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        <div className="space-y-1">
          {fetchArchivedUsers && fetchArchivedUsers.length > 0 ? (
            fetchArchivedUsers.map((user: UserProfileResponse) => (
              <div
                key={user?.chatId}
                onClick={() => handleRowClick(user.chatId)}
                className="flex items-center justify-between space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-700 group"
              >
                <div className="flex gap-3 overflow-hidden">
                  <div className="shrink-0">
                    <DefaultUserIcon />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-white truncate">
                      {user.isGroup ? user.name : user.receiverName}
                    </span>
                    <span className="text-sm text-gray-400 truncate max-w-">
                      {user.message || 'No messages yet'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between self-stretch">
                  <span className="text-gray-400 text-xs whitespace-nowrap">
                    {user?.lastMessageTime
                      ? formatChatTimestamp(user.lastMessageTime)
                      : ''}
                  </span>

                  <div onClick={(e) => e.stopPropagation()}>
                    <CustomDropdown
                      triggerContent={
                        <IoIosArrowDown
                          size={17}
                          className="text-gray-400 hover:text-white"
                        />
                      }
                      buttonClassName="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      items={menuItems}
                      onMenuClick={(item) => {
                        if (item.key === 'unarchive' && user?.chatId) {
                          unarchievechat({ chatId: user.chatId })
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>No archived chats found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArchievedUserList
