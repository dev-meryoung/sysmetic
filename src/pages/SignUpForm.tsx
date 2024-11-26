import { useEffect, useState, ChangeEvent } from 'react';
import { css } from '@emotion/react';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import Calendar from '@/components/Calendar';
import IconButton from '@/components/IconButton';
import Modal from '@/components/Modal';
import ProfileImage from '@/components/ProfileImage';
import RadioButton from '@/components/RadioButton';
import SelectBox from '@/components/SelectBox';
import Dot from '@/components/signup/Dot';
import TextInput, { InputStateTypes } from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useModalStore } from '@/stores/useModalStore';

const RadioOption1 = [
  { label: '관심 전략과 정보 수신에 동의합니다.', value: 'true' },
  { label: '관심 전략과 정보 수신에 동의하지 않습니다.', value: 'false' },
];

const RadioOption2 = [
  { label: '마케팅 정보 알림 수신에 동의합니다.', value: 'true' },
  { label: '마케팅 정보 알림 수신에 동의하지 않습니다.', value: 'false' },
];

const EmailOptions = [
  { label: 'naver.com', value: 'naver' },
  { label: 'gmail.com', value: 'gmail' },
  { label: 'hanmail.net', value: 'hanmail' },
  { label: 'nate.com', value: 'nate' },
  { label: 'yahoo.com', value: 'yahoo' },
  { label: 'empal.com', value: 'empal' },
];

const REGEX = {
  ID_REGEX: /^[a-zA-Z\d\W_]+$/,
  PW_REGEX: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
  NAME_REGEX: /^[가-힣]{1,10}$/,
  NICKNAME_REGEX: /^[가-힣\d]{3,10}$/,
  PHONE_REGEX: /^010\d{8}$/,
};

