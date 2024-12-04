import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import Table, { ColumnProps } from '@/components/Table';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useDeleteTraderAddStrategyList,
  useGetTraderAddStrategyList,
} from '@/hooks/useStrategyApi';
import useModalStore from '@/stores/useModalStore';
import { useTableStore } from '@/stores/useTableStore';
import getColorStyleBasedOnValue from '@/utils/tableUtils';

interface MyStrategyListDataProps {
  ranking?: number;
  traderId: number;
  traderNickname: string;
  strategyId: number;
  methodId: number;
  cycle: string;
  name: string;
  mdd: number;
  smScore: number;
  accumulatedProfitLossRate: number;
  followerCount?: number;
  strategy?: any;
}

const PAGE_SIZE = 10;

const CheckModalContent = () => (
  <div css={checkModalStyle}>삭제할 전략을 선택해주세요.</div>
);

const DeleteStrategyModalContent = ({
  strategyIds,
  traderAddStrategyListRefetch,
}: {
  strategyIds: number[];
  traderAddStrategyListRefetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
}) => {
  const { closeModal } = useModalStore();
  const { toggleAllCheckboxes } = useTableStore();

  const { mutate: deleteStrategyMutation } = useDeleteTraderAddStrategyList();

  const handleStrategyDelete = () => {
    deleteStrategyMutation(
      { idList: strategyIds },
      {
        onSuccess: async () => {
          traderAddStrategyListRefetch();
          toggleAllCheckboxes(0);
          closeModal('delete-strategy-modal-01');
        },
        onError: (error: any) => {
          console.error('Strategy deletion failed:', error);
          alert(`삭제에 실패했습니다: ${error.message}`);
        },
      }
    );
  };

  return (
    <div css={modalStyle}>
      해당전략의 데이터를
      <br />
      삭제하시겠습니까?
      <div className='btn-area'>
        <Button
          label='아니오'
          border={true}
          width={120}
          handleClick={() => closeModal('delete-strategy-modal-01')}
        />
        <Button label='예' width={120} handleClick={handleStrategyDelete} />
      </div>
    </div>
  );
};

const MyStrategyList = () => {
  const navigate = useNavigate();
  const deleteModal01 = useModalStore();
  const checkModal01 = useModalStore();

  const [tableData, setTableData] = useState<MyStrategyListDataProps[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );

  const page = 0;
  const {
    data: traderAddStrategyListData,
    refetch: traderAddStrategyListRefetch,
  } = useGetTraderAddStrategyList(page);

  const traderName = traderAddStrategyListData?.data?.traderNickname;

  useEffect(() => {
    if (traderAddStrategyListData) {
      const data = traderAddStrategyListData?.data?.strategyList;
      setTotalPage(data?.totalPages);
      setTableData(data?.content);
      setPageSize(data?.pageSize);
    }
  }, [traderAddStrategyListData]);

  const getSelectedStrategyIds = () => {
    const selectedStrategyIds = checkedItems
      .map((index) => tableData[index]?.strategyId)
      .filter((strategyId) => strategyId !== undefined);

    return selectedStrategyIds;
  };

  const strategyIds = getSelectedStrategyIds();

  const handleDeleteInterestStrategy = () => {
    if (checkedItems?.length > 0) {
      deleteModal01.openModal('delete-strategy-modal-01', 360);
    } else {
      checkModal01.openModal('check-modal-01', 336);
    }
  };

  const columns: ColumnProps<MyStrategyListDataProps>[] = [
    {
      key: 'ranking',
      header: '순서',
      render: (_, __, rowIndex: number) =>
        rowIndex + 1 + currentPage * pageSize,
    },
    {
      key: 'traderNickname',
      header: '트레이더',
      render: () => <div>{traderName}</div>,
    },
    {
      key: 'name',
      header: '전략명',
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
      header: '상태',
      render: (_, item) => (
        <div css={buttonStyle}>
          <Button
            label='전략 수정'
            shape='round'
            size='xs'
            width={80}
            handleClick={() =>
              navigate(PATH.MYPAGE_STRATEGIES_EDIT(String(item.strategyId)))
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div css={strategyListWrapperStyle}>
      <div className='table-info'>
        <h6 className='info-text'>
          {/* 총 <strong>{tradersStrategyData?.data?.length}개</strong>의 리스트 */}
        </h6>
        <div className='btn-area'>
          <Button
            label='삭제'
            width={80}
            color='black'
            handleClick={handleDeleteInterestStrategy}
          />
        </div>
      </div>
      <Table
        data={tableData}
        columns={columns}
        hasCheckbox={true}
        checkedItems={checkedItems}
        handleCheckboxChange={toggleCheckbox}
        handleHeaderCheckboxChange={() => toggleAllCheckboxes(tableData.length)}
      />
      <Pagination
        totalPage={totalPage}
        currentPage={currentPage}
        handlePageChange={setCurrentPage}
      />
      <Modal
        content={
          <DeleteStrategyModalContent
            strategyIds={strategyIds as number[]}
            traderAddStrategyListRefetch={traderAddStrategyListRefetch}
          />
        }
        id='delete-strategy-modal-01'
      />
      <Modal content={<CheckModalContent />} id='check-modal-01' />
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

const modalStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  line-height: 160%;
  text-align: center;
  margin-top: 8px;

  .btn-area {
    display: flex;
    gap: 16px;
  }

  .delete-error-msg {
    color: ${COLOR.ERROR_RED};
    font-size: ${FONT_SIZE.TEXT_SM};
  }
`;

const fontStyle = css`
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const checkModalStyle = css`
  display: flex;
  margin-top: 8px;
  gap: 24px;
  padding: 24px 0;
`;

export default MyStrategyList;
