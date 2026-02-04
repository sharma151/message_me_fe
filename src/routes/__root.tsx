import { useAuthStore } from '@/store/auth.store'
import { Outlet, createRootRoute, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanStackDevtools } from '@tanstack/react-devtools'

// import Header from '../components/Header'

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
  return (
    <>
      <main className="overflow-y-auto w-full ">
        <Outlet />
      </main>
      <TanStackRouterDevtoolsPanel />
    </>
  )
}
