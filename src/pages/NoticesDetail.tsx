import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useGetNoticeDetail } from '@/hooks/useCommonApi';

interface FileDto {
  name: string;
  url: string;
  size: string;
}

interface NoticesDataProps {
  noticeId?: string;
  noticeTitle?: string;
  writeDate?: string;
  noticeContent?: string;
  previousTitle?: string;
  previousWriteDate?: string;
  nextTitle?: string;
  nextWriteDate?: string;
  previousId?: string;
  nextId?: string;
  fileDtoList?: FileDto[];
}
const NoticesDetail = () => {
  const { noticeId: paramNoticeId } = useParams<{ noticeId: string }>();
  const noticeId = paramNoticeId ? Number(paramNoticeId) : 0;
  const [data, setData] = useState<NoticesDataProps>({ fileDtoList: [] });
  const params = { noticeId: String(noticeId) };
  const getNoticeMutation = useGetNoticeDetail(params);
  const navigate = useNavigate();

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
    }
  }, [getNoticeMutation.data]);

  const downloadFile = async (url: string, fileName: string) => {
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
    } catch (error) {
      console.error('다운로드 실패:', error);
    }
  };

  const downloadAllFiles = () => {
    if (!data.fileDtoList || data.fileDtoList.length === 0) {
      alert('다운로드할 파일이 없습니다.');
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
    navigate(PATH.NOTICES);
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
        <h1>공지사항</h1>
        <p>시스메틱 서비스의 신규 및 업데이트 소식을 알려드립니다.</p>
      </div>
      <div css={noticesDetailMainStyle}>
        <div css={noticesTitleStyle}>
          <h6>{data.noticeTitle}</h6>
          <div>
            <p>작성일</p>
            <p>{formatDate(data.writeDate)}</p>
          </div>
        </div>
        <div css={noticesContentStyle}>
          <p>{data.noticeContent}</p>
        </div>
        {data.fileDtoList && data.fileDtoList.length > 0 && (
          <div css={noticesFileStyle}>
            <div className='file-title' css={fileTitleStyle}>
              <div className='file-title-info'>
                <AttachFileIcon css={iconStyle} />
                <p>
                  첨부파일 <span>{data.fileDtoList.length}</span>개
                </p>
                <div>
                  <Button
                    label='모두저장'
                    shape='none'
                    size='xs'
                    handleClick={downloadAllFiles}
                  />
                </div>
              </div>
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
                <Link to={`/notices/${data.previousId}`} css={linkStyle}>
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
                <Link to={`/notices/${data.nextId}`} css={linkStyle}>
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
    </div>
  );
};

export default NoticesDetail;

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
`;

const noticesFileStyle = css`
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-weight: ${FONT_WEIGHT.BOLD};
  padding: 0 28px;
`;

const fileTitleStyle = css`
  font-weight: ${FONT_WEIGHT.BOLD};

  .file-title-info {
    display: flex;
    margin: 0;
    text-align: center;
    align-items: center;

    p,
    span {
      display: inline;
      margin: 0;
    }

    p {
      width: 100px;
    }
  }
`;

const iconStyle = css`
  font-size: 24px;
  transform: translateY(-12.5%);
`;

const noticesFileDivStyle = css`
  border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 4px;
  padding: 8px 0;

  .file-content {
    display: flex;
    align-items: center;
    gap: 16px;
    height: 40px;
    padding: 0 8px;
    font-weight: ${FONT_WEIGHT.REGULAR};

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

const linkStyle = css`
  text-decoration: none;
  color: inherit;
  margin-right: 400px;
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

const buttonWrapperStyle = css`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;
