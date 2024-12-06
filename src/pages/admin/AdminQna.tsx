import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import TabButton from '@/components/TabButton';
import Table, { ColumnProps } from '@/components/Table';
import Tag from '@/components/Tag';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useDeleteInquiryList, useGetInquiryList } from '@/hooks/useAdminApi';
import useModalStore from '@/stores/useModalStore';
import { useTableStore } from '@/stores/useTableStore';
import { extractDate } from '@/utils/dataUtils';

interface AdminQnaDataProps {
  ranking?: number;
  cycle: string;
  inquirerNickname: string;
  inquiryId: number;
  inquiryRegistrationDate: string;
  inquiryStatus: string;
  methodIconPath: string;
  methodId: number;
  statusCode: number;
  stockList: StockListProps;
  strategyId: number;
  strategyName: string;
  traderId: number;
  traderNickname: string;
  state?: string;
}

interface StockListProps {
  stockIconPath: string[];
}

const SearchOption = [
  { label: '전략명', value: 'strategy' },
  { label: '트레이더', value: 'trader' },
  { label: '작성자', value: 'inquirer' },
];

const DelModal = ({
  inquiryIdList,
  inquiryListDataRefetch,
}: {
  inquiryIdList: number[];
  inquiryListDataRefetch: () => void;
}) => {
  const { closeModal } = useModalStore();
  const deleteCompleteModal = useModalStore();
  const { toggleAllCheckboxes } = useTableStore();

  const { mutate: deleteInquiryListMutation } = useDeleteInquiryList();

  const handleInquiryIdListDelete = () => {
    deleteInquiryListMutation(
      { inquiryIdList },
      {
        onSuccess: async () => {
          inquiryListDataRefetch();
          toggleAllCheckboxes(0);
          closeModal('inquiry-delete-modal');
          deleteCompleteModal.openModal('delete-inquiry-complete-modal');
        },
        onError: (error) => {
          console.error('Strategy deletion failed:', error);
          alert(`삭제에 실패했습니다: ${error.message}`);
        },
      }
    );
  };

  return (
    <div css={ModalStyle}>
      <p>해당 전략을 삭제하시겠습니까?</p>
      <div className='btn'>
        <Button
          width={120}
          border={true}
          label='아니오'
          handleClick={() => closeModal('inquiry-delete-modal')}
        />
        <Button
          width={120}
          label='예'
          handleClick={handleInquiryIdListDelete}
        />
      </div>
    </div>
  );
};
const DelCompleteModal = () => (
  <div css={ModalStyle}>해당 전략이 삭제되었습니다.</div>
);

const CheckModalContent = () => (
  <div css={checkModalStyle}>삭제할 전략을 선택해주세요.</div>
);

