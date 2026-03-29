import DefaultUserIcon from '@/features/user/components/DefaultUserIcon'
import { useActiveChat } from '@/core/hooks/common/useActiveChat'
import { useModalStore } from '@/store/modal.store'
import { FaArrowLeft, FaUserPlus } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import { useParams } from '@tanstack/react-router'
import { useChat } from '@/core/hooks/api/useChat'
import { useState } from 'react'
import UserSelectionDialog from '@/components/UserSelectionDialog'

const ContactInfo = () => {
  const onContactInfoClose = useModalStore((state) => state.onContactInfoClose)
  const { activeChat } = useActiveChat()
  const { chatId } = useParams({ strict: false })
  const { addUserToGroupChat, removeUserFromGroupChat } = useChat()
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const chat = activeChat

  //  TEMP DATA need to replace to actual data
  const availableUsers = [
    { id: 2, name: 'John Doe', email: 'john@example.com' },
    { id: 3, name: 'Saurav Sharma', email: 'saurav@example.com' },
  ]
  // const handleSelectUser = (userId: number) => {
  //   addUserToGroupChat({ chatId: Number(chatId), userId })
  // }

  const handleRemoveParticipant = (userId: number) => {
    removeUserFromGroupChat({ chatId: Number(chatId), userId })
  }

  return (
    <div className="h-full flex flex-col text-white">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-700">
        <button
          onClick={onContactInfoClose}
          className="p-2 hover:bg-gray-700 rounded-full"
        >
          <FaArrowLeft size={16} />
        </button>
        <h3 className="font-semibold text-lg">Contact info</h3>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto  custom-scrollbar">
        {/* PROFILE */}
        <div className="flex flex-col items-center py-6 border-b border-gray-700">
          <DefaultUserIcon size={80} />

          <h2 className="mt-3 text-lg font-medium">
            {chat.isGroup ? chat.name : chat.receiverName}
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            {chat.isGroup
              ? `${chat.participants?.length || 0} participants`
              : 'Online'}
          </p>
        </div>

        {/* ABOUT */}
        <div className="p-4 border-b border-gray-700">
          <p className="text-xs text-gray-400 mb-1">About</p>
          <p className="text-sm">{chat.about || 'No status available'}</p>
        </div>

        {/* GROUP ACTIONS */}
        {chat.isGroup && (
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="flex items-center gap-2 text-green-400 hover:bg-gray-800 p-2 rounded w-full"
            >
              <FaUserPlus size={16} />
              <span>Add participant</span>
            </button>
          </div>
        )}

        {/* PARTICIPANTS */}
        {chat.isGroup && (
          <div className="p-4">
            <p className="text-sm font-medium mb-3">
              Participants ({chat.participants?.length || 0})
            </p>

            <div className="flex flex-col gap-2">
              {chat.participants?.map((p: any) => (
                <div
                  key={p.user.id}
                  className="flex items-center justify-between hover:bg-gray-800 p-2 rounded-lg group"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    <DefaultUserIcon size={35} />
                    <div>
                      <p className="text-sm font-medium">{p.user.name}</p>
                      <p className="text-xs text-gray-400">
                        Hey there! I am using ChatApp.
                      </p>
                    </div>
                  </div>

                  {/* REMOVE BUTTON */}
                  <button
                    onClick={() => handleRemoveParticipant(p.user.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition"
                  >
                    <MdClose size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTION */}
        <div className="p-4 border-gray-700 mt-4">
          <button className="w-full text-red-500 text-sm hover:bg-gray-800 p-2 rounded">
            {chat.isGroup ? 'Exit group' : ''}
            {/* {chat.isGroup ? 'Exit group' : 'Block contact'} */}
          </button>
        </div>
      </div>
      <UserSelectionDialog
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddMembers={(ids) => {
          ids.forEach((userId) =>
            addUserToGroupChat({ chatId: Number(chatId), userId }),
          )
        }}
        users={availableUsers}
      />
    </div>
  )
}

export default ContactInfo
