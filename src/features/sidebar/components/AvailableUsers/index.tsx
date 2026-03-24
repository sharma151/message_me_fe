import type { AvailableUsersResponse } from '@/@types/response/api-response'
import { useChat } from '@/core/hooks/api/useChat'
import { useNavigate, useParams } from '@tanstack/react-router'
import DefaultUserIcon from '@/features/user/components/DefaultUserIcon'
import CustomDropdown from '@/components/CustomDropdown/index'
import { IoIosArrowDown } from 'react-icons/io'
import { RiLoader2Line } from 'react-icons/ri'
import SearchBar from '@/features/sidebar/components/SearchBar'
import { useEffect, useState, type ReactNode } from 'react'
import { formatChatTimestamp } from '@/utils/helper.utils'
import {
  Archive,
  BellOff,
  Pin,
  Mail,
  Heart,
  List,
  Ban,
  MinusCircle,
  Trash2,
} from 'lucide-react'

export type DropdownItem =
  | {
      key: string
      label: string
      icon?: ReactNode
      className?: string
      type?: 'item'
    }
  | {
      key: string
      label: string
      type: 'separator'
      icon?: never
      className?: string
    }
const AvailableUser = () => {
  const {
    fetchAvailableUsers,
    isFetchingAvailableUsers,
    searchAvailableUsers,
  } = useChat()
  const [searchText, setSearchText] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const { chatId } = useParams({ strict: false })
  const navigate = useNavigate()

  // Handle Debounce Logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchText])

  // Sync with API
  useEffect(() => {
    searchAvailableUsers(debouncedSearch)
  }, [debouncedSearch, searchAvailableUsers])

  const handleRowClick = (chatID: number) => {
    navigate({
      to: '/chats/$chatId',
      params: { chatId: chatID.toString() },
    })
  }

  const menuItems: DropdownItem[] = [
    { key: 'archive', label: 'Archive chat', icon: <Archive size={18} /> },
    { key: 'mute', label: 'Mute notifications', icon: <BellOff size={18} /> },
    { key: 'pin', label: 'Pin chat', icon: <Pin size={18} /> },
    { key: 'unread', label: 'Mark as unread', icon: <Mail size={18} /> },
    { key: 'fav', label: 'Add to favourites', icon: <Heart size={18} /> },
    { key: 'list', label: 'Add to list', icon: <List size={18} /> },
    {
      key: 'sep1',
      type: 'separator',
      label: '',
    },
    { key: 'block', label: 'Block', icon: <Ban size={18} /> },
    { key: 'clear', label: 'Clear chat', icon: <MinusCircle size={18} /> },
    {
      key: 'delete',
      label: 'Delete chat',
      icon: <Trash2 size={18} />,
      className: 'text-red-500',
    },
  ] as const

  return (
    <div className="flex flex-col h-full">
      <SearchBar value={searchText} onChange={setSearchText} />

      <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
        Available Users
      </p>

      <div className="flex-1 overflow-y-auto px-2 max-h-102 custom-scrollbar">
        {/* Crucial: Don't return early with the loader if we are just searching, 
           or the SearchBar will disappear and lose focus.
        */}
        {isFetchingAvailableUsers && fetchAvailableUsers?.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <RiLoader2Line size={25} color="gray" className="animate-spin" />
          </div>
        ) : (
          <div className="space-y-1">
            {fetchAvailableUsers?.map((user: AvailableUsersResponse) => {
              const isActive = chatId === user.chatId.toString()
              return (
                <div
                  key={user.chatId}
                  onClick={() => handleRowClick(user.chatId)}
                  className={`
                    flex items-center justify-between space-x-3 p-2 rounded-lg cursor-pointer
                    transition-colors hover:bg-gray-300 group
                    ${isActive ? 'bg-gray-300' : ''}
                  `}
                >
                  <div className="flex gap-2">
                    <DefaultUserIcon />
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium text-white truncate">
                        {user.isGroup ? user.name : user.receiverName}
                      </span>
                      <span className="text-sm text-gray-400 truncate max-w-[150px]">
                        {user.message}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between py-1">
                    <span className="text-gray-400 text-[10px] whitespace-nowrap">
                      {user?.lastMessageTime
                        ? formatChatTimestamp(user?.lastMessageTime)
                        : ''}
                    </span>

                    <CustomDropdown
                      triggerContent={<IoIosArrowDown size={17} color="gray" />}
                      buttonClassName="opacity-0 group-hover:opacity-100 transition-opacity"
                      items={menuItems}
                      onMenuClick={(item) => {
                        if (item.key === 'Delete') alert(`Delete ${user.name}`)
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AvailableUser
