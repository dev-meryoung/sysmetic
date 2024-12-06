import { useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useFindEmail } from '@/hooks/useAuthApi';

type InputStateTypes = 'normal' | 'warn';

const SignFindId = () => {
  const [name, setName] = useState('');
  const [nameStatus, setNameStatus] = useState<InputStateTypes>('normal');
  const [phone, setPhone] = useState('');
  const [phoneStatus, setPhoneStatus] = useState<InputStateTypes>('normal');
  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const findMutation = useFindEmail();

  const navigate = useNavigate();

  const nameRegEx = /^[가-힣]{1,10}$/i;
  const phoneRegEx = /^010\d{8}$/;

  const handleFindBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const isNameValid = nameRegEx.test(name);
    const isPhoneValid = phoneRegEx.test(phone);

    if (!isNameValid || !isPhoneValid) {
      setShowMessage(true);
      setShowEmail(false);
      setNameStatus(isNameValid ? 'normal' : 'warn');
      setPhoneStatus(isPhoneValid ? 'normal' : 'warn');
      return;
    }

    findMutation.mutate(
      { name, phoneNumber: phone },
      {
        onSuccess: (response) => {
          if (response && response.data) {
            setEmail(response.data);
            setShowMessage(false);
            setShowEmail(true);
            setNameStatus('normal');
            setPhoneStatus('normal');
          } else {
            console.error('이메일 정보가 없습니다.');
          }
        },

        onError: () => {
          setShowMessage(true);
          setShowEmail(false);
          setNameStatus('warn');
          setPhoneStatus('warn');
        },
      }
    );
  };

  return (
    <div css={wrapperStyle}>
      <div css={pageInfoStyle}>
        <div className='info'>
          <div>계정(이메일) 찾기</div>
          <span>
            가입된 계정(이메일)을 찾기 위해 휴대폰 번호 확인이 필요합니다.
            <br />
            회원가입 시 입력한 이름과 휴대폰 번호를 입력해주세요.
          </span>
        </div>
      </div>

      <div css={findFormStyle}>
        <div className='writting-layout'>
          <div css={inputWrapperStyle}>
            <label>이름</label>
            <TextInput
              value={name}
              status={nameStatus}
              placeholder='이름을 입력하세요'
              handleChange={(e) => setName(e.target.value)}
            />
          </div>
          <div css={inputWrapperStyle}>
            <label>휴대번호</label>
            <div className='input-items'>
              <TextInput
                value={phone}
                status={phoneStatus}
                placeholder="' - ' 를 제외하고 입력하세요"
                handleChange={(e) => setPhone(e.target.value)}
                width={360}
              />
              <Button
                label='계정(이메일) 찾기'
                handleClick={handleFindBtn}
                color='primary'
                size='md'
                width={128}
                shape='square'
                fontSize='14px'
              />
            </div>
            {showMessage && (
              <span>해당 정보로 가입된 계정(이메일)이 존재하지 않습니다.</span>
            )}
          </div>
        </div>
      </div>

      {showEmail && (
        <>
          <div css={showEmailStyle}>
            <div className='show-email'>
              <p>
                해당 정보로 가입된 계정(이메일)은
                <br />
                <span>{email}</span> 입니다.
              </p>
            </div>
          </div>
          <div css={linkStyle}>
            <Button
              label='메인가기'
              handleClick={() => navigate(PATH.ROOT)}
              color='primaryOpacity10'
              size='md'
              width={120}
              shape='square'
              border
            />
            <Button
              label='로그인'
              handleClick={() => navigate(PATH.SIGN_IN)}
              color='primary'
              size='md'
              width={120}
              shape='square'
            />
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
      font-size: ${FONT_SIZE.TITLE_SM};
      font-weight: ${FONT_WEIGHT.BOLD};
      margin-bottom: 16px;
    }
    span {
      font-size: ${FONT_SIZE.TEXT_MD};
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
    display: flex;
    flex-direction: column;
    gap: 16px;

    span {
      margin-top: 8px;
      color: ${COLOR.ERROR_RED};
      font-size: ${FONT_SIZE.TEXT_SM};
    }
  }
`;

const inputWrapperStyle = css`
  display: flex;
  flex-direction: column;

  label {
    font-size: ${FONT_SIZE.TEXT_SM};
    font-weight: ${FONT_WEIGHT.REGULAR};
    margin-bottom: 8px;
  }

  .input-items {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  span {
    color: ${COLOR.POINT};
    font-size: ${FONT_SIZE.TEXT_SM};
    margin-top: 4px;
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
      font-size: ${FONT_SIZE.TEXT_LG};
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
