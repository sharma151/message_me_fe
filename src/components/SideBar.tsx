import SideBarNav from '@/components/SidebarNav'
import AllUserList from './AllUserList'
import { useModalStore } from '@/store/modal.store'
import AvailableUser from './AvailableUser'

const SideBar = () => {
  const { onOpen, onClose, isOpen } = useModalStore()
  return (
    <div className="w-full border-r border-gray-400">
      <SideBarNav onOpenNewChat={onOpen} />
      {isOpen ? <AllUserList onBack={onClose} /> : <AvailableUser />}
    </div>
  )
}

export default SideBar
