import { useState, useCallback, useEffect } from 'react';
import { css } from '@emotion/react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import TextArea from '@/components/TextArea';
import TextInput from '@/components/TextInput';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useGetEditInquiry, useUpdateInquiry } from '@/hooks/useCommonApi';

interface InquiryDataTypes {
  inquiryId: number;
  page: number;
  sort: string;
  closed: string;
  inquiryTitle: string;
  inquiryContent: string;
}

type InputStateTypes = 'normal' | 'warn';

const MyQnaEdit = () => {
  const [status, setStatus] = useState<InputStateTypes>('normal');
  const [titleValue, setTitleValue] = useState('');
  const [contentValue, setContentValue] = useState('');
  const [inquiryData, setInquiryData] = useState<InquiryDataTypes | null>(null);

  const navigate = useNavigate();

  const getEditInquiry = useGetEditInquiry();
  const { inquiryId } = useParams<{ inquiryId: string }>();
  const fetchData = useCallback(() => {
    const params = { inquiryId: Number(inquiryId) };

    getEditInquiry.mutate(params, {
      onSuccess: (data) => {
        if (!data) {
          alert('문의내역 조회에 실패했습니다.');
          return;
        }
        setInquiryData(data);
        setTitleValue(data.inquiryTitle);
        setContentValue(data.inquiryContent);
      },
      onError: () => {
        alert('문의내역 조회에 실패했습니다.');
      },
    });
  }, [getEditInquiry, inquiryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setTitleValue(inputValue);

    if (inputValue.length < 6) {
      setStatus('warn');
    } else {
      setStatus('normal');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentValue(e.target.value);
  };

  const updateMutation = useUpdateInquiry();

  const handleSubmit = () => {
    updateMutation.mutate(
      {
        inquiryId: Number(inquiryId),
        inquiryTitle: titleValue,
        inquiryContent: contentValue,
      },
      {
        onSuccess: () => {
          navigate(PATH.MYPAGE_QNA_DETAIL());
        },
        onError: () => {
          alert('문의수정에 실패했습니다.');
        },
      }
    );
  };

  const handleBtn = () => {
    navigate(PATH.MYPAGE_QNA_DETAIL());
  };

  return (
    <div css={wrapperStyle}>
      <div css={inputWrapperStyle}>
        <div css={titleStyle}>문의글 수정</div>
        <div>
          {inquiryData && (
            <>
              <div css={questionNameStyle}>
                <TextInput
                  value={titleValue}
                  status={status}
                  placeholder='제목을 입력해주세요.'
                  fullWidth
                  handleChange={handleChange}
                />
              </div>
              <div css={questionStyle}>
                <TextArea
                  value={contentValue}
                  placeholder='내용을 입력해주세요.'
                  fullWidth
                  handleChange={handleTextChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div css={buttonStyle}>
        <Button
          label='이전'
          handleClick={handleBtn}
          color='primaryOpacity10'
          size='md'
          shape='square'
          width={120}
          border
        />
        <Button
          label='수정완료'
          handleClick={handleSubmit}
          color='primary'
          size='md'
          shape='square'
          width={120}
        />
      </div>
    </div>
  );
};

export default MyQnaEdit;

const wrapperStyle = css`
  padding-top: 96px;
  padding-bottom: 227px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  box-sizing: border-box;
`;

const inputWrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const titleStyle = css`
  font-size: ${FONT_SIZE.TITLE_SM};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const questionNameStyle = css`
  margin-top: 32px;
`;

const questionStyle = css`
  margin-top: 40px;
`;

const buttonStyle = css`
  margin-top: 80px;
  display: flex;
  align-items: center;
  gap: 16px;
`;
