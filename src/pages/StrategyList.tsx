import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { css } from '@emotion/react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import ProfileImage from '@/components/ProfileImage';
import RadioButton from '@/components/RadioButton';
import StrategyFilter from '@/components/StrategyFilter';
import TabButton from '@/components/TabButton';
import Table, { ColumnProps } from '@/components/Table';
import Tag from '@/components/Tag';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useCreateFollowFolder,
  useCreateStrategyItemFilter,
  useGetFilterdStrategy,
  useGetStrategyAlgorithmFilter,
  useGetStrategyList,
  useGetUserFolderList,
} from '@/hooks/useStrategyApi';
import {
  getAlgorithmFilter,
  useStrategyFilters,
} from '@/hooks/useStrategyFilters';
import useAuthStore from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';
import { FilterValueTypes } from '@/types/strategyFilter';
import { getColorStyleBasedOnValue } from '@/utils/tableUtils';

export const TAB_NAME = ['항목별', '알고리즘별'];

interface PageInfoProps {
  currentPage: number;
  pageSize: number;
  totalElement: number;
  totalPages: number;
}

interface StrategyTableProps {
  strategyId: number;
  traderId: number;
  traderNickname: string;
  methodId: number;
  methodName: string;
  traderProfileImage?: string;
  name: string;
  cycle: string;
  stockList: {
    stockIds: number[];
    stockNames: string[];
    stockIconPath?: string[];
  };
  accumulatedProfitLossRate: number;
  mdd: number;
  smScore: number;
  ranking?: number;
  methodIconPath?: string;
  accumulatedProfitLossRateRangeStart?: string;
  accumulatedProfitLossRateRangeEnd?: string;
  strategy?: string;
  stockIconPath?: string[];
}

interface AddInterestModalProps {
  strategyId: number;
}

const CheckLoginModalContent = () => {
  const { closeModal } = useModalStore();
  const navigate = useNavigate();

  return (
    <div css={modalStyle}>
      로그인이 필요합니다.
      <br />
      로그인하시겠습니까?
      <div className='btn-area'>
        <Button
          label='메인가기'
          border={true}
          width={120}
          handleClick={() => {
            navigate(PATH.ROOT);
            closeModal('check-login-modal');
          }}
        />
        <Button
          label='로그인'
          width={120}
          handleClick={() => {
            navigate(PATH.SIGN_IN);
            closeModal('check-login-modal');
          }}
        />
      </div>
    </div>
  );
};

const AddInterestModalContent = ({ strategyId }: AddInterestModalProps) => {
  const { closeModal } = useModalStore();

  const { data: folderListData } = useGetUserFolderList();
  const { mutate: createFollowFolder } = useCreateFollowFolder();
  const [selectedOption, setSelectedOption] = useState<string | ''>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const folderOptions =
    folderListData?.data.map((folder: any) => ({
      value: folder.id,
      label: folder.name,
    })) || [];

  const handleRadioChange = (value: string) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      setSelectedOption(value);
      setErrorMessage('');
    } else {
      console.error('Invalid value:', value);
    }
  };

  const validateRequest = (
    folderId: number | '',
    strategyId: number
  ): boolean => {
    if (!folderId) {
      setErrorMessage('폴더를 선택해주세요.');
      return false;
    }

    if (!Number.isInteger(strategyId) || strategyId <= 0) {
      console.error('Invalid strategyId:', strategyId);
      setErrorMessage('유효하지 않은 전략 ID입니다.');
      return false;
    }

    return true;
  };

  const handleAddButtonClick = () => {
    const selectedOptionNumber = Number(selectedOption);

    if (!validateRequest(selectedOptionNumber, strategyId)) {
      return;
    }

    const requestBody = {
      folderId: Number(selectedOption),
      strategyId: Number(strategyId),
    };

    createFollowFolder(requestBody, {
      onSuccess: () => {
        closeModal('add-interest-modal');
        // addCompleteModal.openModal('add-complete-modal');
        setErrorMessage('');
        setSelectedOption('');
      },
    });
  };

  return (
    <div css={addInteresmodalStyle}>
      <span>관심등록</span>
      <RadioButton
        options={folderOptions}
        name='folder-radio'
        selected={selectedOption}
        handleChange={handleRadioChange}
      />
      {errorMessage && <span className='error-msg'>{errorMessage}</span>}
      <Button
        label='등록하기'
        size='sm'
        handleClick={handleAddButtonClick}
        disabled={!selectedOption}
      />
    </div>
  );
};

