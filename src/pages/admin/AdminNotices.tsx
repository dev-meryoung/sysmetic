import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import Table from '@/components/Table';
import { ColumnProps } from '@/components/Table';
import TextInput from '@/components/TextInput';
import Toggle from '@/components/Toggle';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import noticesAdmin from '@/mocks/notice-admin.json';
import { useTableStore } from '@/stores/useTableStore';

interface NoticesAdminDataProps {
  noticeId: number;
  noticeTitle: string;
  writeNickname: string;
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
  const [curPage, setCurPage] = useState(0);
  const [data, setData] = useState<NoticesAdminDataProps[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const count = data.length;
  const navigate = useNavigate();
  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );
  const handleStatusChange = (index: number, value: boolean) => {
    setData((prevData) =>
      prevData.map((item, idx) =>
        idx === index ? { ...item, isOpen: value } : item
      )
    );
  };

  const columns: ColumnProps<NoticesAdminDataProps>[] = [
    {
      key: 'noticeId',
      header: '순서',
    },
    {
      key: 'noticeTitle',
      header: '제목',
      render: (value) => {
        if (typeof value === 'string') {
          return <span>{value}</span>;
        }
        return;
      },
    },

    {
      key: 'writeNickname',
      header: '작성자',
    },
    {
      key: 'writeDate',
      header: '날짜',
    },
    {
      key: 'hits',
      header: '조회수',
    },
    {
      key: 'fileExist',
      header: '파일',
      render: (value) => {
        if (typeof value === 'boolean') {
          return value ? <AttachFileIcon /> : <span>나중에 아이콘 변경</span>;
        }
        return <span>Invalid Type</span>;
      },
    },
    {
      key: 'isOpen',
      header: '공개여부',
      render: (value, _item, rowIndex) => {
        if (typeof value === 'boolean') {
          return (
            <div css={toggleWrapperStyle}>
              <Toggle
                checked={value}
                handleChange={(newValue: boolean) => {
                  handleStatusChange(rowIndex, newValue);
                  toggleCheckbox(rowIndex);
                }}
              />
            </div>
          );
        }
        return <span>Invalid Type</span>;
      },
    },
  ];

  const getPaginatedData = (page: number) => {
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return data.slice(startIndex, endIndex);
  };

  useEffect(() => {
    const sortedData = [...noticesAdmin].sort(
      (a, b) => b.noticeId - a.noticeId
    );
    setData(sortedData);

    const pages = Math.ceil(sortedData.length / PAGE_SIZE);
    setTotalPage(pages);
  }, []);

  const handleDeleteBtn = () => {};

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
            handleChange={(e) => setSearchValue(e.target.value)}
            placeholder='내용을 입력하세요'
            color='skyblue'
            iconNum='single'
            width={360}
          />
          <SearchIcon css={searchIconStyle} />
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
          handleClick={() => navigate(PATH.ADMIN_NOTICES_ADD)}
        />
        <Button
          label='삭제'
          color='black'
          shape='square'
          width={80}
          size='md'
          handleClick={handleDeleteBtn}
        />
      </div>

      <div css={noticesListStyle}>
        <Table
          data={getPaginatedData(curPage)}
          columns={columns}
          hasCheckbox={true}
          checkedItems={checkedItems}
          handleCheckboxChange={toggleCheckbox}
          handleHeaderCheckboxChange={() =>
            toggleAllCheckboxes(getPaginatedData.length)
          }
        />
      </div>

      <div css={noticesPaginationStyle}>
        <Pagination
          totalPage={totalPage}
          currentPage={curPage}
          handlePageChange={setCurPage}
        />
      </div>
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

export default AdminNotices;
