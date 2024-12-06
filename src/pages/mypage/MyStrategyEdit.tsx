import { css } from '@emotion/react';
import {
  AddPhotoAlternateOutlined,
  Close,
  FavoriteBorder,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import Button from '@/components/Button';
import Calendar from '@/components/Calendar';
import Checkbox from '@/components/Checkbox';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import ProfileImage from '@/components/ProfileImage';
import SelectBox from '@/components/SelectBox';
import TabButton from '@/components/TabButton';
import TextArea from '@/components/TextArea';
import TextInput from '@/components/TextInput';
import Toggle from '@/components/Toggle';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import useMyStrategyEdit from '@/hooks/useMyStrategyEdit';
import { formatCurrency, formatDate, formatPercent } from '@/utils/dataUtils';

const TAB_BUTTONS = ['기본정보', '일간분석', '실계좌정보'];
const CYCLE_OPTIONS = [
  { label: '데이', value: 'D' },
  { label: '포지션', value: 'P' },
];
const STATUS_CODES = {
  PRIVATE: ['요청 전', COLOR.GRAY700],
  REQUEST: ['요청됨', COLOR.BLACK],
  PUBLIC: ['승인', COLOR.CHECK_GREEN],
  RETURN: ['반려', COLOR.ERROR_RED],
};

const MyStrategyEdit = () => {
  const {
    currentTab,
    setCurrentTab,
    dailyPage,
    setDailyPage,
    accountPage,
    setAccountPage,
    methodOptions,
    stockOptions,
    status,
    statusToggle,
    title,
    setTitle,
    method,
    setMethod,
    cycle,
    setCycle,
    stocks,
    content,
    setContent,
    file,
    dailyStartDate,
    setDailyStartDate,
    dailyEndDate,
    setDailyEndDate,
    dailyTotalPage,
    newDailyData,
    setNewDailyData,
    editingDailyId,
    setEditingDailyId,
    editedDailyData,
    setEditedDailyData,
    setDeleteDailyId,
    accountTotalPage,
    newAccountData,
    setNewAccountData,
    checkedAccount,
    submitErrorData,
    noticeMessage,
    fileInputRef,
    excelFileInputRef,
    strategyInfo,
    strategyDaily,
    strategyAccount,
    exampleLink,
    handleCheckboxChange,
    handleBrowseClick,
    handleFileChange,
    handleFileDelete,
    handleStrategySubmitButton,
    handleRequestApproveButton,
    handleCancelApproveButton,
    handleDailyAddButton,
    handleExcelFileChange,
    handleNewDailyDataChange,
    handleDailySubmitButton,
    handleDailyEditButton,
    handleDailyUpdateButton,
    handleDailyDeleteButton,
    handleAccountAddButton,
    handleBrowseImageClick,
    handleImageFileChange,
    handleImageFileDelete,
    handleAccountSubmitButton,
    handleAccountCheckboxChange,
    handleAccountCheckAllButton,
    handleAccountDeleteButton,
    openModal,
    closeModal,
    navigate,
    refetchStrategyInfo,
    changePrivateMutate,
  } = useMyStrategyEdit();

  const { strategyId } = useParams();

  const conditionalRender: Record<(typeof TAB_BUTTONS)[number], JSX.Element> = {
    기본정보: ['PRIVATE', 'RETURN'].includes(status) ? (
      <div css={formBoxStyle}>
        <div className='form-box'>
          <div className='form-item'>
            <span>전략명</span>
            <TextInput
              value={title}
              handleChange={(e) => setTitle(e.target.value)}
              width={700}
              maxLength={30}
            />
          </div>
          <div className='form-item'>
            <span>매매방식</span>
            <SelectBox
              placeholder='매매방식 선택'
              value={method}
              options={methodOptions}
              handleChange={setMethod}
            />
          </div>
          <div className='form-item'>
            <span>주기</span>
            <SelectBox
              placeholder='주기 선택'
              value={cycle}
              options={CYCLE_OPTIONS}
              handleChange={setCycle}
            />
          </div>
          <div className='form-item'>
            <span>운용 종목</span>
            {stockOptions.map((option: { label: string; value: string }) => (
              <Checkbox
                key={option.value}
                checked={stocks.includes(option.value)}
                label={option.label}
                handleChange={() => handleCheckboxChange(option.value)}
              />
            ))}
          </div>
          <div className='form-item form-item-top'>
            <span>
              전략소개
              <br />
              <span className='explain-text'>(500자내외)</span>
            </span>
            <TextArea
              value={content}
              handleChange={(e) => setContent(e.target.value)}
              maxLength={500}
            />
          </div>
          <div className='form-item form-item-last'>
            <span>제안서</span>
            <div className='file-box'>
              <div>
                <TextInput
                  value={file ? file.name : ''}
                  iconNum='single'
                  handleChange={() => {}}
                  disabled={true}
                />
                {file && (
                  <Close
                    className='delete'
                    onClick={handleFileDelete}
                    sx={{ fontSize: 20, color: COLOR.POINT }}
                  />
                )}
              </div>
              <Button
                label='찾아보기'
                handleClick={handleBrowseClick}
                width={80}
              />
              <input
                type='file'
                ref={fileInputRef}
                accept='.pdf'
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        <div className='button-box'>
          <Button
            label='이전'
            handleClick={() => navigate(-1)}
            border={true}
            width={120}
          />
          <Button
            label='전략수정'
            handleClick={handleStrategySubmitButton}
            width={120}
          />
        </div>
      </div>
    ) : (
      <div css={onlyViewBoxStyle}>
        <div className='form-box'>
          <div className='form-item'>
            <span>전략명</span>
            <span>{title}</span>
          </div>
          <div className='form-item'>
            <span>매매방식</span>
            <span>{methodOptions[+method].label}</span>
          </div>
          <div className='form-item'>
            <span>주기</span>
            <span>
              {CYCLE_OPTIONS.find((option) => option.value === cycle)?.label}
            </span>
          </div>
          <div className='form-item'>
            <span>운용 종목</span>
            <div className='options'>
              {stockOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  checked={stocks.includes(option.value)}
                  handleChange={() => {}}
                  label={option.label}
                />
              ))}
            </div>
          </div>
          <div className='form-item form-item-top'>
            <span>전략소개</span>
            <span>{strategyInfo?.content}</span>
          </div>
          <div className='form-item form-item-last'>
            <span>제안서</span>
            {strategyInfo?.fileWithInfoResponse ? (
              <a
                href={strategyInfo?.fileWithInfoResponse.url}
                target='_blank'
                download={strategyInfo?.fileWithInfoResponse.originalName}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {strategyInfo?.fileWithInfoResponse.originalName}
              </a>
            ) : (
              '-'
            )}
          </div>
        </div>
        <div className='explanation'>
          <span>
            ※ 기본정보 수정은 전략이 비공개(신청 전) 상태일 때만 가능합니다.
          </span>
        </div>
      </div>
    ),
    일간분석: (
      <div css={dailyBoxStyle}>
        <div className='action-box'>
          <Calendar
            type='periodDate'
            periodProps={{
              startDate: dailyStartDate,
              setStartDate: setDailyStartDate,
              endDate: dailyEndDate,
              setEndDate: setDailyEndDate,
            }}
          />
          <div className='buttons'>
            <Button
              label='데이터 입력'
              width={95}
              handleClick={handleDailyAddButton}
            />
            <Button
              label='엑셀 양식 다운로드'
              color='black'
              width={130}
              handleClick={() => {
                if (exampleLink?.data) {
                  const fileUrl = exampleLink.data;
                  const a = document.createElement('a');
                  a.href = fileUrl;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }
              }}
            />
            <Button
              label='엑셀 업로드'
              color='black'
              width={95}
              handleClick={() => {
                excelFileInputRef.current?.click();
              }}
            />
            <input
              type='file'
              ref={excelFileInputRef}
              accept='.xlsx'
              style={{ display: 'none' }}
              onChange={handleExcelFileChange}
            />
          </div>
        </div>
        <div className='table-box'>
          <table className='table'>
            <thead>
              <tr>
                <th>날짜</th>
                <th>원금</th>
                <th>입출금</th>
                <th>일 손익</th>
                <th>일 손익률</th>
                <th>누적손익</th>
                <th>누적손익률</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {strategyDaily?.content && strategyDaily.content.length > 0 ? (
                strategyDaily.content.map((daily) => (
                  <tr key={daily.dailyId}>
                    <td>
                      {editingDailyId === daily.dailyId ? (
                        <div className='editing-box'>
                          <Calendar
                            type='date'
                            size='mini'
                            dateProps={{
                              date: editedDailyData.date,
                              setDate: (value) =>
                                setEditedDailyData((prev) => ({
                                  ...prev,
                                  date: value as string,
                                })),
                            }}
                          />
                        </div>
                      ) : (
                        formatDate(daily.date)
                      )}
                    </td>
                    <td>{formatCurrency(daily.principal)}</td>
                    <td
                      className={
                        editingDailyId === daily.dailyId ? 'editing' : ''
                      }
                    >
                      {editingDailyId === daily.dailyId ? (
                        <div className='editing-box'>
                          <TextInput
                            type='number'
                            value={editedDailyData.depositWithdrawalAmount.toString()}
                            handleChange={(e) =>
                              setEditedDailyData((prev) => ({
                                ...prev,
                                depositWithdrawalAmount: +e.target.value,
                              }))
                            }
                            width={160}
                          />
                        </div>
                      ) : (
                        formatCurrency(daily.depositWithdrawalAmount)
                      )}
                    </td>
                    <td
                      className={
                        editingDailyId === daily.dailyId ? 'editing' : ''
                      }
                    >
                      {editingDailyId === daily.dailyId ? (
                        <div className='editing-box'>
                          <TextInput
                            type='number'
                            value={editedDailyData.dailyProfitLossAmount.toString()}
                            handleChange={(e) =>
                              setEditedDailyData((prev) => ({
                                ...prev,
                                dailyProfitLossAmount: +e.target.value,
                              }))
                            }
                            width={160}
                          />
                        </div>
                      ) : (
                        formatCurrency(daily.profitLossAmount)
                      )}
                    </td>
                    <td>{formatPercent(daily.profitLossRate)}</td>
                    <td>{formatCurrency(daily.accumulatedProfitLossAmount)}</td>
                    <td>{formatPercent(daily.accumulatedProfitLossRate)}</td>
                    <td>
                      {editingDailyId === daily.dailyId ? (
                        <div>
                          <Button
                            label='저장'
                            shape='round'
                            size='xs'
                            width={80}
                            border={true}
                            handleClick={() => handleDailyUpdateButton()}
                          />
                          <Button
                            label='취소'
                            shape='round'
                            size='xs'
                            color='point'
                            width={80}
                            border={true}
                            handleClick={() => setEditingDailyId(0)}
                          />
                        </div>
                      ) : (
                        <div>
                          <Button
                            label='수정'
                            shape='round'
                            size='xs'
                            width={80}
                            border={true}
                            handleClick={() => handleDailyEditButton(daily)}
                          />
                          <Button
                            label='삭제'
                            shape='round'
                            size='xs'
                            color='point'
                            width={80}
                            border={true}
                            handleClick={() => {
                              setDeleteDailyId(daily.dailyId);
                              openModal('daily-delete');
                            }}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    style={{ textAlign: 'center', padding: '64px' }}
                  >
                    <div>해당하는 데이터가 없습니다.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <span className='explanation'>
            ※ 모든 통계 및 그래프 데이터는 실시간으로 반영되는 것이 아니라, 전
            날까지의 일간분석 데이터를 토대로 계산됩니다.
          </span>
        </div>
        {strategyDaily?.content && strategyDaily.content.length > 0 ? (
          <Pagination
            currentPage={dailyPage}
            totalPage={+dailyTotalPage}
            handlePageChange={setDailyPage}
          />
        ) : (
          ''
        )}
      </div>
    ),
    실계좌정보: (
      <div css={accountBoxStyle}>
        <div className='buttons'>
          <Button
            label='실계좌 인증'
            width={95}
            handleClick={handleAccountAddButton}
          />
          <Button
            label='전체선택'
            color='black'
            width={80}
            handleClick={handleAccountCheckAllButton}
          />
          <Button
            label='삭제'
            color='black'
            width={80}
            handleClick={() => openModal('account-delete')}
          />
        </div>
        <div className='account-box'>
          {strategyAccount?.content && strategyAccount.content.length > 0 ? (
            strategyAccount.content.map((account) => (
              <div className='account' key={account.accountImageId}>
                <Checkbox
                  checked={checkedAccount.includes(account.accountImageId)}
                  handleChange={() =>
                    handleAccountCheckboxChange(account.accountImageId)
                  }
                />
                <img
                  src={account.imageUrl}
                  onClick={() =>
                    window.open(
                      account.imageUrl,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                />
                <span>{account.title}</span>
              </div>
            ))
          ) : (
            <div
              style={{ textAlign: 'center', width: '100%', padding: '64px' }}
            >
              해당하는 데이터가 없습니다.
            </div>
          )}
        </div>
        {strategyAccount?.content && strategyAccount.content.length > 0 && (
          <Pagination
            currentPage={accountPage}
            totalPage={+accountTotalPage}
            handlePageChange={setAccountPage}
          />
        )}
      </div>
    ),
  };

  return (
    <div css={wrapperStyle}>
      <div css={titleBoxStyle}>
        <h5>전략 수정</h5>
        <span>
          시스메틱에서 나의 투자 전략을 수정하고 다시 공유해보세요.
          <br />
          트레이더라면 투자자들이 당신의 전략에 투자할 수 있습니다.
        </span>
      </div>
      <div css={traderBoxStyle}>
        <div className='left-box'>
          <div className='trader-box'>
            <ProfileImage src={strategyInfo?.traderProfileImage} />
            <span>{strategyInfo?.traderNickname}</span>
          </div>
          <div className='count-box'>
            <span>관심수</span>
            <div>
              <FavoriteBorder sx={{ color: COLOR.POINT, fontSize: 20 }} />
              <span>{strategyInfo?.followerCount}</span>
            </div>
          </div>
        </div>
        <div className='right-box'>
          <div className='row-box'>
            <span>전략공개</span>
            <Toggle
              checked={statusToggle}
              disabled={!statusToggle}
              handleChange={() => {
                openModal('change-status', 400);
              }}
            />
          </div>
          <div className='row-box'>
            <span>승인단계</span>
            <span css={statusStyle(status)}>
              {STATUS_CODES[status as keyof typeof STATUS_CODES][0]}
            </span>
          </div>
          {status !== 'PUBLIC' && (
            <div>
              {status !== 'REQUEST' ? (
                <Button
                  label='승인요청'
                  color='point'
                  shape='round'
                  size='xs'
                  width={80}
                  border={true}
                  handleClick={handleRequestApproveButton}
                />
              ) : (
                <Button
                  label='요청취소'
                  color='point'
                  shape='round'
                  size='xs'
                  width={80}
                  handleClick={handleCancelApproveButton}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div css={strategyBoxStyle}>
        <TabButton
          tabs={TAB_BUTTONS}
          shape='line'
          currentTab={currentTab}
          handleTabChange={setCurrentTab}
        />
        {conditionalRender[TAB_BUTTONS[currentTab]]}
      </div>
      <Modal
        id='submit'
        content={
          <div css={modalStyle}>
            {submitErrorData.length > 0 ? (
              <>
                <span style={{ fontWeight: FONT_WEIGHT.BOLD }}>
                  [ {submitErrorData.join(', ')} ]
                </span>
                <span>필수 입력 항목을 모두 입력한 후 다시 시도해주세요.</span>
              </>
            ) : null}
          </div>
        }
      />
      <Modal
        id='notice'
        content={
          <div css={modalStyle}>
            <span>{noticeMessage}</span>
          </div>
        }
      />
      <Modal
        id='daily-add'
        content={
          <div css={dailyModalStyle}>
            <span>일간분석 데이터</span>
            <table className='modal-table'>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>입출금</th>
                  <th>일 손익</th>
                </tr>
              </thead>
              <tbody>
                {newDailyData.map((data, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className='add-box'>
                        <Calendar
                          type='date'
                          size='mini'
                          dateProps={{
                            date: data.date,
                            setDate: (value) =>
                              handleNewDailyDataChange(
                                idx,
                                'date',
                                value.toString()
                              ),
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className='add-box'>
                        <TextInput
                          type='number'
                          value={data.depositWithdrawalAmount.toString()}
                          handleChange={(e) =>
                            handleNewDailyDataChange(
                              idx,
                              'depositWithdrawalAmount',
                              e.target.value
                            )
                          }
                          width={308}
                        />
                      </div>
                    </td>
                    <td>
                      <div className='add-box'>
                        <TextInput
                          type='number'
                          value={data.dailyProfitLossAmount.toString()}
                          handleChange={(e) =>
                            handleNewDailyDataChange(
                              idx,
                              'dailyProfitLossAmount',
                              e.target.value
                            )
                          }
                          width={308}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='buttons'>
              <Button
                label='취소'
                handleClick={() => {
                  closeModal('daily-add');
                  setNewDailyData(
                    Array(5).fill({
                      date: '',
                      depositWithdrawalAmount: 0,
                      dailyProfitLossAmount: 0,
                    })
                  );
                }}
                width={120}
                border={true}
              />
              <Button
                label='등록'
                handleClick={() => handleDailySubmitButton()}
                width={120}
              />
            </div>
          </div>
        }
      />
      <Modal
        id='daily-delete'
        content={
          <div css={modalStyle}>
            <span>
              해당 날짜의 데이터를 <br />
              삭제하시겠습니까?
            </span>
            <div className='buttons'>
              <Button
                label='아니오'
                handleClick={() => {
                  setDeleteDailyId(0);
                  closeModal('daily-delete');
                }}
                width={120}
                border={true}
              />
              <Button
                label='예'
                handleClick={() => handleDailyDeleteButton()}
                width={120}
              />
            </div>
          </div>
        }
      />
      <Modal
        id='change-status'
        content={
          <div css={modalStyle}>
            <span>
              해당 전략을 비공개로 전환하시겠습니까?
              <br />
              전환된 전략은 관리자의 재승인이 필요합니다.
            </span>
            <div className='buttons'>
              <Button
                label='아니오'
                handleClick={() => {
                  closeModal('change-status');
                }}
                width={120}
                border={true}
              />
              <Button
                label='예'
                handleClick={() => {
                  if (strategyId) {
                    changePrivateMutate(strategyId, {
                      onSuccess: (res) => {
                        if (res.code === 200) {
                          refetchStrategyInfo();
                          closeModal('change-status');
                        }
                      },
                    });
                  }
                }}
                width={120}
              />
            </div>
          </div>
        }
      />
      <Modal
        id='account-add'
        content={
          <div css={accountModalStyle}>
            <span>실계좌정보</span>
            <table className='modal-table'>
              <thead>
                <tr>
                  <th>순서</th>
                  <th>제목</th>
                  <th>이미지</th>
                </tr>
              </thead>
              <tbody>
                {newAccountData.map((data, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className='add-box'>{idx + 1}</div>
                    </td>
                    <td>
                      <div className='add-box'>
                        <TextInput
                          value={data.title}
                          handleChange={(e) =>
                            setNewAccountData((prev) =>
                              prev.map((item, index) =>
                                index === idx
                                  ? { ...item, title: e.target.value }
                                  : item
                              )
                            )
                          }
                          width={308}
                        />
                      </div>
                    </td>
                    <td>
                      <div className='add-box'>
                        <div>
                          <TextInput
                            value={data.image ? data.image.name : ''}
                            handleChange={() => {}}
                            width={308}
                            disabled={true}
                          />
                          {data.image && (
                            <Close
                              className='delete'
                              onClick={() => handleImageFileDelete(idx)}
                              sx={{ fontSize: 20, color: COLOR.POINT }}
                            />
                          )}
                        </div>
                        <AddPhotoAlternateOutlined
                          sx={{ fontSize: 24, cursor: 'pointer' }}
                          onClick={() => handleBrowseImageClick(idx)}
                        />
                        <input
                          id={`image-input-${idx}`}
                          type='file'
                          accept='.jpg, .jpeg, .png, .gif'
                          style={{ display: 'none' }}
                          onChange={(e) => handleImageFileChange(e, idx)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='buttons'>
              <Button
                label='취소'
                handleClick={() => {
                  closeModal('account-add');
                  setNewAccountData(Array(5).fill({ title: '', image: null }));
                }}
                width={120}
                border={true}
              />
              <Button
                label='등록'
                handleClick={() => handleAccountSubmitButton()}
                width={120}
              />
            </div>
          </div>
        }
      />
      <Modal
        id='account-delete'
        content={
          <div css={modalStyle}>
            <span>
              선택한 실계좌 정보 데이터를 <br />
              삭제하시겠습니까?
            </span>
            <div className='buttons'>
              <Button
                label='아니오'
                handleClick={() => {
                  closeModal('account-delete');
                }}
                width={120}
                border={true}
              />
              <Button
                label='예'
                handleClick={() => handleAccountDeleteButton()}
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

const titleBoxStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 96px;
  padding-bottom: 40px;
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};

  span {
    line-height: 24px;
  }
`;

const traderBoxStyle = css`
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  margin: 40px 0;
  border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 4px;

  .left-box {
    display: flex;
    gap: 32px;

    .trader-box {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .count-box {
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
    display: flex;
    align-items: center;
    gap: 32px;

    .row-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      span:first-child {
        font-size: ${FONT_SIZE.TEXT_SM};
      }
    }
  }
`;

const statusStyle = (status: string) => css`
  height: 20px;
  color: ${STATUS_CODES[status as keyof typeof STATUS_CODES][1]};
`;

const strategyBoxStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding-bottom: 80px;
`;

const formBoxStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .form-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 24px;
    margin-bottom: 80px;
    border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
    border-radius: 4px;

    .form-item {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

      span {
        width: 84px;
        font-weight: ${FONT_WEIGHT.BOLD};

        .explain-text {
          font-size: ${FONT_SIZE.TEXT_SM};
          font-weight: ${FONT_WEIGHT.REGULAR};
        }
      }

      .file-box {
        display: flex;
        gap: 16px;

        div {
          position: relative;

          .delete {
            position: absolute;
            top: 50%;
            right: 16px;
            transform: translateY(-50%);
            cursor: pointer;
          }
        }
      }
    }

    .form-item-top {
      align-items: flex-start;
    }

    .form-item-last {
      border: 0;
    }
  }

  .button-box {
    display: flex;
    gap: 16px;
    padding-bottom: 168px;
  }
`;

const onlyViewBoxStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .form-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 24px;
    margin-bottom: 8px;
    border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
    border-radius: 4px;

    .form-item {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

      span {
        line-height: 24px;
      }

      span:first-child {
        width: 84px;
        font-weight: ${FONT_WEIGHT.BOLD};
        flex-shrink: 0;
      }

      span:nth-child(2) {
        min-height: 48px;
        display: flex;
        align-items: center;
      }

      .options {
        display: flex;
        gap: 8px;
      }

      .file-box {
        display: flex;
        gap: 16px;
      }
    }

    .form-item-top {
      align-items: center;
    }

    .form-item-last {
      border: 0;
    }
  }

  .explanation {
    width: 100%;
    display: flex;
    justify-content: flex-end;

    span {
      color: ${COLOR.POINT};
    }
  }
`;

const dailyBoxStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .action-box {
    display: flex;
    justify-content: space-between;

    .buttons {
      display: flex;
      gap: 16px;
    }
  }

  .table-box {
    width: 100%;
    text-align: right;
    margin-bottom: 8px;

    .table {
      width: 100%;
      text-align: center;
      margin-bottom: 8px;
    }

    .editing {
      padding: 0;
    }

    .editing-box {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    th {
      height: 48px;
      color: ${COLOR.PRIMARY400};
      font-weight: ${FONT_WEIGHT.BOLD};
      background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
    }

    td {
      height: 120px;
      text-align: end;
      padding-right: 16px;
    }

    th,
    td {
      border: 1px solid ${COLOR.PRIMARY100};
      vertical-align: middle;
    }

    th:first-child,
    td:first-child {
      width: 120px;
      text-align: center;
      padding: 0;
    }

    th:nth-child(2),
    td:nth-child(2),
    th:nth-child(3),
    td:nth-child(3),
    th:nth-child(4),
    td:nth-child(4) {
      width: 168px;
    }

    th:nth-child(5),
    td:nth-child(5),
    th:nth-child(6),
    td:nth-child(6),
    th:nth-child(7),
    td:nth-child(7) {
      width: 140px;
    }

    td:last-child {
      text-align: center;
      padding: 0;

      div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 16px;
      }
    }

    .explanation {
      color: ${COLOR.POINT};
    }
  }
`;

const accountBoxStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;

  .buttons {
    display: flex;
    width: 100%;
    gap: 16px;
    justify-content: end;
  }

  .account-box {
    width: 100%;
    display: flex;
    position: relative;
    flex-wrap: wrap;
    gap: 20px;
    row-gap: 32px;
    margin-bottom: 8px;
    user-select: none;

    .account {
      width: 220px;
      height: 208px;
      overflow: hidden;

      &:hover {
        cursor: pointer;
      }

      div {
        width: 40px;
        height: 40px;
        position: absolute;
      }

      img {
        width: 100%;
        height: 144px;
        object-fit: cover;
        margin-bottom: 16px;
      }

      span {
        padding-bottom: 10px;
        line-height: 24px;
      }
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

const dailyModalStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;

  span {
    font-size: ${FONT_SIZE.TEXT_SM};
    font-weight: ${FONT_WEIGHT.MEDIUM};
  }

  table {
    width: 100%;
    text-align: center;
    margin-bottom: 16px;

    th {
      height: 48px;
      background-color: ${COLOR.GRAY100};
      vertical-align: middle;
    }

    th:first-child,
    td:first-child {
      width: 120px;
    }

    tbody {
      tr {
        border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

        td {
          height: 69px;
        }

        .add-box {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }
`;

const accountModalStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;

  span {
    font-size: ${FONT_SIZE.TEXT_SM};
    font-weight: ${FONT_WEIGHT.MEDIUM};
  }

  table {
    width: 100%;
    text-align: center;
    margin-bottom: 16px;

    th {
      height: 48px;
      background-color: ${COLOR.GRAY100};
      vertical-align: middle;
    }

    th:first-child,
    td:first-child {
      width: 56px;
    }

    tbody {
      tr {
        border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

        td {
          height: 69px;
        }

        .add-box {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          div {
            width: 100%;
            height: 100%;
            display: flex;
            position: relative;
            justify-content: center;
            align-items: center;
            gap: 16px;

            .delete {
              position: absolute;
              top: 50%;
              right: 16px;
              transform: translateY(-50%);
              cursor: pointer;
            }
          }

          svg {
            cursor: pointer;
            margin-right: 8px;
          }
        }
      }
    }
  }

  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }
`;

export default MyStrategyEdit;
