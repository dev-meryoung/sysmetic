import React, { useEffect, useState, ChangeEvent, Dispatch } from 'react';
import { css } from '@emotion/react';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { checkEmail } from '@/api/authApi';
import Button from '@/components/Button';
import Calendar from '@/components/Calendar';
import Modal from '@/components/Modal';
import ProfileImage from '@/components/ProfileImage';
import RadioButton from '@/components/RadioButton';
import SelectBox from '@/components/SelectBox';
import Dot from '@/components/signup/Dot';
import TextInput, { InputStateTypes } from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useSendAuthCode,
  useCheckNickname,
  useSignUp,
  useCheckEmailCode,
} from '@/hooks/useAuthApi';
import useModalStore from '@/stores/useModalStore';

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
  { label: 'test.com', value: 'test' },
];

const REGEX = {
  ID_REGEX: /^[a-zA-Z\d_]+$/,
  PW_REGEX:
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
  NAME_REGEX: /^[가-힣]{1,10}$/,
  NICKNAME_REGEX: /^[가-힣\d]{3,10}$/,
  PHONE_REGEX: /^010\d{8}$/,
  AUTHCODE_REGEX: /^[A-Z0-9]{6}$/,
};

interface AuthModalProps {
  email: string;
  setSuccessEmailAuth: Dispatch<React.SetStateAction<boolean>>;
}
const AuthModal: React.FC<AuthModalProps> = ({
  email,
  setSuccessEmailAuth,
}) => {
  // 모달 내 변수
  const [authCode, setAuthCode] = useState('');
  const [authCodeStatus, setAuthCodeStatus] =
    useState<InputStateTypes>('normal');
  const [message, setMessage] = useState('');
  // 모달 생성 변수
  const authModal = useModalStore();
  const authSuccessModal = useModalStore();

  const handleAuthCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthCode(e.target.value);
    if (REGEX.AUTHCODE_REGEX.test(e.target.value)) {
      setAuthCodeStatus('pass');
    } else {
      setAuthCodeStatus('warn');
      setMessage('6자리의 영문 대문자, 숫자만 조합하여 사용');
    }
  };

  const { mutate: checkEmailCodeMutation } = useCheckEmailCode();

  const handleAuthBtnClick = () => {
    const emailData = {
      email,
      authCode,
    };
    checkEmailCodeMutation(emailData, {
      onSuccess: (data) => {
        if (data?.code === 200) {
          setSuccessEmailAuth(true);
          authModal.closeModal('auth');
          authSuccessModal.openModal('success');
        }
      },
      onError: () => {
        setAuthCodeStatus('warn');
        setMessage('인증번호를 다시 확인해주세요.');
      },
    });
  };

  return (
    <div css={AuthModalStyle}>
      <h6>해당 이메일로 인증번호가 전송되었습니다.</h6>
      <h6>전송된 인증번호를 정확히 입력해주세요.</h6>
      <div className='input-form'>
        <p>
          인증번호 입력
          <Dot />
        </p>
        <TextInput
          maxLength={6}
          status={authCodeStatus}
          width={312}
          value={authCode}
          handleChange={handleAuthCodeChange}
        />
        <p>{authCodeStatus === 'warn' && message}</p>
      </div>
      <div className='auth-btn'>
        <Button
          width={120}
          border={true}
          label='취소'
          handleClick={() => authModal.closeModal('auth')}
        />
        <Button width={120} label='인증하기' handleClick={handleAuthBtnClick} />
      </div>
    </div>
  );
};

