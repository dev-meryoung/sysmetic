import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { Link, useNavigate } from 'react-router-dom';
import ProfileImageTest from '@/assets/images/test-profile.png';
import TagTest from '@/assets/images/test-tag.jpg';
import Button from '@/components/Button';
import ProfileImage from '@/components/ProfileImage';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

interface AnswerData {
  id: string;
  title: string;
  content: string;
  date: string;
  profileImage: string;
  nickname: string;
}

const QnaDetail = () => {
  const [userType] = useState('investor'); // 임시 유저타입 지정 (추후 삭제)
  const navigate = useNavigate();

  const [qnaData, setQnaData] = useState({
    title: '질문 제목이 없습니다.',
    status: '답변대기',
    date: '-',
    content: '내용이 없습니다.',
  });

  const [strategyData, setStrategyData] = useState({
    tag: TagTest,
    name: '전략명',
    profileImage: ProfileImageTest,
    nickName: '닉네임',
  });

  const [answerData, setAnswerData] = useState<AnswerData[]>([
    {
      id: '1',
      title: 'RE : 임시답변, 나중에 삭제!',
      date: '2024.11.25',
      profileImage: ProfileImageTest,
      nickname: '트레짱짱',
      content: '자고싶다!',
    },
  ]);

  // 문의내역 조회 API (문의 및 답변)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const qnaResponse = await fetch('/api/qna/detail');
        const qnaResult = await qnaResponse.json();

        setQnaData({
          title: qnaResult.title || '질문 제목이 없습니다.',
          status: qnaResult.status || '답변대기',
          date: qnaResult.date || '-',
          content: qnaResult.content || '내용이 없습니다.',
        });

        const strategyResponse = await fetch('/api/qna/strategy');
        const strategyResult = await strategyResponse.json();
        setStrategyData({
          tag: strategyResult.tag || TagTest,
          name: strategyResult.name || '전략명 없음',
          profileImage: strategyResult.profileImage || ProfileImageTest,
          nickName: strategyResult.nickName || '닉네임 없음',
        });

        const answerResponse = await fetch('/api/qna/answers');
        const answerResult = await answerResponse.json();
        setAnswerData(answerResult || []);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };

    fetchData();
  }, []);

  // 답변 데이터 갱신 API
  // const fetchUpdatedAnswers = async () => {
  //   try {
  //     const response = await fetch('/api/qna/answers');
  //     const result = await response.json();
  //     setAnswerData(result || []);
  //   } catch (error) {
  //     console.error('답변 데이터 갱신 실패:', error);
  //   }
  // };

  const handleDeleteBtn = () => {
    // Q&A 삭제 기능 구현 예정
  };

  return (
    <div css={wrapperStyle}>
      <div className='question-section' css={titleWrapperStyle}>
        <span css={titleStyle}>{qnaData.title}</span>
        <span css={statusStyle}>{qnaData.status}</span>
        <div css={infoStyle}>
          <div css={dateAndButtonsStyle}>
            <div css={dateStyle}>
              <span>작성일</span>
              <span>{qnaData.date}</span>
            </div>
            <div css={buttonStyle}>
              {userType === 'investor' && (
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
              {userType === 'trader' && (
                <Button
                  label='답변하기'
                  handleClick={() =>
                    navigate(PATH.MYPAGE_QNA_ANSWER(), {
                      state: { qnaId: 'QNA_ID' },
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
        <div css={tagsAndTitleStyle}>
          <div css={tagStyle}>
            <Tag src={strategyData.tag} alt='tag' />
          </div>
          <div css={strategyTextStyle}>{strategyData.name}</div>
        </div>
        <div css={profileStyle}>
          <ProfileImage
            src={strategyData.profileImage}
            alt='profileImg'
            size='md'
          />
          <span css={nicknameStyle}>{strategyData.nickName}</span>
        </div>
      </div>
      <div css={inputStyle}>{qnaData.content}</div>

      {answerData.map((answer) => (
        <div key={answer.id} css={wrapperStyle}>
          <div className='comment-section' css={titleWrapperStyle}>
            <div css={titleStyle}>
              <SubdirectoryArrowRightIcon css={commentIconStyle} />
              {answer.title.startsWith('RE:')
                ? answer.title
                : `RE: ${answer.title}`}{' '}
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
        <div css={listItemStyle}>
          <span css={stepperStyle}>이전</span>
          {/* 나중에 api 있을 때 변경 */}
          {/* <Link to={`/qna-detail/${previousPostId}`} css={listItemTilteStyle}> */}
          <Link to='' css={listItemTilteStyle}>
            12월 이벤트 개최
          </Link>
          <span css={listItemDateStyle}>2024.11.17</span>
        </div>
        <div css={listItemStyle}>
          <span css={stepperStyle}>다음</span>
          <Link to='' css={listItemTilteStyle}>
            홈페이지 개선사항 안내
          </Link>
          <span css={listItemDateStyle}>2024.11.19</span>
        </div>
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

const dateAndButtonsStyle = css`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const dateStyle = css`
  display: flex;
  gap: 8px;
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
