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
}

const ChatRoomPage = () => {
  const { chatId } = useParams({ strict: false })
  const parsedChatId = Number(chatId)

  // 1. Fetch history via TanStack Query (POST request)
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
                style={{
                  fontSize: 11,
                  opacity: 0.6,
                  marginBottom: 2,
                  textAlign: isMe ? 'right' : 'left',
                }}
              >
                {msg?.sender?.name}
              </div>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: isMe ? '#007AFF' : '#fff',
                  color: isMe ? '#fff' : '#000',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {msg.content}
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
          style={{
            flex: 1,
            padding: '10px 15px',
            borderRadius: 20,
            border: '1px solid #ccc',
            outline: 'none',
          }}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2.5 rounded-md bg-blue-500 text-white font-bold cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatRoomPage
