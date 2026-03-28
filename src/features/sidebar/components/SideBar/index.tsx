import SideBarNav from '@/features/sidebar/components/SideBarNav'
import { useModalStore } from '@/store/modal.store'
import AvailableUser from '@/features/sidebar/components/AvailableUsers/index'
import UserDetailCard from '@/features/user/components/UserProfileDetails/index'
import Users from '@/components/Users'
import ArchievedUserList from '@/features/sidebar/components/ArchievedUserList'

const SideBar = () => {
  const {
    onOpen,
    isOpen,
    onUserDetailClose,
    isUserDetailOpen,
    isArchievedUserListOpen,
    onArchievedUserListClose, 
  } = useModalStore()

  if (isUserDetailOpen) {
    return (
      <div className="w-full border-r border-gray-400 bg-gray-800 h-full">
        <UserDetailCard onBack={onUserDetailClose} />
      </div>
    )
  }

  if (isArchievedUserListOpen) {
    return (
      <div className="w-full border-r border-gray-400 bg-gray-800 h-full">
        <ArchievedUserList onBack={onArchievedUserListClose} />
      </div>
    )
  }

  if (isOpen) {
    return (
      <div className="w-full border-r border-gray-400 bg-gray-800 h-full">
        <Users />
      </div>
    )
  }

  return (
    <div className="w-full border-r border-gray-400 bg-gray-800 h-full flex flex-col">
      <SideBarNav onOpenNewChat={onOpen} />
      <AvailableUser />
    </div>
  )
}

export default SideBar
