import SideBarNav from '@/components/SideBarNav'
import AllUserList from '@/components/AllUserList/index'
import { useModalStore } from '@/store/modal.store'
import AvailableUser from '@/components/AvailableUsers/index'
import UserDetailCard from '@/components/UserProfileDetails/index'

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
