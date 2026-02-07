// src/components/layout/AppLayout.tsx
import ActionBar from '@/components/ActionBar'
import Sidebar from '@/components/SideBar'
import { socketService } from '@/socket/socket'
import { useEffect } from 'react'
// import ActionBar from "@/Components/ActionBar";
import { Group, Panel, Separator } from 'react-resizable-panels'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    socketService.connect()

    return () => {
      socketService.disconnect()
    }
  }, [])
  return (
    <Group orientation="horizontal" className="h-screen">
      <div className="h-screen flex">
        <ActionBar />
      </div>

      <Panel defaultSize={350} minSize={200} maxSize={400}>
        <Sidebar />
      </Panel>

      <Separator className="w-0 " />

      <Panel>
        <div className="h-full flex-1">{children}</div>
      </Panel>
    </Group>
  )
}
