import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import Toggle from '@/components/Toggle';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useGetAdminNotice, useDeleteAdminNotice } from '@/hooks/useAdminApi';
import useModalStore from '@/stores/useModalStore';

interface FileDto {
  name: string;
  url: string;
  size: string;
}

interface NoticesDataProps {
  noticeId?: string;
  noticeTitle?: string;
  writeDate?: string;
  correctDate?: string;
  writerNickname?: string;
  hits?: number;
  fileExist?: boolean;
  imageExist?: boolean;
  isOpen?: boolean;
  noticeContent?: string;
  previousTitle?: string;
  previousWriteDate?: string;
  nextTitle?: string;
  nextWriteDate?: string;
  previousId?: string;
  nextId?: string;
  fileDtoList?: FileDto[];
}

const AdminNoticesDetail = () => {
  const [toggleOn, setToggleOn] = useState(false);
  const navigate = useNavigate();
  const { openModal, closeModal } = useModalStore();
  const { noticeId: paramNoticeId } = useParams<{ noticeId: string }>();
  const noticeId = paramNoticeId ? Number(paramNoticeId) : 0;
  const [data, setData] = useState<NoticesDataProps>({ fileDtoList: [] });
  const params = { noticeId: String(noticeId) };
  const getNoticeMutation = useGetAdminNotice(params);

  useEffect(() => {
    if (getNoticeMutation.data?.data) {
      const fileDtoList =
        getNoticeMutation.data.data.fileDtoList?.map((file: any) => ({
          name: file.originalName || '알 수 없는 파일',
          url: file.path || '',
          size: `${file.fileSize || 0} KB`,
        })) || [];

      setData({
        ...getNoticeMutation.data.data,
        fileDtoList,
      });

      if (getNoticeMutation.data.data.isOpen !== undefined) {
        setToggleOn(getNoticeMutation.data.data.isOpen);
      }
    }
  }, [getNoticeMutation.data]);

  const downloadFile = async (url: string, fileName: string) => {
    if (!url || !fileName) return;

    try {
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
        throw new Error('파일을 다운로드할 수 없습니다.');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      openModal('error');
    }
  };

  const downloadAllFiles = () => {
    if (!data.fileDtoList || data.fileDtoList.length === 0) {
      return;
    }
    data.fileDtoList.forEach((file) => {
      if (file.url) {
        downloadFile(file.url, file.name);
      }
    });
  };

  const formatDate = (isoDate: string | undefined): string =>
    isoDate
      ? new Date(isoDate).toISOString().split('T')[0].replace(/-/g, '.')
      : '';

  const handleGoList = () => {
    navigate(PATH.ADMIN_NOTICES);
  };

  const handleEdit = () => {
    navigate(PATH.ADMIN_NOTICES_EDIT(String(noticeId)));
  };

  const deleteMutation = useDeleteAdminNotice();
  const handleDelete = () => {
    openModal('delete-confirm');
  };

  if (!data) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div css={noticesDetailWrapperStyle}>
      <div css={noticesDetailHeaderStyle}>
        <h1>공지관리</h1>
        <p>시스메틱에 등록된 공지사항을 관리, 수정, 삭제하는 페이지입니다.</p>
      </div>
      <div css={noticesDetailMainStyle}>
        <div css={noticesTitleStyle}>
          <h6>{data.noticeTitle}</h6>
          <div css={noticesStyle}>
            <div className='left-section'>
              <div>
                <span>작성일</span>
                <p>{formatDate(data.writeDate)}</p>
              </div>
              <div>
                <span>수정일</span>
                <p>{formatDate(data.correctDate)}</p>
              </div>
              <div>
                <span>작성자</span>
                <p>{data.writerNickname}</p>
              </div>
              <div className='buttons'>
                <Button
                  width={40}
                  size='xxs'
                  shape='none'
                  label='수정'
                  color='primary'
                  handleClick={handleEdit}
                />
                <span>|</span>
                <Button
                  width={40}
                  size='xxs'
                  shape='none'
                  label='삭제'
                  color='primary'
                  handleClick={handleDelete}
                />
              </div>
            </div>
            <div className='right-section'>
              <span className='toggle-text'>공개여부</span>
              <Toggle checked={toggleOn} handleChange={() => {}} />
              <p className='hits'>
                조회수 <span>{data.hits}</span>
              </p>
            </div>
          </div>
        </div>
        <div css={noticesContentStyle}>
          {data.noticeContent?.split('\n').map((line, index) => {
            const imageRegex = /!\[image]\((.+)\)/;
            const match = line.match(imageRegex);

            if (match) {
              const imageUrl = match[1];
              return (
                <img
                  key={index}
                  src={imageUrl}
                  alt='Uploaded Image'
                  css={css`
                    max-width: 100%;
                    height: auto;
                    margin: 8px 0;
                  `}
                />
              );
            }

            return (
              <span key={index}>
                {line}
                <br />
              </span>
            );
          })}
        </div>

        {data.fileDtoList && data.fileDtoList.length > 0 && (
          <div css={noticesFileStyle}>
            <div className='file-title'>
              <AttachFileIcon css={iconStyle} />
              <p>
                첨부파일 <span>{data.fileDtoList?.length || 0}</span>개
              </p>
              <Button
                width={72}
                size='xxs'
                shape='none'
                label='모두 저장'
                color='primary'
                handleClick={downloadAllFiles}
              />
            </div>

            <div css={noticesFileDivStyle}>
              {data.fileDtoList.map((file, index) => (
                <div key={index} className='file-content'>
                  <p>
                    {file.name}
                    <span>({file.size})</span>
                  </p>
                  <FileDownloadOutlinedIcon
                    css={iconStyle}
                    onClick={() =>
                      downloadFile(file.url, file.name || 'default-file-name')
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div css={noticesDetailNavStyle}>
        {data.previousTitle && (
          <div className='page-nav'>
            <div>
              <p>이전</p>
              <span>
                <Link to={`/admin/notices/${data.previousId}`} css={linkStyle}>
                  {data.previousTitle}
                </Link>
              </span>
            </div>
            <p>{formatDate(data.previousWriteDate)}</p>
          </div>
        )}
        {data.nextTitle && (
          <div className='page-nav'>
            <div>
              <p>다음</p>
              <p>
                <Link to={`/admin/notices/${data.nextId}`} css={linkStyle}>
                  {data.nextTitle}
                </Link>
              </p>
            </div>
            <p>{formatDate(data.nextWriteDate)}</p>
          </div>
        )}
      </div>
      <div css={buttonWrapperStyle}>
        <Button
          label='목록보기'
          size='md'
          width={80}
          color='black'
          handleClick={handleGoList}
        />
      </div>

      <Modal
        id='delete-confirm'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>공지를 삭제하시겠습니까?</p>
            <div css={modalButtonWrapperStyle}>
              <Button
                label='아니오'
                handleClick={() => closeModal('delete-confirm')}
                color='primaryOpacity10'
                border
              />
              <Button
                label='예'
                handleClick={() => {
                  closeModal('delete-confirm');
                  deleteMutation.mutate(String(noticeId), {
                    onSuccess: () => {
                      navigate(PATH.ADMIN_NOTICES);
                    },
                    onError: () => {
                      openModal('error-delete');
                    },
                  });
                }}
                color='primary'
              />
            </div>
          </div>
        }
      />

      <Modal
        id='error-delete'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>공지를 삭제할 수 없습니다.</p>
          </div>
        }
      />
      <Modal
        id='error'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>실패하였습니다.</p>
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
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};

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

const noticesTitleStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  background-color: ${COLOR.GRAY100};
  height: 120px;
  padding: 0 28px;
  div {
    display: flex;
    gap: 8px;

    p {
      font-size: ${FONT_SIZE.TEXT_SM};
    }
  }
`;
const noticesContentStyle = css`
  padding: 24px 24px 64px;
  min-height: 280px;
  white-space: pre-line;
  word-break: break-word;
`;
const noticesFileStyle = css`
  display: flex;
  flex-direction: column;
  gap: 14px;

  font-weight: ${FONT_WEIGHT.BOLD};
  padding: 0 28px;

  .file-title {
    display: flex;
    align-items: center;
    gap: 4px;
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
      font-size: ${FONT_SIZE.TEXT_SM};
      color: ${COLOR_OPACITY.BLACK_OPACITY30};
    }
    svg {
      cursor: pointer;
    }
  }
`;

const noticesDetailNavStyle = css`
  border-top: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

  .page-nav {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

    div {
      display: flex;
      gap: 40px;

      p {
        &:nth-of-type(1) {
          font-weight: ${FONT_WEIGHT.BOLD};
        }
      }
    }
  }
`;

const iconStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transform: translateY(-12.5%);
`;

const noticesStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left-section {
    display: flex;
    align-items: center;
    gap: 32px;

    div {
      display: flex;
      align-items: center;
      gap: 8px;

      span {
        line-height: 1.4;
      }

      p {
        font-size: ${FONT_SIZE.TEXT_SM};
        line-height: 1.6;
      }
    }

    .buttons {
      display: flex;
      align-items: center;

      button {
        transform: none;
      }

      span {
        color: ${COLOR.GRAY200};
      }
    }
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    transform: translateY(-100%);

    .toggle-text {
      font-size: ${FONT_SIZE.TEXT_SM};
      font-weight: ${FONT_WEIGHT.REGULAR};
      color: ${COLOR.TEXT_BLACK};
    }

    .hits {
      margin-left: 24px;
    }
  }
`;

const linkStyle = css`
  text-decoration: none;
  color: inherit;
  margin-right: 400px;
`;

const buttonWrapperStyle = css`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

const modalButtonWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
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
  font-size: ${FONT_SIZE.TEXT_MD};
  text-align: center;
  margin-top: 32px;
  margin-bottom: 24px;
`;

export default AdminNoticesDetail;
