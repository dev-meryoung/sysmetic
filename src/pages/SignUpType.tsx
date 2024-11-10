import React, { useState } from 'react';
import { css } from '@emotion/react';

export interface ContentProps {
  id: number;
  name: string;
  title: string;
  license: string;
  agree: string;
}

const SignUpType = () => {
  const [isRadioToggled, setIsRadioToggled] = useState<boolean[]>([]);

  const handleRadioToggle = (i: number, v: boolean) => {
    const updatedToggled = [...isRadioToggled];
    updatedToggled[i] = v;
    setIsRadioToggled(updatedToggled);
  };

  const ContentLists: ContentProps[] = [
    {
      id: 1,
      name: 'termsAgree1',
      title: '홈페이지 이용약관',
      license:
        '김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영김대영바보김바대보영',
      agree: '홈페이지 회원 서비스 이용약관에 동의하십니까?',
    },
    {
      id: 2,
      name: 'termsAgree2',
      title: '개인정보 취급방침',
      license:
        '개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침개인정보취급방침',
      agree: '개인정보 취급방침에 동의하십니까?',
    },
    {
      id: 3,
      name: 'termsAgree3',
      title: '제3자 정보제공',
      license:
        '제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공제3자 정보제공',
      agree: '제3자 정보제공에 동의하십니까?',
    },
  ];

  return (
    <div css={WrapperStyle}>
      <div css={ContentsDivStyle}>
        {ContentLists.map((ContentList, i) => (
          <React.Fragment key={ContentList.id}>
            <div className='content-box'>
              <h2>{ContentList.title}</h2>
              <div className='content-div'>
                <p>{ContentList.license}</p>
              </div>
              <div className='bottom'>
                <h3>{ContentList.agree}</h3>
                <div className='radio-div'>
                  <label>
                    <input
                      type='radio'
                      name={ContentList.name}
                      checked={isRadioToggled[i] === true}
                      onChange={() => handleRadioToggle(i, true)}
                    />
                    동의합니다.
                  </label>
                  <label>
                    <input
                      type='radio'
                      name={ContentList.name}
                      checked={isRadioToggled[i] === false}
                      onChange={() => handleRadioToggle(i, false)}
                    />
                    동의하지 않습니다.
                  </label>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div css={ButtonDivStyle}>
        <button className='back-btn'>이전</button>
        <button className='next-btn'>다음</button>
      </div>
    </div>
  );
};

const WrapperStyle = css`
  width: 100%;
  height: 100%;
  max-width: 1200px;
  padding: 0 10px;
  margin: 0 auto;
  color: #000;
  letter-spacing: -0.4px;
  display: flex;
  flex-direction: column;
`;

const ContentsDivStyle = css`
  height: auto;
  margin-top: 80px;
  h2 {
    width: 140px;
    height: 20px;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.4px;
    margin-bottom: 16px;
  }

  h3 {
    width: 293px;
    height: 16px;
    font-size: 16px;
    letter-spacing: -0.32px;
  }

  .content-box {
    // padding-bottom: 119px;
    margin-bottom: 64px;
  }

  .content-div {
    border: 1px solid #1261c44d;
    padding: 30px 26px;
    height: 250px;

    p {
      height: 186px;
      overflow: auto;
      line-height: 160%;
    }
  }

  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .radio-div {
      width: 300px;
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;

      label {
        display: flex;
        align-items: center;
      }

      input[type='radio'] {
        width: 24px;
        height: 24px;
        margin: 12px;
        accent-color: #1261c4;
      }
    }
  }
`;

const ButtonDivStyle = css`
  display: flex;
  margin: 0 auto 96px;
  gap: 16px;

  button {
    width: 120px;
    height: 48px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.28px;
    border-radius: 4px;
    cursor: pointer;
  }

  .back-btn {
    border: 1px solid #1261c4;
    background-color: rgba(18, 97, 196, 0);
    color: #1261c4;
  }

  .next-btn {
    border: none;
    background-color: #1261c4;
    color: #fff;
  }
`;

export default SignUpType;
