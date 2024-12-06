import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import Table, { ColumnProps } from '@/components/Table';
import Tag from '@/components/Tag';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { useGetAdminStrategyList } from '@/hooks/useAdminApi';

export type OpenStatusTypes = 'PUBLIC' | 'PRIVATE';
export type ApprovalStatusTypes = '요청 전' | '승인' | '반려' | '승인 요청';

interface AdminStrategyDataProps {
  strategyId: number;
  strategyName: string;
  traderName: string;
  openStatusCode: OpenStatusTypes;
  strategyCreateDate: string;
  methodId: string;
  methodIconPath: string;
  stockList: StockListProps;
  approvalStatusCode: ApprovalStatusTypes; //TODO: 단계 뭐뭐있는지?
}

interface StockListProps {
  stockIds: number[];
  stockNames: string[];
  stockIconPath: string[];
}

const StatusOption = [
  { label: '공개', value: 'PUBLIC' },
  { label: '비공개', value: 'PRIVATE' },
];

const StagedOption = [
  { label: '승인', value: '승인' },
  { label: '반려', value: '반려' },
  { label: '요청 전', value: '요청 전' },
  { label: '승인 요청', value: '승인 요청' },
];

const AdminStrategies = () => {
  // 필드 관련
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedStaged, setSelectedStaged] = useState('');
  const [value, SetValue] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  //테이블 관련
  const [curPage, setCurPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [totalElement, setTotalElement] = useState(0);
  // const [pageSize, setPageSize] = useState(0);
  const [tableData, setTableData] = useState<AdminStrategyDataProps[]>([]);
  //데이터 관련
  const params = {
    ...(selectedStatus && { openStatus: selectedStatus }),
    ...(selectedStaged && { approvalStatus: selectedStaged }),
    ...(searchKeyword && { keyword: searchKeyword }),
    page: curPage,
  };
  const { data, refetch } = useGetAdminStrategyList(params);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const handleStagedChange = (value: string) => {
    setSelectedStaged(value);
  };

  const handleIconClick = () => {
    setSearchKeyword(value);
    refetch();
  };

  useEffect(() => {
    console.log(selectedStatus);
  }, [selectedStatus]);

  useEffect(() => {
    console.log(selectedStaged);
  }, [selectedStaged]);

  useEffect(() => {
    setTableData(data?.data?.content || []);
    setTotalPage(data?.data?.totalPages || 0);
    setTotalElement(data?.data?.totalElement || 0);
    // setPageSize(data?.data?.pageSize || 0);
  }, [data]);

  const columns: ColumnProps<AdminStrategyDataProps>[] = [
    {
      key: 'strategyId' as keyof AdminStrategyDataProps,
      header: '순서',
    },
    {
      key: 'traderName' as keyof AdminStrategyDataProps,
      header: '트레이더',
    },
    {
      key: 'strategyName' as keyof AdminStrategyDataProps,
      header: '전략명',
      render: (_, item) => (
        <div css={tagStyle}>
          <div className='tag'>
            <Tag src={item?.methodIconPath || ''} />
            {item?.stockList?.stockIconPath &&
              item?.stockList?.stockIconPath.map(
                (stock: string, index: number) => (
                  <Tag key={index} src={stock || ''} alt='tag' />
                )
              )}
          </div>
          {item.strategyName}
        </div>
      ),
    },
    {
      key: 'strategyCreateDate' as keyof AdminStrategyDataProps,
      header: '전략등록일자',
      render: (_, item) => item.strategyCreateDate.substring(0, 10),
    },
    {
      key: 'openStatusCode' as keyof AdminStrategyDataProps,
      header: '공개여부',
      render: (_, item) =>
        item.openStatusCode === 'PUBLIC' ? '공개' : '비공개',
    },
    {
      key: 'approvalStatusCode' as keyof AdminStrategyDataProps,
      header: '승인단계',
      render: (_, item) => (
        <p css={approvalStatusStyle(item.approvalStatusCode)}>
          {item.approvalStatusCode}
        </p>
      ),
    },
    {
      key: 'state' as keyof AdminStrategyDataProps,
      header: '상태',
      render: () => (
        <div css={buttonStyle}>
          <Button
            label='상세관리'
            shape='round'
            size='xs'
            color='primary'
            border={true}
            width={80}
            handleClick={() => {}}
          />
        </div>
      ),
    },
  ];

  return (
    <div css={strategyWrapperStyle}>
      <div css={strategySearchDivStyle}>
        <SelectBox
          placeholder='공개여부'
          color='skyblue'
          options={StatusOption}
          handleChange={handleStatusChange}
        />
        <SelectBox
          placeholder='승인단계'
          color='skyblue'
          options={StagedOption}
          handleChange={handleStagedChange}
        />
        <div className='search-input'>
          <TextInput
            placeholder='전략명'
            iconNum='single'
            color='skyblue'
            value={value}
            handleChange={(e) => SetValue(e.target.value)}
          />
          <SearchOutlinedIcon css={iconStyle} onClick={handleIconClick} />
        </div>
      </div>
      <div css={strategyInfoStyle}>
        <p>
          총 <span>{totalElement}개</span>의 전략이 검색되었습니다.
        </p>
      </div>
      <div css={startegytableStyle}>
        {totalElement > 0 ? (
          <Table data={tableData} columns={columns} />
        ) : (
          <div className='no-data'> 전략이 존재하지 않습니다.</div>
        )}
      </div>
      <div css={strategyPaginationStyle}>
        <Pagination
          totalPage={totalPage}
          currentPage={curPage}
          handlePageChange={setCurPage}
        />
      </div>
    </div>
  );
};

