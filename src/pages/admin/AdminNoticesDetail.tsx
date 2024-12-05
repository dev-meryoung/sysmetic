import { useState } from 'react';
import { css } from '@emotion/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Toggle from '@/components/Toggle';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

const AdminNoticesDetail = () => {
  const [toggleOn, setToggleOn] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setToggleOn(!toggleOn);
  };

  const handleGoList = () => {
    navigate(PATH.ADMIN_NOTICES);
  };
  return (
    <div css={noticesDetailWrapperStyle}>
      <div css={noticesDetailHeaderStyle}>
        <h1>공지관리</h1>
        <p>시스메틱에 등록된 공지사항을 관리, 수정, 삭제하는 페이지입니다.</p>
      </div>
      <div css={noticesDetailMainStyle}>
        <div css={noticesTitleStyle}>
          <h6>시스메틱 내 오늘의투자판이 출시됩니다!</h6>
          <div css={noticesStyle}>
            <div className='left-section'>
              <div>
                <span>작성일</span>
                <p>2024. 11. 28.</p>
              </div>
              <div>
                <span>수정일</span>
                <p>2024. 12. 04.</p>
              </div>
              <div>
                <span>작성자</span>
                <p>관리자작성용</p>
              </div>
              <div className='buttons'>
                <Button
                  width={40}
                  size='xxs'
                  shape='none'
                  label='수정'
                  color='primary'
                  handleClick={() => console.log('수정 클릭')}
                />
                <span>|</span>
                <Button
                  width={40}
                  size='xxs'
                  shape='none'
                  label='삭제'
                  color='primary'
                  handleClick={() => console.log('삭제 클릭')}
                />
              </div>
            </div>
            <div className='right-section'>
              <span className='toggle-text'>공개여부</span>
              <Toggle checked={toggleOn} handleChange={handleToggle} />
              <p className='hits'>
                조회수 <span>99</span>
              </p>
            </div>
          </div>
        </div>
        <div css={noticesContentStyle}>
          <p>공지내용</p>
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
              color='primary'
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
        <div css={goListBtnStyle}>
          <Button
            label='목록보기'
            color='black'
            shape='square'
            width={80}
            size='md'
            handleClick={handleGoList}
          />
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

const goListBtnStyle = css`
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  margin-top: 40px;
`;

export default AdminNoticesDetail;
