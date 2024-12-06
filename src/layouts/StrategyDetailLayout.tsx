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
import Chart from '@/components/Chart';
import Comment from '@/components/Comment';
import DetailCard from '@/components/DetailCard';
import IconButton from '@/components/IconButton';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import ProfileImage from '@/components/ProfileImage';
import RadioButton from '@/components/RadioButton';
import SelectBox from '@/components/SelectBox';
import TabButton from '@/components/TabButton';
import Tag from '@/components/Tag';
import TextArea from '@/components/TextArea';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useCreateFollowFolder,
  useCreateStrategyComment,
  useDeleteSingleInterestStrategy,
  useDeleteStrategyComment,
  useGetStrategyAnalysis,
  useGetStrategyComment,
  useGetStrategyInfo,
  useGetUserFolderList,
} from '@/hooks/useStrategyApi';
import useAuthStore from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

const TAB_BUTTONS = ['통계', '일간분석', '월간분석', '실계좌정보'];
const ANALYSIS_OPTIONS = [
  { label: '기준가', value: 'standardAmounts', unit: '원' },
  { label: '잔고', value: 'currentBalance', unit: '원' },
  { label: '원금', value: 'principal', unit: '원' },
  {
    label: '누적 입출 금액',
    value: 'accumulatedDepositWithdrawalAmount',
    unit: '원',
  },
  { label: '일별 입출 금액', value: 'depositWithdrawalAmount', unit: '원' },
  { label: '일 손익 금액', value: 'dailyProfitLossAmount', unit: '원' },
  { label: '일 손익율', value: 'dailyProfitLossRate', unit: '%' },
  { label: '누적 손익 금액', value: 'accumulatedProfitLossAmount', unit: '원' },
  {
    label: '현재 자본 인하 금액',
    value: 'currentCapitalReductionAmount',
    unit: '원',
  },
  {
    label: '현재 자본 인하율',
    value: 'currentCapitalReductionRate',
    unit: '%',
  },
  { label: '평균 손익 금액', value: 'averageProfitLossAmount', unit: '원' },
  { label: '평균 손익률', value: 'averageProfitLossRate', unit: '%' },
  { label: '승률', value: 'winningRate', unit: '%' },
  { label: 'Profit Factor', value: 'profitFactor', unit: '%' },
  { label: 'ROA', value: 'roa', unit: '%' },
];

