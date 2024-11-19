import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import { COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

const MyQnaEdit = () => {
  const navigate = useNavigate();

  const handleBtn = () => {
    navigate(PATH.MYPAGE_QNA_DETAIL());
  }

  return (
    <div css={wrapperStyle}>
      <div css={inputWrapperStyle}>
        <div css={titleStyle}>문의글 수정</div>
        <div>
          <input type='text' placeholder='제목을 입력해주세요.' css={questionStyle} />
          <textarea name='answer' placeholder='내용을 입력해주세요.' css={answerStyle} />
        </div>
      </div>
      <div css={buttonStyle}>
        <Button
          label='이전'
          handleClick={handleBtn}
          color='primaryOpacity10'
          size='md'
          shape='line'
          width={120}
        />
        <Button
          label='수정완료'
          handleClick={handleBtn}
          color='primary'
          size='md'
          shape='block'
          width={120}
        />
      </div>

    </div>
  )
};

export default MyQnaEdit;

const wrapperStyle = css`
  padding-top: 96px;
  padding-bottom: 227px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  box-sizing: border-box;
`;

const inputWrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`; 

const titleStyle = css`
  font-size: ${FONT_SIZE.TITLE_SM};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const questionStyle = css`
  margin-top: 40px;
  width: 100%; 
  height: 64px;
  padding: 10px; 
  border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 4px; 
`;

const answerStyle = css`
  margin-top: 32px;
  width: 100%; 
  height: 360px;
  padding: 10px; 
  border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 4px; 
`;

const buttonStyle = css`
  margin-top: 80px;
  display: flex;
  align-items: center;
  gap: 16px;
`;
