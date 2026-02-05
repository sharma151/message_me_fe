import type { UserProfileResponse } from '@/@types/forms/auth'
import { useAuth } from '@/core/hooks/api/useAuth'
import defaultimage from '@/assets/default-user.webp'
import { useNavigate } from '@tanstack/react-router'
const AllUserList = () => {
  const { users, isFetchingUsers } = useAuth()

  const navigate = useNavigate()
  const handleRowClick = ({ chatID }: { chatID: any }) => {
    
    navigate({
      to: '/chats/$chatId',
      params: { chatId: chatID },
    })
  }
  if (isFetchingUsers) {
    return <div>Loading users...</div>
  }
  return (
    <>
      <div className="px-2 ">
        <h2 className="text-lg font-semibold mb-2">All Users</h2>
        <div className="space-y-1 overflow-y-auto max-h-96">
          {users ? (
            users.map((user: UserProfileResponse) => (
              <div
                key={user.id}
                onClick={() => handleRowClick({ chatID: user.id })}
                className=" flex items-center border-b  border-gray-200 space-x-3 p-2 hover:rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <span>
                  <img
                    src={defaultimage || '/default-avatar.png'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                </span>
                <span className="font-medium">{user.name}</span>{' '}
              </div>
            ))
          ) : (
            <li>No users found.</li>
          )}
        </div>
      </div>
    </>
  )
}

export default AllUserList
