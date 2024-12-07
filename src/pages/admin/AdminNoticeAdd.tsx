import { useState } from 'react';
import { css } from '@emotion/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import RadioButton from '@/components/RadioButton';
import TextArea from '@/components/TextArea';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useCreateAdminNotice } from '@/hooks/useAdminApi';
import useModalStore from '@/stores/useModalStore';

interface FileDto {
  name: string;
  size: string;
  file: File;
}

const options = [
  { label: '공개', value: 'unclosed' },
  { label: '비공개', value: 'closed' },
];

const AdminNoticesAdd = () => {
  const { openModal } = useModalStore();
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [isChecked, setIsChecked] = useState('closed');
  const [attachedFiles, setAttachedFiles] = useState<FileDto[]>([]);
  const navigate = useNavigate();

  const createMutation = useCreateAdminNotice();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 100) {
      setNoticeTitle(e.target.value);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 1000) {
      setNoticeContent(e.target.value);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      const fileArray = Array.from(files).map((file) => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        file,
      }));

      setAttachedFiles((prev) => [...prev, ...fileArray]);
      event.target.value = '';
    }
  };

  const handleImageInsert = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files[0]) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setNoticeContent((prev) => `${prev}\n![image](${imageUrl})`);
      event.target.value = '';
    }
  };

  const handleFileRemove = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitBtn = () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      openModal('error-input');
      return;
    }

    const MAX_SINGLE_FILE_SIZE = 20 * 1024 * 1024;
    const MAX_TOTAL_FILE_SIZE = 40 * 1024 * 1024;

    const totalFileSize = attachedFiles.reduce(
      (total, file) => total + file.file.size,
      0
    );

    if (
      attachedFiles.some((file) => file.file.size > MAX_SINGLE_FILE_SIZE) ||
      totalFileSize > MAX_TOTAL_FILE_SIZE
    ) {
      openModal('file-size-error');
      return;
    }

    const formData = new FormData();

    const noticeModifyRequestDto = {
      noticeTitle,
      noticeContent,
      isOpen: isChecked === 'unclosed',
    };

    formData.append(
      'NoticeSaveRequestDto',
      JSON.stringify(noticeModifyRequestDto)
    );

    attachedFiles.forEach((fileDtoList) => {
      if (fileDtoList.file.type.startsWith('image/')) {
        formData.append('imageDtoList', fileDtoList.file);
      } else {
        formData.append('fileList', fileDtoList.file);
      }
    });

    createMutation.mutate(formData, {
      onSuccess: () => {
        navigate(PATH.ADMIN_NOTICES);
      },
      onError: (error) => {
        console.error('Submission error:', error);
        openModal('error-submit');
      },
    });
  };

  const renderContent = (content: string) => {
    const imageRegex = /!\[image]\((.+)\)/g;
    const images = [...content.matchAll(imageRegex)];

    return images.map((match, index) => {
      const imageUrl = match[1];
      return <img key={index} src={imageUrl} alt='Uploaded' css={imageStyle} />;
    });
  };

  const imageStyle = css`
    max-width: 150px;
    max-height: 100px;
    height: auto;
    margin: 8px 0;
    object-fit: cover;
    border: 1px solid ${COLOR.GRAY100};
  `;

  const handleGoList = () => {
    navigate(PATH.ADMIN_NOTICES);
  };

  return (
    <div css={noticesDetailWrapperStyle}>
      <div css={noticesDetailHeaderStyle}>
        <h1>공지 작성</h1>
      </div>
      <div css={inputStyle}>
        <TextInput
          value={noticeTitle}
          placeholder='제목을 입력하세요'
          handleChange={handleTitleChange}
          fullWidth
        />
      </div>
      <div css={textAreaIconStyle}>
        <label>
          <ImageIcon />
          <input
            type='file'
            accept='image/*'
            onChange={handleImageInsert}
            style={{ display: 'none' }}
          />
        </label>
        <label>
          <AttachFileIcon />
          <input
            type='file'
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
      </div>
      <div>
        <TextArea
          value={noticeContent}
          placeholder='내용을 입력하세요'
          handleChange={handleContentChange}
          fullWidth
        />
        <div css={noticesContentStyle}>{renderContent(noticeContent)}</div>
      </div>
      <div css={noticesDetailMainStyle}>
        <div css={noticesFileStyle}>
          <div className='file-title'>
            <p>
              첨부파일 <span>{attachedFiles.length}</span>개
            </p>
            <p className='point'>
              *파일 1개당 최대 첨부용량 20MB, 전체 파일 최대 첨부용량 40MB
            </p>
          </div>
          <div css={noticesFileDivStyle}>
            {attachedFiles.map((file, index) => (
              <div key={index} className='file-content'>
                <p>
                  {file.name}
                  <span>({file.size})</span>
                </p>
                <CloseIcon
                  css={iconStyle}
                  onClick={() => handleFileRemove(index)}
                />
              </div>
            ))}
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
          label='게시글 등록'
          color='primary'
          shape='square'
          width={120}
          size='lg'
          handleClick={handleSubmitBtn}
        />
      </div>
      <Modal
        id='error-input'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>제목, 내용을 입력하세요.</p>
          </div>
        }
      />
      <Modal
        id='error-submit'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>공지 등록에 실패했습니다.</p>
          </div>
        }
      />
      <Modal
        id='file-size-error'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>최대 파일 용량에 맞춰 업로드해주세요.</p>
          </div>
        }
      />
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

const noticesContentStyle = css`
  padding-top: 16px;
  white-space: pre-line;
`;

const noticesDetailMainStyle = css`
  padding-top: 16px;
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

export default AdminNoticesAdd;
