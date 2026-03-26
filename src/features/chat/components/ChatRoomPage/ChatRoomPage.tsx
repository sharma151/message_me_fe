import { useEffect, useState, useRef } from 'react'
import { useParams } from '@tanstack/react-router'
import { socketService } from '@/socket/socket'
import { useAuthStore } from '@/store/auth.store'
import ChatRoomNav from '@/features/chat/components/ChatRoomNav'
import { useChat } from '@/core/hooks/api/useChat'
import { RiLoader2Line } from 'react-icons/ri'
import CustomDropdown, { type DropdownItem } from '@/components/CustomDropdown'
import { FaAngleDown } from 'react-icons/fa'
import ChatInputBar from '@/features/chat/components/ChatInputBar'
import { BsCheckLg } from 'react-icons/bs'
import { MdClose } from 'react-icons/md'
import { useModalStore } from '@/store/modal.store'
import ContactInfo from '@/features/chat/components/ContactInfo'

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

  const isContactInfoOpen = useModalStore((state) => state.isContactInfoOpen)

  const {
    messages,
    isLoadingMessages,
    queryClient,
    deleteMessage,
    editMessage,
  } = useChat(parsedChatId)

  const userId = useAuthStore((state) => state.user?.id)

  const [isTyping, setIsTyping] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null)
  const [tempMsg, setTempMsg] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)

  // SOCKET
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

    socketService.on('user_typing', (data: { userId: string }) => {
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

  // AUTO SCROLL
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  if (isLoadingMessages) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-800">
        <RiLoader2Line size={25} className="animate-spin text-gray-400" />
      </div>
    )
  }

  const items = [
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Unsend' },
  ]

  const handleMenuClick = (
    e: DropdownItem,
    chatId: number,
    msgId: number,
    content: string,
  ) => {
    if (e.key === 'delete') {
      deleteMessage({ msgId, chatId })
    }
    if (e.key === 'edit') {
      setTempMsg(content || '')
      setEditingMessageId(msgId)
    }
  }

  const handleEditMsgSave = () => {
    if (!editingMessageId || !tempMsg.trim()) return

    editMessage({
      msgId: editingMessageId,
      chatId: parsedChatId,
      content: tempMsg,
    })

    setEditingMessageId(null)
    setTempMsg('')
  }

  return (
    <div className="flex h-screen bg-gray-800">
      {/* LEFT → CHAT */}
      <div
        className={`flex flex-col transition-all duration-300 ${
          isContactInfoOpen ? 'w-[70%]' : 'w-full'
        }`}
      >
        <ChatRoomNav />

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2 custom-scrollbar bg-doodle-gray"
        >
          {messages.map((msg: Message) => {
            const isMe = Number(msg.senderId) === Number(userId)

            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '60%',
                }}
              >
                <div
                  className={`rounded-lg px-2 py-1 text-sm shadow relative flex group ${
                    isMe
                      ? 'bg-green-900 rounded-tr-none'
                      : 'bg-gray-600 rounded-tl-none'
                  }`}
                >
                  <div>
                    {!isMe && (
                      <p className="text-xs font-bold text-green-500 mb-1">
                        {msg.sender.name}
                      </p>
                    )}

                    {isMe && (
                      <CustomDropdown
                        items={items}
                        buttonClassName="opacity-0 group-hover:opacity-100 absolute top-1 right-1 bg-white/50 rounded-full"
                        triggerContent={<FaAngleDown size={12} />}
                        onMenuClick={(e) =>
                          handleMenuClick(e, parsedChatId, msg.id, msg.content)
                        }
                      />
                    )}

                    {isMe && editingMessageId === msg.id ? (
                      <div className="flex items-center gap-2 pr-4">
                        <input
                          autoFocus
                          className="bg-transparent outline-none text-white text-sm flex-1"
                          value={tempMsg}
                          onChange={(e) => setTempMsg(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleEditMsgSave()
                          }
                        />
                        <BsCheckLg
                          onClick={handleEditMsgSave}
                          className="text-green-400 cursor-pointer"
                        />
                        <MdClose
                          onClick={() => setEditingMessageId(null)}
                          className="text-red-400 cursor-pointer"
                        />
                      </div>
                    ) : (
                      <p className="text-white pr-4 wrap-break-words">
                        {msg.content}
                      </p>
                    )}

                    <p className="text-[10px] text-gray-200 text-right">
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

          {/* Typing */}
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

        {/* Input */}
        <ChatInputBar chatId={parsedChatId} userId={userId} />
      </div>

      {/* RIGHT → CONTACT INFO */}
      {isContactInfoOpen && (
        <div className="w-[40%] border-l border-gray-700  h-full">
          <ContactInfo />
        </div>
      )}
    </div>
  )
}

export default ChatRoomPage
