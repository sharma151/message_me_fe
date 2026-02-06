import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  isUserDetailOpen: boolean;
  isCreateGroupOpen: boolean;
  onCreateGroupOpen: () => void;
  onCreateGroupClose: () => void;
  onOpen: () => void;
  onClose: () => void;
  onUserDetailOpen: () => void;
  onUserDetailClose: () => void;
}

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
}));
