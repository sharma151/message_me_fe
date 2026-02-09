import CustomDropdown from '@/components/UI/CustomDropdown'
import { useToast } from '@/core/hooks/common/useToast'
import { useAuthStore } from '@/store/auth.store'
import { Link, useNavigate } from '@tanstack/react-router'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { IoChatboxEllipsesOutline } from 'react-icons/io5'
import { TbLogout } from 'react-icons/tb'

interface SideBarNavProps {
  onOpenNewChat?: () => void
}

const SideBarNav = ({ onOpenNewChat }: SideBarNavProps) => {
  const logoutStore = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const { success: Success } = useToast()
  const items = [
    { key: 'Logout', label: 'Logout', icon: <TbLogout size={16} /> },
  ]

  const handleLogoutUser = () => {
    logoutStore()
    navigate({ to: '/auth/login' })
    Success('Logged out successfully')
  }
  return (
    <>
      <div className="flex items-center  justify-between p-4 border-b border-gray-800">
        <Link
          to="/"
          className="flex items-center  text-xl font-bold text-white"
          activeProps={{
            className:
              'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
          }}
        >
          ChatAPP
        </Link>

        <div className="flex items-center gap-3">
          <button className="cursor-pointer" onClick={onOpenNewChat}>
            <IoChatboxEllipsesOutline size={24} color="white" />
          </button>

          <div>
            <CustomDropdown
              items={items}
              triggerContent={<BsThreeDotsVertical size={22} color="white" />}
              onMenuClick={handleLogoutUser}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default SideBarNav
