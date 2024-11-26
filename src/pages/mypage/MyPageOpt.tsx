import { useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

const MypageOpt: React.FC = () => {
  const [checkboxStates, setCheckboxStates] = useState([false, false]);
  const navigate = useNavigate();

  const handleCheckboxChange = (index: number) => {
    setCheckboxStates((prev) =>
      prev.map((state, i) => (i === index ? !state : state))
    );
  };

  return (
    <div css={wrapperStyle}>
      <div css={indexStyle}>
        <div css={titleStyle}>정보수신 동의</div>
        <div css={descriptionStyle}>정보수신 동의 페이지입니다!</div>
      </div>
      <div css={checkboxWrapperStyle}>
        {checkboxStates.map((state, index) => (
          <div key={index} css={checkboxItemStyle}>
            <Checkbox
              checked={state}
              handleChange={() => handleCheckboxChange(index)}
            />
            <div css={checkboxTextStyle}>
              관심 전략과 정보를 수신 동의합니다.
            </div>
          </div>
        ))}
      </div>
      <div css={buttonStyle}>
        <Button
          label='이전'
          handleClick={() => navigate(PATH.MYPAGE_PROFILE())}
          color='primaryOpacity10'
          size='md'
          shape='square'
          width={120}
          border
        />
        <Button
          label='수정완료'
          handleClick={() => navigate(PATH.MYPAGE_PROFILE())}
          color='primary'
          size='md'
          shape='square'
          width={120}
        />
      </div>
    </div>
  );
};

export default MypageOpt;

const wrapperStyle = css`
  padding-top: 96px;
  padding-bottom: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
`;

const indexStyle = css`
  width: 100%;
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};
  height: 127px;
  margin-bottom: 40px;
`;

const titleStyle = css`
  font-size: ${FONT_SIZE.TITLE_SM};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const descriptionStyle = css`
  margin-top: 16px;
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.REGULAR};
`;

const checkboxWrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const checkboxItemStyle = css`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const checkboxTextStyle = css`
  font-size: ${FONT_SIZE.TEXT_MD};
`;

const buttonStyle = css`
  margin-top: 76px;
  display: flex;
  gap: 16px;
`;
