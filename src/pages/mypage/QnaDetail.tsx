import { useEffect, useState, useCallback } from 'react';
import { css } from '@emotion/react';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import ProfileImage from '@/components/ProfileImage';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useGetInquiryDetailTrader,
  useGetInquiryDetailUser,
  useDeleteInquiry,
} from '@/hooks/useCommonApi';
import useAuthStore from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

interface QnaDataTypes {
  page: number;
  sort: string;
  closed: string;
  searchType: string;
  searchText: string;
  inquiryId: number;
  inquiryAnswerId: number;
  inquiryTitle: string;
  inquiryRegistrationDate: string;
  inquirerNickname: string;
  inquiryStatus: 'unclosed' | 'closed';
  strategyName: string;
  traderNickname: string;
  inquiryContent: string;
  answerTitle: string;
  answerRegistrationDate: string;
  answerContent: string;
  previousTitle: string;
  previousWriteDate: string;
  nextTitle: string;
  nextWriteDate: string;
}

interface StrategyDataTypes {
  name: string;
  profileImage: string;
  nickName: string;
  tag: string;
}

interface AnswerDataTypes {
  id: number;
  title: string;
  date: string;
  content: string;
  profileImage: string;
  nickname: string;
}

interface ApiResponse {
  qna: QnaDataTypes;
  strategy: StrategyDataTypes;
  answers: AnswerDataTypes[];
}

