import { create } from 'zustand'

interface ModalState {
  isOpen: boolean
  isUserDetailOpen: boolean
  isCreateGroupOpen: boolean
  isContactInfoOpen: boolean
  onCreateGroupOpen: () => void
  onCreateGroupClose: () => void
  onOpen: () => void
  onClose: () => void
  onUserDetailOpen: () => void
  onUserDetailClose: () => void
  onContactInfoOpen: () => void
  onContactInfoClose: () => void
  isArchievedUserListOpen: boolean
  onArchievedUserListOpen: () => void
  onArchievedUserListClose: () => void
}

//need to be refactored in future temp solution
export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  isUserDetailOpen: false,
  onUserDetailOpen: () => set({ isUserDetailOpen: true }),
  onUserDetailClose: () => set({ isUserDetailOpen: false }),
  isCreateGroupOpen: false,
  onCreateGroupOpen: () => set({ isCreateGroupOpen: true }),
  onCreateGroupClose: () => set({ isCreateGroupOpen: false }),
  isContactInfoOpen: false,
  onContactInfoOpen: () => set({ isContactInfoOpen: true }),
  onContactInfoClose: () => set({ isContactInfoOpen: false }),
  isArchievedUserListOpen: false,
  onArchievedUserListOpen: () => set({ isArchievedUserListOpen: true }),
  onArchievedUserListClose: () => set({ isArchievedUserListOpen: false }),
}))
