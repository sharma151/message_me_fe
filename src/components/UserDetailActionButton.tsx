import { useAuth } from '@/core/hooks/api/useAuth'
import { useModalStore } from '@/store/modal.store'
import DefaultUser from '@/components/DefaultUser'

const UserDetailActionButton = () => {
  const { onUserDetailOpen } = useModalStore()
  const { userdetail } = useAuth()
  console.log('User Detail:', userdetail)
  return (
    <>
      <div className="w-18 shrink-0 flex flex-col  items-center justify-end  ">
        <div
          className=""
          onClick={onUserDetailOpen}
        >
          <DefaultUser />
        </div>
      </div>
    </>
  )
}

export default UserDetailActionButton
