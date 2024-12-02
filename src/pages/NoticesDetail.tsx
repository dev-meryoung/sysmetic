import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Button from '@/components/Button';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

const NoticesDetail = () => {
  const a = 1;

  return (
    <div css={noticesDetailWrapperStyle}>
      <div css={noticesDetailHeaderStyle}>
        <h1>공지사항</h1>
        <p>시스메틱 서비스의 신규 및 업데이트 소식을 알려드립니다.</p>
      </div>
      <div css={noticesDetailMainStyle}>
        <div css={noticesTitleStyle}>
          <h6>시스메틱 내 오늘의투자판이 출시됩니다!</h6>
          <div>
            <p>작성일</p>
            <p>2024. 11. 28.</p>
          </div>
        </div>
        <div css={noticesContentStyle}>
          <p>공지내용 공지내용</p>
        </div>
        <div css={noticesFileStyle}>
          <div className='file-title'>
            <AttachFileIcon css={iconStyle} />
            <p>
              첨부파일 <span>2</span>개
            </p>
            <Button
              width={72}
              size='xxs'
              shape='none'
              label='모두 저장'
              handleClick={() => console.log('click')}
            />
          </div>
          <div css={noticesFileDivStyle}>
            <div className='file-content'>
              <p>
                시스메틱 특약 변경 대비표1.pdf<span>(1.2MB)</span>
              </p>
              <FileDownloadOutlinedIcon css={iconStyle} />
            </div>
            <div className='file-content'>
              <p>
                시스메틱 특약 변경 대비표2.pdf<span>(1.2MB)</span>
              </p>
              <FileDownloadOutlinedIcon css={iconStyle} />
            </div>
          </div>
        </div>
      </div>
      <div css={noticesDetailNavStyle}>
        <div className='page-nav'>
          <div>
            <p>이전</p>
            <p>이전 공지사항</p>
          </div>
          <p>2024. 11. 11.</p>
        </div>
        <div className='page-nav'>
          <div>
            <p>다음</p>
            <p>다음 공지사항</p>
          </div>
          <p>2024. 12. 1.</p>
        </div>
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
  min-height: 120px;
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
  }
`;

const noticesDetailNavStyle = css`
  border-top: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

  .page-nav {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

    p {
      &:last-of-type {
        width: 100px;
      }
    }
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

export default NoticesDetail;
