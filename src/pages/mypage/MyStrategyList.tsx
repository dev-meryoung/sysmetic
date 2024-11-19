import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import strategyData from '@/mocks/strategies.json';
import { useTableStore } from '@/stores/useTableStore';

const PAGE_SIZE = 10;

interface MyStrategyListDataProps {
  ranking?: number;
  traderNickname: string;
  strategyId: number;
  methodId: number;
  cycle: string;
  strategyName: string;
  mdd: number;
  smScore: number;
  accumProfitLossRate: number;
  followerCount: number;
}

const MyStrategyList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MyStrategyListDataProps[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );

  const getPaginatedData = (page: number) => {
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return data.slice(startIndex, endIndex);
  };

  const paginatedData = getPaginatedData(currentPage);

  useEffect(() => {
    const sortedData = [...strategyData].sort(
      (a, b) => b.accumProfitLossRate - a.accumProfitLossRate
    );
    const rankedData = sortedData.map((item, index) => ({
      ...item,
      ranking: index + 1,
    }));
    setData(rankedData);

    const pages = Math.ceil(rankedData.length / PAGE_SIZE);
    setTotalPage(pages);
  }, []);

  const columns = [
    {
      //기본: 누적수익율순 정력
      key: 'index' as keyof MyStrategyListDataProps,
      header: '순서',
      render: (_: unknown, item: MyStrategyListDataProps) => item.ranking,
    },
    {
      key: 'traderNickname' as keyof MyStrategyListDataProps,
      header: '트레이더',
    },
    {
      key: 'strategyName' as keyof MyStrategyListDataProps,
      header: '전략명',
    },
    {
      key: 'accumProfitLossRate' as keyof MyStrategyListDataProps,
      header: '누적 수익률 (%)',
      sortable: true,
    },
    {
      key: 'mdd' as keyof MyStrategyListDataProps,
      header: 'MDD',
      sortable: true,
    },
    {
      key: 'smScore' as keyof MyStrategyListDataProps,
      header: 'SM Score',
      sortable: true,
    },
    {
      key: 'strategy' as keyof MyStrategyListDataProps,
      header: '상태',
      render: () => (
        <div css={buttonStyle}>
          <Button
            label='관심 등록'
            shape='round'
            size='xs'
            color='point'
            width={80}
            handleClick={() => {}}
          />
          <Button
            label='상세보기'
            shape='round'
            size='xs'
            width={80}
            handleClick={() => {
              navigate(PATH.STRATEGIES_DETAIL());
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div css={strategyListWrapperStyle}>
      <div className='table-info'>
        <h6 className='info-text'>
          총 <strong>{data.length}개</strong>의 리스트
        </h6>
        <div className='btn-area'>
          <Button label='등록' width={80} handleClick={() => {}} />
          <Button
            label='삭제'
            width={80}
            color='black'
            handleClick={() => {}}
          />
        </div>
      </div>
      <Table
        data={paginatedData}
        columns={columns}
        hasCheckbox={true}
        checkedItems={checkedItems}
        handleCheckboxChange={toggleCheckbox}
        handleHeaderCheckboxChange={() =>
          toggleAllCheckboxes(paginatedData.length)
        }
      />
      <Pagination
        totalPage={totalPage}
        currentPage={currentPage}
        handlePageChange={setCurrentPage}
      />
    </div>
  );
};

const strategyListWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 105px;

  .table-info {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .info-text {
      font-weight: ${FONT_WEIGHT.REGULAR};

      strong {
        font-weight: ${FONT_WEIGHT.BOLD};
      }
    }

    .btn-area {
      display: flex;
      gap: 16px;
    }
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

export default MyStrategyList;
