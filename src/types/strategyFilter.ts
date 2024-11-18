export type FilterTypes = 'select' | 'checkbox' | 'radio';

export type ItemFilterTypes = {
  operationMethod: string[];
  operationPeriod: string[];
  operationType: string[];
  operationTerm: string;
  profitRate: string;
};

export type AlgorithmFilterTypes = {
  algorithm: string;
};

export interface FilterOptionProps {
  value: string;
  label: string;
}

export interface FilterProps {
  id: string;
  label: string;
  type: FilterTypes;
  options?: FilterOptionProps[];
}