const QnaDetail = () => {
  const { roleCode } = useAuthStore();
  const [qnaData, setQnaData] = useState<QnaDataTypes | null>(null);
  const [strategyData, setStrategyData] = useState<StrategyDataTypes | null>(
    null
  );
  const [answerData, setAnswerData] = useState<AnswerDataTypes[]>([]);
  const navigate = useNavigate();
  const { openModal, closeModal } = useModalStore();
  const { inquiryId } = useParams<{ inquiryId: string }>();
  const userQuery = useGetInquiryDetailUser();
  const traderQuery = useGetInquiryDetailTrader();

  const fetchData = useCallback(() => {
    const params = { inquiryId: Number(inquiryId) };

    const queryFn = roleCode === 'USER' ? userQuery : traderQuery;

    queryFn.mutate(params, {
      onSuccess: (data: ApiResponse) => {
        setQnaData(data.qna);
        setStrategyData(data.strategy);
        setAnswerData(data.answers || []);
      },
      onError: (error: unknown) => {
        console.error('Error fetching Q&A data:', error);
      },
    });
  }, [inquiryId, roleCode, userQuery, traderQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteMutation = useDeleteInquiry();
  const isAnswerPresent = () => answerData.length > 0;

  const handleDeleteBtn = () => {
    if (isAnswerPresent()) {
      alert('답변이 존재하는 문의는 삭제할 수 없습니다.');
      return;
    }
    openModal('delete-confirm');
  };

  const confirmDelete = () => {
    if (isAnswerPresent()) {
      alert('답변이 존재하는 문의는 삭제할 수 없습니다.');
      closeModal('delete-confirm');
      return;
    }

    deleteMutation.mutate(Number(inquiryId), {
      onSuccess: () => {
        closeModal('delete-confirm');
        navigate(PATH.MYPAGE_QNA());
      },
      onError: () => {
        closeModal('delete-confirm');
      },
    });
  };

  return (
    <div css={wrapperStyle}>
      {qnaData && (
        <>
          <div className='question-section' css={titleWrapperStyle}>
            <span css={titleStyle}>{qnaData.inquiryTitle}</span>
            <span css={statusStyle}>{qnaData.inquiryStatus}</span>
            <div css={infoStyle}>
              <div css={dateAndWriterStyle}>
                <div css={dateStyle}>
                  <span css={dateNameStyle}>작성일</span>
                  <span>{qnaData.inquiryRegistrationDate}</span>
                </div>
                <div css={writerStyle}>
                  <span css={writerNameStyle}>작성자</span>
                  <span>{qnaData.inquirerNickname}</span>
                </div>
                <div css={buttonStyle}>
                  {roleCode === 'USER' && (
                    <>
                      <Button
                        label='수정'
                        handleClick={() => navigate(PATH.MYPAGE_QNA_EDIT())}
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
                    </>
                  )}
                  {roleCode === 'TRADER' && (
                    <Button
                      label='답변하기'
                      handleClick={() =>
                        navigate(PATH.MYPAGE_QNA_ANSWER(), {
                          state: { qnaId: qnaData.inquiryId },
                        })
                      }
                      color='primary'
                      size='xs'
                      shape='none'
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div css={strategyWrapperStyle}>
            {strategyData?.name === 'null' ? (
              <div css={deletedStrategyStyle}>해당 전략이 삭제되었습니다.</div>
            ) : (
              <>
                <div css={tagsAndTitleStyle}>
                  <div css={tagStyle}>
                    <Tag
                      src={strategyData?.tag || 'default-tag.png'}
                      alt='tag'
                    />
                  </div>
                  <div css={strategyTextStyle}>{strategyData?.name}</div>
                </div>
                <div css={profileStyle}>
                  <ProfileImage
                    src={strategyData?.profileImage}
                    alt='profileImg'
                    size='md'
                  />
                  <span css={nicknameStyle}>{strategyData?.nickName}</span>
                </div>
              </>
            )}
          </div>
          <div css={inputStyle}>{qnaData.inquiryContent}</div>
        </>
      )}

      {answerData.map((answer) => (
        <div key={answer.id} css={wrapperStyle}>
          <div className='comment-section' css={titleWrapperStyle}>
            <div css={titleStyle}>
              <SubdirectoryArrowRightIcon css={commentIconStyle} />
              {answer.title.startsWith('RE:')
                ? answer.title
                : `RE: ${answer.title}`}
            </div>
            <div css={infoStyle}>
              <div css={dateStyle}>
                <span>작성일</span>
                <span>{answer.date}</span>
              </div>
              <div css={answerProfileStyle}>
                <ProfileImage
                  src={answer.profileImage}
                  alt='profileImg'
                  size='md'
                />
                <span css={nicknameStyle}>{answer.nickname}</span>
              </div>
            </div>
          </div>
          <div css={answerInputStyle}>{answer.content}</div>
        </div>
      ))}

      <div css={listWrapperStyle}>
        {qnaData?.previousTitle && qnaData?.previousWriteDate && (
          <div css={listItemStyle}>
            <span css={stepperStyle}>이전</span>
            <Link to={`/qna/${qnaData.inquiryId - 1}`} css={listItemTilteStyle}>
              {qnaData.previousTitle}
            </Link>
            <span css={listItemDateStyle}>{qnaData.previousWriteDate}</span>
          </div>
        )}
        {qnaData?.nextTitle && qnaData?.nextWriteDate && (
          <div css={listItemStyle}>
            <span css={stepperStyle}>다음</span>
            <Link to={`/qna/${qnaData.inquiryId + 1}`} css={listItemTilteStyle}>
              {qnaData.nextTitle}
            </Link>
            <span css={listItemDateStyle}>{qnaData.nextWriteDate}</span>
          </div>
        )}
      </div>

      <div css={goListBtnStyle}>
        <Button
          label='목록보기'
          handleClick={() => navigate(PATH.MYPAGE_QNA())}
          color='black'
          size='md'
          width={80}
          shape='square'
        />
      </div>

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
              <Button label='예' handleClick={confirmDelete} color='primary' />
            </div>
          </div>
        }
      />
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

const tagStyle = css`
  display: flex;
  gap: 8px;
`;

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

const listItemDateStyle = css`
  flex: 1;
  text-align: center;
`;

const goListBtnStyle = css`
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
  font-size: ${FONT_SIZE.TEXT_LG};
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
