import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Checkbox from '@/components/Checkbox';
import IconButton from '@/components/IconButton';
import RadioButton from '@/components/RadioButton';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { useGetMethodAndStock } from '@/hooks/useStrategyApi';
import { FiltersProps, AlgorithmFilters } from '@/hooks/useStrategyFilters';

interface FilterOptionProps {
  value: string;
  label: string;
}

interface FilterProps {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range';
  options?: FilterOptionProps[];
}

interface FilterInputProps {
  filter: FilterProps;
  currentValue: string | string[] | [number, number] | undefined;
  onChange: (id: string, value: string | string[] | [number, number]) => void;
}

interface StrategyFilterProps {
  tabIndex: number;
  currentFilters: FiltersProps | AlgorithmFilters;
  onFilterChange: (
    id: string,
    value: string | string[] | [number, number]
  ) => void;
}

export const TAB_FILTERS: Record<number, FilterProps[]> = {
  0: [
    {
      id: 'methods',
      label: '운용 방식',
      type: 'checkbox',
      options: [],
    },
    {
      id: 'cycle',
      label: '운용 주기',
      type: 'checkbox',
      options: [
        { value: 'D', label: '데이' },
        { value: 'P', label: '포지션' },
      ],
    },
    {
      id: 'stockNames',
      label: '운용 종목',
      type: 'checkbox',
      options: [],
    },
    // {
    //   id: 'operationTerm',
    //   label: '운용 기간',
    //   type: 'radio',
    //   options: [
    //     { value: '1', label: '전체' },
    //     { value: '2', label: '1년 이하' },
    //     { value: '3', label: '1년 ~ 2년' },
    //     { value: '4', label: '2년 ~ 3년' },
    //     { value: '5', label: '3년 이상' },
    //   ],
    // },
    {
      id: 'accumProfitLossRate',
      label: '누적손익률',
      type: 'range',
      options: [],
    },
  ],
  1: [
    {
      id: 'algorithm',
      label: '알고리즘',
      type: 'radio',
      options: [
        { value: 'EFFICIENCY', label: '효율형 전략' },
        { value: 'OFFENSIVE', label: '공격형 전략' },
        { value: 'DEFENSIVE', label: '방어형 전략' },
      ],
    },
  ],
};

const FilterInput = ({ filter, currentValue, onChange }: FilterInputProps) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');

  useEffect(() => {
    if (Array.isArray(currentValue)) {
      setRangeStart(currentValue[0]?.toString() || '');
      setRangeEnd(currentValue[1]?.toString() || '');
    }
  }, [currentValue]);

  switch (filter.type) {
    case 'checkbox': {
      const selectedValues: string[] =
        (currentValue as string[]) ||
        filter.options?.map((option) => option.value);

      return (
        <div css={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {filter.options?.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={selectedValues.includes(option.value)}
              handleChange={(checked) => {
                const updatedValues = checked
                  ? [...selectedValues, option.value]
                  : selectedValues.filter((v) => v !== option.value);
                onChange(filter.id, updatedValues);
              }}
            />
          ))}
        </div>
      );
    }

    case 'radio': {
      const radioValue = currentValue as string;

      return (
        <RadioButton
          options={filter.options || []}
          name={filter.id}
          selected={radioValue || filter.options?.[0]?.value || ''}
          handleChange={(value) => onChange(filter.id, value)}
        />
      );
    }

    case 'range': {
      const handleRangeChange =
        (type: 'start' | 'end') => (e: React.ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (value !== '' && !/^[-]?\d*$/.test(value)) return; // 숫자 입력만 허용
          type === 'start' ? setRangeStart(value) : setRangeEnd(value);
        };

      const handleSubmit = () => {
        const startValue = rangeStart === '' ? '' : rangeStart.trim();
        const endValue = rangeEnd === '' ? '' : rangeEnd.trim();

        if (startValue === '' && endValue === '') {
          setErrorMessage('범위를 입력해주세요.');
          return;
        }

        if (
          startValue !== '' &&
          endValue !== '' &&
          parseInt(startValue, 10) >= parseInt(endValue, 10)
        ) {
          setErrorMessage('최소값이 최대값보다 작아야 합니다.');
          return;
        }

        if (
          (startValue !== '' &&
            (parseInt(startValue, 10) < -100 ||
              parseInt(startValue, 10) > 100)) ||
          (endValue !== '' &&
            (parseInt(endValue, 10) < -100 || parseInt(endValue, 10) > 100))
        ) {
          setErrorMessage('-100 ~ 100 사이의 값을 입력해주세요.');
          return;
        }

        // 각각의 값을 문자열로 전송
        onChange('accumulatedProfitLossRateRangeStart', startValue);
        onChange('accumulatedProfitLossRateRangeEnd', endValue);
        setErrorMessage('');
      };

      return (
        <div css={rangeStyle}>
          <div className='wrapper'>
            <TextInput
              type='text'
              value={rangeStart}
              placeholder='-100'
              width={118}
              handleChange={handleRangeChange('start')}
              handleKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            ~
            <TextInput
              type='text'
              value={rangeEnd}
              placeholder='100'
              width={118}
              handleChange={handleRangeChange('end')}
              handleKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            %
            <IconButton
              IconComponent={KeyboardDoubleArrowRightIcon}
              shape='none'
              handleClick={handleSubmit}
            />
          </div>
          {errorMessage && <span className='error-msg'>{errorMessage}</span>}
        </div>
      );
    }

    default:
      return null;
  }
};

