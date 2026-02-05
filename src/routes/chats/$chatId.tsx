import ChatRoomPage from '@/components/ChatRoomPage'
import AppLayout from '@/Layout/AppLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chats/$chatId')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <AppLayout>
        <ChatRoomPage />
      </AppLayout>
    </>
  )
}
