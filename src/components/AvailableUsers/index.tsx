import type { AvailableUsersResponse } from '@/@types/response/api-response'
import { useChat } from '@/core/hooks/api/useChat'
import { useNavigate, useParams } from '@tanstack/react-router'
import DefaultUserIcon from '@/components/DefaultUserIcon'
import CustomDropdown from '@/components/CustomDropdown/index'
import { IoIosArrowDown } from 'react-icons/io'
import { RiLoader2Line } from 'react-icons/ri'
import SearchBar from '@/components/SearchBar'

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

  const items = [{ key: 'Delete', label: 'Delete' }]

  if (isFetchingAvailableUsers) {
    return (
      <div className="flex justify-center items-center h-full  bg-gray-800 ">
        <RiLoader2Line size={25} color="gray" className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="px-2">
      <SearchBar />
      <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
        Available Users
      </p>

      <div className="space-y-1 overflow-y-auto max-h-96">
        {fetchAvailableUsers?.map((user: AvailableUsersResponse) => {
          const isActive = chatId === user.chatId.toString()

          return (
            <div
              key={user.chatId}
              onClick={(e) => {
                handleRowClick(user.chatId)
                e.stopPropagation()
              }}
              className={`
                flex items-center  justify-between space-x-3 p-2 rounded-lg cursor-pointer
                transition-colors
                hover:bg-gray-300 group
                ${isActive ? 'bg-gray-300' : ''}
              `}
            >
              <div className="flex gap-2">
                <span>
                  <DefaultUserIcon />
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

              <CustomDropdown
                triggerContent={<IoIosArrowDown size={17} color="gray" />}
                buttonClassName="opacity-0 group-hover:opacity-100 transition-opacity"
                items={items}
                onMenuClick={() => {
                  alert('Delete clicked for user')
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AvailableUser
