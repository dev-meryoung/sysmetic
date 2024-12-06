import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useParams } from 'react-router-dom';
import Pagination from '@/components/Pagination';
import Table, { ColumnProps } from '@/components/Table';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useGetNoticeList } from '@/hooks/useCommonApi';

interface NoticesStrategyDataProps {
  noticeId?: string;
  noticeTitle?: string;
  writeDate?: string;
}

const PAGE_SIZE = 10;

const Notices = () => {
  const [searchValue, setSearchValue] = useState('');
  const [curPage, setCurPage] = useState<number>(0);
  const [data, setData] = useState<NoticesStrategyDataProps[]>([]);
  const [filteredData, setFilteredData] = useState<NoticesStrategyDataProps[]>(
    []
  );
  const [totalPage, setTotalPage] = useState(0);
  const { noticeId } = useParams<{ noticeId: string }>();
  const params = {
    noticeId,
    page: curPage,
    searchText: searchValue,
  };

  const noticeMutation = useGetNoticeList(params);

  useEffect(() => {
    const total = noticeMutation.data?.data?.totalElement;
    const fetchedData = noticeMutation.data?.data?.content;

    if (Array.isArray(fetchedData)) {
      const sortedData = [...fetchedData].sort((a, b) => b.no - a.no);
      setData(sortedData);
      setFilteredData(sortedData);
      setTotalPage(Math.ceil(total / PAGE_SIZE));
    } else {
      setData([]);
      setFilteredData([]);
      setTotalPage(0);
    }
  }, [noticeMutation.data]);

  const formatDate = (isoDate: string | undefined): string =>
    isoDate
      ? new Date(isoDate).toISOString().split('T')[0].replace(/-/g, '.')
      : '';

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

  const getPaginatedData = () => {
    const startIndex = curPage * PAGE_SIZE;
    return filteredData.slice(startIndex, startIndex + PAGE_SIZE);
  };

  const columns: ColumnProps<NoticesStrategyDataProps>[] = [
    {
      key: 'noticeTitle',
      header: '',
      render: (value, row) => (
        <div css={questionContainerStyle}>
          <div css={questionTitleStyle}>
            <Link
              to={PATH.NOTICES_DETAIL(String(row.noticeId))}
              css={linkStyle}
            >
              {value}
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: 'writeDate',
      header: '',
      render: (value) => <span>{formatDate(value)}</span>,
    },
  ];

  return (
    <div css={noticesWrapperStyle}>
      <div css={noticesHeaderStyle}>
        <h1>공지사항</h1>
        <p>시스메틱 서비스의 신규 및 업데이트 소식을 알려드립니다.</p>
      </div>
      <div css={noticesSearchStyle}>
        <TextInput
          placeholder='검색어를 입력하세요.'
          value={searchValue}
          handleChange={handleChange}
          handleKeyDown={handleKeyDown}
        />
        <SearchIcon css={iconStyle} onClick={handleSearch} />{' '}
      </div>
      <div css={noticesListStyle}>
        <Table data={data} columns={columns} />
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
  margin: 96px auto;
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

const noticesSearchStyle = css`
  position: relative;
  display: flex;
  justify-content: flex-end;
  margin: 40px 0 24px;
`;

const iconStyle = css`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  cursor: pointer;
`;

const noticesListStyle = css`
  border-top: 2px solid ${COLOR.PRIMARY600};

  th {
    display: none; 
  }
  thead {
    background-color: transparent;
  }

  table > tbody > tr > td {
    padding: 24px;

    &:first-of-type {
      font-weight: ${FONT_WEIGHT.BOLD};
    }
    &:last-of-type {
      display: flex;
      justify-content: flex-end; 
      align-items: center;
    }
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

export default Notices;
