import { useState } from 'react';
import { css } from '@emotion/react';
import { Link, useParams } from 'react-router-dom';
import dayIcon from '@/assets/images/day-icon.png';
import positionIcon from '@/assets/images/position-icon.png';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import Table, { ColumnProps } from '@/components/Table';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useGetInquiryListUser,
  useGetInquiryListTrader,
} from '@/hooks/useCommonApi';
import useAuthStore from '@/stores/useAuthStore';

const POSTS_PER_PAGE = 10;

interface QnaListDataProps {
  inquiryId: number;
  inquiryTitle: string;
  strategyName: string;
  inquiryRegistrationDate: string;
  inquiryStatus: string;
  methodId: number;
  methodIconPath: string;
  stockIconPath: string[] | null;
  cycle: string;
  stockList: {
    stockIds: number[];
    stockNames: string[];
    stockIconPath?: string[];
  };
}

const strategyOptions = [
  { label: '최신순', value: 'registrationDate' },
  { label: '전략명', value: 'strategyName' },
];

const statusOptions = [
  { label: '전체', value: 'all' },
  { label: '답변대기', value: 'unclosed' },
  { label: '답변완료', value: 'closed' },
];

const statusMap: { [key: string]: string } = {
  unclosed: '답변대기',
  closed: '답변완료',
};

const QnaList = () => {
  const { roleCode } = useAuthStore();
  const [sortConfig, setSortConfig] = useState<string>('registrationDate');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const dateCustom = (isoDate: string): string => {
    const dateObj = new Date(isoDate);
    return `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
  };

  const { userId, inquiryId } = useParams<{
    userId: string;
    inquiryId: string;
  }>();

  const parsedInquiryId = inquiryId ? Number(inquiryId) : 0;

  const params = {
    userId,
    sort: sortConfig,
    closed: statusFilter === 'all' ? undefined : statusFilter,
    page: currentPage,
    qnaId: parsedInquiryId,
  };

  const userQuery = useGetInquiryListUser(params);
  const traderQuery = useGetInquiryListTrader(params);

  const data =
    roleCode === 'USER'
      ? userQuery.data?.data?.content || []
      : traderQuery.data?.data?.content || [];

  const total =
    roleCode === 'USER'
      ? userQuery.data?.data?.totalElement || 0
      : traderQuery.data?.data?.totalElement || 0;

  const totalPage = Math.ceil(total / POSTS_PER_PAGE);

  const columns: ColumnProps<QnaListDataProps>[] = [
    {
      key: 'inquiryTitle',
      header: '제목',
      render: (_, item) => (
        <div css={questionContainerStyle}>
          <div css={questionTitleStyle}>
            <Link
              to={PATH.MYPAGE_QNA_DETAIL(
                String(userId),
                String(item.inquiryId)
              )}
              css={linkStyle}
            >
              {item.inquiryTitle}
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: 'strategyName',
      header: '전략명',
      render: (_, item) => (
        <div css={strategyStyle}>
          <div className='tag'>
            {item.methodIconPath && <Tag src={item.methodIconPath} alt='tag' />}
            {item.methodIconPath && <Tag src={item?.cycle === 'D' ? dayIcon : positionIcon} />}
            {Array.isArray(item?.stockList?.stockIconPath) &&
              item.stockList.stockIconPath.map(
                (stock: string, index: number) => (
                  <Tag key={index} src={stock || ''} alt='tag' />
                )
              )}
          </div>
          <span>{item.strategyName}</span>
        </div>
      ),
    },

    {
      key: 'inquiryRegistrationDate',
      header: '전략일자',
      render: (value) => <span>{dateCustom(String(value))}</span>,
    },
    {
      key: 'inquiryStatus',
      header: '진행상태',
      render: (_, item) => (
        <span
          css={item.inquiryStatus === 'closed' ? successStyle : waitingStyle}
        >
          {statusMap[item.inquiryStatus] || ''}
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
  line-height: 50px;
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
