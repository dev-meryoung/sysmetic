import { useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import TextArea from '@/components/TextArea';
import TextInput from '@/components/TextInput';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

type InputStateTypes = 'normal' | 'warn';
const MyQnaEdit = () => {
  const [ status, setStatus ] = useState<InputStateTypes>('normal');
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
  }

  return (
    <div css={wrapperStyle}>
      <div css={inputWrapperStyle}>
        <div css={titleStyle}>문의글 수정</div>
        <div>
          <div css={questionStyle}>
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
      </div>
      <div css={buttonStyle}>
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
          label='수정완료'
          handleClick={handleBtn}
          color='primary'
          size='md'
          shape='square'
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
`;

const answerStyle = css`
  margin-top: 32px;
`;

const buttonStyle = css`
  margin-top: 80px;
  display: flex;
  align-items: center;
  gap: 16px;
`;