const AdminQna = () => {
  const navigate = useNavigate();
  const deleteModal = useModalStore();
  const checkModal = useModalStore();

  const [tab, setTab] = useState(0);
  const [value, setValue] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectiedOption, setSelectedOption] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElement, setTotalElement] = useState(0);
  const [tableData, setTableData] = useState<AdminQnaDataProps[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );

  const getTabValue = (currentTab: number) => {
    switch (currentTab) {
      case 0:
        return 'all';
      case 1:
        return 'unclosed';
      case 2:
        return 'closed';
      default:
        return 'all';
    }
  };

  const {
    data: InquiryListData,
    refetch: inquiryListDataRefetch,
    isLoading,
  } = useGetInquiryList(0, getTabValue(tab), selectiedOption, searchText);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const getSelectedInquiryIdList = () => {
    const selectedInquiryIdList = checkedItems
      .map((index) => tableData[index]?.inquiryId)
      .filter((inquiryId) => inquiryId !== undefined);

    return selectedInquiryIdList;
  };

  const inquiryIdList = getSelectedInquiryIdList();

  const handleDeleteInquiryList = () => {
    if (checkedItems?.length > 0) {
      deleteModal.openModal('inquiry-delete-modal', 336);
    } else {
      checkModal.openModal('check-inquiry-modal', 336);
    }
  };

  const handleTabChange: Dispatch<SetStateAction<number>> = (newTab) => {
    if (typeof newTab === 'function') {
      setTab(newTab);
    } else {
      setTab(newTab);
      setSearchText('');
      setValue('');
    }
  };

  useEffect(() => {
    setTableData(InquiryListData?.data?.content || []);
    setTotalPage(InquiryListData?.data?.totalPages || 0);
    setTotalElement(InquiryListData?.data?.totalElement || 0);
    setPageSize(InquiryListData?.data?.pageSize || 0);
  }, [InquiryListData]);

  useEffect(() => {
    setCurrentPage(0);
  }, [tab]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchText]);

  const columns: ColumnProps<AdminQnaDataProps>[] = [
    {
      key: 'ranking',
      header: '순서',
      render: (_, __, rowIndex) => {
        const ranking = currentPage * pageSize + (rowIndex + 1);
        return ranking;
      },
    },
    {
      key: 'traderNickname',
      header: '트레이더',
    },
    {
      key: 'strategyName',
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
      key: 'inquiryRegistrationDate',
      header: '문의날짜',
      render: (_, item) => (
        <span>{extractDate(item.inquiryRegistrationDate)}</span>
      ),
    },
    {
      key: 'inquirerNickname',
      header: '작성자',
    },
    {
      key: 'inquiryStatus',
      header: '상태',
      render: (_, item) => (
        <span css={inquiryStatusStyle(item.inquiryStatus)}>
          {item.inquiryStatus === 'unclosed' ? '답변대기' : '답변완료'}
        </span>
      ),
    },
    {
      key: 'state',
      header: '관리',
      render: (_, item) => (
        <Button
          label='상세보기'
          shape='round'
          size='xs'
          color='primary'
          border={true}
          width={80}
          handleClick={() =>
            navigate(PATH.ADMIN_QNA_DETAIL(String(item.inquiryId)))
          }
        />
      ),
    },
  ];

  return (
    <div css={adminQnaWrapperStyle}>
      <div css={adminQnaHeaderStyle}>
        <h5>문의관리</h5>
        <p>
          시스메틱 투자자가 트레이더에게 문의한 내용과 답변 내용을 확인하고
          관리할 수 있는 페이지입니다.
        </p>
      </div>
      <div css={adminQnaTabStyle}>
        <TabButton
          tabs={['전체', '답변대기', '답변완료']}
          currentTab={tab}
          handleTabChange={handleTabChange}
          shape='round'
        />
      </div>
      <div css={adminQnaSearchStyle}>
        <SelectBox
          color='skyblue'
          options={SearchOption}
          value={selectiedOption}
          handleChange={handleOptionChange}
        />
        <TextInput
          placeholder='검색어를 입력해주세요.'
          color='skyblue'
          value={value}
          handleKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSearchText(value);
            }
          }}
          handleChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div css={adminQnaInfoStyle}>
        <p>
          총 <span>{totalElement}</span>의 문의가 있습니다.
        </p>
        <Button
          width={80}
          color='black'
          label='삭제'
          handleClick={handleDeleteInquiryList}
        />
      </div>
      <div css={adminQnaListStyle}>
        <Table
          data={tableData}
          columns={columns}
          hasCheckbox={tableData?.length > 0}
          checkedItems={checkedItems}
          handleCheckboxChange={toggleCheckbox}
          handleHeaderCheckboxChange={() =>
            toggleAllCheckboxes(tableData?.length || 0)
          }
        />
        {isLoading ? (
          <div css={loadingStyle}>
            <Loading />
          </div>
        ) : searchText ? (
          InquiryListData?.data?.content?.length > 0 ? (
            <div css={adminQnaPaginationStyle}>
              <Pagination
                totalPage={totalPage}
                currentPage={currentPage}
                handlePageChange={setCurrentPage}
              />
            </div>
          ) : (
            <span css={emptyContents}>검색결과가 없습니다.</span>
          )
        ) : InquiryListData?.data?.content?.length > 0 ? (
          <div css={adminQnaPaginationStyle}>
            <Pagination
              totalPage={totalPage}
              currentPage={currentPage}
              handlePageChange={setCurrentPage}
            />
          </div>
        ) : (
          <span css={emptyContents}>문의가 없습니다.</span>
        )}
      </div>
      <Modal
        content={
          <DelModal
            inquiryIdList={inquiryIdList}
            inquiryListDataRefetch={inquiryListDataRefetch}
          />
        }
        id='inquiry-delete-modal'
      />
      <Modal
        content={<DelCompleteModal />}
        id='delete-inquiry-complete-modal'
      />
      <Modal content={<CheckModalContent />} id='check-inquiry-modal' />
    </div>
  );
};

const inquiryStatusStyle = (inquiryStatus: string) => css`
  color: ${inquiryStatus === 'unclosed' ? 'initial' : COLOR.CHECK_GREEN};
`;

const adminQnaWrapperStyle = css`
  display: flex;
  flex-direction: column;
  margin: 96px auto 96px;
  padding: 0 10px;
  max-width: 1200px;
`;

const adminQnaHeaderStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 40px;
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};

  h5 {
    letter-spacing: -0.48px;
  }
`;

const loadingStyle = css`
  width: 100%;
  height: 100vh;
  padding: 100px;
`;

const emptyContents = css`
  padding: 32px;
  border-radius: 4px;
  background: ${COLOR.GRAY100};
  text-align: center;
`;

const adminQnaTabStyle = css`
  padding: 40px 0;
`;

const adminQnaSearchStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  height: 120px;

  background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
  border-radius: 2px;
`;

const adminQnaInfoStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 40px 0 24px;

  p {
    font-size: ${FONT_SIZE.TITLE_XS};
    letter-spacing: -0.4px;
  }

  span {
    font-weight: ${FONT_WEIGHT.BOLD};
  }
`;

const checkModalStyle = css`
  display: flex;
  margin-top: 8px;
  gap: 24px;
  padding: 16px;
`;

const adminQnaListStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;

  table > thead > tr > th {
    padding: 0;
    height: 48px;

    &:nth-of-type(1) {
      width: 60px;
    }
    &:nth-of-type(2) {
      width: 80px;
    }
    &:nth-of-type(3) {
      width: 160px;
    }
    &:nth-of-type(4) {
      width: 380px;
    }
    &:nth-of-type(5) {
      width: 120px;
    }
    &:nth-of-type(6) {
      width: 160px;
    }
    &:nth-of-type(7) {
      width: 100px;
    }
    &:nth-of-type(8) {
      width: 120px;
    }
  }

  div {
    justify-content: center;
  }
`;

const adminQnaPaginationStyle = css`
  margin-top: 32px;
`;

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

const ModalStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding-top: 8px;

  p {
    line-height: 160%;
  }

  .btn {
    display: flex;
    gap: 16px;
  }
`;
export default AdminQna;
