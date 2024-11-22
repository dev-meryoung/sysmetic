import React, { useState } from 'react';
import { css } from '@emotion/react';
import Button from '@/components/Button';
import RadioButton from '@/components/RadioButton';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

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
const ThirdOptions = [
  { label: '동의합니다.', value: 'true' },
  { label: '동의하지 않습니다.', value: 'false' },
];

const SignUpType = () => {
  const [isServiceChecked, setIsServiceChecked] = useState('false');
  const [isPersonalChecked, setIsPersonalChecked] = useState('false');
  const [isThirdChecked, setIsThirdChecked] = useState('false');

  return (
    <div css={wrapperStyle}>
      <div css={contentsDivStyle}>
        <div className='terms-and-conditions'>
          <h6>홈페이지 이용약관</h6>
          <div className='content-box'>
            <p>
              가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하
            </p>
          </div>
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
          <div className='content-box'>
            <p>
              가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하
            </p>
          </div>
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
        <div className='terms-and-conditions'>
          <h6>제 3자 정보제공</h6>
          <div className='content-box'>
            <p>
              가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하
            </p>
          </div>
          <div className='agreement'>
            <p>제 3자 정보제공에 동의하십니까?</p>
            <RadioButton
              options={ThirdOptions}
              name='third'
              selected={isThirdChecked}
              handleChange={setIsThirdChecked}
            />
          </div>
        </div>
      </div>
      <div css={buttonDivStyle}>
        <Button
          width={120}
          border={true}
          label='이전'
          handleClick={() => console.log('이전')}
        />
        <Button
          width={120}
          label='다음'
          handleClick={() => console.log('다음')}
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
      letter-spacing: -0.4px;
      margin-bottom: 16px;
    }

    .content-box {
      height: 240px;
      padding: 24px;
      border: 1px solid ${COLOR_OPACITY.PRIMARY_OPACITY10};
      border-radius: 4px;

      p {
        height: 192px;
        overflow: auto;
        letter-spacing: -0.32px;
        line-height: 160%;
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
