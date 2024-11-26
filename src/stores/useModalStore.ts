import { create } from 'zustand';

interface ModalStateProps {
  modals: {
    [key: string]: {
      isOpen: boolean;
      content: React.ReactNode | null;
      inputValue1: string;
      inputValue2: string;
      radioValue: string;
      width: number;
    };
  };
  openModal: (id: string, content: React.ReactNode, width?: number) => void;
  closeModal: (id: string) => void;
  resetModal: (id: string) => void;
  setInputValue: (id: string, field: string, value: string) => void;
  setRadioValue: (id: string, value: string) => void;
  setModalWidth: (id: string, width: number) => void;
}

export const useModalStore = create<ModalStateProps>((set) => ({
  modals: {},
  openModal: (id, content, width = 336) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: {
          isOpen: true,
          content,
          inputValue1: state.modals[id]?.inputValue1 || '',
          inputValue2: state.modals[id]?.inputValue2 || '',
          radioValue: '',
          width,
        },
      },
    })),
  closeModal: (id) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { ...state.modals[id], isOpen: false },
      },
    })),
  resetModal: (id) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { ...state.modals[id], inputValue1: '', inputValue2: '' },
      },
    })),
  setInputValue: (id, field, value) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: {
          ...state.modals[id],
          [field]: value,
        },
      },
    })),
  setRadioValue: (id, value) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { ...state.modals[id], radioValue: value },
      },
    })),
  setModalWidth: (id, width) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { ...state.modals[id], width },
      },
    })),
}));
