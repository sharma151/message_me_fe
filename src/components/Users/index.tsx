import CreateGroupChat from '@/features/sidebar/components/CreateGroupChat'
import AllUsersList from '@/features/sidebar/components/AllUserList'
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
