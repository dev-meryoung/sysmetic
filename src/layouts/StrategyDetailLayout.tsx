import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import {
  FavoriteBorder,
  FileDownloadOutlined,
  PrintOutlined,
  KeyboardArrowDown,
  Link,
} from '@mui/icons-material';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import dayIcon from '@/assets/images/day-icon.png';
import facebookIcon from '@/assets/images/facebook-icon.png';
import positionIcon from '@/assets/images/position-icon.png';
import xIcon from '@/assets/images/x-icon.png';
import Button from '@/components/Button';
import Comment from '@/components/Comment';
import DetailCard from '@/components/DetailCard';
import IconButton from '@/components/IconButton';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import ProfileImage from '@/components/ProfileImage';
import TabButton from '@/components/TabButton';
import Tag from '@/components/Tag';
import TextArea from '@/components/TextArea';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useCreateStrategyComment,
  useDeleteStrategyComment,
  useGetStrategyAccount,
  useGetStrategyComment,
  useGetStrategyDaily,
  useGetStrategyInfo,
  useGetStrategyMonthly,
} from '@/hooks/useStrategyApi';
import useAuthStore from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

const TAB_BUTTONS = ['통계', '일간분석', '월간분석', '실계좌정보'];

const StrategyDetailLayout = () => {
  const navigate = useNavigate();
  const { strategyId } = useParams();
  const { isLoggedIn, roleCode, memberId, nickname, profileImage } =
    useAuthStore();
  const { openModal, closeModal } = useModalStore();

  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [dailyPage, setDailyPage] = useState<number>(0);
  const [monthlyPage, setMonthlyPage] = useState<number>(0);
  const [accountPage, setAccountPage] = useState<number>(0);
  const [dailyStartDate, setDailyStartDate] = useState<string>('');
  const [dailyEndDate, setDailyEndDate] = useState<string>('');
  const [dailyTotalPage, setDailyTotalPage] = useState<string>('');
  const [monthlyStartYearMonth, setMonthlyStartYearMonth] =
    useState<string>('');
  const [monthlyEndYearMonth, setMonthlyEndYearMonth] = useState<string>('');
  const [monthlyTotalPage, setMonthlyTotalPage] = useState<string>('');
  const [accountTotalPage, setAccountTotalPage] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [deleteCommentId, setDeleteCommentId] = useState<number>(0);
  const [commentPage, setCommentPage] = useState<number>(0);
  const [commentTotalPage, setCommentTotalPage] = useState<string>('');
  const [noticeMessage, setNoticeMessage] = useState<string>('');

  const {
    data: strategyInfo,
    isError: strategyInfoIsError,
    refetch: refetchStrategyInfo,
  } = useGetStrategyInfo(strategyId as string);
  const { data: strategyDaily } = useGetStrategyDaily(
    strategyId as string,
    dailyPage,
    dailyStartDate,
    dailyEndDate
  );
  const { data: strategyMonthly } = useGetStrategyMonthly(
    strategyId as string,
    monthlyPage,
    monthlyStartYearMonth,
    monthlyEndYearMonth
  );
  const { data: strategyAccount } = useGetStrategyAccount(
    strategyId as string,
    accountPage
  );
  const { data: strategyComment, refetch: refetchStrategyComment } =
    useGetStrategyComment(strategyId as string, commentPage);
  const { mutate: createCommentMutate } = useCreateStrategyComment();
  const { mutate: deleteCommentMutate } = useDeleteStrategyComment();

  useEffect(() => {
    const pathArr: string[] = [
      PATH.STRATEGIES_DETAIL(strategyId),
      PATH.STRATEGIES_DETAIL_DAILY(strategyId),
      PATH.STRATEGIES_DETAIL_MONTHLY(strategyId),
      PATH.STRATEGIES_DETAIL_ACCOUNT(strategyId),
    ];

    navigate(pathArr[currentTab]);
  }, [currentTab, navigate]);

  useEffect(() => {
    if (strategyInfoIsError) navigate(PATH.ROOT);
  }, [strategyInfo, strategyInfoIsError]);

  useEffect(() => {
    if (strategyComment)
      setCommentTotalPage(strategyComment.totalPages.toString());
  }, [strategyComment]);

  const handleCommentCheckLogin = () => {
    if (!isLoggedIn) {
      openModal('check-login', 400);
      return;
    }
  };

  const handleCreateCommentButton = () => {
    if (comment.trim().length <= 0) {
      setComment('');
      setNoticeMessage('댓글 내용을 입력해주세요.');
      openModal('notice', 400);
      return;
    }

    if (strategyId) {
      createCommentMutate(
        { strategyId: +strategyId, content: comment },
        {
          onSuccess: () => {
            setComment('');
            refetchStrategyComment();
          },
        }
      );
    }
  };

  const handleCommentDeleteButton = () => {
    if (strategyId) {
      deleteCommentMutate(
        { strategyId: +strategyId, replyId: deleteCommentId },
        {
          onSuccess: () => {
            setDeleteCommentId(0);
            refetchStrategyComment();
            closeModal('comment-delete');
          },
        }
      );
    }
  };

  return (
    <div css={wrapperStyle}>
      <div css={infoBoxStyle}>
        <div className='trader-box border'>
          <div className='left-box'>
            <div className='trader-info'>
              <ProfileImage src={strategyInfo?.traderProfileImage} />
              <span>{strategyInfo?.traderNickname}</span>
            </div>
            <div className='count-info'>
              <span>관심수</span>
              <div>
                <FavoriteBorder sx={{ color: COLOR.POINT, fontSize: '20px' }} />
                <span>{strategyInfo?.followerCount}</span>
              </div>
            </div>
            {isLoggedIn && roleCode === 'USER' ? (
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
                  handleClick={() => navigate(PATH.STRATEGIES_QNA(strategyId))}
                />
              </div>
            ) : (
              ''
            )}
          </div>
          <div className='right-box'>
            <div className='buttons'>
              <img
                src={xIcon}
                alt='x'
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  const text = encodeURIComponent('Check this out!');
                  window.open(
                    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                    '_blank'
                  );
                }}
              />
              <img
                src={facebookIcon}
                alt='facebook'
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                    '_blank'
                  );
                }}
              />
              <IconButton
                IconComponent={Link}
                shape='round'
                color='white'
                handleClick={() => {
                  const currentUrl = window.location.href;
                  navigator.clipboard.writeText(currentUrl).then(() => {
                    setNoticeMessage('URL 주소가 클립보드에 복사되었습니다.');
                    openModal('notice', 400);
                  });
                }}
              />
              <IconButton
                IconComponent={PrintOutlined}
                shape='round'
                color='white'
                handleClick={() => window.print()}
              />
              {strategyInfo?.fileWithInfoResponse ? (
                <IconButton
                  IconComponent={FileDownloadOutlined}
                  shape='round'
                  color='white'
                  handleClick={() => {
                    window.open(
                      strategyInfo?.fileWithInfoResponse.url,
                      '_blank'
                    );
                  }}
                />
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <div className='strategy-box'>
          <div className='tags'>
            <Tag src={strategyInfo?.methodIconPath as string} />
            <Tag src={strategyInfo?.cycle === 'D' ? dayIcon : positionIcon} />
            {strategyInfo?.stockList.stockIconPath.map((icon, idx) => (
              <Tag src={icon} key={idx} />
            ))}
          </div>
          <span>{strategyInfo?.name}</span>
        </div>
        <div className='detail-box border'>
          <div className='row'>
            <span className='title'>운용종목</span>
            <span className='description'>
              {strategyInfo?.stockList?.stockNames?.join(', ')}
            </span>
          </div>
          <div className='row'>
            <span className='title'>매매방식</span>
            <span className='description'>{strategyInfo?.methodName}</span>
          </div>
          <div className='row'>
            <span className='title'>주기</span>
            <span className='description'>
              {strategyInfo?.cycle === 'D' ? '데이' : '포지션'}
            </span>
          </div>
          <div className='row'>
            <span className='title'>전략소개</span>
            <span className='description'>{strategyInfo?.content}</span>
          </div>
        </div>
        <div className='count-box'>
          <div className='cards'>
            <DetailCard
              title='누적 손익률'
              value={
                strategyInfo
                  ? (strategyInfo?.accumulatedProfitLossRate as number)
                  : 0
              }
            />
            <DetailCard
              title='최대 자본인하율'
              value={strategyInfo?.maximumCapitalReductionAmount as number}
            />
            <DetailCard
              title='평균 손익률'
              value={strategyInfo?.averageProfitLossRate as number}
            />
            <DetailCard
              title='Profit Factor'
              type='RATIO'
              value={strategyInfo?.profitFactor as number}
            />
            <DetailCard
              title='승률'
              value={strategyInfo?.winningRate as number}
            />
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
                  {strategyInfo?.monthlyRecord.map((row, idx) => {
                    const monthlyData = Array.from({ length: 13 }, (_, i) => {
                      const month = i + 1;
                      const monthData = row.data.find((d) => d.month === month);
                      return monthData ? +monthData.value : '-';
                    });

                    return (
                      <tr key={idx}>
                        <td>{row.year}</td>
                        {monthlyData.map((value, idx2) => (
                          <td
                            key={idx2}
                            style={{
                              color:
                                typeof value === 'number'
                                  ? value < 0
                                    ? COLOR.PRIMARY400
                                    : COLOR.POINT
                                  : 'inherit',
                            }}
                          >
                            {typeof value === 'number'
                              ? `${value.toFixed(1)}%`
                              : value}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div css={analyzeBoxStlye(isAnalyzeOpen)}>
        <div className='title' onClick={() => setIsAnalyzeOpen(!isAnalyzeOpen)}>
          <h5>분석</h5>
          <KeyboardArrowDown sx={{ fontSize: '40px' }} />
        </div>
        <div className='content'>
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
            <ProfileImage src={profileImage} />
            <span>{nickname}</span>
          </div>
          <div className='input'>
            <div onClick={handleCommentCheckLogin}>
              <TextArea
                value={comment}
                handleChange={(e) => {
                  setComment(e.target.value);
                }}
                color='transparent'
                placeholder={
                  isLoggedIn ? '댓글을 입력해주세요.' : '로그인이 필요합니다.'
                }
                height={144}
                fullWidth={true}
                maxLength={300}
                disabled={!isLoggedIn}
              />
            </div>
          </div>
          <div className='action-box'>
            <div
              className='limit'
              style={{ color: comment.length >= 300 ? COLOR.ERROR_RED : '' }}
            >
              <span>{comment.length}</span> / <span>300</span>
            </div>
            <Button
              label='등록'
              handleClick={handleCreateCommentButton}
              disabled={!isLoggedIn}
              width={80}
            />
          </div>
        </div>
        {strategyComment.content.length > 0 ? (
          <div className='comment-box'>
            <h6>총 {strategyComment.totalElement}개의 댓글</h6>
            <div className='comment-list'>
              {strategyComment.content.map((comment) => (
                <Comment
                  key={comment.replyId}
                  profileImage={comment.memberProfilePath}
                  nickname={comment.memberNickname}
                  date={comment.createdAt}
                  content={comment.content.split('\n').map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                  isAuthor={comment.memberId === memberId}
                  handleSetDeleteComment={() =>
                    setDeleteCommentId(comment.replyId)
                  }
                />
              ))}
            </div>
            <Pagination
              currentPage={commentPage}
              totalPage={+commentTotalPage}
              handlePageChange={setCommentPage}
            />
          </div>
        ) : (
          ''
        )}
      </div>
      <Modal
        id='notice'
        content={
          <div css={modalStyle}>
            <span>{noticeMessage}</span>
          </div>
        }
      />
      <Modal
        id='comment-delete'
        content={
          <div css={modalStyle}>
            <span>댓글을 삭제하시겠습니까?</span>
            <div className='buttons'>
              <Button
                label='아니오'
                handleClick={() => {
                  setDeleteCommentId(0);
                  closeModal('comment-delete');
                }}
                width={120}
                border={true}
              />
              <Button
                label='예'
                handleClick={() => handleCommentDeleteButton()}
                width={120}
              />
            </div>
          </div>
        }
      />
      <Modal
        id='check-login'
        content={
          <div css={modalStyle}>
            <span>
              로그인이 필요합니다.
              <br />
              로그인하시겠습니까?
            </span>
            <div className='buttons'>
              <Button
                label='아니오'
                handleClick={() => {
                  setDeleteCommentId(0);
                  closeModal('check-login');
                }}
                width={120}
                border={true}
              />
              <Button
                label='로그인'
                handleClick={() => navigate(PATH.SIGN_IN)}
                width={120}
              />
            </div>
          </div>
        }
      />
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

      .count-info {
        display: flex;
        flex-direction: column;
        gap: 16px;

        span:first-child {
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

    .tags {
      display: flex;
      gap: 4px;
    }
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
        letter-spacing: -2%;
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

    &:hover {
      cursor: pointer;
    }

    svg {
      margin: 20px;
      transform: rotate(${isOpen ? '180deg' : '0deg'});
      transition: 0.3s;
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

const modalStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 8px;
  line-height: 24px;
  gap: 24px;

  span {
    text-align: center;
  }

  .buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 16px;
  }
`;

export default StrategyDetailLayout;
