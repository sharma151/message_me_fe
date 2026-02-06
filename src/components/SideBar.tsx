import SideBarNav from '@/components/SidebarNav'
import AllUserList from './AllUserList'
import { useModalStore } from '@/store/modal.store'
import AvailableUser from './AvailableUser'
import UserDetailCard from './UserProfileDetails'

const SideBar = () => {
  const { onOpen, onClose, isOpen, onUserDetailClose, isUserDetailOpen } =
    useModalStore()
  return (
    <div className="w-full border-r border-gray-400">
      <SideBarNav onOpenNewChat={onOpen} />
      {isUserDetailOpen ? (
        <UserDetailCard onBack={onUserDetailClose} />
      ) : isOpen ? (
        <AllUserList onBack={onClose} />
      ) : (
        <AvailableUser />
      )}
    </div>
  )
}

export default SideBar
