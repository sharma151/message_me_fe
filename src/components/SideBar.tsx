import SideBarNav from '@/components/SidebarNav'
import AllUserList from './AllUserList'
import { useModalStore } from '@/store/modal.store'
import AvailableUser from './AvailableUser'
import UserDetailCard from './UserProfileDetails'

const SideBar = () => {
  const { onOpen, onClose, isOpen, onUserDetailClose, isUserDetailOpen } =
    useModalStore()
  return (
    <div className="w-full border-r border-gray-400 bg-gray-800 h-full ">
      {isUserDetailOpen ? (
        <UserDetailCard onBack={onUserDetailClose} />
      ) : isOpen ? (
        <AllUserList onBack={onClose} />
      ) : (
        <>
          <SideBarNav onOpenNewChat={onOpen} />
          <AvailableUser />
        </>
      )}
    </div>
  )
}

export default SideBar