const strategyWrapperStyle = css`
  display: flex;
  flex-direction: column;
  margin: 0 auto 96px;
  padding: 0 10px;
  max-width: 1200px;
`;

const strategySearchDivStyle = css`
  display: flex;
  gap: 16px;
  height: 120px;
  justify-content: center;
  align-items: center;
  background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};

  .search-input {
    position: relative;
  }
`;

const iconStyle = css`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  cursor: pointer;
`;

const strategyInfoStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 40px 0;

  font-size: ${FONT_SIZE.TITLE_XS};
  letter-spacing: -0.4px;

  p > span {
    font-weight: ${FONT_WEIGHT.BOLD};
  }
`;

const startegytableStyle = css`
  display: flex;
  flex-direction: column;
  gap: 29px;

  table > thead > tr > th {
    padding: 16px 0;
  }

  table > tbody > tr > td {
    padding: 24px 0;

    &:nth-of-type(1) {
      width: 80px;
    }

    &:nth-of-type(2) {
      width: 203px;
    }

    &:nth-of-type(3) {
      width: 441px;
    }

    &:nth-of-type(4) {
      width: 120px;
    }

    &:nth-of-type(5) {
      width: 114px;
    }

    &:nth-of-type(6) {
      width: 102px;
    }

    &:nth-of-type(7) {
      width: 120px;
    }
  }

  .no-data {
    height: 80px;
    background-color: ${COLOR.GRAY100};
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: ${FONT_SIZE.TEXT_LG};
  }
`;

const strategyPaginationStyle = css`
  margin-top: 40px;
`;

const buttonStyle = css``;

const tagStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;

  .tag {
    display: flex;
    gap: 4px;
  }
`;

const approvalStatusStyle = (approvalStatusCode: ApprovalStatusTypes) => css`
  color: ${approvalStatusCode === '반려'
    ? COLOR.ERROR_RED
    : approvalStatusCode === '승인'
      ? COLOR.CHECK_GREEN
      : approvalStatusCode === '요청 전'
        ? COLOR.GRAY700
        : COLOR.TEXT_BLACK};
`;
export default AdminStrategies;
