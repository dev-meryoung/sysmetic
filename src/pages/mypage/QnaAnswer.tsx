import { useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import ProfileImageTest from '@/assets/images/test-profile.png';
import TagTest from '@/assets/images/test-tag.jpg';
import Button from '@/components/Button';
import ProfileImage from '@/components/ProfileImage';
import Tag from '@/components/Tag';
import TextArea from '@/components/TextArea';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

type InputStateTypes = 'normal' | 'warn';

const QnaAnswer = () => {
  const [status, setStatus] = useState<InputStateTypes>('normal');
  const [value, setValue] = useState('');
  const [textValue, setTextValue] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (inputValue.length < 6) {
      setStatus('warn');
    } else {
      setStatus('normal');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  const handleBtn = () => {
    navigate(PATH.MYPAGE_QNA_DETAIL());
  };

  return (
    <div css={wrapperStyle}>
      <span css={pageInfoStyle}>답변하기</span>
      <div className='question-section' css={titleWrapperStyle}>
        <span css={titleStyle}>
          미국발 경제악화가 한국 증시에 미치는 영향은 뭘까?
        </span>
        <span css={statusStyle}>답변대기</span>
        <div css={infoStyle}>
          <div css={dateAndWriterStyle}>
            <div css={dateStyle}>
              <span css={dateNameStyle}>작성일</span>
              <span>2024.11.18</span>
            </div>
            <div css={writerStyle}>
              <span css={writerNameStyle}>작성자</span>
              <span>질문자이름</span>
            </div>
          </div>
        </div>
      </div>

      <div css={strategyWrapperStyle}>
        <div css={tagsAndTitleStyle}>
          <div css={tagStyle}>
            <Tag src={TagTest} alt='tag' />
          </div>
          <div css={strategyTextStyle}>해당 전략명</div>
        </div>
        <div css={profileStyle}>
          <ProfileImage src={ProfileImageTest} alt='profileImg' size='md' />
          <span css={nicknameStyle}>닉네임</span>
        </div>
      </div>

      <div css={inputStyle}>뭔가요?</div>

      <div className='comment-section' css={answerWrapperStyle}>
        <div css={answerNameStyle}>
          <TextInput
            value={value}
            status={status}
            placeholder='제목을 입력해주세요.'
            fullWidth
            handleChange={handleChange}
          />
        </div>
        <div css={answerStyle}>
          <TextArea
            value={textValue}
            placeholder='내용을 입력해주세요.'
            fullWidth
            handleChange={handleTextChange}
          />
        </div>
      </div>

      <div css={goDetailBtnStyle}>
        <Button
          label='이전'
          handleClick={handleBtn}
          color='primaryOpacity10'
          size='md'
          shape='square'
          width={120}
          border
        />
        <Button
          label='답변완료'
          handleClick={handleBtn}
          color='primary'
          size='md'
          shape='square'
          width={120}
        />
      </div>
    </div>
  );
};

const wrapperStyle = css`
  padding-top: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 181px;
`;
const pageInfoStyle = css`
  font-size: ${FONT_SIZE.TITLE_SM};
  font-weight: ${FONT_WEIGHT.BOLD};
  align-self: flex-start;
`;
const titleWrapperStyle = css`
  margin-top: 40px;
  width: 100%;
  padding: 16px;
  background-color: ${COLOR.GRAY100};
  position: relative;
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

const answerWrapperStyle = css`
  width: 100%;
  padding: 0 24px;
  background-color: ${COLOR.GRAY100};
  position: relative;
`;

const answerNameStyle = css`
  margin-top: 42px;
`;

const answerStyle = css`
  margin-top: 32px;
  margin-bottom: 40px;
`;

const goDetailBtnStyle = css`
  margin-top: 80px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export default QnaAnswer;
