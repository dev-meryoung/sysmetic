import { useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { PATH } from '@/constants/path';

const SignFindId = () => {
  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const handleFindBtn = () => {
    if (email.trim() === '') {
      setShowMessage(true);
      setShowEmail(false);
    } else {
      setShowMessage(false);
      setShowEmail(true);
    }
  };

  const handleMainBtn = () => {
    navigate(PATH.ROOT);
  };
  const handleSignInBtn = () => {
    navigate(PATH.SIGN_IN);
  };

  return (
    <div css={wrapperStyle}>
      <div css={pageInfoStyle}>
        <div className='info'>
          <div>계정(이메일) 찾기</div>
          <br />
          <span>
            가입된 계정(이메일) 을 찾기 위해 휴대폰 번호 확인이 필요합니다.
            <br />
            회원가입 시 입력한 휴대폰 번호를 입력해주세요.
          </span>
        </div>
      </div>
      <div css={findFormStyle}>
        <div className='writting-layout'>
          <div>휴대번호</div>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="' - ' 를 제외하고 입력해주세요."
          />
          <Button
            label='아이디 찾기'
            handleClick={handleFindBtn}
            color='primary'
            size='xxl'
            shape='block'
            fontSize='14px'
          ></Button>
          <br />
          {showMessage && (
            <span>해당 휴대번호로 가입한 이메일이 존재하지않습니다.</span>
          )}
        </div>
      </div>
      {showEmail && (
        <>
          <div css={showEmailStyle}>
            <div className='show-email'>
              <p>
                해당 휴대폰 번호로 가입된 계정(이메일)은
                <br />
                <span>fast@fastcampus.com</span> 입니다.
              </p>
            </div>
          </div>
          <div css={linkStyle}>
            <Button
              label='메인가기'
              handleClick={handleMainBtn}
              color='primaryOpacity10'
              size='xs'
              shape='line'
            ></Button>
            <Button
              label='로그인'
              handleClick={handleSignInBtn}
              color='primary'
              size='xs'
              shape='block'
            ></Button>
          </div>
        </>
      )}
    </div>
  );
};
export default SignFindId;

const wrapperStyle = css`
  padding-top: 96px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  min-height: 627px;
`;

const pageInfoStyle = css`
  width: 100%;
  border-bottom: 1px solid ${COLOR.BLACK};

  .info {
    div {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    span {
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      margin-bottom: 40px;
      display: inline-block;
    }
  }
`;

const findFormStyle = css`
  width: 100%;
  margin-top: 40px;

  .writting-layout {
    div {
      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      margin-bottom: 8px;
    }

    input {
      width: 360px;
      height: 48px;
      padding: 8px 12px;
      border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
      border-radius: 4px;
      outline: none;

      &:focus {
        border: 1px solid ${COLOR.PRIMARY};
      }

      &::placeholder {
        font-size: 16px;
        color: ${COLOR_OPACITY.BLACK_OPACITY30};
      }
    }

    button {
      margin-left: 12px;
    }

    span {
      position: absolute;
      margin-top: 8px;
      color: ${COLOR.POINT};
      font-size: 14px;
      font-weight: 400;
    }
  }
`;

const showEmailStyle = css`
  width: 100%;
  height: 120px;
  margin-top: 80px;
  padding: 20px;
  background-color: ${COLOR.GRAY100};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .show-email {
    p {
      font-size: 18px;
      font-weight: 400;
      line-height: 26px;
    }
    span {
      color: ${COLOR.ERROR_RED};
    }
  }
`;

const linkStyle = css`
  width: 100%;
  text-align: center;
  margin-top: 80px;
  margin-bottom: 96px;
  display: flex;
  justify-content: center;
  gap: 16px;
`;
