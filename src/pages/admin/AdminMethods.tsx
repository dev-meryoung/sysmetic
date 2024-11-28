import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import TagTest from '@/assets/images/test-tag.jpg';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import Tag from '@/components/Tag';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import adminMethods from '@/mocks/adminMethods.json';
import useModalStore from '@/stores/useModalStore';
import { useTableStore } from '@/stores/useTableStore';

interface AdminMethodsDataProps {
  no: number;
  type: string;
}

interface DelModalProps {
  toggleAllCheckBoxes: (value: number) => void;
}

const PAGE_SIZE = 10;

const DelModal: React.FC<DelModalProps> = ({ toggleAllCheckBoxes }) => {
  const delModal = useModalStore();

  const handleDeleteClick = () => {
    //? 데이터 삭제 코드
    //1. data.filter()를 통해 체크된 항목을 제외한 새로운 데이터 생성
    //2. setData(변수명)을 통해 data 상태 업데이트
    //3. 페이지 수 최신화 업데이트

    //4.체크박스 상태 초기화 및 모달 닫기
    toggleAllCheckBoxes(0);
    delModal.closeModal('delete');
  };

  return (
    <div css={delModalStyle}>
      <p>해당 종목을 삭제하시겠습니까?</p>
      <div className='del-modal-btn'>
        <Button
          width={120}
          border={true}
          label='아니오'
          handleClick={() => delModal.closeModal('delete')}
        />
        <Button width={120} label='예' handleClick={handleDeleteClick} />
      </div>
    </div>
  );
};

const AdminMethods = () => {
  //테이블 관련
  const [curPage, setCurPage] = useState(0);
  const [data, setData] = useState<AdminMethodsDataProps[]>([]);
  //페이지네이션 관련
  const [totalPage, setTotalPage] = useState(0);
  const getPaginatedData = (page: number) => {
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return data.slice(startIndex, endIndex);
  };

  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );

  const paginatedData = getPaginatedData(curPage);
  const columns = [
    {
      key: 'no' as keyof AdminMethodsDataProps,
      header: '순서',
    },
    {
      key: 'type' as keyof AdminMethodsDataProps,
      header: '상품유형',
    },
    {
      key: 'icon' as keyof AdminMethodsDataProps,
      header: '아이콘',
      render: (value: string | number) => (
        <div css={tagStyle}>
          <div>
            <Tag src={TagTest} alt='tag' />
          </div>
          {value}
        </div>
      ),
    },
    {
      key: 'state' as keyof AdminMethodsDataProps,
      header: '상태',
      render: () => (
        <Button
          label='방식수정'
          shape='round'
          size='xs'
          color='primary'
          border={true}
          width={80}
          handleClick={() => {}}
        />
      ),
    },
  ];

  //모달 관련
  const delModal = useModalStore();

  const openDeleteModal = () => {
    if (checkedItems.length > 0) {
      delModal.openModal('delete');
    }
  };

  useEffect(() => {
    // 순서를 기준으로
    const sortedData = [...adminMethods].sort((a, b) => b.no - a.no);
    const arrangedData = sortedData.map((item, index) => ({
      ...item,
      no: index + 1,
    }));
    setData(arrangedData);

    const pages = Math.ceil(arrangedData.length / PAGE_SIZE);
    setTotalPage(pages);
  }, []);

  return (
    <div css={methodsWrapperStyle}>
      <div css={methodsInfoStyle}>
        <p>
          총 <span>15개</span>의 매매방식이 있습니다.
        </p>
        <div className='manage-btn'>
          <Button
            width={80}
            label='등록'
            handleClick={() => console.log('등록')}
          />
          <Button
            width={80}
            color='black'
            label='삭제'
            handleClick={openDeleteModal}
          />
        </div>
      </div>
      <div css={methodsTableStyle}>
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
      </div>
      <div css={methodsPaginationStyle}>
        <Pagination
          totalPage={totalPage}
          currentPage={curPage}
          handlePageChange={setCurPage}
        />
      </div>
      <Modal
        content={<DelModal toggleAllCheckBoxes={toggleAllCheckboxes} />}
        id='delete'
      />
    </div>
  );
};

const methodsWrapperStyle = css`
  display: flex;
  flex-direction: column;
  margin: 0 auto 96px;
  padding: 0 10px;
  max-width: 1200px;
`;

const methodsInfoStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${FONT_SIZE.TITLE_XS};
  letter-spacing: -0.4px;
  margin-bottom: 24px;

  p > span {
    font-weight: ${FONT_WEIGHT.BOLD};
  }

  .manage-btn {
    display: flex;
    gap: 16px;
  }
`;

const methodsTableStyle = css`
  display: flex;
  flex-direction: column;
  gap: 29px;

  table > thead > tr > th {
    padding: 16px 0;

    div {
      align-items: center;
      justify-content: center;
    }
  }

  table > tbody > tr > td {
    padding: 16px 0;

    div {
      align-items: center;
      justify-content: center;
    }

    &:nth-of-type(1) {
      width: 60px;
    }
    &:nth-of-type(2) {
      width: 80px;
    }
    &:nth-of-type(3) {
      width: 460px;
    }
    &:nth-of-type(4) {
      width: 460px;
    }
    &:nth-of-type(5) {
      width: 120px;
    }
  }
`;

const methodsPaginationStyle = css`
  margin-top: 32px;
`;

const tagStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`;

const delModalStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 8px 16px 0;

  font-size: ${FONT_SIZE.TEXT_MD};
  letter-spacing: -0.32px;

  .del-modal-btn {
    display: flex;
    gap: 16px;
  }
`;

export default AdminMethods;
