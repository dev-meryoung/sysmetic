import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import RadioButton from '@/components/RadioButton';
import Terms from '@/components/signup/Terms';
import TermsCommon from '@/components/signup/TermsCommon';
import { COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';
import { PATH } from '@/constants/path';

export interface ContentProps {
  id: number;
  name: string;
  title: string;
  license: string;
}

const ServiceOptions = [
  { label: '동의합니다.', value: 'true' },
  { label: '동의하지 않습니다.', value: 'false' },
];
const PersonalOptions = [
  { label: '동의합니다.', value: 'true' },
  { label: '동의하지 않습니다.', value: 'false' },
];

const SignUpType = () => {
  const [isServiceChecked, setIsServiceChecked] = useState('false');
  const [isPersonalChecked, setIsPersonalChecked] = useState('false');
  const [isDisabled, setIsDisabled] = useState(false);

  const { type } = useParams();
  const navigate = useNavigate();

  const handleBackBtnClick = () => {
    navigate(PATH.SIGN_UP);
  };

  const handleNextBtnClick = () => {
    navigate(PATH.SIGN_UP_FORM(type));
  };

  useEffect(() => {
    setIsDisabled(
      !(isServiceChecked === 'true' && isPersonalChecked === 'true')
    );
  }, [isServiceChecked, isPersonalChecked]);

  return (
    <div css={wrapperStyle}>
      <div css={contentsDivStyle}>
        <div className='terms-and-conditions'>
          <h6>홈페이지 이용약관</h6>
          <Terms type={type} />
          <div className='agreement'>
            <p>홈페이지 회원 서비스 이용약관에 동의하십니까?</p>
            <RadioButton
              options={ServiceOptions}
              name='service'
              selected={isServiceChecked}
              handleChange={setIsServiceChecked}
            />
          </div>
        </div>
        <div className='terms-and-conditions'>
          <h6>개인정보 취급방침</h6>
          <TermsCommon />
          <div className='agreement'>
            <p>개인정보 취급방침에 동의하십니까?</p>
            <RadioButton
              options={PersonalOptions}
              name='personal'
              selected={isPersonalChecked}
              handleChange={setIsPersonalChecked}
            />
          </div>
        </div>
      </div>
      <div css={buttonDivStyle}>
        <Button
          width={120}
          border={true}
          label='이전'
          handleClick={handleBackBtnClick}
        />
        <Button
          width={120}
          label='다음'
          handleClick={handleNextBtnClick}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
};

const wrapperStyle = css`
  width: 100%;
  height: 100%;
  max-width: 1200px;
  padding: 0 10px;
  margin: 80px auto 96px;
  display: flex;
  flex-direction: column;
`;

const contentsDivStyle = css`
  display: flex;
  flex-direction: column;

  .terms-and-conditions {
    display: flex;
    flex-direction: column;
    margin-bottom: 80px;

    h6 {
      margin-bottom: 16px;
    }
    div > h6 {
      font-size: ${FONT_SIZE.TEXT_MD};
      letter-spacing: -0.4px;
    }

    .content-box {
      height: 400px;
      padding: 24px;
      border: 1px solid ${COLOR_OPACITY.PRIMARY_OPACITY10};
      border-radius: 4px;
      overflow: auto;
      line-height: 160%;

      p {
        margin-bottom: 16px;
        tab-size: 4;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
    }
  }

  .agreement {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const buttonDivStyle = css`
  display: flex;
  margin: 0 auto;
  gap: 16px;
`;

export default SignUpType;
