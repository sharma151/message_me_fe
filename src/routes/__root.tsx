import { useAuthStore } from '@/store/auth.store'
import { Outlet, createRootRoute, redirect } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Progress } from '@/components/Progress'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated

    if (!isAuthenticated && !location.pathname.startsWith('/auth')) {
      throw redirect({
        to: '/auth/login',
      })
    }

    if (isAuthenticated && location.pathname.startsWith('/auth')) {
      throw redirect({
        to: '/chats',
      })
    }
  },
  component: RootLayout,
})

function RootLayout() {
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  if (isInitializing) {
    return <Progress />
  }
  return (
    <>
      <main className="overflow-y-auto w-full ">
        <Outlet />
      </main>
    </>
  )
}