const SignUpForm = () => {
  // 입력 폼
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [checkPw, setCheckPw] = useState('');
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [date, setDate] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  // 모달 내 변수
  const [authCode, setAuthCode] = useState('');
  //정보수신 동의
  const [isFirstChecked, setIsFirstChecked] = useState('false');
  const [isSecondChecked, setIsSecondChecked] = useState('false');
  const [isDisabled, setIsDisabled] = useState(true);
  // 라우팅 관련
  const { type } = useParams();
  const navigate = useNavigate();

  //status 관련 (인풋창 border 색상)
  const [idStatus, setIdStatus] = useState<InputStateTypes>('normal');
  const [pwStatus, setPwStatus] = useState<InputStateTypes>('normal');
  const [checkPwStatus, setCheckPwStatus] = useState<InputStateTypes>('normal');
  const [nicknameStatus, setNicknameStatus] =
    useState<InputStateTypes>('normal');
  const [nameStatus, setNameStatus] = useState<InputStateTypes>('normal');
  const [phoneNumStatus, setPhoneNumStatus] =
    useState<InputStateTypes>('normal');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setProfileImg(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 파일 탐색기 열기
  const handleOpenFileExplorer = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.addEventListener('change', (e: Event) => {
      const input = e.target as HTMLInputElement;
      handleFileChange({
        target: input,
      } as ChangeEvent<HTMLInputElement>);
    });

    fileInput.click();
  };

  const handleEmailChange = (value: string) => {
    setSelectedEmail(value);
  };

  const handleBackBtnClick = () => {
    navigate(PATH.SIGN_UP_TYPE(type));
  };

  const handleNextBtnClick = () => {
    navigate(PATH.SIGN_UP_DONE(type));
  };

  const handleIdInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);

    if (REGEX.ID_REGEX.test(e.target.value)) {
      setIdStatus('pass');
    } else {
      setIdStatus('warn');
    }
  };

  const handlePwInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);

    if (REGEX.PW_REGEX.test(e.target.value)) {
      setPwStatus('pass');
    } else {
      setPwStatus('warn');
    }
  };

  const handleCheckPwInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCheckPw(e.target.value);

    if (e.target.value === pw) {
      setCheckPwStatus('pass');
    } else {
      setCheckPwStatus('warn');
    }
  };

  const handleNicknameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);

    if (REGEX.NICKNAME_REGEX.test(e.target.value)) {
      setNicknameStatus('pass');
    } else {
      setNicknameStatus('warn');
    }
  };

  const handleNameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);

    if (REGEX.NAME_REGEX.test(e.target.value)) {
      setNameStatus('pass');
    } else {
      setNameStatus('warn');
    }
  };

  const handlePhoneInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNum(e.target.value);

    if (REGEX.PHONE_REGEX.test(e.target.value)) {
      setPhoneNumStatus('pass');
    } else {
      setPhoneNumStatus('warn');
    }
  };

  const { openModal, closeModal } = useModalStore();

  const handleAuthModal = () => {
    openModal(
      <div css={AuthModalStyle}>
        <h6>
          해당 이메일로 코드가 전송되었습니다.
          <br />
          3분 이내로 입력해 주시기 바랍니다.
        </h6>
        <div className='input-form'>
          <p>
            인증번호 입력
            <Dot />
          </p>
          <TextInput
            width={312}
            value={authCode}
            handleChange={(e) => setAuthCode(e.target.value)}
          />
          <p>support message</p>
        </div>
        <div className='auth-btn'>
          <Button
            width={120}
            border={true}
            label='취소'
            handleClick={closeModal}
          />
          <Button
            width={120}
            label='인증하기'
            handleClick={() => console.log('인증하기')}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    console.log(selectedEmail);
  }, [selectedEmail]);

  useEffect(() => {
    setIsDisabled(
      !(
        isFirstChecked === 'true' &&
        isSecondChecked === 'true' &&
        idStatus === 'pass' &&
        pwStatus === 'pass' &&
        checkPwStatus === 'pass' &&
        nicknameStatus === 'pass' &&
        nameStatus === 'pass' &&
        phoneNumStatus === 'pass'
      )
    );
  }, [
    isFirstChecked,
    isSecondChecked,
    idStatus,
    pwStatus,
    checkPwStatus,
    nicknameStatus,
    nameStatus,
    phoneNumStatus,
  ]);

  return (
    <div css={wrapperStyle}>
      <div css={subTitleStyle}>정보입력</div>
      <div css={formDivStyle}>
        <div className='email-form'>
          <p>
            이메일
            <Dot />
          </p>
          <div>
            <TextInput
              status={idStatus}
              width={160}
              value={id}
              handleChange={handleIdInputChange}
            />
            <span>@</span>
            <SelectBox
              options={EmailOptions}
              handleChange={handleEmailChange}
            />
            <div className='email-btn'>
              <Button
                width={80}
                label='중복확인'
                handleClick={() => console.log('중복확인')}
              />
              <Button
                color='textBlack'
                width={96}
                label='이메일 인증'
                handleClick={handleAuthModal}
              />
            </div>
          </div>
          {idStatus !== 'pass' ? (
            <p>영문, 숫자, 특수문자 중 1개 이상 조합하여 사용</p>
          ) : (
            <></>
          )}
        </div>
        <div className='input-form'>
          <p>
            비밀번호
            <Dot />
          </p>
          <TextInput
            status={pwStatus}
            type='password'
            value={pw}
            handleChange={handlePwInputChange}
          />
          {pwStatus !== 'pass' ? (
            <p>6~20자의 영문, 숫자, 특수문자를 모두 조합하여 사용</p>
          ) : (
            <></>
          )}
        </div>
        <div className='input-form'>
          <p>
            비밀번호 확인
            <Dot />
          </p>
          <TextInput
            status={checkPwStatus}
            type='password'
            value={checkPw}
            handleChange={handleCheckPwInputChange}
          />
          {checkPw !== pw ? <p>비밀번호가 일치하지 않습니다.</p> : <></>}
        </div>
        <div className='input-form'>
          <p>
            닉네임
            <Dot />
          </p>
          <div className='check-nickname'>
            <TextInput
              status={nicknameStatus}
              value={nickname}
              handleChange={handleNicknameInputChange}
            />
            <Button
              width={80}
              label='중복확인'
              handleClick={() => console.log('중복확인')}
            />
          </div>
          {nicknameStatus !== 'pass' ? (
            <p>3~10자의 한글, 숫자 중 1개 이상 조합하여 사용</p>
          ) : (
            <></>
          )}
        </div>
        <div className='input-form'>
          <p>
            이름
            <Dot />
          </p>
          <TextInput
            status={nameStatus}
            value={name}
            handleChange={handleNameInputChange}
          />
          {nameStatus !== 'pass' ? <p>1~10자의 한글만 조합하여 사용</p> : <></>}
        </div>
        <div className='input-form'>
          <p>
            생년월일
            <Dot />
          </p>
          <Calendar type='date' dateProps={{ date, setDate }} />
          {date ? <></> : <p>생년월일을 선택해 주세요.</p>}
        </div>
        <div className='input-form'>
          <p>
            휴대번호
            <Dot />
          </p>
          <TextInput
            status={phoneNumStatus}
            type='tel'
            value={phoneNum}
            handleChange={handlePhoneInputChange}
          />
          {phoneNumStatus !== 'pass' ? (
            <p>010으로 시작하는 11자의 숫자만 조합하여 사용('-' 제외)</p>
          ) : (
            <></>
          )}
        </div>
        <div className='img-form'>
          <p>프로필 이미지 설정</p>
          <div>
            <ProfileImage size='xxl' alt='profile' src={profileImg} />
            <IconButton
              color='realGray'
              shape='round'
              iconBgSize='lg'
              IconComponent={CameraAltOutlinedIcon}
              handleClick={handleOpenFileExplorer}
              css={iconStyle}
            />
          </div>
        </div>
      </div>
      <div css={subTitleStyle}>
        정보수신 동의
        <p>모든 정보수신에 동의를 하셔야 회원가입이 이루어집니다.</p>
      </div>
      <div css={agreementDivStyle}>
        <RadioButton
          options={RadioOption1}
          name='interested'
          selected={isFirstChecked}
          handleChange={setIsFirstChecked}
        />
        <RadioButton
          options={RadioOption2}
          name='marketing'
          selected={isSecondChecked}
          handleChange={setIsSecondChecked}
        />
      </div>
      <div css={buttonDivStyle}>
        <Button
          border={true}
          width={120}
          label='이전'
          handleClick={handleBackBtnClick}
        />
        <Button
          width={120}
          label='가입 완료'
          handleClick={handleNextBtnClick}
          disabled={isDisabled}
        />
      </div>
      <Modal width={360} />
    </div>
  );
};

