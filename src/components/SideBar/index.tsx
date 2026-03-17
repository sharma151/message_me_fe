import SideBarNav from '@/components/SideBarNav'
import { useModalStore } from '@/store/modal.store'
import AvailableUser from '@/components/AvailableUsers/index'
import UserDetailCard from '@/components/UserProfileDetails/index'
import Users from '@/components/Users'

const SideBar = () => {
  const { onOpen, isOpen, onUserDetailClose, isUserDetailOpen } =
    useModalStore()
  return (
    <div className="w-full border-r border-gray-400 bg-gray-800 h-full ">
      {isUserDetailOpen ? (
        <UserDetailCard onBack={onUserDetailClose} />
      ) : isOpen ? (
        <Users />
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
