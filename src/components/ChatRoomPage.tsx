import { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { socketService } from '@/socket/socket'
import { useAuthStore } from '@/store/auth.store'

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

  const user = useAuthStore((state) => state.user)
  const userId = user?.id

  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')

  useEffect(() => {
    if (!parsedChatId || !userId) return

    socketService.connect()

    socketService.emit('joinChat', {
      chatId: parsedChatId,
      userId,
    })

    socketService.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socketService.off('newMessage')
    }
  }, [parsedChatId, userId])

  const sendMessage = () => {
    if (!text.trim()) return

    socketService.emit('sendMessage', {
      chatId: parsedChatId,
      senderId: userId,
      content: text,
    })

    setText('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: 8,
              //   textAlign: msg.senderId === userId ? 'right' : 'left',
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.6 }}>{msg.sender.name}</div>
            <div
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: 8,
                // background:
                //   msg.senderId === userId ? '#DCF8C6' : '#F1F1F1',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', padding: 16, gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1 }}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default ChatRoomPage