import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import RadioButton from '@/components/RadioButton';
import TextArea from '@/components/TextArea';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useGetAdminNoticeEdit,
  useUpdateAdminNotice,
} from '@/hooks/useAdminApi';
import useModalStore from '@/stores/useModalStore';

const options = [
  { label: '공개', value: 'unclosed' },
  { label: '비공개', value: 'closed' },
];

const AdminNoticeEdit = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isChecked, setIsChecked] = useState('closed');
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [deleteFileIds, setDeleteFileIds] = useState<number[]>([]);
  const { noticeId } = useParams<{ noticeId: string }>();
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);

  const { data: noticeData, isError } = useGetAdminNoticeEdit(String(noticeId));

  useEffect(() => {
    if (noticeData && noticeData.data) {
      const { noticeTitle, noticeContent, isOpen, fileDtoList } =
        noticeData.data;
      setTitle(noticeTitle || '');
      setContent(noticeContent || '');
      setIsChecked(isOpen ? 'unclosed' : 'closed');
      setExistingFiles(fileDtoList || []);
    } else if (isError) {
      openModal('error-load');
    }
  }, [noticeData, isError, openModal]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleFileChange = ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (files) {
      setNewFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleFileRemove = (fileId: number) => {
    setDeleteFileIds((prev) => [...prev, fileId]);
    setExistingFiles((prev) => prev.filter((file) => file.fileId !== fileId));
  };

  const handleNewFileRemove = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGoList = () => {
    navigate(PATH.ADMIN_NOTICES);
  };

  const updateMutation = useUpdateAdminNotice();

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      openModal('error-input');
      return;
    }

    const formData = new FormData();

    const noticeModifyRequestDto = {
      noticeTitle: title,
      noticeContent: content,
      isOpen: isChecked === 'unclosed',
      deleteFileIdList: deleteFileIds,
      deleteImageIdList: deleteImageIds,
    };

    formData.append(
      'NoticeModifyRequestDto',
      JSON.stringify(noticeModifyRequestDto)
    );

    newFiles.forEach((file) => {
      formData.append('newFileList', file);
    });

    updateMutation.mutate(
      { formData, noticeId: String(noticeId) },
      {
        onSuccess: async () => {
          setDeleteFileIds([]);
          setDeleteImageIds([]);
          setNewFiles([]);
          navigate(PATH.ADMIN_NOTICES_DETAIL(String(noticeId)));
        },
      }
    );
  };

  return (
    <div css={noticesDetailWrapperStyle}>
      <div css={noticesDetailHeaderStyle}>
        <h1>공지 수정</h1>
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
          value={content}
          placeholder='내용을 입력하세요'
          handleChange={handleContentChange}
          fullWidth
        />
      </div>
      <div css={noticesDetailMainStyle}>
        <div css={noticesFileStyle}>
          <div className='file-title'>
            <p>첨부파일</p>
          </div>
          <div css={noticesFileDivStyle}>
            {existingFiles.map((file) => (
              <div key={file.fileId} className='file-content'>
                <p>
                  {file.originalName}
                  <span>({(file.fileSize / 1024).toFixed(2)} KB)</span>
                </p>
                <CloseIcon
                  css={iconStyle}
                  onClick={() => handleFileRemove(file.fileId)}
                />
              </div>
            ))}
            {newFiles.map((file, index) => (
              <div key={index} className='file-content'>
                <p>
                  {file.name}
                  <span>({(file.size / 1024).toFixed(2)} KB)</span>
                </p>
                <CloseIcon
                  css={iconStyle}
                  onClick={() => handleNewFileRemove(index)}
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
          label='수정완료'
          color='primary'
          shape='square'
          width={120}
          size='lg'
          handleClick={handleSubmit}
        />
      </div>

      <Modal
        id='error-load'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>
              공지사항 데이터를 불러오는 데 실패했습니다.
            </p>
          </div>
        }
      />
      <Modal
        id='error-input'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>제목과 내용을 입력하세요.</p>
          </div>
        }
      />
      <Modal
        id='error-submit'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>공지 수정에 실패했습니다.</p>
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

export default AdminNoticeEdit;
