import { useEffect, useState, useRef } from 'react'
import { useParams } from '@tanstack/react-router'
import { socketService } from '@/socket/socket'
import { useAuthStore } from '@/store/auth.store'
import ChatRoomNav from './ChatRoomNav'
import { useChat } from '@/core/hooks/api/useChat'
// import CustomDropdown from './UI/CustomDropdown'
// import { FaAngleDown } from 'react-icons/fa'

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

  const [text, setText] = useState('')

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

    return () => {
      socketService.off('newMessage')
    }
  }, [parsedChatId, userId, queryClient])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = () => {
    if (!text.trim()) return

    socketService.emit('sendMessage', {
      chatId: parsedChatId,
      senderId: userId,
      content: text,
    })

    setText('')
  }

  if (isLoadingMessages) {
    return <div style={{ padding: 20 }}>Loading chat history...</div>
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#f5f5f5',
      }}
    >
      <ChatRoomNav />

      {/* Messages Area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
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
                className={`max-w- rounded-lg px-3 py-2 text-sm shadow relative flex gap-2 group
                  ${
                    isMe
                      ? 'bg-[#dcf8c6] rounded-tr-none'
                      : 'bg-white rounded-tl-none'
                  }
                `}
              >
                <div>
                  {!isMe && (
                    <p className="text-xs font-bold text-blue-600 mb-1">
                      {msg?.sender?.name}
                    </p>
                  )}

                  {msg.content && (
                    <p className="text-gray-900 wrap-break-words leading-relaxed">
                      {msg.content}
                    </p>
                  )}

                  <p className="text-[10px] text-gray-500 text-right mt-1 ml-4">
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
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: 16,
          background: '#fff',
          borderTop: '1px solid #ddd',
          display: 'flex',
          gap: 10,
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 "
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2.5 rounded-full bg-blue-500 text-white font-bold cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatRoomPage
