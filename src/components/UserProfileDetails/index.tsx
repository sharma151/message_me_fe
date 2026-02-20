import { HiOutlinePencilAlt } from 'react-icons/hi'
import { FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '@/core/hooks/api/useAuth'
import DefaultUserIcon from '@/components/DefaultUserIcon'
import { useRef, useState } from 'react'
import { BsCheckLg } from 'react-icons/bs'
import { MdClose } from 'react-icons/md'
import { IoCamera } from 'react-icons/io5'

interface AllUsersListProps {
  onBack: () => void
}

const UserDetailCard = ({ onBack }: AllUsersListProps) => {
  const { userdetail, updateUserName, UploadAvatar, UpdateAvatar } = useAuth()

  const [isRenaming, setIsRenaming] = useState(false)
  const [tempName, setTempName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const image = `http://localhost:5000/uploadsimages/${userdetail?.user?.profileimg}`

  const userName = userdetail?.user?.name
  const handleRenameSave = () => {
    if (userName !== tempName) {
      updateUserName(tempName.trim())
    }
    setIsRenaming(false)
  }

  const handleEditUsername = () => {
    setTempName(userName || '')
    setIsRenaming(true)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleUploadavatar = (formData: FormData) => {
    const hasProfile = Boolean(userdetail?.user?.profileimg)
    return hasProfile ? UpdateAvatar(formData) : UploadAvatar(formData)
  }

  return (
    <div className="bg-gray-800 text-[#e9edef] h-screen w-full mx-auto flex flex-col font-sans overflow-hidden">
      {/* Scrollable container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-800">
        {/* Header */}
        <div className="flex items-center p-5 pt-8 sticky top-0 bg-gray-800 z-10">
          <button
            onClick={onBack}
            className="p-2 rounded-full transition-colors cursor-pointer hover:bg-gray-600"
          >
            <FaArrowLeft size={16} />
          </button>
          <h1 className="text-xl font-medium ml-2">Profile</h1>
        </div>

        {/* Avatar */}
        
        <div className="flex flex-col items-center my-8 relative">
          <div className="relative group mb-4">
            <div className="w-48 h-48 rounded-full overflow-hidden border-none bg-gray-800">
              {userdetail?.user?.profileimg ? (
                <img
                  src={image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <DefaultUserIcon size={190} iconSize={60} />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const formData = new FormData()
                  formData.append('file', file)

                  handleUploadavatar(formData)
                }
              }}
            />
            <button
              onClick={handleButtonClick}
              className="absolute bottom-2 left-2 bg-[#00a884] p-3 rounded-full shadow-lg hover:bg-[#06cf9c] transition-colors"
              title="Edit Avatar"
            >
              <IoCamera size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8 px-8 pb-8">
          {/* User name */}
          <section>
            <label className="text-[#00a884] text-sm block mb-4">
              User name
            </label>
            {isRenaming ? (
              <div className="flex items-center gap-1 flex-1">
                <input
                  autoFocus
                  className="border-b border-gray-500 outline-none font-semibold text-lg px-1 w-full max-w-50"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameSave()}
                />
                <button onClick={handleRenameSave} className="text-green-600">
                  <BsCheckLg size={18} />
                </button>
                <button
                  onClick={() => setIsRenaming(false)}
                  className="text-red-500"
                >
                  <MdClose size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-lg">{userName}</span>
                <HiOutlinePencilAlt
                  size={20}
                  className="text-[#8696a0] cursor-pointer hover:text-[#e9edef]"
                  onClick={handleEditUsername}
                />
              </div>
            )}
          </section>

          {/* Full name */}
          <section>
            <label className="text-[#8696a0] text-sm block mb-4">
              Full Name
            </label>
            <div className="flex items-center justify-between">
              <span className="text-lg">{userdetail?.user?.name}</span>
            </div>
          </section>

          {/* Email */}
          <section>
            <label className="text-[#8696a0] text-sm block mb-4">Email</label>
            <div className="flex items-center justify-between">
              <span className="text-lg truncate max-w-[75%]">
                {userdetail?.user?.email || 'Hey there! I am using WhatsApp.'}
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default UserDetailCard
