import { useCallback, useEffect, useState } from 'react';

interface BaseFilters {
  [key: string]: string | string[] | undefined;
}

export interface FiltersProps extends BaseFilters {
  methods: string[];
  cycle: string[];
  period: string;
  stockNames: string[];
  accumulatedProfitLossRateRangeStart: string;
  accumulatedProfitLossRateRangeEnd: string;
  algorithm?: string;
}

export interface AlgorithmFilters extends BaseFilters {
  methods?: string[];
  cycle?: string[];
  period?: string;
  stockNames?: string[];
  accumulatedProfitLossRateRangeStart?: string;
  accumulatedProfitLossRateRangeEnd?: string;
  algorithm: string;
}

type CombinedFilters = FiltersProps | AlgorithmFilters;

const createDefaultItemFilters = (
  _methodList: string[] = [],
  _stockList: string[] = []
): FiltersProps => ({
  methods: [],
  cycle: [],
  period: 'ALL',
  stockNames: [],
  accumulatedProfitLossRateRangeStart: '',
  accumulatedProfitLossRateRangeEnd: '',
});

const ALGORITHM_DEFAULT_FILTERS: AlgorithmFilters = {
  algorithm: 'EFFICIENCY',
};

const isEqual = (a: any, b: any): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => item === b[index]);
  }
  return a === b;
};

export const useStrategyFilters = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [itemFilters, setItemFilters] = useState<FiltersProps>(
    createDefaultItemFilters()
  );
  const [algorithmFilters, setAlgorithmFilters] = useState<AlgorithmFilters>(
    ALGORITHM_DEFAULT_FILTERS
  );
  const [hasFilterChanged, setHasFilterChanged] = useState(false);
  const [shouldShowDefaultList, setShouldShowDefaultList] = useState(true);

  useEffect(() => {
    const currentFilters = currentTab === 0 ? itemFilters : algorithmFilters;
    const defaultFilters =
      currentTab === 0
        ? createDefaultItemFilters([], [])
        : ALGORITHM_DEFAULT_FILTERS;

    const filterKeys = Object.keys(currentFilters);
    const isChanged = !filterKeys.every((key) => {
      const currentValue = currentFilters[key];
      const defaultValue = defaultFilters[key as keyof typeof defaultFilters];
      return isEqual(currentValue, defaultValue);
    });

    setHasFilterChanged(isChanged);
  }, [currentTab, itemFilters, algorithmFilters]);

  const setLocalFilters = (id: string, value: any) => {
    setShouldShowDefaultList(false);

    if (currentTab === 0) {
      setItemFilters((prev) => ({ ...prev, [id]: value }));
    } else {
      setAlgorithmFilters((prev) => ({ ...prev, [id]: value }));
    }
  };

  const resetFilters = useCallback(() => {
    setShouldShowDefaultList(currentTab === 0);
    setHasFilterChanged(false);

    if (currentTab === 0) {
      setItemFilters(createDefaultItemFilters([], []));
    } else {
      setAlgorithmFilters(ALGORITHM_DEFAULT_FILTERS);
    }
  }, [currentTab]);

  useEffect(() => {
    resetFilters();
  }, [currentTab, resetFilters]);

  useEffect(
    () => () => {
      setCurrentTab(0);
      resetFilters();
    },
    [resetFilters]
  );

  return {
    currentTab,
    setCurrentTab,
    filters: currentTab === 0 ? itemFilters : algorithmFilters,
    setLocalFilters,
    resetFilters,
    hasFilterChanged,
    shouldShowDefaultList,
  };
};

export const getAlgorithmFilter = (filters: CombinedFilters): string => {
  if ('algorithm' in filters && filters.algorithm !== undefined) {
    return filters.algorithm;
  }
  return ALGORITHM_DEFAULT_FILTERS.algorithm;
};
