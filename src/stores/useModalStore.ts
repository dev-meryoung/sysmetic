import { create } from 'zustand';

interface ModalConfig {
  isOpen: boolean;
  width?: number;
}

interface ModalStateProps {
  modals: Record<string, ModalConfig>;
  openModal: (id: string, width?: number) => void;
  closeModal: (id: string) => void;
}

const useModalStore = create<ModalStateProps>((set) => ({
  modals: {},
  openModal: (id: string, width: number = 336) =>
    set((state: ModalStateProps) => ({
      modals: {
        ...state.modals,
        [id]: { isOpen: true, width },
      },
    })),
  closeModal: (id: string) =>
    set((state: ModalStateProps) => ({
      modals: {
        ...state.modals,
        [id]: { ...state.modals[id], isOpen: false },
      },
    })),
}));

export default useModalStore;
