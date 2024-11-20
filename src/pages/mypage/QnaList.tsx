import { useState } from 'react';
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import TagTest from '@/assets/images/test-tag.jpg';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import Table from '@/components/Table';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_WEIGHT } from '@/constants/font';

const POSTS_PER_PAGE = 10;

interface QnaListDataProps {
  questionName: string;
  strategyName: string;
  date: string;
  status: string;
}

const QnaList = () => {
  const [data] = useState<QnaListDataProps[]>([
    {
      questionName: '첫 번째 질문입니다.',
      strategyName: '주식 성공하는 방법',
      date: '2024.12.24',
      status: '답변완료',
    },
  ]);

  const [currentPage, setCurrentPage] = useState<number>(0);

  const strategyOptions = [
    { label: '최신순', value: '최신순' },
    { label: '전략순', value: '전략순' },
  ];

  const statusOptions = [
    { label: '전체', value: '전체' },
    { label: '답변대기', value: '답변대기' },
    { label: '답변완료', value: '답변완료' },
  ];

  const handleStrategyChange = () => {};

  const handleStatusChange = () => {};

  const totalPage = Math.ceil(data.length / POSTS_PER_PAGE);

  const paginatedData = data.slice(
    currentPage * POSTS_PER_PAGE,
    (currentPage + 1) * POSTS_PER_PAGE
  );

  const columns = [
    {
      key: 'questionName' as keyof QnaListDataProps,
      header: '제목',
      render: (value: string) => (
        <div css={questionNameStyle}>
          <Link to='/mypage/${userId}/qna/${qnaId}'>{value}</Link>
        </div>
      ),
    },
    {
      key: 'strategyName' as keyof QnaListDataProps,
      header: '전략명',
      render: (value: string) => (
        <div css={strategyStyle}>
          <div>
            <Tag src={TagTest} alt='tag' />
            <Tag src={TagTest} alt='tag' />
          </div>
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'date' as keyof QnaListDataProps,
      header: '전략일자',
    },
    {
      key: 'status' as keyof QnaListDataProps,
      header: '진행상태',
      render: (value: string) => (
        <span css={value === '답변완료' ? successStyle : waitingStyle}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <div css={wrapperStyle}>
      <div css={filterStyle}>
        <div css={filerWrapperStyle}>
          <SelectBox
            options={strategyOptions}
            placeholder='정렬 기준'
            handleChange={handleStrategyChange}
          />
        </div>
        <div css={filerWrapperStyle}>
          <SelectBox
            options={statusOptions}
            placeholder='답변 상태'
            handleChange={handleStatusChange}
          />
        </div>
      </div>
      <div css={tableWrapperStyle}>
        <div css={tableStyle}>
          <Table data={paginatedData} columns={columns} />
        </div>
        <Pagination
          totalPage={totalPage}
          currentPage={currentPage}
          handlePageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default QnaList;

const wrapperStyle = css`
  padding-bottom: 181px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  box-sizing: border-box;
`;

const filterStyle = css`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  margin-bottom: 24px;
  gap: 16px;
`;

const filerWrapperStyle = css`
  position: relative;
  align-items: center;
`;

const successStyle = css`
  color: ${COLOR.CHECK_GREEN};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const waitingStyle = css`
  color: ${COLOR.ERROR_RED};
  font-weight: ${FONT_WEIGHT.BOLD};
`;
const questionNameStyle = css`
  a {
    text-decoration: none;
    font-weight: ${FONT_WEIGHT.BOLD};
  }
  a:active {
    color: ${COLOR.TEXT_BLACK};
  }
`;

const strategyStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  > div {
    display: flex;
    gap: 4px;
  }
`;

const tableWrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 32px;
`;

const tableStyle = css`
  thead {
    background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
    border-top: 1px solid ${COLOR.PRIMARY700};
    font-weight: ${FONT_WEIGHT.BOLD};
  }
  td {
    padding: 40px 0;
    vertical-align: middle;
    text-align: center;
  }
`;