const wrapperStyle = css`
  width: 100%;
  height: 100%;
  max-width: 1200px;
  padding: 0 10px;
  margin: 0 auto;
  letter-spacing: -0.4px;
  font-size: ${FONT_SIZE.TEXT_SM};
  display: flex;
  flex-direction: column;
`;

const subTitleStyle = css`
  margin-top: 80px;
  padding-bottom: 40px;
  font-size: ${FONT_SIZE.TITLE_XS};
  font-weight: ${FONT_WEIGHT.BOLD};
  letter-spacing: -0.4px;
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};

  p {
    font-size: ${FONT_SIZE.TEXT_MD};
    letter-spacing: -0.32px;
    margin-top: 16px;
  }
`;

const formDivStyle = css`
  margin-top: 40px;
  letter-spacing: -0.28px;

  .email-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 40px;

    p:last-child {
      color: ${COLOR.POINT};
    }

    div {
      display: flex;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 8px;
      }

      .email-btn {
        display: flex;
        gap: 16px;
        margin-left: 16px;
      }
    }
  }

  .input-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 40px;

    p:last-child {
      color: ${COLOR.POINT};
    }

    .check-nickname {
      display: flex;
      gap: 16px;
    }
  }

  .check-pw {
    display: flex;
    gap: 16px;
  }

  .img-form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    div {
      position: relative;
      width: 120px;
      height: 120px;
    }
  }
`;

const agreementDivStyle = css`
  margin-top: 24px;

  div {
    display: flex;
    gap: 16px;
  }
`;

const buttonDivStyle = css`
  display: flex;
  margin: 80px auto 96px;
  gap: 16px;
`;

const iconStyle = css`
  position: absolute;
  right: 0;
  bottom: 0;
`;

const AuthModalStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 0;

  font-size: ${FONT_SIZE.TEXT_MD};

  h6 {
    font-size: ${FONT_SIZE.TEXT_MD};
    font-weight: ${FONT_WEIGHT.REGULAR};
    line-height: 160%;
  }

  .input-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 32px 0 40px;

    p::first-of-type {
      font-size: ${FONT_SIZE.TEXT_SM};
    }

    p:last-child {
      font-size: ${FONT_SIZE.TEXT_SM};
      color: ${COLOR.POINT};
    }
  }

  .auth-btn {
    display: flex;
    gap: 16px;
  }
`;

export default SignUpForm;
