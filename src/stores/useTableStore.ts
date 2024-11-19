import { create } from 'zustand';

interface TableStateProps {
  checkedItems: number[];
  toggleCheckbox: (index: number) => void;
  toggleAllCheckboxes: (totalItems: number) => void;
}

export const useTableStore = create<TableStateProps>((set) => ({
  checkedItems: [],

  toggleCheckbox: (index: number) =>
    set((state: TableStateProps) => {
      const position = state.checkedItems.indexOf(index);
      if (position === -1) {
        return { checkedItems: [...state.checkedItems, index] };
      }
      return {
        checkedItems: state.checkedItems.filter((item) => item !== index),
      };
    }),

  toggleAllCheckboxes: (totalItems: number) =>
    set((state: TableStateProps) => {
      if (state.checkedItems.length === totalItems) {
        return { checkedItems: [] };
      }
      return {
        checkedItems: Array.from({ length: totalItems }, (_, i) => i),
      };
    }),
}));
