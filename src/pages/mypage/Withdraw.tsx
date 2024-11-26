import { useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

const Withdraw: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => navigate(path);

  const infoData = [
    '탈퇴 즉시 관심 전략 및 포트폴리오의 모든 내용이 삭제됩니다.',
    '탈퇴 즉시 회원님의 모든 개인정보는 삭제됩니다.',
    '탈퇴 후 2주일간 동일한 이메일주소로 회원가입이 불가합니다.',
  ];

  return (
    <div css={wrapperStyle}>
      <div css={indexStyle}>
        <div css={titleStyle}>회원탈퇴</div>
        <div css={descriptionStyle}>
          회원탈퇴를 신청하기 전에 안내 사항을 꼭 확인해주세요.
          <br />
          탈퇴한 아이디는 본인과 타인 모두 재사용 및 복구가 불가하오니 신중하게
          선택하시기 바랍니다.
        </div>
      </div>
      <div css={warningStyle}>
        홍길동님, 잠시만요!
        <br />
        정말로 탈퇴하시겠습니까?
      </div>
      <div css={infoContainerStyle}>
        {infoData.map((info, index) => (
          <div key={index} css={infoStyle}>
            <div css={imgStyle}>img</div>
            <span>{info}</span>
          </div>
        ))}
      </div>
      <div css={checkboxWrapperStyle}>
        <Checkbox
          checked={isChecked}
          handleChange={() => setIsChecked(!isChecked)}
        />
        <div css={checkboxTextStyle}>
          안내 사항을 모두 확인하였으며, 이에 동의합니다.
        </div>
      </div>
      <div css={buttonStyle}>
        <Button
          label='회원탈퇴'
          handleClick={() => handleNavigation(PATH.ROOT)}
          color='primaryOpacity10'
          size='md'
          shape='square'
          width={120}
          border
        />
        <Button
          label='취소'
          handleClick={() => handleNavigation(PATH.MYPAGE_PROFILE())}
          color='primary'
          size='md'
          shape='square'
          width={120}
        />
      </div>
    </div>
  );
};

export default Withdraw;

const wrapperStyle = css`
  padding-top: 96px;
  padding-bottom: 212px;
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
  line-height: 1.5;
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.REGULAR};
`;

const warningStyle = css`
  text-align: center;
  font-size: ${FONT_SIZE.TITLE_XS};
  font-weight: ${FONT_WEIGHT.BOLD};
  line-height: 1.5;
  margin: 40px 0;
`;

const infoContainerStyle = css`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
`;

const infoStyle = css`
  flex-shrink: 0;
  width: 380px;
  height: 268px;
  background-color: ${COLOR.GRAY100};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;

  span {
    margin-top: 20px;
    font-size: ${FONT_SIZE.TITLE_XS};
    line-height: 1.5;
    color: ${COLOR.GRAY800};
  }
`;

const imgStyle = css`
  width: 120px;
  height: 120px;
  background-color: ${COLOR.GRAY};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${FONT_SIZE.TEXT_MD};
  color: ${COLOR.GRAY600};
`;

const checkboxWrapperStyle = css`
  display: flex;
  align-items: center;
  margin-top: 40px;
`;

const checkboxTextStyle = css`
  font-size: ${FONT_SIZE.TEXT_MD};
`;

const buttonStyle = css`
  margin-top: 80px;
  display: flex;
  gap: 16px;
  justify-content: center;
`;
