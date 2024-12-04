import { useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';
import tempTag from '@/assets/images/test-tag.jpg';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import ProfileImage from '@/components/ProfileImage';
import Tag from '@/components/Tag';
import TextArea from '@/components/TextArea';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useCreateUserInquiry } from '@/hooks/useCommonApi';
import { useGetStrategyInfo } from '@/hooks/useStrategyApi';
import useModalStore from '@/stores/useModalStore';

const QnaQuestion = () => {
  const { openModal } = useModalStore();
  const navigate = useNavigate();
  const { strategyId: paramStrategyId } = useParams<{ strategyId: string }>();
  const strategyId =
    paramStrategyId && !isNaN(Number(paramStrategyId))
      ? Number(paramStrategyId)
      : 0;
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const userId =
    paramUserId && !isNaN(Number(paramStrategyId))
      ? Number(paramStrategyId)
      : 0;

  const { data: strategyInfo } = useGetStrategyInfo(String(strategyId));
  const createUserInquiry = useCreateUserInquiry();
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 100) {
      setInquiryTitle(e.target.value);
    }
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 1000) {
      setInquiryContent(e.target.value);
    }
  };
  const handleSubmitBtn = () => {
    if (!inquiryTitle.trim() || inquiryTitle.length > 40) {
      openModal('error-input');
      return;
    }
    if (!inquiryContent.trim() || inquiryContent.length < 10) {
      openModal('error-input');
      return;
    }

    createUserInquiry.mutate(
      {
        strategyId,
        inquiryTitle,
        inquiryContent,
      },
      {
        onSuccess: () => {
          navigate(PATH.MYPAGE_QNA(String(userId)));
        },
        onError: () => {
          openModal('error-input');
        },
      }
    );
  };

  return (
    <div css={wrapperStyle}>
      <div css={titleBoxStyle}>
        <h5>문의하기</h5>
        <span>시스메틱 트레이더에게 당신이 궁금한 전략에 대해 문의하세요.</span>
      </div>
      <div css={strategyBoxStyle}>
        <div className='strategy-box'>
          <div className='tags'>
            <Tag src={tempTag} />
          </div>
          <span>{strategyInfo?.name || '전략명이 존재하지않습니다.'}</span>
        </div>
        <div className='trader-box'>
          <ProfileImage />
          <span>
            {strategyInfo?.traderNickname || '트레이더명이 존재하지않습니다.'}
          </span>
        </div>
      </div>
      <div css={inputBoxStyle}>
        <TextInput
          value={inquiryTitle}
          height={64}
          fullWidth={true}
          placeholder='제목을 입력하세요 (최대 100자)'
          handleChange={handleTitleChange}
        />
        <TextArea
          value={inquiryContent}
          fullWidth={true}
          handleChange={handleContentChange}
        />
      </div>
      <div css={buttonBoxStyle}>
        <Button
          label='이전'
          shape='square'
          border={true}
          width={120}
          handleClick={() => {
            navigate(-1);
          }}
        />
        <Button label='문의하기' width={120} handleClick={handleSubmitBtn} />
      </div>
      <Modal
        id='error-input'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>형식에 맞춰 작성해주세요.</p>
          </div>
        }
      />
      <Modal
        id='error-submit'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>문의등록에 실패했습니다.</p>
          </div>
        }
      />
    </div>
  );
};

const wrapperStyle = css`
  max-width: 1200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  margin: 0 auto;

  span {
    line-height: 24px;
  }
`;

const titleBoxStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};
  margin-top: 96px;
  padding-bottom: 40px;
`;

const strategyBoxStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;

  .strategy-box {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .trader-box {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

const inputBoxStyle = css`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 80px;
`;

const buttonBoxStyle = css`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 80px;
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

export default QnaQuestion;
