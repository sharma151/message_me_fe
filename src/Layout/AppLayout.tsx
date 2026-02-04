// src/components/layout/AppLayout.tsx
import ActionBar from '@/components/ActionBar'
import Sidebar from '@/components/SideBar'
import { socketService } from '@/socket/socket'
import { useEffect } from 'react'
// import ActionBar from "@/Components/ActionBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    socketService.connect()

    return () => {
      socketService.disconnect()
    }
  }, [])
  return (
    <div className="h-screen">
      {/* Left Sidebar */}
      <div className="h-screen flex">
        <div className='flex w-1/3'>
          <ActionBar />

          <Sidebar />
        </div>

        {/* Right Panel */}

        <div className="h-full flex-1">{children}</div>
      </div>
    </div>
  )
}
