import { useActiveChat } from '@/core/hooks/common/useActiveChat'
import DefaultUser from './DefaultUser'
const ChatRoomNav = () => {
  const { activeChat } = useActiveChat()
  return (
    <>
      <div
        key={activeChat?.chatId}
        className=" flex items-center  bg-sidebar  gap-3 p-3 "
      >
        <span>
          
          <DefaultUser size={40} />
        </span>
        <span className="font-medium text-white">
          {activeChat?.receiverName}
        </span>{' '}
      </div>
    </>
  )
}

export default ChatRoomNav
