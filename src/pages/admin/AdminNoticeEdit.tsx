import { useState } from 'react';
import { css } from '@emotion/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import RadioButton from '@/components/RadioButton';
import TextArea from '@/components/TextArea';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

const options = [
  { label: '공개', value: 'unclosed' },
  { label: '비공개', value: 'closed' },
];

const AdminNoticeEdit = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isChecked, setIsChecked] = useState('closed');
  const navigate = useNavigate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 나중에 정확한 경로로 변경
  const handleGoList = () => {
    navigate(PATH.ADMIN_NOTICES);
  };

  const handleSubmit = () => {
    navigate(PATH.ADMIN_NOTICES);
  };

  return (
    <div css={noticesDetailWrapperStyle}>
      <div css={noticesDetailHeaderStyle}>
        <h1>공지 작성</h1>
      </div>
      <div css={inputStyle}>
        <TextInput
          value={title}
          placeholder='제목을 입력하세요'
          handleChange={handleTitleChange}
          fullWidth
        />
      </div>
      <div css={textAreaIconStyle}>
        <CropOriginalIcon />
        <AttachFileIcon />
      </div>
      <div>
        <TextArea
          value={content}
          placeholder='내용을 입력하세요'
          handleChange={handleContentChange}
          fullWidth
        />
      </div>
      <div css={noticesDetailMainStyle}>
        <div css={noticesFileStyle}>
          <div className='file-title'>
            <p>
              첨부파일 <span>2</span>개<span>(1.2MB)</span>
            </p>
            <p className='point'>
              *파일 1개당 최대 첨부용량 20MB, 전체 파일 최대 첨부용량 40MB
              게시판
            </p>
          </div>
          <div css={noticesFileDivStyle}>
            <div className='file-content'>
              <p>
                시스메틱 특약 변경 대비표1.pdf<span>(1.2MB)</span>
              </p>
              <CloseIcon css={iconStyle} />
            </div>
            <div className='file-content'>
              <p>
                시스메틱 특약 변경 대비표2.pdf<span>(1.2MB)</span>
              </p>
              <CloseIcon css={iconStyle} />
            </div>
          </div>
          <div css={radioBtnStyle}>
            <p>공개설정</p>
            <RadioButton
              name='agreeRadioBtn'
              options={options}
              selected={isChecked}
              handleChange={setIsChecked}
            />
          </div>
        </div>
      </div>

      <div css={btnStyle}>
        <Button
          label='이전'
          color='primaryOpacity10'
          shape='square'
          width={120}
          size='lg'
          handleClick={handleGoList}
          border
        />
        <Button
          label='게시물 등록'
          color='primary'
          shape='square'
          width={120}
          size='lg'
          handleClick={handleSubmit}
        />
      </div>
    </div>
  );
};

const noticesDetailWrapperStyle = css`
  display: flex;
  flex-direction: column;
  margin: 96px auto 96px;
  padding: 0 10px;
  max-width: 1200px;
`;

const noticesDetailHeaderStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 40px;

  h1 {
    font-size: ${FONT_SIZE.TITLE_SM};
    font-weight: ${FONT_WEIGHT.BOLD};
    letter-spacing: -0.48px;
  }

  p {
    line-height: 160%;
    letter-spacing: -0.32px;
  }
`;

const noticesDetailMainStyle = css`
  padding: 40px 0 24px;
`;

const noticesFileStyle = css`
  display: flex;
  flex-direction: column;
  gap: 14px;

  .file-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;

    p:first-child {
      font-weight: ${FONT_WEIGHT.BOLD};
    }

    span:last-child {
      margin-left: 8px;
      font-size: ${FONT_SIZE.TEXT_SM};
      color: ${COLOR_OPACITY.BLACK_OPACITY30};
    }
  }

  .point {
    color: ${COLOR.POINT};
    text-align: right;
  }
`;

const noticesFileDivStyle = css`
  border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 4px;
  padding: 8px 0;

  .file-content {
    display: flex;
    align-items: center;
    gap: 40px;
    height: 40px;
    padding: 0 8px;
    font-weight: ${FONT_WEIGHT.REGULAR};
    cursor: pointer;

    &:hover {
      background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
    }
    span {
      margin-left: 8px;
      font-size: ${FONT_SIZE.TEXT_SM};
      color: ${COLOR_OPACITY.BLACK_OPACITY30};
    }
  }
`;

const iconStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${COLOR.POINT};
  transform: translateY(-12%);
`;

const textAreaIconStyle = css`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 8px;
  padding-left: 16px;
  gap: 16px;
  font-size: 20px;

  svg {
    font-size: inherit;
  }
`;

const btnStyle = css`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  gap: 16px;
`;

const inputStyle = css`
  margin-bottom: 40px;
`;

const radioBtnStyle = css`
  display: flex;
  gap: 16px;
  margin-top: 12px;

  p {
    transform: translateY(32%);
    font-weight: ${FONT_WEIGHT.BOLD};
  }
`;
export default AdminNoticeEdit;
