import UserDetailActionButton from '@/components/UserDetailActionButton'
import ChatIcon from '@/assets/chatIcon.png'

const ActionBar = () => {
  return (
    <>
      <div className="w-18 border  border-r shrink-0 flex flex-col  items-center justify-between pb-4 bg-gray-700 ">
        <div>
          <button className="mt-5 cursor-pointer border p-2 rounded-full bg-gray-300 border-gray-500">
            <img src={ChatIcon} alt="Chat" className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-end">
          <UserDetailActionButton />
        </div>
      </div>
    </>
  )
}

export default ActionBar