const StrategyDetailLayout = () => {
  const navigate = useNavigate();
  const { strategyId } = useParams();
  const { isLoggedIn, roleCode, memberId, nickname, profileImage } =
    useAuthStore();
  const { openModal, closeModal } = useModalStore();

  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [graphOption1, setGraphOption1] = useState<string>('standardAmounts');
  const [graphOption2, setGraphOption2] = useState<string>('currentBalance');
  const [chartData, setChartData] = useState({
    data1: [],
    data2: [],
  });
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
  const { data: strategyAnalysis } = useGetStrategyAnalysis(
    strategyId as string
  );
  const { data: strategyComment, refetch: refetchStrategyComment } =
    useGetStrategyComment(strategyId as string, commentPage);
  const { mutate: createCommentMutate } = useCreateStrategyComment();
  const { mutate: deleteCommentMutate } = useDeleteStrategyComment();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    if (strategyAnalysis) {
      const formatValue = (value: number, optionValue: string) => {
        const unit = ANALYSIS_OPTIONS.find(
          (option) => option.value === optionValue
        )?.unit;

        if (unit === '원') {
          return Math.round(value);
        }

        if (unit === '%') {
          return parseFloat(value.toFixed(2));
        }

        return value;
      };

      const data1 =
        strategyAnalysis[graphOption1]?.map((value: number, idx: number) => [
          new Date(strategyAnalysis.xaxis[idx]).getTime(),
          formatValue(value, graphOption1),
        ]) || [];

      const data2 =
        strategyAnalysis[graphOption2]?.map((value: number, idx: number) => [
          new Date(strategyAnalysis.xaxis[idx]).getTime(),
          formatValue(value, graphOption2),
        ]) || [];

      setChartData({ data1, data2 });
    }
  }, [strategyAnalysis, graphOption1, graphOption2]);

  useEffect(() => {
    if (strategyInfoIsError) navigate(PATH.NOT_FOUND);
  }, [strategyInfo, strategyInfoIsError]);

  useEffect(() => {
    if (strategyComment)
      setCommentTotalPage(strategyComment.totalPages.toString());
  }, [strategyComment]);

  const [selectedOption1, selectedOption2] = [graphOption1, graphOption2].map(
    (optionValue) =>
      ANALYSIS_OPTIONS.find((option) => option.value === optionValue) || null
  );

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

  const handleCommentCheckLogin = () => {
    if (!isLoggedIn) {
      openModal('check-login', 400);
      return;
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

  const AddInterestModalContent = () => {
    const { closeModal } = useModalStore();

    const { data: folderListData } = useGetUserFolderList();
    const { mutate: createFollowFolder } = useCreateFollowFolder();
    const [selectedOption, setSelectedOption] = useState<string | ''>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const folderOptions =
      folderListData?.data.map((folder: any) => ({
        value: folder.id,
        label: folder.name,
      })) || [];

    const handleRadioChange = (value: string) => {
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        setSelectedOption(value);
        setErrorMessage('');
      }
    };

    const validateRequest = (
      folderId: number | '',
      strategyId: number
    ): boolean => {
      if (!folderId) {
        setErrorMessage('폴더를 선택해주세요.');
        return false;
      }

      if (!Number.isInteger(strategyId) || strategyId <= 0) {
        setErrorMessage('유효하지 않은 전략 ID입니다.');
        return false;
      }

      return true;
    };

    const handleAddButtonClick = () => {
      const selectedOptionNumber = Number(selectedOption);

      if (strategyId && !validateRequest(selectedOptionNumber, +strategyId)) {
        return;
      }

      const requestBody = {
        folderId: selectedOptionNumber,
        strategyId: Number(strategyId),
      };

      createFollowFolder(requestBody, {
        onSuccess: () => {
          closeModal('add-interest-modal');
          refetchStrategyInfo();
          openModal('add-complete-modal');
          setErrorMessage('');
          setSelectedOption('');
        },
      });
    };

    return (
      <div css={addInteresmodalStyle}>
        <span>관심 등록</span>
        <RadioButton
          options={folderOptions}
          name='folder-radio'
          selected={selectedOption}
          handleChange={handleRadioChange}
        />
        {errorMessage && <span className='error-msg'>{errorMessage}</span>}
        <Button
          label='등록하기'
          size='sm'
          handleClick={handleAddButtonClick}
          disabled={!selectedOption}
        />
      </div>
    );
  };

  const DeleteInterestModalContent = () => {
    const { closeModal } = useModalStore();

    const { mutate: deleteInteresMutate } = useDeleteSingleInterestStrategy();

    const handleDeleteInteres = () => {
      if (strategyId)
        deleteInteresMutate(+strategyId, {
          onSuccess: () => {
            closeModal('delete-modal');
            refetchStrategyInfo();
            openModal('delete-complete-modal');
          },
        });
    };

    return (
      <div css={commonModalStyle}>
        해당전략을 관심취소하시겠습니까?
        <div className='btn-area'>
          <Button
            label='아니오'
            border={true}
            width={120}
            handleClick={() => {
              closeModal('delete-modal');
            }}
          />
          <Button
            label='예'
            width={120}
            handleClick={() => {
              handleDeleteInteres();
            }}
          />
        </div>
      </div>
    );
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
            <div className='buttons'>
              {strategyInfo?.isFollow ? (
                <Button
                  label='관심취소'
                  size='xs'
                  shape='round'
                  border={true}
                  color='pointOpacity10'
                  width={80}
                  handleClick={() => {
                    if (roleCode === 'USER') {
                      if (isLoggedIn) {
                        openModal('delete-modal');
                      } else {
                        openModal('check-login-modal', 360);
                      }
                    } else {
                      openModal('sign-up-modal', 360);
                    }
                  }}
                />
              ) : (
                <Button
                  label='관심등록'
                  size='xs'
                  shape='round'
                  border={true}
                  color='pointOpacity10'
                  width={80}
                  handleClick={() => {
                    if (roleCode === 'USER') {
                      if (isLoggedIn) {
                        openModal('add-interest-modal', 216);
                      } else {
                        openModal('check-login-modal', 360);
                      }
                    } else {
                      openModal('sign-up-modal', 360);
                    }
                  }}
                />
              )}
              <Button
                label='문의하기'
                size='xs'
                shape='round'
                border={true}
                color='primaryOpacity10'
                width={80}
                handleClick={() => {
                  if (roleCode === 'USER') {
                    if (isLoggedIn) {
                      navigate(PATH.STRATEGIES_QNA(strategyId));
                    } else {
                      openModal('check-login-modal', 360);
                    }
                  } else {
                    openModal('sign-up-modal', 360);
                  }
                }}
              />
            </div>
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
          <div className='chart-box'>
            <div className='select-box'>
              <SelectBox
                options={ANALYSIS_OPTIONS}
                handleChange={setGraphOption1}
                value={graphOption1}
              />
              <SelectBox
                options={ANALYSIS_OPTIONS}
                handleChange={setGraphOption2}
                value={graphOption2}
              />
            </div>

            <Chart
              chartData={chartData}
              name={[
                selectedOption1?.label || '',
                selectedOption2?.label || '',
              ]}
              unit={[selectedOption1?.unit || '', selectedOption2?.unit || '']}
              type={['line', 'line']}
            />
          </div>
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
      <Modal id='add-interest-modal' content={<AddInterestModalContent />} />
      <Modal id='delete-modal' content={<DeleteInterestModalContent />} />
      <Modal
        id='add-complete-modal'
        content={
          <div css={commonModalStyle}>
            해당전략을 관심등록했습니다.
            <br />
            마이페이지에서 확인하세요.
            <div className='btn-area'>
              <Button
                label='마이페이지 가기'
                border={true}
                width={120}
                handleClick={() => {
                  navigate(PATH.MYPAGE);
                  closeModal('add-complete-modal');
                }}
              />
              <Button
                label='계속하기'
                width={120}
                handleClick={() => {
                  closeModal('add-complete-modal');
                }}
              />
            </div>
          </div>
        }
      />
      <Modal
        id='delete-complete-modal'
        content={
          <div css={commonModalStyle}>
            해당전략을 관심취소했습니다.
            <div className='btn-area'>
              <Button
                label='마이페이지 가기'
                border={true}
                width={120}
                handleClick={() => {
                  navigate(PATH.MYPAGE);
                  closeModal('delete-complete-modal');
                }}
              />
              <Button
                label='계속하기'
                width={120}
                handleClick={() => {
                  closeModal('delete-complete-modal');
                }}
              />
            </div>
          </div>
        }
      />
      <Modal
        id='check-login-modal'
        content={
          <div css={commonModalStyle}>
            로그인이 필요합니다.
            <br />
            로그인하시겠습니까?
            <div className='btn-area'>
              <Button
                label='메인가기'
                border={true}
                width={120}
                handleClick={() => {
                  navigate(PATH.ROOT);
                  closeModal('check-login-modal');
                }}
              />
              <Button
                label='로그인'
                width={120}
                handleClick={() => {
                  navigate(PATH.SIGN_IN);
                  closeModal('check-login-modal');
                }}
              />
            </div>
          </div>
        }
      />
      <Modal
        id='sign-up-modal'
        content={
          <div css={commonModalStyle}>
            투자자 회원가입이 필요한 서비스 입니다.
            <br />
            회원가입을 진행해주세요.
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
      display: flex;
      position: relative;
      width: 100%;
      margin-bottom: 80px;

      .select-box {
        display: flex;
        position: absolute;
        top: 30px;
        right: 0;
        gap: 16px;
        z-index: 1;
      }
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

const commonModalStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  line-height: 160%;
  padding-top: 8px;

  .btn-area {
    display: flex;
    gap: 16px;
  }
`;

const addInteresmodalStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;

  .css-1o97835 {
    flex-direction: column;
  }
  span {
    font-size: ${FONT_SIZE.TEXT_SM};
    font-weight: ${FONT_WEIGHT.MEDIUM};
  }
  .error-msg {
    color: ${COLOR.ERROR_RED};
    font-size: ${FONT_SIZE.TEXT_SM};
  }
`;

export default StrategyDetailLayout;
