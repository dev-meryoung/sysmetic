import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Modal from '@/components/Modal';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useUpdateOpt } from '@/hooks/useUserApi';
import useAuthStore from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

const MypageOpt: React.FC = () => {
  const [checkboxStates, setCheckboxStates] = useState([false, false]);
  const { memberId, receiveInfoConsent, receiveMarketingConsent } =
    useAuthStore();
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { openModal } = useModalStore();

  const userId =
    paramUserId && !isNaN(Number(paramUserId)) ? Number(paramUserId) : memberId;
  const updateOpt = useUpdateOpt();

  useEffect(() => {
    if (
      receiveInfoConsent !== undefined &&
      receiveMarketingConsent !== undefined
    ) {
      setCheckboxStates([receiveInfoConsent, receiveMarketingConsent]);
    }
  }, [receiveInfoConsent, receiveMarketingConsent]);

  const handleCheckboxChange = (index: number) => {
    setCheckboxStates((prev) =>
      prev.map((state, i) => (i === index ? !state : state))
    );
  };

  const handleComplete = () => {
    const [updatedReceiveInfoConsent, updatedReceiveMarketingConsent] =
      checkboxStates;

    updateOpt.mutate(
      {
        userId,
        receiveInfoConsent: updatedReceiveInfoConsent,
        receiveMarketingConsent: updatedReceiveMarketingConsent,
      },
      {
        onSuccess: () => {
          useAuthStore.setState({
            receiveInfoConsent: updatedReceiveInfoConsent,
            receiveMarketingConsent: updatedReceiveMarketingConsent,
          });

          navigate(PATH.MYPAGE_PROFILE(String(userId)));
        },
        onError: () => {
          openModal('update-confirm');
        },
      }
    );
  };

  if (!userId) {
    return null;
  }

  return (
    <div css={wrapperStyle}>
      <div css={indexStyle}>
        <div css={titleStyle}>정보수신 동의</div>
        <div css={descriptionStyle}>정보수신 동의 페이지입니다.</div>
      </div>
      <div css={checkboxWrapperStyle}>
        {checkboxStates.map((state, index) => (
          <div key={index} css={checkboxItemStyle}>
            <Checkbox
              checked={state}
              handleChange={() => handleCheckboxChange(index)}
            />
            <div css={checkboxTextStyle}>
              {index === 0
                ? '정보 수신에 동의합니다.'
                : '마케팅 정보 수신에 동의합니다.'}
            </div>
          </div>
        ))}
      </div>
      <div css={buttonStyle}>
        <Button
          label='이전'
          handleClick={() => navigate(PATH.MYPAGE_PROFILE(String(userId)))}
          color='primaryOpacity10'
          size='md'
          shape='square'
          width={120}
          border
        />
        <Button
          label='수정완료'
          handleClick={handleComplete}
          color='primary'
          size='md'
          shape='square'
          width={120}
        />
      </div>

      <Modal
        id='update-confirm'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>정보수신 동의 변경에 실패했습니다.</p>
          </div>
        }
      />
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

const modalContentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const modalTextStyle = css`
  font-size: ${FONT_SIZE.TEXT_LG};
  text-align: center;
  margin-top: 32px;
  margin-bottom: 24px;
`;