const StrategyFilter = ({
  tabIndex,
  currentFilters,
  onFilterChange,
}: StrategyFilterProps) => {
  const { data: methodAndStockData } = useGetMethodAndStock();
  const [filters, setFilters] = useState(TAB_FILTERS);

  useEffect(() => {
    if (!methodAndStockData) return;

    const { methodList, stockList } = methodAndStockData;

    if (!methodList || !stockList) return;

    setFilters((prev) => {
      const updatedFilters = prev[0].map((filter) => {
        if (filter.id === 'methods') {
          return {
            ...filter,
            options: methodList.map((method) => ({
              value: method.name,
              label: method.name,
            })),
          };
        }
        if (filter.id === 'stockNames') {
          return {
            ...filter,
            options: stockList.map((stock) => ({
              value: stock.name,
              label: stock.name,
            })),
          };
        }
        return filter;
      });

      return {
        ...prev,
        0: updatedFilters,
      };
    });
  }, [methodAndStockData]);

  return (
    <div css={filterContentStyle}>
      {filters[tabIndex]?.map((filter) => (
        <div className='filter' key={filter.id}>
          <label className='filter-label'>{filter.label}</label>
          <FilterInput
            filter={filter}
            currentValue={currentFilters[filter.id]}
            onChange={onFilterChange}
          />
        </div>
      ))}
    </div>
  );
};

export default StrategyFilter;

const filterContentStyle = css`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  .filter {
    min-width: 200px;
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
    padding: 12px 0;

    &::after {
      content: '';
      position: absolute;
      height: 1px;
      width: 100%;
      background-color: ${COLOR.GRAY};
      bottom: 0;
      left: 0;
    }

    &:nth-last-of-type(1) {
      gap: 36px;
      padding: 14px 0;

      &::after {
        content: '';
        position: absolute;
        height: 1px;
        width: 100%;
        background-color: transparent;
        bottom: 0;
        left: 0;
      }
    }

    .filter-label {
      display: block;
      width: 70px;
      font-weight: ${FONT_WEIGHT.BOLD};
      color: ${COLOR.BLACK};
    }
  }
`;

const rangeStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .wrapper {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .error-msg {
    color: ${COLOR.ERROR_RED};
    font-size: ${FONT_SIZE.TEXT_SM};
  }
`;
