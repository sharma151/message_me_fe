import { useEffect, useState, useRef } from 'react'
import { useParams } from '@tanstack/react-router'
import { socketService } from '@/socket/socket'
import { useAuthStore } from '@/store/auth.store'
import ChatRoomNav from './ChatRoomNav'
import { useChat } from '@/core/hooks/api/useChat'

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

  const [isTyping, setIsTyping] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  // --- TYPING EMITTER LOGIC ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)

    // Notify server that I am typing
    socketService.emit('typing', { chatId: parsedChatId.toString() })

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    // Set a timeout to emit 'stop_typing' after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit('stop_typing', { chatId: parsedChatId.toString() })
    }, 1000)
  }

  const sendMessage = () => {
    if (!text.trim()) return

    // Clear typing timeout and notify stop immediately on send
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    socketService.emit('stop_typing', { chatId: parsedChatId.toString() })

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
    <div className="flex flex-col h-[100vh] bg-[#efeae2]">
      <ChatRoomNav />

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2"
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

        {/* TYPING INDICATOR */}
        {isTyping && (
          <div className="self-start bg-white px-4 py-2 rounded-lg rounded-tl-none shadow-sm flex items-center gap-1 max-w-[100px]">
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
          onChange={handleInputChange}
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
