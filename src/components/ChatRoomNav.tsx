import { useActiveChat } from '@/core/hooks/common/useActiveChat'
import defaultimage from '@/assets/default-user.webp'
const ChatRoomNav = () => {
  const { activeChat } = useActiveChat()
  console.log('activeChat', activeChat)
  return (
    <>
      <div
        key={activeChat?.chatId}
        className=" flex items-center border-b  border-gray-200 gap-3 p-3 "
      >
        <span>
          <img
            src={defaultimage || '/default-avatar.png'}
            alt={'default user'}
            className="w-10 h-10 rounded-full"
          />
        </span>
        <span className="font-medium">{activeChat?.receiverName}</span>{' '}
      </div>
    </>
  )
}

export default ChatRoomNav
