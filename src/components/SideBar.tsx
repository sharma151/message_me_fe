import SideBarNav from '@/components/SidebarNav'
import AllUserList from './AllUserList'

const SideBar = () => {
  return (
    <div className="w-full border-r border-gray-400">
      <SideBarNav />
      <AllUserList />
    </div>
  )
}

export default SideBar
