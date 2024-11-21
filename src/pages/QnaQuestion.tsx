import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import tempTag from '@/assets/images/test-tag.jpg';
import Button from '@/components/Button';
import ProfileImage from '@/components/ProfileImage';
import Tag from '@/components/Tag';
import TextArea from '@/components/TextArea';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';

const QnaQuestion = () => {
  const navigate = useNavigate();

  return (
    <div css={wrapperStyle}>
      <div css={titleBoxStyle}>
        <h5>문의하기</h5>
        <span>시스메틱 트레이더에게 당신이 궁금한 전략에 대해 문의하세요.</span>
      </div>
      <div css={strategyBoxStyle}>
        <div className='strategy-box'>
          <div className='tags'>
            <Tag src={tempTag} />
          </div>
          <span>전략명</span>
        </div>
        <div className='trader-box'>
          <ProfileImage />
          <span>트레이더명</span>
        </div>
      </div>
      <div css={inputBoxStyle}>
        <TextInput
          value=''
          height={64}
          fullWidth={true}
          placeholder='제목을 입력하세요 (최대 40자)'
          handleChange={() => {}}
        />
        <TextArea value='' fullWidth={true} handleChange={() => {}} />
      </div>
      <div css={buttonBoxStyle}>
        <Button
          label='이전'
          shape='square'
          border={true}
          width={120}
          handleClick={() => {
            navigate(-1);
          }}
        />
        <Button label='문의하기' width={120} handleClick={() => {}} />
      </div>
    </div>
  );
};

const wrapperStyle = css`
  max-width: 1200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  margin: 0 auto;

  span {
    line-height: 24px;
  }
`;

const titleBoxStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};
  margin-top: 96px;
  padding-bottom: 40px;
`;

const strategyBoxStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;

  .strategy-box {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .trader-box {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

const inputBoxStyle = css`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 80px;
`;

const buttonBoxStyle = css`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 80px;
`;

export default QnaQuestion;
