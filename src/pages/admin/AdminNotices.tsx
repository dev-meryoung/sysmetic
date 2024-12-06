import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import Table, { ColumnProps } from '@/components/Table';
import TextInput from '@/components/TextInput';
import Toggle from '@/components/Toggle';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useGetAdminNoticeList,
  useUpdateAdminNoticeStatus,
  useDeleteAdminNoticeList,
} from '@/hooks/useAdminApi';
import useModalStore from '@/stores/useModalStore';
import { useTableStore } from '@/stores/useTableStore';

interface NoticesAdminDataProps {
  noticeId: number;
  noticeTitle: string;
  writerNickname: string;
  writeDate: string;
  hits: number;
  fileExist: boolean;
  isOpen: boolean;
}

const selectBoxOptions = [
  { label: '제목', value: 'noticeTitle' },
  { label: '내용', value: 'noticeContent' },
  { label: '제목+내용', value: 'titleAndContent' },
  { label: '작성자', value: 'writeNickname' },
];

const PAGE_SIZE = 10;

const AdminNotices = () => {
  const [searchValue, setSearchValue] = useState('');
  const [curPage, setCurPage] = useState<number>(0);
  const [data, setData] = useState<NoticesAdminDataProps[]>([]);
  const [_filteredData, setFilteredData] = useState<NoticesAdminDataProps[]>(
    []
  );
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();
  const { openModal, closeModal } = useModalStore();
  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );

  const formatDate = (date: string): string => {
    if (!date) return '';
    const parsedDate = new Date(Date.parse(date));
    return parsedDate.toISOString().split('T')[0].replace(/-/g, '.');
  };

  const { noticeId } = useParams<{ noticeId: string }>();
  const params = {
    noticeId,
    page: curPage,
    searchText: searchValue,
  };

  const noticeGetListMutation = useGetAdminNoticeList(params);
  const noticeUpdateStatusMutation = useUpdateAdminNoticeStatus();

  useEffect(() => {
    const total = noticeGetListMutation.data?.data?.totalElement;
    const fetchedData = noticeGetListMutation.data?.data?.content;

    if (Array.isArray(fetchedData)) {
      const sortedData = [...fetchedData].sort((a, b) => b.no - a.no);
      setData(sortedData);
      setFilteredData(sortedData);

      const calculatedTotalPage = Math.ceil(total / PAGE_SIZE);
      setTotalPage(calculatedTotalPage);
    } else {
      setData([]);
      setFilteredData([]);
      setTotalPage(1);
    }
  }, [noticeGetListMutation.data]);

  const handleStatusChange = (index: number, newValue: boolean) => {
    const noticeId = data[index]?.noticeId;

    if (!noticeId) return;

    setData((prevData) =>
      prevData.map((item, idx) =>
        idx === index ? { ...item, isOpen: newValue } : item
      )
    );

    noticeUpdateStatusMutation.mutate(String(noticeId), {
      onError: () => {
        setData((prevData) =>
          prevData.map((item, idx) =>
            idx === index ? { ...item, isOpen: !newValue } : item
          )
        );
      },
    });
  };

  const count = data.length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.noticeTitle?.toLowerCase().includes(searchValue.trim().toLowerCase())
    );
    setFilteredData(filtered);
    setCurPage(0);
    setTotalPage(Math.ceil(filtered.length / PAGE_SIZE));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleWrite = () => {
    navigate(PATH.ADMIN_NOTICES_ADD);
  };

  const deleteMutation = useDeleteAdminNoticeList();

  const getSelectedNoticeIds = () => {
    const selectedNoticeIds = checkedItems
      .map((index) => data[index]?.noticeId)
      .filter((id) => id !== undefined);

    return selectedNoticeIds;
  };

  const confirmDelete = () => {
    const selectedNoticeIds = getSelectedNoticeIds();

    if (!selectedNoticeIds.length) {
      openModal('error-confirm');
      return;
    }

    const payload = { ids: selectedNoticeIds };

    deleteMutation.mutate(payload, {
      onSuccess: () => {
        closeModal('delete-confirm');
        noticeGetListMutation.refetch();
      },
      onError: (error) => {
        console.error('삭제 실패:', error);
        openModal('error-delete');
      },
    });
  };

  const handleDelete = () => {
    if (checkedItems.length === 0) {
      openModal('error-confirm');
      return;
    }
    openModal('delete-confirm');
  };

  const columns: ColumnProps<NoticesAdminDataProps>[] = [
    {
      key: 'noticeId',
      header: '순서',
    },
    {
      key: 'noticeTitle',
      header: '제목',
      render: (value, row) => (
        <div css={questionContainerStyle}>
          <div css={questionTitleStyle}>
            <Link
              to={PATH.ADMIN_NOTICES_DETAIL(String(row.noticeId))}
              css={linkStyle}
            >
              {value}
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: 'writerNickname',
      header: '작성자',
    },
    {
      key: 'writeDate',
      header: '날짜',
      render: (value) => <span>{formatDate(value as string)}</span>,
    },
    {
      key: 'hits',
      header: '조회수',
    },
    {
      key: 'fileExist',
      header: '파일',
      render: (value) =>
        typeof value === 'boolean' ? (
          value ? (
            <AttachFileIcon />
          ) : null
        ) : (
          <span>Invalid Type</span>
        ),
    },
    {
      key: 'isOpen',
      header: '공개여부',
      render: (value, _item, rowIndex) => (
        <div css={toggleWrapperStyle}>
          <Toggle
            checked={!!value}
            handleChange={(newValue: boolean, e?: React.MouseEvent) => {
              e?.stopPropagation();
              handleStatusChange(rowIndex, newValue);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div css={noticesWrapperStyle}>
      <div css={noticesHeaderStyle}>
        <h1>공지관리</h1>
        <p>시스메틱에 등록된 공지사항을 관리, 수정, 삭제하는 페이지입니다.</p>
      </div>

      <div css={searchWrapperStyle}>
        <div css={searchStyle}>
          <SelectBox
            options={selectBoxOptions}
            placeholder='선택'
            handleChange={() => {}}
            color='skyblue'
            width={177}
          />
          <TextInput
            value={searchValue}
            handleChange={handleChange}
            placeholder='내용을 입력하세요'
            color='skyblue'
            iconNum='single'
            width={360}
            handleKeyDown={handleKeyDown}
          />
          <SearchIcon css={searchIconStyle} onClick={handleSearch} />
        </div>
      </div>

      <div css={buttonStyle}>
        <div className='count-wrapper'>
          <span>총</span>
          <span>{count}개</span>
        </div>
        <Button
          label='글쓰기'
          color='primary'
          shape='square'
          width={80}
          size='md'
          handleClick={handleWrite}
        />
        <Button
          label='삭제'
          color='black'
          shape='square'
          width={80}
          size='md'
          handleClick={handleDelete}
        />
      </div>

      <div css={noticesListStyle}>
        <Table
          data={data}
          columns={columns}
          hasCheckbox={true}
          checkedItems={checkedItems}
          handleCheckboxChange={toggleCheckbox}
          handleHeaderCheckboxChange={() => toggleAllCheckboxes(data.length)}
        />
      </div>

      <div css={noticesPaginationStyle}>
        <Pagination
          totalPage={totalPage}
          currentPage={curPage}
          handlePageChange={setCurPage}
        />
      </div>

      <Modal
        id='delete-confirm'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>선택한 공지를 삭제하시겠습니까?</p>
            <div css={modalButtonWrapperStyle}>
              <Button
                label='아니오'
                handleClick={() => closeModal('delete-confirm')}
                color='primaryOpacity10'
                border
              />
              <Button label='예' handleClick={confirmDelete} color='primary' />
            </div>
          </div>
        }
      />

      <Modal
        id='error-confirm'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>삭제할 항목을 선택해주세요.</p>
          </div>
        }
      />

      <Modal
        id='error-delete'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>삭제에 실패했습니다. 다시 시도해주세요.</p>
          </div>
        }
      />
    </div>
  );
};

const noticesWrapperStyle = css`
  display: flex;
  flex-direction: column;
  margin: 96px auto 96px;
  padding: 0 10px;
  max-width: 1200px;
`;

const noticesHeaderStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 40px;
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};

  h1 {
    font-size: ${FONT_SIZE.TITLE_SM};
    font-weight: ${FONT_WEIGHT.BOLD};
    letter-spacing: -0.48px;
  }

  p {
    line-height: 160%;
    letter-spacing: -0.32px;
  }