const AddCompleteModalContent = () => {
  const { closeModal } = useModalStore();
  const navigate = useNavigate();

  return (
    <div css={modalStyle}>
      해당전략을 관심등록했습니다.
      <br />
      마이페이지에서 확인하세요.
      <div className='btn-area'>
        <Button
          label='마이페이지 가기'
          border={true}
          width={120}
          handleClick={() => {
            navigate(PATH.MYPAGE);
            closeModal('check-login-modal');
          }}
        />
        <Button
          label='계속하기'
          width={120}
          handleClick={() => {
            closeModal('add-complete-modal');
          }}
        />
      </div>
    </div>
  );
};

export const StrategyList = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const checkLoginModal = useModalStore();
  const addInterestModal = useModalStore();
  // const addCompleteModal = useModalStore();

  const [strategyId, setStrategyId] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [isNotFound, setIsNotFound] = useState(false);

  const [pageInfo, setPageInfo] = useState<PageInfoProps>({
    currentPage: 0,
    pageSize: 10,
    totalElement: 0,
    totalPages: 0,
  });

  const {
    currentTab,
    filters,
    setCurrentTab,
    setLocalFilters,
    hasFilterChanged,
    resetFilters,
  } = useStrategyFilters();

  const [tableData, setTableData] = useState<StrategyTableProps[]>([]);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  // 각 전략별 관심 등록 상태 관리
  // const [interestStates, setInterestStates] = useState<{
  //   [strategyId: number]: boolean;
  // }>({});

  const { data: strategyListData } = useGetStrategyList(pageInfo.currentPage);

  const { mutate: createStrategyItemFilter } = useCreateStrategyItemFilter();

  const {
    data: algorithmData,
    refetch: algorithmDataRefetch,
    isSuccess,
  } = useGetStrategyAlgorithmFilter(
    pageInfo.currentPage,
    getAlgorithmFilter(filters)
  );

  const { data: strategyNameData, isLoading: strategyNameIsLoading } =
    useGetFilterdStrategy(searchValue, pageInfo.currentPage, isSearchEnabled);

  const [resultMessage, setResultMessage] = useState('');

  const fetchFilterdStrategies = useCallback(() => {
    if (currentTab === 0) {
      const requestBody = filters as {
        methods: string[];
        cycle: string[];
        stockNames: string[];
        accumulatedProfitLossRateRangeStart: string;
        accumulatedProfitLossRateRangeEnd: string;
      };

      createStrategyItemFilter(
        {
          pageNum: pageInfo.currentPage,
          requestBody,
        },
        {
          onSuccess: (data) => {
            setTableData(data?.data?.content || []);
            setPageInfo((prev) => ({
              ...prev,
              totalPages: data?.data?.totalPages ?? 0,
              pageSize: data?.data?.pageSize ?? 0,
            }));

            if (data.code === 404) {
              setResultMessage('상세 조건에 해당하는 검색 결과가 없습니다.');
            }
          },
        }
      );
    } else if (currentTab === 1) {
      if (isSuccess) {
        setTableData(algorithmData?.data?.content || []);
        setPageInfo((prev) => ({
          ...prev,
          totalPages: algorithmData?.data?.totalPages,
          pageSize: algorithmData?.data?.pageSize,
        }));

        if (algorithmData?.data?.code === 404) {
          setResultMessage('상세 조건에 해당하는 검색 결과가 없습니다.');
        }
      }

      // algorithmDataRefetch();
    }
  }, [
    currentTab,
    pageInfo.currentPage,
    filters,
    algorithmData,
    // algorithmDataRefetch,
    createStrategyItemFilter,
    isSuccess,
  ]);

  // 검색어 입력 처리 함수
  const handleSearch = useCallback(() => {
    if (searchValue !== '') {
      setIsSearchEnabled(true);
      setSearchValue(searchValue);
      setCurrentTab(0);
      resetFilters();
      setPageInfo((prevPageInfo) => ({
        ...prevPageInfo,
        currentPage: 0,
      }));
    }
  }, [searchValue, resetFilters, setCurrentTab]);

  // 탭 변경 시 검색어 및 쿼리 파라미터 초기화
  const handleTabChange: Dispatch<SetStateAction<number>> = useCallback(
    (value) => {
      const newTab = typeof value === 'function' ? value(currentTab) : value;
      setCurrentTab(newTab);
      setPageInfo((prevPageInfo) => ({
        ...prevPageInfo,
        currentPage: 0,
      }));
      setIsSearchEnabled(false);
      setResultMessage('');
      setIsNotFound(false);
    },
    [currentTab, setCurrentTab, setPageInfo]
  );

  // 필터 변경 시 검색어 초기화
  const handleFilterChange = useCallback(
    (id: string, value: FilterValueTypes) => {
      setLocalFilters(id, value);
      setSearchValue('');
    },
    [setLocalFilters]
  );

  const handlePageChange: Dispatch<SetStateAction<number>> = (value) => {
    const newPage =
      typeof value === 'function' ? value(pageInfo.currentPage) : value;

    setPageInfo((prevPageInfo) => ({
      ...prevPageInfo,
      currentPage: newPage,
    }));

    // 검색 중일 때는 검색 API 재호출
    if (isSearchEnabled) {
      setIsSearchEnabled(true);
    }
  };

  useEffect(() => {
    if (isSearchEnabled && strategyNameData?.data) {
      setTableData(strategyNameData?.data?.content || []);
      setPageInfo((prev) => ({
        ...prev,
        totalPages: strategyNameData.data.totalPages,
        pageSize: strategyNameData.data.pageSize,
      }));

      if (
        strategyNameData?.data?.content?.length === 0 &&
        !strategyNameIsLoading
      ) {
        setIsNotFound(true);
      } else {
        setIsNotFound(false);
      }

      setIsSearchEnabled(false);
    }
  }, [strategyNameData, isSearchEnabled, strategyNameIsLoading]);

  //검색초기화
  useEffect(() => {
    if (currentTab !== 0) {
      setSearchValue('');
      setIsSearchEnabled(false);
    }
  }, [setSearchValue, currentTab, filters]);

  // 알고리즘 탭 필터링
  useEffect(() => {
    if (isSearchEnabled || strategyNameData?.data) return;
    if (currentTab === 1) {
      fetchFilterdStrategies();
    }
  }, [
    currentTab,
    // filters.algorithm,
    isSearchEnabled,
    strategyNameData,
    fetchFilterdStrategies,
  ]);

  // 항목별 탭 필터링
  useEffect(() => {
    if (searchValue) return;
    if (currentTab === 0 && hasFilterChanged && !searchValue) {
      console.log(hasFilterChanged, 'hasFilterChanged2');
      fetchFilterdStrategies();
    }
  }, [
    // currentTab,
    hasFilterChanged,
    // filters,
    searchValue,
    fetchFilterdStrategies,
  ]);

  // 처음 로드시 전략 조회
  useEffect(() => {
    if (
      currentTab === 0 &&
      strategyListData &&
      !searchValue &&
      !hasFilterChanged
    ) {
      setTableData(strategyListData?.data?.content);
      setPageInfo((prev) => ({
        ...prev,
        totalPages: strategyListData?.data?.totalPages,
        pageSize: strategyListData?.data?.pageSize,
      }));
      setIsNotFound(false);
    }
  }, [strategyListData, currentTab, searchValue]);

  const handleButtonClick = (id: number) => {
    setStrategyId(id);
    addInterestModal.openModal('add-interest-modal', 216);
  };

  const columns: ColumnProps<StrategyTableProps>[] = [
    {
      key: 'ranking',
      header: '순위',
      render: (_, __, rowIndex) => {
        const ranking =
          pageInfo.currentPage * pageInfo.pageSize + (rowIndex + 1);
        return ranking;
      },
    },
    {
      key: 'traderNickname',
      header: '트레이더',
      render: (_, item) => (
        <div css={traderStyle}>
          <ProfileImage src={item.traderProfileImage || ''} />
          {item.traderNickname}
        </div>
      ),
    },
    {
      key: 'name',
      header: '전략명',
      render: (_, item) => (
        <div css={tagStyle}>
          <div className='tag'>
            <Tag src={item?.methodIconPath || ''} alt='tag' />
            {item?.stockList?.stockIconPath &&
              item?.stockList?.stockIconPath.map(
                (stock: string, index: number) => (
                  <Tag key={index} src={stock} alt='tag' />
                )
              )}
          </div>
          {item.name}
        </div>
      ),
    },
    {
      key: 'accumulatedProfitLossRate',
      header: '누적 손익률',
      render: (_, item) => {
        const itemValue = item.accumulatedProfitLossRate;

        const colorStyle = getColorStyleBasedOnValue(itemValue);

        return (
          <div css={fontStyle} style={colorStyle}>
            {itemValue}%
          </div>
        );
      },
    },
    {
      key: 'mdd',
      header: 'MDD',
      render: (_, item) => {
        const itemValue = item.mdd;

        const colorStyle = getColorStyleBasedOnValue(itemValue);

        return (
          <div css={fontStyle} style={colorStyle}>
            {itemValue}%
          </div>
        );
      },
    },
    {
      key: 'smScore',
      header: 'SM Score',
      render: (_, item) => {
        const itemValue = item.smScore;

        const colorStyle = getColorStyleBasedOnValue(itemValue);

        return (
          <div css={fontStyle} style={colorStyle}>
            {itemValue}%
          </div>
        );
      },
    },
    {
      key: 'strategy',
      header: '전략',
      render: (_, item) => (
        <div css={buttonStyle}>
          <Button
            // label={interestStates[item.strategyId] ? '관심 취소' : '관심 등록'}
            label='관심 등록'
            shape='round'
            size='xs'
            color='point'
            width={80}
            handleClick={() => {
              if (isLoggedIn) {
                handleButtonClick(item.strategyId);
              } else {
                checkLoginModal.openModal('check-login-modal', 360);
              }
            }}
          />
          <Button
            label='상세보기'
            shape='round'
            size='xs'
            width={80}
            handleClick={() => {
              navigate(PATH.STRATEGIES_DETAIL(String(item.strategyId)));
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div css={strategyWrapperStyle}>
      <Modal content={<CheckLoginModalContent />} id='check-login-modal' />
      <Modal
        content={<AddInterestModalContent strategyId={strategyId} />}
        id='add-interest-modal'
      />
      <Modal content={<AddCompleteModalContent />} id='add-complete-modal' />

      <section className='search-box-bg'>
        <div className='search-box'>
          <TextInput
            type='text'
            iconNum='single'
            placeholder='전략명'
            color='skyblue'
            value={searchValue}
            width={360}
            handleChange={(e) => {
              setSearchValue(e.target.value);
              setIsSearchEnabled(false);
            }}
            handleKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <div className='searchIcon' onClick={handleSearch}>
            <SearchOutlinedIcon />
          </div>
        </div>
      </section>

      <section css={filterStyle}>
        <TabButton
          tabs={TAB_NAME}
          currentTab={currentTab}
          shape='square'
          handleTabChange={handleTabChange}
        />
        <div className='filter-wrapper'>
          <StrategyFilter
            tabIndex={currentTab}
            currentFilters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </section>
      <div>현재 필터: {JSON.stringify(filters, null, 2)}</div>

      <section css={tableStyle}>
        <Table data={tableData} columns={columns} />
        {isNotFound ? (
          <div css={emptyContents}>결과가 없습니다.</div>
        ) : resultMessage ? (
          <div css={emptyContents}>{resultMessage}</div>
        ) : (
          ''
        )}
        {!isNotFound && !resultMessage && (
          <Pagination
            totalPage={pageInfo.totalPages}
            currentPage={pageInfo.currentPage}
            handlePageChange={handlePageChange}
          />
        )}
      </section>
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

      .searchIcon {
        position: absolute;
        width: 48px;
        height: 48px;
        padding: 12px;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        cursor: pointer;

        svg {
          font-size: ${FONT_SIZE.TITLE_SM};
        }
      }
    }
  }
`;

const filterStyle = css`
  .filter-wrapper {
    border-width: 0px 1px 1px 1px;
    border-style: solid;
    border-color: ${COLOR.PRIMARY100};
    padding: 0 16px;
  }
`;

const buttonStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  button:nth-of-type(1) {
    background: none;
    border: 1px solid ${COLOR.POINT};
    color: ${COLOR.POINT};

    :hover {
      background: ${COLOR_OPACITY.POINT_OPACITY10};
      transition: 0.3s;
    }
  }

  button:nth-of-type(2) {
    background: none;
    border: 1px solid ${COLOR.PRIMARY};
    color: ${COLOR.PRIMARY};

    :hover {
      background: ${COLOR_OPACITY.PRIMARY_OPACITY10};
      transition: 0.3s;
    }
  }
`;

const traderStyle = css`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const tagStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  text-align: start;

  .tag {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const tableStyle = css`
  display: flex;
  flex-direction: column;
  gap: 32px;

  table > thead > tr > th {
    &:nth-of-type(1) {
      width: 80px;
    }
    &:nth-of-type(2) {
      width: 204px;
    }
    &:nth-of-type(3) {
      width: 340px;
    }
    &:nth-of-type(4) {
      width: 196px;
    }
    &:nth-of-type(5) {
      width: 120px;
    }
    &:nth-of-type(6) {
      width: 120px;
    }
    &:nth-of-type(7) {
      width: 120px;
    }
  }
`;

const emptyContents = css`
  padding: 32px;
  border-radius: 4px;
  background: ${COLOR.GRAY100};
  text-align: center;
`;

const modalStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  line-height: 160%;
  padding-top: 8px;

  .btn-area {
    display: flex;
    gap: 16px;
  }
`;

const addInteresmodalStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;

  .css-1o97835 {
    flex-direction: column;
  }
  span {
    font-size: ${FONT_SIZE.TEXT_SM};
    font-weight: ${FONT_WEIGHT.MEDIUM};
  }
  .error-msg {
    color: ${COLOR.ERROR_RED};
    font-size: ${FONT_SIZE.TEXT_SM};
  }
`;

const fontStyle = css`
  font-weight: ${FONT_WEIGHT.BOLD};
`;

export default StrategyList;
