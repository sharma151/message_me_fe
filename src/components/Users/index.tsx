import CreateGroupChat from '@/components/CreateGroupChat/index'
import AllUsersList from '@/components/AllUserList'
import { useModalStore } from '@/store/modal.store'

const Users = () => {
  const { onClose, isCreateGroupOpen } = useModalStore()
  return (
    <>
      {isCreateGroupOpen ? (
        <CreateGroupChat />
      ) : (
        <AllUsersList onBack={onClose} />
      )}
    </>
  )
}
export default Users
