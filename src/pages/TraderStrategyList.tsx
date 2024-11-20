import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useNavigate } from 'react-router-dom';
import TagTest from '@/assets/images/test-tag.jpg';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import ProfileImage from '@/components/ProfileImage';
import Table from '@/components/Table';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';
import { PATH } from '@/constants/path';
import strategyData from '@/mocks/strategies.json';

const PAGE_SIZE = 10;

interface StrategyDataProps {
  ranking?: number;
  traderNickname: string;
  strategyId: number;
  methodId: number;
  cycle: string;
  strategyName: string;
  mdd: number;
  smScore: number;
  accumProfitLossRate: number;
  followerCount: number;
}

const TraderStrategyList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<StrategyDataProps[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const getPaginatedData = (page: number) => {
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return data.slice(startIndex, endIndex);
  };

  const paginatedData = getPaginatedData(currentPage);

  useEffect(() => {
    // 누적 수익률을 기준으로 데이터를 정렬
    const sortedData = [...strategyData].sort(
      (a, b) => b.accumProfitLossRate - a.accumProfitLossRate
    );
    const rankedData = sortedData.map((item, index) => ({
      ...item,
      ranking: index + 1,
    }));
    setData(rankedData);

    const pages = Math.ceil(rankedData.length / PAGE_SIZE);
    setTotalPage(pages);
  }, []);

  const columns = [
    {
      key: 'ranking' as keyof StrategyDataProps,
      header: '순위',
      render: (_: unknown, item: StrategyDataProps) => item.ranking,
    },
    { key: 'traderNickname' as keyof StrategyDataProps, header: '트레이더' },
    {
      key: 'strategyName' as keyof StrategyDataProps,
      header: '전략명',
      render: (value: string | number | undefined) => (
        <div css={tagStyle}>
          <div>
            <Tag src={TagTest} alt='tag' />
          </div>
          {value}
        </div>
      ),
    },
    {
      key: 'followerCount' as keyof StrategyDataProps,
      header: '팔로워 수',
      sortable: true,
    },
    {
      key: 'accumProfitLossRate' as keyof StrategyDataProps,
      header: '누적 수익률 (%)',
      sortable: true,
    },
    { key: 'mdd' as keyof StrategyDataProps, header: 'MDD' },
    {
      key: 'smScore' as keyof StrategyDataProps,
      header: 'SM 점수',
    },
    {
      key: 'strategy' as keyof StrategyDataProps,
      header: '전략',
      render: () => (
        <div css={buttonStyle}>
          <Button
            label='관심 등록'
            shape='round'
            size='xs'
            color='point'
            width={80}
            handleClick={() => {}}
          />
          <Button
            label='상세보기'
            shape='round'
            size='xs'
            width={80}
            handleClick={() => {
              navigate(PATH.STRATEGIES_DETAIL());
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div css={strategyListWrapperStyle}>
      <section css={infoStyle}>
        <div className='info-area'>
          <ProfileImage
            src='/src/assets/images/test-profile.png'
            alt='profile'
          />
          <span>ABC가나다라883</span>
        </div>
        <div className='button-area'>
          <span>관심수</span>
          <div className='icon-btn'>
            <FavoriteBorderOutlinedIcon />
            10,000
          </div>
        </div>
      </section>
      <section css={tableWrapperStyle}>
        <div className='title-area'>
          <h5>트레이더 전략정보</h5>
        </div>
        <Table data={paginatedData} columns={columns} />
        <Pagination
          totalPage={totalPage}
          currentPage={currentPage}
          handlePageChange={setCurrentPage}
        />
      </section>
    </div>
  );
};

const strategyListWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1200px;
  padding: 96px 10px;
  margin: 0 auto;
`;

const infoStyle = css`
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 35px 24px;
  border-radius: 4px;
  border: 1px solid ${COLOR.GRAY};

  .info-area {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .button-area {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .icon-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      color: ${COLOR.POINT};

      svg {
        color: ${COLOR.POINT};
        font-size: ${FONT_SIZE.TITLE_XS};
      }
    }
  }
`;

const tableWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 29px;

  .title-area {
    position: relative;
    padding: 28px 0;

    h5::after {
      content: '';
      position: absolute;
      height: 1px;
      width: 100%;
      left: 0;
      bottom: 0;
      background-color: ${COLOR.GRAY};
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

const tagStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`;

export default TraderStrategyList;
