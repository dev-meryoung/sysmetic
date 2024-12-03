import { useEffect, useState } from 'react';
import { useGetMethodAndStock } from '@/hooks/useStrategyApi';

interface BaseFilters {
  [key: string]: string | string[] | undefined;
}

export interface FiltersProps extends BaseFilters {
  methods: string[];
  cycle: string[];
  stockNames: string[];
  accumulatedProfitLossRateRangeStart: string;
  accumulatedProfitLossRateRangeEnd: string;
  algorithm?: string;
}

export interface AlgorithmFilters extends BaseFilters {
  methods?: string[];
  cycle?: string[];
  stockNames?: string[];
  accumulatedProfitLossRateRangeStart?: string;
  accumulatedProfitLossRateRangeEnd?: string;
  algorithm: string;
}

type CombinedFilters = FiltersProps | AlgorithmFilters;

const createDefaultItemFilters = (
  methodList: string[] = [],
  stockList: string[] = []
): FiltersProps => ({
  methods: methodList,
  cycle: ['D', 'P'],
  stockNames: stockList,
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
  const { data } = useGetMethodAndStock();
  const [currentTab, setCurrentTab] = useState(0);
  const [itemFilters, setItemFilters] = useState<FiltersProps>(
    createDefaultItemFilters()
  );
  const [algorithmFilters, setAlgorithmFilters] = useState<AlgorithmFilters>(
    ALGORITHM_DEFAULT_FILTERS
  );
  const [hasFilterChanged, setHasFilterChanged] = useState(false);
  const [shouldShowDefaultList, setShouldShowDefaultList] = useState(true);
  const [dynamicMethodList, setDynamicMethodList] = useState<string[]>([]);
  const [dynamicStockList, setDynamicStockList] = useState<string[]>([]);

  useEffect(() => {
    if (!data?.methodList || !data?.stockList) return;

    try {
      const methods = data.methodList.map((method) => method.name);
      const stocks = data.stockList.map((stock) => stock.name);

      setDynamicMethodList(methods);
      setDynamicStockList(stocks);

      if (currentTab === 0) {
        setItemFilters((prev) => ({
          ...prev,
          methods,
          stockNames: stocks,
        }));
      }
    } catch (error) {
      setDynamicMethodList([]);
      setDynamicStockList([]);
    }
  }, [data, currentTab]);

  // 필터 변경 감지
  useEffect(() => {
    const currentFilters = currentTab === 0 ? itemFilters : algorithmFilters;
    const defaultFilters =
      currentTab === 0
        ? createDefaultItemFilters(dynamicMethodList, dynamicStockList)
        : ALGORITHM_DEFAULT_FILTERS;

    const filterKeys = Object.keys(currentFilters);
    const isChanged = !filterKeys.every((key) => {
      const currentValue = currentFilters[key];
      const defaultValue = defaultFilters[key as keyof typeof defaultFilters];
      return isEqual(currentValue, defaultValue);
    });

    setHasFilterChanged(isChanged);
  }, [
    currentTab,
    itemFilters,
    algorithmFilters,
    dynamicMethodList,
    dynamicStockList,
  ]);

  const setLocalFilters = (id: string, value: any) => {
    setShouldShowDefaultList(false);

    if (currentTab === 0) {
      setItemFilters((prev) => ({ ...prev, [id]: value }));
    } else {
      setAlgorithmFilters((prev) => ({ ...prev, [id]: value }));
    }
  };

  const resetFilters = () => {
    setShouldShowDefaultList(currentTab === 0);
    setHasFilterChanged(false);

    if (currentTab === 0) {
      setItemFilters(
        createDefaultItemFilters(dynamicMethodList, dynamicStockList)
      );
    } else {
      setAlgorithmFilters(ALGORITHM_DEFAULT_FILTERS);
    }
  };

  useEffect(() => {
    resetFilters();
  }, [currentTab]);

  useEffect(
    () => () => {
      setCurrentTab(0);
      resetFilters();
    },
    []
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
