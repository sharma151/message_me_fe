import UserDetailActionButton from '@/components/UserDetailActionButton'

const ActionBar = () => {
  return (
    <>
      <div className="w-18 border  border-r shrink-0 flex flex-col  items-center justify-end pb-4 bg-gray-700 ">
        <UserDetailActionButton />
      </div>
    </>
  )
}

export default ActionBar
