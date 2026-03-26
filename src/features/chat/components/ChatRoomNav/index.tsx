import CustomDropdown from '@/components/CustomDropdown'
import { useActiveChat } from '@/core/hooks/common/useActiveChat'
import DefaultUserIcon from '@/features/user/components/DefaultUserIcon'
import { LuInfo } from 'react-icons/lu'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useModalStore } from '@/store/modal.store'
const ChatRoomNav = () => {
  const { activeChat } = useActiveChat()
  console.log(activeChat)
  const GroupName = activeChat?.name
  const items = [
    { key: 'contact_info', label: 'Contact info', icon: <LuInfo size={16} /> },
  ]
  const { onContactInfoOpen } = useModalStore()
  const handleMenuClick = (item: any) => {
    if (item.key === 'contact_info') {
      onContactInfoOpen()
    }
  }
  return (
    <>
      <div
        key={activeChat?.chatId}
        className=" flex items-center justify-between  bg-gray-800  gap-3 p-3 "
      >
        {' '}
        <div className="flex items-center gap-2">
          <span>
            <DefaultUserIcon size={40} />
          </span>
          <span className="font-medium text-white">
            {activeChat?.isGroup ? GroupName : activeChat?.receiverName}
          </span>{' '}
        </div>
        <CustomDropdown
          items={items}
          triggerContent={<BsThreeDotsVertical size={20} color="white" />}
          onMenuClick={handleMenuClick}
          buttonClassName="p-1.5 rounded-full hover:bg-gray-300"
        />
      </div>
    </>
  )
}

export default ChatRoomNav
