import { useActiveChat } from '@/core/hooks/common/useActiveChat'
import DefaultUserIcon from '@/features/user/components/DefaultUserIcon'
const ChatRoomNav = () => {
  const { activeChat } = useActiveChat()
  console.log(activeChat)
  const GroupName = activeChat?.name
  return (
    <>
      <div
        key={activeChat?.chatId}
        className=" flex items-center  bg-gray-800  gap-3 p-3 "
      >
        <span>
          <DefaultUserIcon size={40} />
        </span>
        <span className="font-medium text-white">
          {activeChat?.isGroup ? GroupName : activeChat?.receiverName}
        </span>{' '}
      </div>
    </>
  )
}

export default ChatRoomNav
