import { useEffect, useState, useRef } from 'react'
import { useParams } from '@tanstack/react-router'
import { socketService } from '@/socket/socket'
import { useAuthStore } from '@/store/auth.store'
import ChatRoomNav from '@/components/ChatRoomNav/index'
import { useChat } from '@/core/hooks/api/useChat'
import { RiLoader2Line } from 'react-icons/ri'
import CustomDropdown from '@/components/CustomDropdown'
import { FaAngleDown } from 'react-icons/fa'
import ChatInputBar from '@/components/ChatInputBar'

type Message = {
  id: number
  content: string
  senderId: number
  sender: {
    id: number
    name: string
  }
  createdAt: string
}

const ChatRoomPage = () => {
  const { chatId } = useParams({ strict: false })
  const parsedChatId = Number(chatId)
  const { messages, isLoadingMessages, queryClient } = useChat(parsedChatId)

  const userId = useAuthStore((state) => state.user?.id)


  const [isTyping, setIsTyping] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!parsedChatId || !userId) return

    socketService.connect(parsedChatId)

    socketService.on('newMessage', (newMessage: Message) => {
      queryClient.setQueryData(
        ['chats', parsedChatId],
        (oldData: Message[] | undefined) => {
          const history = oldData || []
          if (history.find((m) => m.id === newMessage.id)) return history
          return [...history, newMessage]
        },
      )
    })

    // --- TYPING LISTENERS ---
    socketService.on('user_typing', (data: { userId: string }) => {
      // Only show typing if it's not me
      if (data.userId !== socketService.socket?.id) {
        setIsTyping(true)
      }
    })

    socketService.on('user_stop_typing', () => {
      setIsTyping(false)
    })

    return () => {
      socketService.off('newMessage')
      socketService.off('user_typing')
      socketService.off('user_stop_typing')
    }
  }, [parsedChatId, userId, queryClient])

  // Scroll to bottom when messages or typing status changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  if (isLoadingMessages) {
    return (
      <div className="flex justify-center items-center h-full  bg-gray-800 ">
        <RiLoader2Line size={25} color="gray" className="animate-spin" />
      </div>
    )
  }

  const items = [{ key: 'Delete', label: 'Unsend' }]


  return (
    <div className="flex flex-col h-screen   bg-gray-800  bg-doodle-gray">
      <ChatRoomNav />

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2 custom-scrollbar"
      >
        {messages.map((msg: Message) => {
          const isMe = Number(msg?.senderId) === Number(userId)
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
              }}
            >
              <div
                className={`max-w-fit rounded-lg px-2 py-0.5 text-sm shadow relative flex  group
                  ${
                    isMe
                      ? 'bg-green-900 rounded-tr-none'
                      : 'bg-gray-600 rounded-tl-none'
                  }
                `}
              >
                <div>
                  {!isMe && (
                    <p className="text-xs font-bold text-blue-600 mb-1">
                      {msg?.sender?.name}
                    </p>
                  )}
                  {isMe ? (
                    <CustomDropdown
                      items={items}
                      buttonClassName="opacity-0 group-hover:opacity-100 absolute top-2 right-2 z-10 bg-white/50 rounded-full "
                      triggerContent={<FaAngleDown size={12} />}
                      onMenuClick={() => {
                        alert('clicked')
                      }}
                    />
                  ) : (
                    ''
                  )}

                  {msg.content && (
                    <p className="text-white wrap-break-words leading-relaxed">
                      {msg.content}
                    </p>
                  )}

                  <p className="text-[10px] text-gray-200 text-right ml-4">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )
        })}

        {/* TYPING INDICATOR */}
        {isTyping && (
          <div className="self-start bg-white px-4 py-2 rounded-lg rounded-tl-none shadow-sm flex items-center gap-1 max-w-25">
            <span className="text-xs text-gray-500 italic">typing</span>
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}

      <ChatInputBar chatId={parsedChatId} userId={userId} />
    </div>
  )
}

export default ChatRoomPage
