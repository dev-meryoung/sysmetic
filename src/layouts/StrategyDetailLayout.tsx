import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import {
  FavoriteBorder,
  FileDownloadOutlined,
  PrintOutlined,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import facebookIcon from '@/assets/images/facebook-icon.png';
import kakaotalkIcon from '@/assets/images/kakaotalk-icon.png';
import tempTag from '@/assets/images/test-tag.jpg';
import xIcon from '@/assets/images/x-icon.png';
import Button from '@/components/Button';
import Comment from '@/components/Comment';
import IconButton from '@/components/IconButton';
import Pagination from '@/components/Pagination';
import ProfileImage from '@/components/ProfileImage';
import TabButton from '@/components/TabButton';
import Tag from '@/components/Tag';
import TextArea from '@/components/TextArea';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import commentMockData from '@/mocks/comment.json';
import monthlyMockData from '@/mocks/strategy-monthly.json';

const TAB_BUTTONS = ['통계', '일간분석', '월간분석', '실계좌정보'];

const StrategyDetailLayout = () => {
  const navigate = useNavigate();
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<number>(0);

  useEffect(() => {
    // 이후 전략 ID 값으로 교체 예정
    const pathArr: string[] = [
      PATH.STRATEGIES_DETAIL('10'),
      PATH.STRATEGIES_DETAIL_DAILY('10'),
      PATH.STRATEGIES_DETAIL_MONTHLY('10'),
      PATH.STRATEGIES_DETAIL_ACCOUNT('10'),
    ];

    navigate(pathArr[currentTab]);
  }, [currentTab]);

  return (
    <div css={wrapperStyle}>
      <div css={infoBoxStyle}>
        <div className='trader-box border'>
          <div className='left-box'>
            <div className='trader-info'>
              <ProfileImage />
              <span>트레이더명</span>
            </div>
            <div className='like-info'>
              <span>관심수</span>
              <div>
                <FavoriteBorder sx={{ color: COLOR.POINT, fontSize: '20px' }} />
                <span>1000</span>
              </div>
            </div>
            <div className='buttons'>
              <Button
                label='관심등록'
                size='xs'
                shape='round'
                border={true}
                color='pointOpacity10'
                width={80}
                handleClick={() => {}}
              />
              <Button
                label='문의하기'
                size='xs'
                shape='round'
                border={true}
                color='primaryOpacity10'
                width={80}
                handleClick={() => {}}
              />
            </div>
          </div>
          <div className='right-box'>
            <div className='buttons'>
              <img src={xIcon} alt='x' />
              <img src={kakaotalkIcon} alt='kakaotalk' />
              <img src={facebookIcon} alt='facebook' />
              <IconButton
                IconComponent={PrintOutlined}
                shape='round'
                color='white'
                handleClick={() => {}}
              />
              <IconButton
                IconComponent={FileDownloadOutlined}
                shape='round'
                color='white'
                handleClick={() => {}}
              />
            </div>
          </div>
        </div>
        <div className='strategy-box'>
          <div className='tags'>
            <Tag src={tempTag} />
          </div>
          <span>전략명</span>
        </div>
        <div className='detail-box border'>
          <div className='row'>
            <span className='title'>운용종목</span>
            <span className='description'>운용종목</span>
          </div>
          <div className='row'>
            <span className='title'>매매방식</span>
            <span className='description'>매매방식</span>
          </div>
          <div className='row'>
            <span className='title'>주기</span>
            <span className='description'>주기</span>
          </div>
          <div className='row'>
            <span className='title'>전략소개</span>
            <span className='description'>
              전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개전략소개
            </span>
          </div>
        </div>
        <div className='count-box'>
          {/* 이후 컴포넌트 구현 및 교체 예정 */}
          <div className='cards'>
            <div className='card'></div>
            <div className='card'></div>
            <div className='card'></div>
            <div className='card'></div>
            <div className='card'></div>
          </div>
          <span className='explanation'>
            ※ 월별 손익과 일별 손익은 전일 기준이며 주식잔고 손익만 실시간
            기준입니다.
          </span>
        </div>
        <div className='monthly-box'>
          <div className='title'>
            <h5>월간 손익률</h5>
          </div>
          <div className='table-box'>
            <div className='table-header'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>분류</th>
                    <th>1월</th>
                    <th>2월</th>
                    <th>3월</th>
                    <th>4월</th>
                    <th>5월</th>
                    <th>6월</th>
                    <th>7월</th>
                    <th>8월</th>
                    <th>9월</th>
                    <th>10월</th>
                    <th>11월</th>
                    <th>12월</th>
                    <th>YTD</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className='table-body'>
              <table className='table'>
                <tbody>
                  {monthlyMockData.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.year}</td>
                      {row.values.map((value, idx2) => (
                        <td key={idx2}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div css={analyzeBoxStlye(isAnalyzeOpen)}>
        <div className='title'>
          <h5>분석</h5>
          <KeyboardArrowDown
            sx={{ fontSize: '40px' }}
            onClick={() => setIsAnalyzeOpen(!isAnalyzeOpen)}
          />
        </div>
        <div className='content'>
          {/* Chart 컴포넌트 구현 예정 */}
          <div className='chart-box'></div>
          <div className='tab-box'>
            <TabButton
              tabs={TAB_BUTTONS}
              currentTab={currentTab}
              handleTabChange={setCurrentTab}
            />
            <Outlet />
          </div>
        </div>
      </div>
      <div css={commentBoxStyle}>
        <div className='title'>
          <h5>댓글</h5>
        </div>
        <div className='input-box'>
          <div className='profile'>
            <ProfileImage />
            <span>닉네임</span>
          </div>
          <div className='input'>
            <TextArea
              value=''
              handleChange={() => {}}
              color='transparent'
              placeholder='댓글을 입력해주세요.'
              height={144}
              fullWidth={true}
            />
          </div>
          <div className='action-box'>
            <div className='limit'>
              <span>250</span> / <span>300</span>
            </div>
            <Button label='댓글 등록' handleClick={() => {}} width={80} />
          </div>
        </div>
        <div className='comment-box'>
          <h6>총 30개의 댓글</h6>
          <div className='comment-list'>
            {commentMockData.map((comment, idx) => (
              <Comment
                key={idx}
                profileImage={comment.profileImage}
                nickname={comment.nickname}
                date={comment.date}
                content={comment.content}
                isAuthor={comment.isAuthor}
              />
            ))}
          </div>
          <Pagination
            currentPage={0}
            totalPage={10}
            handlePageChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

const wrapperStyle = css`
  max-width: 1200px;
  height: 100%;
  padding: 0 10px;
  margin: 0 auto;
`;

const infoBoxStyle = css`
  display: flex;
  flex-direction: column;
  margin: 96px 0 40px 0;

  .border {
    border: 1px solid ${COLOR.GRAY};
    border-radius: 4px;
    padding: 24px;
  }

  .trader-box {
    width: 100%;
    height: 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left-box {
      display: flex;
      align-items: center;
      gap: 32px;

      .trader-info {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .like-info {
        display: flex;
        flex-direction: column;
        gap: 16px;

        span:first-of-type {
          font-size: ${FONT_SIZE.TEXT_SM};
        }

        div {
          display: flex;
          align-items: center;
          gap: 8px;
          color: ${COLOR.POINT};
        }
      }
    }

    .right-box {
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .buttons {
      display: flex;
      gap: 16px;
    }
  }

  .strategy-box {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
  }

  .detail-box {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .row {
      display: flex;

      .title {
        display: inline-block;
        width: 64px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border: 1px solid ${COLOR.PRIMARY100};
        margin-right: 8px;
        color: ${COLOR.PRIMARY};
      }

      .description {
        display: flex;
        flex: 1;
        line-height: 24px;
      }
    }
  }

  .count-box {
    display: flex;
    flex-direction: column;
    margin: 32px 0 40px 0;
    gap: 8px;

    .cards {
      display: flex;
      justify-content: space-between;

      .card {
        width: 220px;
        height: 160px;
        border: 1px solid ${COLOR.PRIMARY200};
        border-radius: 4px;
        background-color: ${COLOR.PRIMARY100};
      }
    }

    .explanation {
      text-align: right;
      color: ${COLOR.POINT};
    }
  }

  .monthly-box {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .title {
      display: flex;
      align-items: center;
      height: 80px;
      border-bottom: 1px solid ${COLOR.GRAY};
    }

    .table-box {
      width: 100%;
      border: 1px solid ${COLOR.PRIMARY100};

      .table-header {
        overflow: hidden;
      }

      .table-body {
        max-height: 240px;
        overflow-y: auto;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        width: 84px;
        height: 48px;
        text-align: center;
        vertical-align: middle;
        border: 1px solid ${COLOR.PRIMARY100};
      }

      td:first-of-type {
        font-weight: ${FONT_WEIGHT.BOLD};
      }

      th {
        color: ${COLOR.PRIMARY400};
        font-weight: ${FONT_WEIGHT.BOLD};
        background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
      }
    }
  }
`;

const analyzeBoxStlye = (isOpen: boolean) => css`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    border-bottom: 1px solid ${COLOR.GRAY};

    svg {
      margin: 20px;
      transform: rotate(${isOpen ? '180deg' : '0deg'});
      transition: 0.3s;

      &:hover {
        cursor: pointer;
      }
    }
  }
  .content {
    display: ${isOpen ? 'block' : 'none'};

    .chart-box {
      width: 100%;
      height: 560px;
      background-color: ${COLOR.GRAY};
      margin-bottom: 80px;
    }

    .tab-box {
      display: flex;
      flex-direction: column;
      gap: 36px;
    }
  }
`;

const commentBoxStyle = css`
  display: flex;
  flex-direction: column;

  .title {
    display: flex;
    align-items: center;
    height: 80px;
    border-bottom: 1px solid ${COLOR.GRAY};
  }

  .input-box {
    width: 100%;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    padding: 24px;
    margin: 40px 0;
    border: 1px solid ${COLOR.GRAY};
    border-radius: 4px;
    gap: 24px;

    .profile {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .input {
      border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
    }
  }

  .action-box {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .limit {
      font-size: ${FONT_SIZE.TEXT_SM};
    }
  }

  .comment-box {
    padding-bottom: 160px;

    .comment-list {
      border-top: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
      margin: 24px 0 32px 0;
    }
  }
`;

export default StrategyDetailLayout;
