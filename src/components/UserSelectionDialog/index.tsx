import { useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { MdClose, MdSearch } from 'react-icons/md'
import DefaultUserIcon from '@/features/user/components/DefaultUserIcon'
import { cn } from '@/lib/utils' // shadcn utility

interface User {
  id: number
  name: string
  status?: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  users: User[]
  onAddMembers: (userIds: number[]) => void
}

const UserSelectionDialog = ({
  isOpen,
  onClose,
  users,
  onAddMembers,
}: Props) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState('')

  const toggleUser = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        {/* CLEAR BACKDROP: Removed bg-black/80 and backdrop-blur */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />

        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] 
                     bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl outline-none overflow-hidden"
        >
          {/* HEADER */}
          <div className="flex items-center gap-4 p-4 pb-2 text-white">
            <button
              onClick={onClose}
              className="hover:bg-gray-800 p-1 rounded-full"
            >
              <MdClose size={24} />
            </button>
            <h2 className="text-lg font-medium">Add member</h2>
          </div>

          {/* SEARCH BAR */}
          <div className="px-4 py-2">
            <div className="relative flex items-center bg-gray-300 rounded-full px-3 py-1.5 border border-gray-400 focus-within:border-[#22C55E] transition-all">
              <MdSearch className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                placeholder="Search name or number"
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Contacts
          </p>

          {/* CONTACT LIST */}
          <div className="max-h-100 overflow-y-auto custom-scrollbar p-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => toggleUser(user.id)}
                className="flex items-center gap-4 px-4 py-2 hover:bg-gray-300 rounded-lg cursor-pointer transition"
              >
                {/* CHECKBOX */}
                <div
                  className={cn(
                    'w-5 h-5 border-2 rounded transition-colors flex items-center justify-center',
                    selectedIds.includes(user.id)
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-gray-600',
                  )}
                >
                  {selectedIds.includes(user.id) && (
                    <div className="w-1.5 h-3 border-r-2 border-b-2 border-white rotate-45 mb-0.5" />
                  )}
                </div>

                <DefaultUserIcon size={45} />

                <div className="flex-1  border-gray-800/50 pb-3 mt-3">
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.status || 'Hey there! I am using ChatApp.'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ACTION FOOTER (Optional) */}
          {selectedIds.length > 0 && (
            <div className="p-4 flex justify-end">
              <button
                onClick={() => onAddMembers(selectedIds)}
                className="bg-[#22C55E] hover:bg-emerald-600 text-[#111b21] font-bold py-1 px-3 rounded-full transition"
              >
                Add ({selectedIds.length})
              </button>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default UserSelectionDialog
