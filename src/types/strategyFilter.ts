export type FilterTypes = 'select' | 'checkbox' | 'radio' | 'range';

export type FilterValueTypes = string | string[] | number[] | [number, number];

export interface FilterItemsProps {
  strategyId?: number;
  traderNickname?: string;
  name?: string;
  mdd?: number;
  smScore?: number;
  methodId?: number;
  stockList?: string[];
  cycle?: string[] | string;
  accumProfitLossRate?: [number, number] | number[];
  operationTerm?: string[] | string;
  methodName?: string[] | string;
  algorithm?: string[] | string;
}

export interface FilterProps {
  id: string;
  label: string;
  type: FilterTypes;
  options?: FilterOptionProps[];
}

export interface TabFiltersTypes {
  [key: number]: FilterProps[];
}

export interface FilterOptionProps {
  value: string;
  label: string;
}

export interface UseStrategyFiltersProps {
  handleFilterChange?: (filters: FilterItemsProps) => void;
}