const AuthSuccessModal = () => (
  <div css={AuthSuccessModalStyle}>
    <p>인증되었습니다.</p>
  </div>
);

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
  const age = new Date().getFullYear() - new Date(date).getFullYear() < 14;
  // 모달 변수
  const authModal = useModalStore();
  // 버튼 상태
  const [checkIdDisabled, setCheckIdDisabled] = useState(true);
  const [idAuthBtnDisabled, setIdAuthBtnDisabled] = useState(true);
  const [nicknameBtnDisabled, setNicknameBtnDisabled] = useState(true);
  //계정 존재여부
  const [isExist, setIsExist] = useState(false);
  const [isNicknameExist, setIsNicknameExist] = useState(false);
  //중복확인 및 인증 성공여부
  const [successId, setSuccessId] = useState(false);
  const [successNickname, setSuccessNickname] = useState(false);
  const [succeessEmailAuth, setSuccessEmailAuth] = useState(false);
  //정보수신 동의
  const [isFirstChecked, setIsFirstChecked] = useState(false);
  const [isSecondChecked, setIsSecondChecked] = useState(false);
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
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const fileInput = document.createElement('input');

    fileInput.type = 'file';
    fileInput.accept = 'image/jpg,image/jpeg,image/png,image/gif';

    fileInput.addEventListener('change', (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.size > MAX_FILE_SIZE) {
          alert(
            '5MB 이하의 jp(e)g, png, gif 형식의 이미지만 설정할 수 있습니다.'
          );
          return;
        }

        handleFileChange({
          target: input,
        } as ChangeEvent<HTMLInputElement>);
      }
    });

    fileInput.click();
  };

  const handleEmailChange = (value: string) => {
    setSelectedEmail(value);
  };

  const handleBackBtnClick = () => {
    navigate(PATH.SIGN_UP_TYPE(type));
  };

  const { mutate: signUpMutation } = useSignUp();
  const handleNextBtnClick = () => {
    const formData = new FormData();
    if (profileImg) {
      formData.append('file', profileImg);
    }

    const registerData = {
      roleCode: type === 'investor' ? 'USER' : 'TRADER',
      email: `${id}@${selectedEmail}.com`,
      password: pw,
      rewritePassword: checkPw,
      name,
      nickname,
      birth: date,
      phoneNumber: phoneNum,
      receiveInfoConsent: isFirstChecked,
      infoConsentDate: new Date().toISOString().slice(0, 19).replace('Z', ''),
      receiveMarketingConsent: isSecondChecked,
      marketingConsentDate: new Date()
        .toISOString()
        .slice(0, 19)
        .replace('Z', ''),
    };

    formData.append('registerResponseDto', JSON.stringify(registerData));

    signUpMutation(formData, {
      onSuccess: () => {
        navigate(PATH.SIGN_UP_DONE(type));
      },
      onError: () => {
        console.log('회원가입 실패');
      },
    });
  };

  const handleIdInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);

    if (REGEX.ID_REGEX.test(e.target.value)) {
      setIdStatus('pass');
    } else {
      setIdStatus('warn');
      setEmailMessage('');
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

    if (e.target.value !== pw) {
      setCheckPwStatus('warn');
    } else {
      setCheckPwStatus('pass');
    }
  };

  const handleNicknameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);

    if (REGEX.NICKNAME_REGEX.test(e.target.value)) {
      setNicknameStatus('pass');
    } else {
      setNicknameStatus('warn');
      setNicknameMessage('');
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

  const handleFirstRadioChange = (value: string) => {
    const booleanValue = value === 'true';
    setIsFirstChecked(booleanValue);
  };
  const handleSecoundRadioChange = (value: string) => {
    const booleanSecondValue = value === 'true';
    setIsSecondChecked(booleanSecondValue);
  };
  //이메일 인증 코드 전송 및 모달 생성
  const { mutate: AuthCodeMutation } = useSendAuthCode();
  const handleOpenAuthModal = () => {
    if (idStatus === 'pass' && selectedEmail && successId) {
      const email = `${id}@${selectedEmail}.com`;
      AuthCodeMutation(email, {
        onSuccess: () => {
          authModal.openModal('auth', 360);
        },
        onError: () => {
          console.error('인증코드 전송 중 문제 발생');
        },
      });
    }
  };

  //이메일 중복확인
  const [emailMessage, setEmailMessage] = useState('');

  const handleCheckId = async () => {
    if (id && selectedEmail) {
      const emailData = await checkEmail(id, selectedEmail);
      if (emailData === 200) {
        setIsExist(false); // 계정 중복 여부
        setIdAuthBtnDisabled(false); // 이메일 인증 버튼 상태
        setSuccessId(true);
        setEmailMessage('사용 가능한 이메일입니다.');
      } else {
        setIsExist(true);
        setIdAuthBtnDisabled(true);
        setSuccessId(false);
      }
    }
  };
  //닉네임 중복확인
  const { mutate: checkNicknameMutation } = useCheckNickname();
  const [nicknameMessage, setNicknameMessage] = useState('');

  const handleCheckNickname = () => {
    checkNicknameMutation(nickname, {
      onSuccess: () => {
        setIsNicknameExist(false); // 중복 상태 업데이트
        setSuccessNickname(true);
        setNicknameMessage('사용 가능한 닉네임입니다.');
      },
      onError: () => {
        setIsNicknameExist(true);
        setSuccessNickname(false);
      },
    });
  };

  useEffect(() => {
    setIsDisabled(
      !(
        isFirstChecked &&
        isSecondChecked &&
        idStatus === 'pass' &&
        pwStatus === 'pass' &&
        checkPwStatus === 'pass' &&
        nicknameStatus === 'pass' &&
        nameStatus === 'pass' &&
        phoneNumStatus === 'pass' &&
        !isNicknameExist &&
        !isExist &&
        successNickname &&
        successId &&
        succeessEmailAuth &&
        !age
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
    isNicknameExist,
    isExist,
    successId,
    successNickname,
    succeessEmailAuth,
    age,
  ]);

  //이메일 중복확인 on/off
  useEffect(() => {
    if (idStatus === 'pass' && selectedEmail) {
      setCheckIdDisabled(false);
    } else {
      setCheckIdDisabled(true);
    }
  }, [idStatus, selectedEmail]);

  //닉네임 중복확인 on/off
  useEffect(() => {
    if (nicknameStatus === 'pass') {
      setNicknameBtnDisabled(false);
    } else {
      setNicknameBtnDisabled(true);
    }
  }, [nicknameStatus]);

  //도메인 변경 시, 실시간 이메일인증 on/off
  useEffect(() => {
    if (selectedEmail) {
      setIdAuthBtnDisabled(true);
    }
  }, [selectedEmail]);

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
                handleClick={handleCheckId}
                disabled={checkIdDisabled}
              />
              <Button
                color='textBlack'
                width={96}
                label='이메일 인증'
                handleClick={handleOpenAuthModal}
                disabled={idAuthBtnDisabled}
              />
            </div>
          </div>
          <p>
            {idStatus === 'warn' &&
              '영문, 숫자, 특수문자 중 1개 이상 조합하여 사용'}
            {idStatus === 'pass' && !selectedEmail && '이메일을 선택해주세요.'}
            {idStatus === 'pass' &&
              selectedEmail &&
              (isExist ? (
                '중복된 이메일입니다.'
              ) : (
                <span className='success-msg'>{emailMessage}</span>
              ))}
          </p>
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
          {pwStatus === 'warn' && (
            <p>6~20자의 영문, 숫자, 특수문자를 모두 조합하여 사용</p>
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
          {checkPw !== pw && <p>비밀번호가 일치하지 않습니다.</p>}
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
              handleClick={handleCheckNickname}
              disabled={nicknameBtnDisabled}
            />
          </div>
          <p>
            {nicknameStatus === 'warn' &&
              '3~10자의 한글, 숫자 중 1개 이상 조합하여 사용'}
            {nicknameStatus === 'pass' &&
              (isNicknameExist ? (
                '중복된 닉네임입니다.'
              ) : (
                <span className='success-msg'>{nicknameMessage}</span>
              ))}
          </p>
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
          {nameStatus === 'warn' && <p>1~10자의 한글만 조합하여 사용</p>}
        </div>
        <div className='input-form'>
          <p>
            생년월일
            <Dot />
          </p>
          <Calendar type='date' dateProps={{ date, setDate }} />
          {age && <p>14세 미만은 가입할 수 없습니다.</p>}
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
          {phoneNumStatus === 'warn' && (
            <p>010으로 시작하는 11자의 숫자만 조합하여 사용 ('-' 제외)</p>
          )}
        </div>
        <div className='img-form'>
          <p>프로필 이미지 설정</p>
          <div className='img-div' onClick={handleOpenFileExplorer}>
            <ProfileImage size='xxl' alt='profile' src={profileImg} />
            <CameraAltOutlinedIcon className='icon' css={iconStyle} />
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
          selected={isFirstChecked ? 'true' : 'false'}
          handleChange={handleFirstRadioChange}
        />
        <RadioButton
          options={RadioOption2}
          name='marketing'
          selected={isSecondChecked ? 'true' : 'false'}
          handleChange={handleSecoundRadioChange}
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
      <Modal
        content={
          <AuthModal
            email={`${id}@${selectedEmail}.com`}
            setSuccessEmailAuth={setSuccessEmailAuth}
          />
        }
        id='auth'
      />
      <Modal content={<AuthSuccessModal />} id='success' />
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

    p > .success-msg {
      color: ${COLOR.CHECK_GREEN};
    }

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

    p > .success-msg {
      color: ${COLOR.CHECK_GREEN};
    }
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

    .img-div {
      &:hover .icon {
        background-color: ${COLOR.GRAY700};
      }
    }

    div {
      position: relative;
      width: 120px;
      height: 120px;
      cursor: pointer;
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
  width: 48px;
  height: 48px;
  padding: 12px;
  color: ${COLOR.WHITE};
  background-color: ${COLOR.GRAY};
  border-radius: 50%;

  &:hover {
    background-color: ${COLOR.GRAY700};
  }
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

    p {
      font-size: ${FONT_SIZE.TEXT_SM};
    }

    p:last-of-type {
      color: ${COLOR.POINT};
    }
  }

  .auth-btn {
    display: flex;
    gap: 16px;
  }
`;

const AuthSuccessModalStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 8px 16px;
  font-size: ${FONT_SIZE.TEXT_MD};
`;

export default SignUpForm;
