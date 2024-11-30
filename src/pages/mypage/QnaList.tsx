import { useState } from 'react';
import { css } from '@emotion/react';
import { Link, useParams } from 'react-router-dom';
import TagTest from '@/assets/images/test-tag.jpg';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import Table from '@/components/Table';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useGetInquiryListTrader,
  useGetInquiryListUser,
} from '@/hooks/useCommonApi';
import useAuthStore from '@/stores/useAuthStore';

const POSTS_PER_PAGE = 10;

interface QnaListDataProps {
  questionName: string;
  strategyName: string;
  date: string;
  status: string;
}

const strategyOptions = [
  { label: '최신순', value: 'registrationDate' },
  { label: '전략명', value: 'strategyName' },
];

const statusOptions = [
  { label: '전체', value: 'all' },
  { label: '답변대기', value: 'closed' },
  { label: '답변완료', value: 'unclosed' },
];

const QnaList = () => {
  const { roleCode } = useAuthStore();
  const [sortConfig, setSortConfig] = useState<string>('registrationDate');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const userId = paramUserId ? Number(paramUserId) : 0;

  const params = {
    sort: sortConfig,
    closed: statusFilter === 'all' ? '' : statusFilter,
    page: currentPage + 1,
  };

  const userQuery = useGetInquiryListUser(params);
  const traderQuery = useGetInquiryListTrader(params);

  const data =
    roleCode === 'USER' ? userQuery.data?.data : traderQuery.data?.data;
  const total =
    roleCode === 'USER' ? userQuery.data?.total : traderQuery.data?.total;
  const totalPage = Math.ceil((total || 0) / POSTS_PER_PAGE);

  const columns = [
    {
      key: 'inquiryTitle' as keyof QnaListDataProps,
      header: '제목',
      render: (value: string) => (
        <div css={questionContainerStyle}>
          <div css={questionTitleStyle}>
            <Link to={PATH.MYPAGE_QNA_DETAIL(String(userId))} css={linkStyle}>
              {value}
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: 'strategyName' as keyof QnaListDataProps,
      header: '전략명',
      render: (value: string | number | undefined) => (
        <div css={strategyStyle}>
          <Tag src={TagTest} alt='tag' />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'inquiryRegistrationDate' as keyof QnaListDataProps,
      header: '전략일자',
    },
    {
      key: 'inquiryStatus' as keyof QnaListDataProps,
      header: '진행상태',
      render: (value: string) => (
        <span css={value === 'unclosed' ? successStyle : waitingStyle}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <div css={wrapperStyle}>
      <div css={filterStyle}>
        <div css={countStyle}>
          <span>총</span>
          <span>{total || 0}개</span>
        </div>
        <div css={filterWrapperStyle}>
          <SelectBox
            options={strategyOptions}
            placeholder='정렬기준'
            handleChange={(value) => setSortConfig(value)}
          />
          <SelectBox
            options={statusOptions}
            placeholder='답변상태'
            handleChange={(value) => setStatusFilter(value)}
          />
        </div>
      </div>

      <div css={tableWrapperStyle}>
        {data && data.length > 0 ? (
          <>
            <div css={tableStyle}>
              <Table data={data} columns={columns} />
            </div>
            <Pagination
              totalPage={totalPage}
              currentPage={currentPage}
              handlePageChange={setCurrentPage}
            />
          </>
        ) : (
          <div css={noDataStyle}>문의가 없습니다.</div>
        )}
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
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin-bottom: 24px;
`;

const filterWrapperStyle = css`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const successStyle = css`
  color: ${COLOR.CHECK_GREEN};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const waitingStyle = css`
  color: ${COLOR.TEXT_BLACK};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const questionContainerStyle = css`
  display: flex;
  justify-content: center;
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

const strategyStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  div {
    display: flex;
    gap: 4px;
  }
`;

const countStyle = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: ${FONT_SIZE.TITLE_XS};
  gap: 4px;

  span:first-child {
    font-weight: ${FONT_WEIGHT.REGULAR};
  }
  span:last-child {
    font-weight: ${FONT_WEIGHT.BOLD};
  }
`;

const tableWrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 32px;
`;

const tableStyle = css`
  thead,
  thead tr,
  thead th {
    background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
    border-top: 1px solid ${COLOR.PRIMARY700};
    font-weight: ${FONT_WEIGHT.BOLD};
  }

  td:first-child {
    text-align: left;
  }

  td {
    padding: 20px 0;
    vertical-align: middle;
    text-align: center;
  }
`;

const noDataStyle = css`
  text-align: center;
  margin-top: 80px;
  font-size: ${FONT_SIZE.TEXT_LG};
  color: ${COLOR_OPACITY.BLACK_OPACITY50};
`;
