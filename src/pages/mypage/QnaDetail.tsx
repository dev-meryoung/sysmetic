import { css } from '@emotion/react';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import ProfileImage from '@/components/ProfileImage';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useGetInquiryDetailUser,
  useGetInquiryDetailTrader,
  useDeleteInquiry,
} from '@/hooks/useCommonApi';
import useAuthStore from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

const statusMap: { [key: string]: string } = {
  closed: '답변완료',
  unclosed: '답변대기',
};

const QnaDetail = () => {
  const { roleCode } = useAuthStore();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModalStore();
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const userInquiryId = paramUserId ? Number(paramUserId) : 0;
  const { qnaId: paramQnaId } = useParams<{ qnaId: string }>();
  const qnaInquiryId = paramQnaId ? Number(paramQnaId) : 0;

  const deleteMutation = useDeleteInquiry();

  const userQuery = useGetInquiryDetailUser(
    { qnaId: qnaInquiryId },
    roleCode === 'USER'
  );

  const traderQuery = useGetInquiryDetailTrader(
    { qnaId: qnaInquiryId },
    roleCode === 'TRADER'
  );

  const qnaData =
    roleCode === 'USER' ? userQuery.data?.data : traderQuery.data?.data;

  const dateCustom = (isoDate: string): string => {
    const dateObj = new Date(isoDate);
    return `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
  };

  const handleDeleteBtn = () => {
    if (qnaData?.answerTitle) {
      openModal('error-delete');
      return;
    }
    openModal('delete-confirm');
  };

  const handleEditBtn = () => {
    if (qnaData?.answerTitle) {
      openModal('error-edit');
      return;
    }
    navigate(PATH.MYPAGE_QNA_EDIT(String(qnaInquiryId)));
  };

  const handleAnswerBtn = () => {
    if (qnaData?.answerTitle) {
      openModal('error-edit');
      return;
    }
    navigate(
      PATH.MYPAGE_QNA_ANSWER(String(userInquiryId), String(qnaInquiryId))
    );
  };

  const confirmDelete = () => {
    deleteMutation.mutate(Number(qnaInquiryId), {
      onSuccess: () => {
        closeModal('delete-confirm');
        navigate(PATH.MYPAGE_QNA(String(userInquiryId)));
      },
      onError: () => {
        closeModal('delete-confirm');
      },
    });
  };

  const handleBackBtn = () => {
    navigate(PATH.MYPAGE_QNA(String(userInquiryId)));
  };

  return (
    <div css={wrapperStyle}>
      {qnaData && (
        <>
          <div css={titleWrapperStyle}>
            <span css={titleStyle}>{qnaData.inquiryTitle}</span>
            <span css={statusStyle}>
              {statusMap[qnaData?.inquiryStatus || '']}
            </span>
            <div css={infoStyle}>
              <div css={dateAndWriterStyle}>
                <div css={dateStyle}>
                  <span css={dateNameStyle}>작성일</span>
                  <span>{dateCustom(qnaData.inquiryRegistrationDate)}</span>
                </div>
                <div css={writerStyle}>
                  <span css={writerNameStyle}>작성자</span>
                  <span>{qnaData.inquirerNickname}</span>
                </div>
                {roleCode === 'USER' && (
                  <div css={buttonStyle}>
                    <Button
                      label='수정'
                      handleClick={handleEditBtn}
                      color='primary'
                      size='xs'
                      shape='none'
                    />
                    <span css={dividerStyle}>|</span>
                    <Button
                      label='삭제'
                      handleClick={handleDeleteBtn}
                      color='primary'
                      size='xs'
                      shape='none'
                    />
                  </div>
                )}
                {roleCode === 'TRADER' && (
                  <div css={buttonStyle}>
                    <Button
                      label='답변하기'
                      handleClick={handleAnswerBtn}
                      color='primary'
                      size='xs'
                      shape='none'
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div css={strategyWrapperStyle}>
            {qnaData.strategyName ? (
              <>
                <div css={tagsAndTitleStyle}>
                  <Tag src='default-tag.png' alt='tag' />
                  <div css={strategyTextStyle}>{qnaData.strategyName}</div>
                </div>
                <div css={profileStyle}>
                  <ProfileImage
                    src='default-profile.png'
                    alt='profileImg'
                    size='md'
                  />
                  <span css={nicknameStyle}>{qnaData.traderNickname}</span>
                </div>
              </>
            ) : (
              <div css={deletedStrategyStyle}>해당 전략이 삭제되었습니다.</div>
            )}
          </div>

          <div css={inputStyle}>{qnaData.inquiryContent}</div>

          {qnaData.answerTitle && (
            <div css={wrapperStyle}>
              <div className='comment-section' css={titleWrapperStyle}>
                <div css={titleStyle}>
                  <SubdirectoryArrowRightIcon css={commentIconStyle} />
                  {qnaData.answerTitle.startsWith('RE:')
                    ? qnaData.answerTitle
                    : `RE: ${qnaData.answerTitle}`}
                </div>
                <div css={infoStyle}>
                  <div css={dateStyle}>
                    <span>작성일</span>
                    <span>{dateCustom(qnaData.answerRegistrationDate)}</span>
                  </div>
                  {roleCode !== 'TRADER' && (
                    <div css={answerProfileStyle}>
                      <ProfileImage
                        src='default-profile.png'
                        alt='profileImg'
                        size='md'
                      />
                      <span css={nicknameStyle}>{qnaData.traderNickname}</span>
                    </div>
                  )}
                </div>
              </div>
              <div css={answerInputStyle}>{qnaData.answerContent}</div>
            </div>
          )}

          <div css={listWrapperStyle}>
            {qnaData.previousTitle && (
              <div css={listItemStyle}>
                <span css={stepperStyle}>이전</span>
                <Link
                  to={PATH.MYPAGE_QNA_DETAIL(
                    String(userInquiryId),
                    String(qnaInquiryId - 1)
                  )}
                  css={listItemTilteStyle}
                >
                  {qnaData.previousTitle}
                </Link>
              </div>
            )}
            {qnaData.nextTitle && (
              <div css={listItemStyle}>
                <span css={stepperStyle}>다음</span>
                <Link
                  to={PATH.MYPAGE_QNA_DETAIL(
                    String(userInquiryId),
                    String(qnaInquiryId + 1)
                  )}
                  css={listItemTilteStyle}
                >
                  {qnaData.nextTitle}
                </Link>
              </div>
            )}
          </div>

          <div css={backBtnStyle}>
            <Button
              label='목록보기'
              color='black'
              size='md'
              width={80}
              shape='square'
              handleClick={handleBackBtn}
            />
          </div>
          <Modal
            id='error-edit'
            content={
              <div css={modalContentStyle}>
                <p css={modalTextStyle}>
                  답변이 존재할 시 새로운 답변을 달 수 없습니다.
                </p>
              </div>
            }
          />
          <Modal
            id='error-delete'
            content={
              <div css={modalContentStyle}>
                <p css={modalTextStyle}>
                  답변이 존재할 시 문의를 삭제할 수 없습니다.
                </p>
              </div>
            }
          />
          <Modal
            id='delete-confirm'
            content={
              <div css={modalContentStyle}>
                <p css={modalTextStyle}>문의를 삭제하시겠습니까?</p>
                <div css={modalButtonWrapperStyle}>
                  <Button
                    label='아니오'
                    handleClick={() => closeModal('delete-confirm')}
                    color='primaryOpacity10'
                    border
                  />
                  <Button
                    label='예'
                    handleClick={confirmDelete}
                    color='primary'
                  />
                </div>
              </div>
            }
          />
        </>
      )}
    </div>
  );
};

export default QnaDetail;

const wrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const titleWrapperStyle = css`
  width: 100%;
  padding: 16px;
  position: relative;
  background-color: ${COLOR.GRAY100};
`;

const titleStyle = css`
  font-size: ${FONT_SIZE.TITLE_XS};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const statusStyle = css`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const infoStyle = css`
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const dateAndWriterStyle = css`
  display: flex;
  align-items: center;
  margin-top: 16px;
  gap: 32px;
`;

const dateStyle = css`
  display: flex;
  gap: 8px;
`;

const dateNameStyle = css`
  font-weight: ${FONT_WEIGHT.MEDIUM};
`;

const writerStyle = css`
  display: flex;
  gap: 8px;
`;

const writerNameStyle = css`
  font-weight: ${FONT_WEIGHT.MEDIUM};
`;

const buttonStyle = css`
  display: flex;
  align-items: center;
`;

const dividerStyle = css`
  display: flex;
  align-items: center;
  color: ${COLOR.GRAY200};
`;

const strategyWrapperStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 24px;
  width: 1132px;
  border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 4px;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
  margin-top: 24px;
`;

const tagsAndTitleStyle = css`
  display: flex;
  flex-direction: column;
`;

// const tagStyle = css`
//   display: flex;
//   gap: 8px;
// `;

const strategyTextStyle = css`
  margin-top: 16px;
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.REGULAR};
`;

const profileStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const answerProfileStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  transform: translateY(-30%);
`;

const nicknameStyle = css`
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const inputStyle = css`
  margin-top: 32px;
  padding: 20px 36px;
  width: 100%;
  min-height: 300px;
`;

const answerInputStyle = css`
  margin-top: 32px;
  padding: 20px 36px;
  width: 100%;
  min-height: 300px;
  background-color: white;
`;

const listWrapperStyle = css`
  width: 100%;
  margin-top: 16px;
`;

const listItemStyle = css`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 24px;
  border-top: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  &:last-child {
    border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  }
`;

const stepperStyle = css`
  flex: 1;
  text-align: center;
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const listItemTilteStyle = css`
  flex: 8;
  margin-left: 16px;
  text-decoration: none;
  color: ${COLOR.TEXT_BLACK};
`;

const backBtnStyle = css`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 24px;
  margin-bottom: 181px;
`;

const commentIconStyle = css`
  width: 24px;
  height: 24px;
  color: ${COLOR.POINT};
  position: relative;
  transform: translateY(-10%);
  vertical-align: middle;
  margin-right: 8px;
`;

const deletedStrategyStyle = css`
  width: 100%;
  text-align: center;
  font-size: ${FONT_SIZE.TEXT_MD};
  border-radius: 4px;
`;

const modalContentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const modalTextStyle = css`
  font-size: ${FONT_SIZE.TEXT_MD};
  text-align: center;
  margin-top: 32px;
  margin-bottom: 24px;
`;

const modalButtonWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
`;
