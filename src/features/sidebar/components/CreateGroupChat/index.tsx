import { useState } from 'react'
import { FaArrowLeft, FaCheck, FaArrowRight, FaCamera } from 'react-icons/fa'
import { useChat } from '@/core/hooks/api/useChat'
import { useModalStore } from '@/store/modal.store'
import DefaultUserIcon from '@/features/user/components/DefaultUserIcon'
import { useNavigate } from '@tanstack/react-router'
// import { useNavigate } from "@tanstack/react-router";

const CreateGroupChat = () => {
  const { onCreateGroupClose } = useModalStore()
  const { createGroupChatMutation, fetchAllUsers, iscreateGroupChatPending } =
    useChat()

  const navigate = useNavigate()

  // State for group creation
  const [groupName, setGroupName] = useState('')
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])

  // Toggle user selection
  const handleToggleUser = (userId: number) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId) // Uncheck
      } else {
        return [...prev, userId] // Check
      }
    })
  }

  // Handle Form Submit
  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUserIds.length === 0) return

    createGroupChatMutation({
      chatName: groupName.trim(),
      receiverUserId: selectedUserIds,
    })
    navigate({
      to: '/chats',
    })
  }

  return (
    <div className="h-screen w-full mx-auto flex flex-col font-sans overflow-hidden bg-gray-800">
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 p-4  bg-gray-800">
          <button
            onClick={onCreateGroupClose}
            className="p-2  hover:bg-gray-300  rounded-full transition-colors text-white"
          >
            <FaArrowLeft size={16} />
          </button>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg text-white">New Group</h3>
            <span className="text-xs text-gray-400">
              {selectedUserIds.length} selected
            </span>
          </div>
        </div>

        {/* Group Info Section (Name Input) */}
        <div className="p-4   bg-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 shrink-0 rounded-full flex items-center justify-center text-gray-500">
            <FaCamera />
          </div>
          <input
            type="text"
            placeholder="Group Name"
            className="flex-1 border-b-2 text-white border-gray-100 py-2 focus:outline-none focus:border-green-500 transition-colors"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          {selectedUserIds.length > 0 && groupName.length > 0 && (
            <div className="  animate-in slide-in-from-bottom duration-300">
              <button
                onClick={handleCreateGroup}
                disabled={iscreateGroupChatPending}
                className="bg-green-600 hover:bg-green-500 text-white p-2.5 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {iscreateGroupChatPending ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <FaArrowRight size={20} />
                )}
              </button>
            </div>
          )}
        </div>

        {/* User List with Checkboxes */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 bg-gray-800 custom-scrollbar">
          <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Select Participants
          </p>

          {Array.isArray(fetchAllUsers) && fetchAllUsers.length > 0 ? (
            fetchAllUsers.map((user) => {
              const isSelected = selectedUserIds.includes(user.id)

              return (
                <div
                  key={user.id}
                  onClick={() => handleToggleUser(user.id)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected ? 'bg-gray-300' : 'hover:bg-gray-300 '
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {user.profileimg === null ? (
                        <>
                          <DefaultUserIcon />
                        </>
                      ) : (
                        <img
                          src={user.profileimg || DefaultUserIcon}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-100"
                        />
                      )}
                      {isSelected && (
                        <div className="absolute -bottom-0.5 -right-0.5  bg-green-500 rounded-full p-1  animate-in zoom-in duration-200">
                          <FaCheck size={8} fill="white" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium ${isSelected ? 'text-gray-200' : 'text-white'}`}
                      >
                        {user.name}
                      </span>
                      <span
                        className={`text-xs  ${isSelected ? 'text-gray-400' : 'text-gray-400'} line-clamp-1`}
                      >
                        {user.email || 'Available'}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2  shrink-0 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-400'
                    }`}
                  >
                    {isSelected && <FaCheck size={10} className="text-white" />}
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center text-gray-500 py-8">
              No available users.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateGroupChat
