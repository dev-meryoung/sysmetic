import { useState } from 'react';
import { css } from '@emotion/react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Checkbox from '@/components/Checkbox';
import RadioButton from '@/components/RadioButton';
import TabButton from '@/components/TabButton';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_WEIGHT } from '@/constants/font';
import {
  AlgorithmFilterTypes,
  FilterProps,
  ItemFilterTypes,
} from '@/types/strategyFilter';

const TAB_NAME = ['항목별', '알고리즘별'];

const TAB_FILTERS: { [key: number]: FilterProps[] } = {
  0: [
    {
      id: 'operationMethod',
      label: '운용 방식',
      type: 'checkbox',
      options: [
        { value: 'manual', label: 'Manual Trading' },
        { value: 'system', label: 'System Trading' },
        { value: 'hybrid', label: 'Hybrid Trading (Manual + System)' },
      ],
    },
    {
      id: 'operationPeriod',
      label: '운용 주기',
      type: 'checkbox',
      options: [
        { value: 'day', label: '데이' },
        { value: 'position', label: '포지션' },
      ],
    },
    {
      id: 'operationType',
      label: '운용 종목',
      type: 'checkbox',
      options: [
        { value: 'domesticStocks', label: '국내주식' },
        { value: 'overseasStocks', label: '해외주식' },
        { value: 'domesticEtf', label: '국내 ETF' },
        { value: 'overseasEtf', label: '해외 ETF' },
        { value: 'domesticBonds', label: '국내 채권' },
        { value: 'overseasBonds', label: '해외 채권' },
        { value: 'domesticRitz', label: '국내 리츠' },
        { value: 'overseasRitz', label: '해외 리츠' },
      ],
    },
    {
      id: 'operationTerm',
      label: '운용 기간',
      type: 'radio',
      options: [
        { value: 'all', label: '전체' },
        { value: 'lessThan1Year', label: '1년 이하' },
        { value: '1To2Years', label: '1년 ~ 2년' },
        { value: '2To3Years', label: '2년 ~ 3년' },
        { value: 'moreThan3Years', label: '3년 이상' },
      ],
    },
    {
      id: 'profitRate',
      label: '누적손익률',
      type: 'radio',
      options: [
        // TODO: option 아직 미정. 추후 수정
        { value: 'subAll', label: '전체' },
        { value: 'subType1', label: '10% 이하' },
        { value: 'subType2', label: '10% ~ 20%' },
        { value: 'subType3', label: '30% 이상' },
      ],
    },
  ],
  1: [
    {
      id: 'algorithm',
      label: '알고리즘',
      type: 'radio',
      options: [
        { value: 'efficient', label: '효율형 전략' },
        { value: 'offensive', label: '공격형 전략' },
        { value: 'defensive', label: '방어형 전략' },
      ],
    },
  ],
};

const StrategyList = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchValue, setSearchValue] = useState('');

  // 상태 초기화
  const [itemFilters, setItemFilters] = useState<ItemFilterTypes>({
    operationMethod: ['manual', 'system', 'hybrid'],
    operationPeriod: ['day', 'position'],
    operationType: [
      'domesticStocks',
      'overseasStocks',
      'domesticEtf',
      'overseasEtf',
      'domesticBonds',
      'overseasBonds',
      'domesticRitz',
      'overseasRitz',
    ],
    operationTerm: 'all',
    profitRate: 'subAll',
  });

  const [algorithmFilters, setAlgorithmFilters] =
    useState<AlgorithmFilterTypes>({
      algorithm: 'efficient',
    });

  const updateFilters = (
    tabIndex: number,
    id: string,
    value: string | string[]
  ) => {
    if (tabIndex === 0) {
      // itemFilters 업데이트
      setItemFilters((prevFilters) => ({
        ...prevFilters,
        [id]: value,
      }));
    } else if (tabIndex === 1) {
      // algorithmFilters 업데이트
      setAlgorithmFilters((prevFilters) => ({
        ...prevFilters,
        [id]: value,
      }));
    }
  };

  const currentFilters = currentTab === 0 ? itemFilters : algorithmFilters;

  const StrategyListFilter = ({
    tabIndex,
    currentFilters,
    updateFilters,
  }: {
    tabIndex: number;
    currentFilters: ItemFilterTypes | AlgorithmFilterTypes;
    updateFilters: (
      tabIndex: number,
      id: string,
      value: string | string[]
    ) => void;
  }) => {
    const currentTabFilters = TAB_FILTERS[tabIndex];

    const renderFilterInput = (filter: FilterProps) => {
      switch (filter.type) {
        case 'select':
          return (
            <select
              value={
                currentTab === 0
                  ? itemFilters[filter.id as keyof ItemFilterTypes] || ''
                  : algorithmFilters[filter.id as keyof AlgorithmFilterTypes] ||
                    ''
              }
              onChange={(e) =>
                updateFilters(currentTab, filter.id, e.target.value)
              }
            >
              <option value='' disabled>
                종목 선택
              </option>
              {filter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'checkbox':
          return (
            <div css={checkboxGroupStyle}>
              {filter.options?.map((option) => (
                <Checkbox
                  key={option.value}
                  label={option.label}
                  checked={(
                    currentFilters[
                      filter.id as keyof typeof currentFilters
                    ] as string[]
                  ).includes(option.value)}
                  handleChange={(checked) => {
                    const values = currentFilters[
                      filter.id as keyof typeof currentFilters
                    ] as string[];
                    const updatedValues = checked
                      ? [...values, option.value]
                      : values.filter((v) => v !== option.value);
                    updateFilters(currentTab, filter.id, updatedValues);
                  }}
                />
              ))}
            </div>
          );

        case 'radio':
          return (
            <RadioButton
              options={filter.options || []}
              name={filter.id}
              selected={
                currentFilters[filter.id as keyof typeof currentFilters] ||
                filter.options?.[0]?.value ||
                ''
              }
              handleChange={(value) =>
                updateFilters(currentTab, filter.id, value)
              }
            />
          );

        default:
          return null;
      }
    };

    return (
      <div css={filterContentStyle}>
        {currentTabFilters.map((filter) => (
          <div className='filter' key={filter.id}>
            <label className='filter-label'>{filter.label}</label>
            {renderFilterInput(filter)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div css={strategyWrapperStyle}>
      <section className='search-box-bg'>
        <div className='search-box'>
          <TextInput
            type='text'
            iconNum='single'
            placeholder='전략명'
            color='skyblue'
            value={searchValue}
            width={360}
            handleChange={(e) => setSearchValue(e.target.value)}
          />
          <SearchOutlinedIcon />
        </div>
      </section>
      <section css={filterStyle}>
        <TabButton
          tabs={TAB_NAME}
          currentTab={currentTab}
          shape='square'
          handleTabChange={setCurrentTab}
        />
        <div className='filter-wrapper'>
          <StrategyListFilter
            tabIndex={currentTab}
            currentFilters={currentFilters}
            updateFilters={updateFilters}
          />
        </div>
      </section>
      <div>현재 필터: {JSON.stringify(currentFilters, null, 2)}</div>
    </div>
  );
};

const BG_COLOR = `#F1F7FE;`;

const strategyWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 40px;

  .search-box-bg {
    padding: 36px;
    width: 100%;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    border: 1px solid ${COLOR.PRIMARY100};
    background-color: ${BG_COLOR};

    .search-box {
      position: relative;
      svg {
        position: absolute;
        width: 48px;
        height: 48px;
        padding: 12px;
        right: 0;
        cursor: pointer;
      }
    }
  }
`;

const filterStyle = css`
  .filter-wrapper {
    border-width: 0px 1px 1px 1px;
    border-style: solid;
    border-color: ${COLOR.PRIMARY100};
    padding: 0 24px;
  }
`;

const filterContentStyle = css`
  .filter {
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 0;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      height: 1px;
      width: 100%;
      background-color: ${COLOR.GRAY400};
      bottom: 0;
    }

    .filter-label {
      font-weight: ${FONT_WEIGHT.BOLD};
      min-width: 70px;
    }
  }
`;

const checkboxGroupStyle = css`
  display: flex;
  gap: 12px;
`;

export default StrategyList;
