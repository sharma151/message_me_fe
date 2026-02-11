import { useState, useRef } from 'react'
import { PiPlusBold } from 'react-icons/pi'
import { IoSend } from 'react-icons/io5'
import { ChatPicker } from '@/components/ChatEmojiPicker/index'
import { socketService } from '@/socket/socket'

interface ChatInputBarProps {
  chatId: number
  userId: string | number | undefined
}

const ChatInputBar = ({ chatId, userId }: ChatInputBarProps) => {
  const [text, setText] = useState('')
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)

    // Notify server that I am typing
    socketService.emit('typing', { chatId: chatId.toString() })

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    // Set a timeout to emit 'stop_typing' after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit('stop_typing', { chatId: chatId.toString() })
    }, 1000)
  }

  const sendMessage = () => {
    if (!text.trim()) return

    // Clear typing timeout and notify stop immediately on send
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    socketService.emit('stop_typing', { chatId: chatId.toString() })

    socketService.emit('sendMessage', {
      chatId: chatId,
      senderId: userId,
      content: text,
    })

    setText('')
  }

  const handlePickerSelect = (content: string, type: 'text' | 'gif') => {
    if (type === 'gif') {
      socketService.emit('sendMessage', {
        chatId: chatId,
        senderId: userId,
        content: content,
      })
    } else {
      setText((prev) => prev + content)
    }
  }

  return (
    <div className="flex items-center gap-2 p-3">
      <div className="flex flex-1 items-center bg-gray-600 rounded-full px-1.5 py-1 ">
        <button className="p-2 text-white transition cursor-pointer rounded-full  hover:rounded-full hover:bg-gray-300 ">
          <PiPlusBold size={24} />
        </button>

        <ChatPicker onSelect={handlePickerSelect} />

        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder="Type a message"
          className="flex-1 bg-transparent border-none focus:outline-none text-[#e9edef] px-2 py-2 placeholder-gray-200"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
      </div>

      {text.trim().length > 0 && (
        <button
          onClick={sendMessage}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-[#00a884] text-[#111b21] hover:bg-[#06cf9c] transition-colors"
        >
          <IoSend size={20} />
        </button>
      )}
    </div>
  )
}

export default ChatInputBar
