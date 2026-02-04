// src/components/layout/AppLayout.tsx
import Sidebar from '@/components/sideBar'
// import ActionBar from "@/Components/ActionBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      {/* Left Sidebar */}
      <div className="h-screen flex">
        {/* <ActionBar />  */}

        <Sidebar />

        {/* Right Panel */}

        <div className="h-full flex-1">{children}</div>
      </div>
    </div>
  )
}
