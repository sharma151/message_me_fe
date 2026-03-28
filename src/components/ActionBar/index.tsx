import UserDetailActionButton from '@/features/user/components/UserDetailActionbutton'
import ChatIcon from '@/assets/chatIcon.png'
import { RiInboxArchiveLine } from 'react-icons/ri'
import { useModalStore } from '@/store/modal.store'

const ActionBar = () => {
  const { onArchievedUserListOpen } = useModalStore()
  return (
    <>
      <div className="w-16 border-r border-gray-500 shrink-0 flex flex-col  items-center justify-between pb-4 bg-gray-700 ">
        <div className="flex flex-col">
          <button className="mt-3 cursor-pointer border p-2 rounded-full bg-gray-300 border-gray-500">
            <img src={ChatIcon} alt="Chat" className="w-5.5 h-5.5" />
          </button>
          <button
            className="mt-3 cursor-pointer border p-2 rounded-full bg-gray-300 border-gray-500 flex items-center justify-center"
            onClick={onArchievedUserListOpen}
          >
            <RiInboxArchiveLine size={23} color="white" />
          </button>
        </div>

        <div className="flex justify-end">
          <UserDetailActionButton />
        </div>
      </div>
    </>
  )
}

export default ActionBar
