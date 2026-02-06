import { useAuth } from '@/core/hooks/api/useAuth'
import { useModalStore } from '@/store/modal.store'
import defaultImage from '@/assets/default-user.webp'

const UserDetailActionButton = () => {
  const { onUserDetailOpen } = useModalStore()
  const { userdetail } = useAuth()
  console.log('User Detail:', userdetail)
  return (
    <>
      <div className="w-18 shrink-0 flex flex-col  items-center justify-end  ">
        <div
          className="w-14 h-14 rounded-full overflow-hidden border-none flex justify-end"
          onClick={onUserDetailOpen}
        >
          <img
            src={defaultImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  )
}

export default UserDetailActionButton