`;

const searchWrapperStyle = css`
  background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
  height: 120px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  margin-top: 40px;
`;

const searchStyle = css`
  display: flex;
  position: relative;
  width: 50%;
  gap: 16px;
`;

const searchIconStyle = css`
  font-size: 28px;
  cursor: pointer;
  position: absolute;
  right: 48px;
  top: 50%;
  transform: translateY(-50%);
  color: ${COLOR.GRAY600};
`;

const buttonStyle = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  .count-wrapper {
    display: flex;
    margin-right: auto;
    gap: 8px;
  }

  .count-wrapper > span:first-of-type {
    font-size: ${FONT_SIZE.TITLE_XS};
  }

  .count-wrapper > span:last-of-type {
    font-size: ${FONT_SIZE.TITLE_XS};
    font-weight: ${FONT_WEIGHT.BOLD};
    color: ${COLOR.TEXT_BLACK};
  }
`;

const noticesListStyle = css`
  border-top: 2px solid ${COLOR.PRIMARY600};

  thead th {
    padding: 24px;
  }

  tbody td {
    padding: 24px;

    &:last-of-type {
      width: 180px;
    }
  }
`;

const toggleWrapperStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const noticesPaginationStyle = css`
  margin-top: 32px;
`;

const questionContainerStyle = css`
  display: flex;
  align-items: center;
  height: 100%;
`;

const questionTitleStyle = css`
  text-align: left;
  width: 100%;
`;

const linkStyle = css`
  margin-left: 24px;
  text-decoration: none;
  font-size: 16px;
  font-weight: ${FONT_WEIGHT.BOLD};
  color: ${COLOR.TEXT_BLACK};
`;

const modalContentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const modalTextStyle = css`
  font-size: ${FONT_SIZE.TEXT_MD};
  text-align: center;
  margin-top: 32px;
  margin-bottom: 24px;
`;

const modalButtonWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
`;

export default AdminNotices;
