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

const PAGE_SIZE = 5;

interface MyInterestListDataProps {
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

interface FolderProps {
  id: number;
  name: string;
  items: MyInterestListDataProps[];
}

const MyInterestList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MyInterestListDataProps[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [folders, setFolders] = useState<FolderProps[]>([
    { id: 1, name: '기본폴더 삭제 X', items: [] },
    { id: 2, name: '폴더 1', items: [] },
    { id: 2, name: '폴더 2', items: [] },
    { id: 2, name: '폴더 3', items: [] },
    { id: 2, name: '폴더 4', items: [] },
  ]);

  const [selectedFolderName, setSelectedFolderName] = useState<string>(
    `${folders[0].name}`
  );

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
    setFolders([
      { id: 1, name: '기본폴더 삭제 X', items: [] },
      { id: 2, name: '폴더 1', items: [] },
      { id: 2, name: '폴더 2', items: [] },
      { id: 2, name: '폴더 3', items: [] },
      { id: 2, name: '폴더 4', items: [] },
    ]);
  }, []);

  const columns = [
    {
      //기본: 누적수익율순 정력
      key: 'index' as keyof MyInterestListDataProps,
      header: '순서',
      render: (_: unknown, item: MyInterestListDataProps) => item.ranking,
    },
    {
      key: 'traderNickname' as keyof MyInterestListDataProps,
      header: '트레이더',
    },
    {
      key: 'strategyName' as keyof MyInterestListDataProps,
      header: '전략명',
    },
    {
      key: 'accumProfitLossRate' as keyof MyInterestListDataProps,
      header: '누적 수익률 (%)',
      sortable: true,
    },
    {
      key: 'mdd' as keyof MyInterestListDataProps,
      header: 'MDD',
      sortable: true,
    },
    {
      key: 'smScore' as keyof MyInterestListDataProps,
      header: 'SM Score',
      sortable: true,
    },
    {
      key: 'strategy' as keyof MyInterestListDataProps,
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

  const handleFolderClick = (folderName: string) => {
    setSelectedFolderName(folderName);
  };

  return (
    <div css={interestListWrapperStyle}>
      <section className='folder'>
        <Button label='폴더편집' width={80} handleClick={() => {}} />
        <section css={folderWrapper}>
          {folders.map((folder) => (
            <button
              key={folder.id}
              className='folder'
              onClick={() => {
                handleFolderClick(folder.name);
              }}
            >
              <span>{folder.name}</span>
            </button>
          ))}
        </section>
      </section>
      <section className='folder-name'>
        <h5>{selectedFolderName}</h5>
      </section>
      <section css={tableStyle}>
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
      </section>
    </div>
  );
};

const interestListWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 105px;

  .folder {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 24px;
  }

  .folder-name {
    position: relative;
    padding: 28px 0;

    h5::after {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: ${COLOR_OPACITY.BLACK_OPACITY30};
    }
  }
`;

const tableStyle = css`
  display: flex;
  flex-direction: column;
  gap: 32px;

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

const folderWrapper = css`
  display: flex;
  gap: 20px;
  width: 100%;

  .folder {
    border: 1px solid ${COLOR.PRIMARY100};
    border-radius: 4px;
    padding: 24px;
    min-height: 94px;
    width: 100%;
    display: flex;
    align-items: flex-start;
    background: transparent;

    span {
      font-weight: ${FONT_WEIGHT.BOLD};
      color: ${COLOR.PRIMARY};
      line-height: 160%;
    }

    :hover {
      cursor: pointer;
      background: ${COLOR_OPACITY.PRIMARY_OPACITY10};
      transition: 0.2s;
    }
  }
`;

export default MyInterestList;
