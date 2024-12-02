import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import notices from '@/mocks/notices.json';

interface NoticesStrategyDataProps {
  strategyName: string;
  date: string;
}

const PAGE_SIZE = 10;

const Notices = () => {
  const [searchValue, setSearchValue] = useState('');
  //테이블 관련
  const [curPage, setCurPage] = useState(0);
  const [data, setData] = useState<NoticesStrategyDataProps[]>([]);
  //페이지네이션 관련
  const [totalPage, setTotalPage] = useState(0);

  const columns = [
    {
      key: 'strategyName' as keyof NoticesStrategyDataProps,
      header: '',
    },
    {
      key: 'date' as keyof NoticesStrategyDataProps,
      header: '',
    },
  ];

  const getPaginatedData = (page: number) => {
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return data.slice(startIndex, endIndex);
  };

  const paginatedData = getPaginatedData(curPage);

  useEffect(() => {
    // 순서를 기준으로
    const sortedData = [...notices].sort((a, b) => b.no - a.no);
    const arrangedData = sortedData.map((item, index) => ({
      ...item,
      no: index + 1,
    }));
    setData(arrangedData);

    const pages = Math.ceil(arrangedData.length / PAGE_SIZE);
    setTotalPage(pages);
  }, []);

  return (
    <div css={noticesWrapperStyle}>
      <div css={noticesHeaderStyle}>
        <h1>공지사항</h1>
        <p>시스메틱 서비스의 신규 및 업데이트 소식을 알려드립니다.</p>
      </div>
      <div css={noticesSearchStyle}>
        <TextInput
          placeholder='제목, 내용'
          value={searchValue}
          handleChange={(e) => setSearchValue(e.target.value)}
        />
        <SearchIcon css={iconStyle} />
      </div>
      <div css={noticesListStyle}>
        <Table data={paginatedData} columns={columns} />
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

  table > thead > tr > th {
    padding: 0;
  }

  table > tbody > tr > td {
    padding: 24px;

    &:first-of-type {
      display: flex;
      justify-content: flex-start;
      font-weight: ${FONT_WEIGHT.BOLD};
    }
    &:last-of-type {
      width: 180px;
    }
  }
`;

const noticesPaginationStyle = css`
  margin-top: 32px;
`;
export default Notices;
