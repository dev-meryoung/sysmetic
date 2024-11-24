import { useEffect, useState, ChangeEvent } from 'react';
import { css } from '@emotion/react';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import Calendar from '@/components/Calendar';
import IconButton from '@/components/IconButton';
import ProfileImage from '@/components/ProfileImage';
import RadioButton from '@/components/RadioButton';
import SelectBox from '@/components/SelectBox';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

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

const SignUpForm = () => {
  // 입력 폼
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [checkPw, setCheckPw] = useState('');
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [isFirstChecked, setIsFirstChecked] = useState('false');
  const [isSecondChecked, setIsSecondChecked] = useState('false');
  const [date, setDate] = useState('');
  // 라우팅 관련
  const { type } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    console.log(selectedEmail);
  }, [selectedEmail]);

  return (
    <div css={wrapperStyle}>
      <div css={subTitleStyle}>정보입력</div>
      <div css={formDivStyle}>
        <div className='email-form'>
          <p>이메일</p>
          <div>
            <TextInput
              width={160}
              value={id}
              handleChange={(e) => setId(e.target.value)}
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
                handleClick={() => console.log('이메일 인증')}
              />
            </div>
          </div>
          <p>support message</p>
        </div>
        <div className='input-form'>
          <p>비밀번호</p>
          <TextInput
            type='password'
            value={pw}
            handleChange={(e) => setPw(e.target.value)}
          />
          <p>support message</p>
        </div>
        <div className='input-form'>
          <p>비밀번호 확인</p>
          <div className='check-pw'>
            <TextInput
              type='password'
              value={checkPw}
              handleChange={(e) => setCheckPw(e.target.value)}
            />
            <Button
              width={80}
              label='중복확인'
              handleClick={() => console.log('중복확인')}
            />
          </div>
          <p>support message</p>
        </div>
        <div className='input-form'>
          <p>닉네임</p>
          <TextInput
            value={nickname}
            handleChange={(e) => setNickname(e.target.value)}
          />
          <p>support message</p>
        </div>
        <div className='input-form'>
          <p>이름</p>
          <TextInput
            value={name}
            handleChange={(e) => setName(e.target.value)}
          />
          <p>support message</p>
        </div>
        <div className='input-form'>
          <p>생년월일</p>
          <Calendar type='date' dateProps={{ date, setDate }} />
          <p>support message</p>
        </div>
        <div className='input-form'>
          <p>휴대번호</p>
          <TextInput
            type='tel'
            value={phoneNum}
            handleChange={(e) => setPhoneNum(e.target.value)}
          />
          <p>support message</p>
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
        <Button width={120} label='다음' handleClick={handleNextBtnClick} />
      </div>
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

export default SignUpForm;
