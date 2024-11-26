import { css } from '@emotion/react';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ProfileImageTest from '@/assets/images/test-profile.png';
import TagTest from '@/assets/images/test-tag.jpg';
import Button from '@/components/Button';
import ProfileImage from '@/components/ProfileImage';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

const QnaDetail = () => {
  const navigate = useNavigate();

  const handleEditBtn = () => {
    navigate(PATH.MYPAGE_QNA_EDIT());
  };

  const handleAnswerBtn = () => {
    navigate(PATH.MYPAGE_QNA_ANSWER());
  };

  const handleDeleteBtn = () => {};

  const handleGoListBtn = () => {
    navigate(PATH.MYPAGE_QNA());
  };

  return (
    <div css={wrapperStyle}>
      <div className='question-section' css={titleWrapperStyle}>
        <span css={titleStyle}>
          미국발 경제악화가 한국 증시에 미치는 영향은 뭘까?
        </span>
        <span css={statusStyle}>답변대기</span>
        <div css={infoStyle}>
          <div css={dateAndButtonsStyle}>
            <div css={dateStyle}>
              <span>작성일</span>
              <span>2024.11.18</span>
            </div>
            <div css={buttonStyle}>
              <Button
                label='수정'
                handleClick={handleEditBtn}
                color='primary'
                size='xs'
                shape='none'
              />
              <span css={dividerStyle}>|</span>
              <Button
                label='삭제'
                handleClick={handleDeleteBtn}
                color='primary'
                size='xs'
                shape='none'
              />
              {/* 임시버튼 나중에 삭제 */}
              <span css={dividerStyle}>|</span>
              <Button
                label='답변'
                handleClick={handleAnswerBtn}
                color='primary'
                size='xs'
                shape='none'
              />
            </div>
          </div>
        </div>
      </div>

      <div css={strategyWrapperStyle}>
        <div css={tagsAndTitleStyle}>
          <div css={tagStyle}>
            <Tag src={TagTest} alt='tag' />
          </div>
          <div css={strategyTextStyle}>해당 전략명</div>
        </div>
        <div css={profileStyle}>
          <ProfileImage src={ProfileImageTest} alt='profileImg' size='md' />
          <span css={nicknameStyle}>닉네임</span>
        </div>
      </div>

      <div css={inputStyle}>뭔가요?</div>

      <div className='comment-section' css={titleWrapperStyle}>
        <div css={titleStyle}>
          <SubdirectoryArrowRightIcon css={commentIconStyle} />
          RE: 미국발 경제악화가 한국 증시에 미치는 영향은 뭘까?
        </div>
        <div css={infoStyle}>
          <div css={dateStyle}>
            <span>작성일</span>
            <span>2024.11.18</span>
          </div>
          <div css={profileStyle}>
            <ProfileImage src={ProfileImageTest} alt='profileImg' size='md' />
            <span css={nicknameStyle}>닉네임</span>
          </div>
        </div>
      </div>

      <div css={inputStyle}>모르겠습니다.</div>

      <div css={listWrapperStyle}>
        <div css={listItemStyle}>
          <span css={stepperStyle}>이전</span>
          <Link to='' css={listItemTilteStyle}>
            12월 이벤트 개최
          </Link>
          <span css={listItemDateStyle}>2024.11.17</span>
        </div>
        <div css={listItemStyle}>
          <span css={stepperStyle}>다음</span>
          <Link to='' css={listItemTilteStyle}>
            홈페이지 개선사항 안내
          </Link>
          <span css={listItemDateStyle}>2024.11.19</span>
        </div>
      </div>

      <div css={goListBtnStyle}>
        <Button
          label='목록보기'
          handleClick={handleGoListBtn}
          color='black'
          size='md'
          width={80}
          shape='square'
        />
      </div>
    </div>
  );
};

export default QnaDetail;

const wrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 181px;
`;

const titleWrapperStyle = css`
  width: 100%;
  padding: 16px;
  background-color: ${COLOR.GRAY100};
  position: relative;
`;

const titleStyle = css`
  font-size: ${FONT_SIZE.TITLE_XS};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const statusStyle = css`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const infoStyle = css`
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const dateAndButtonsStyle = css`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const dateStyle = css`
  display: flex;
  gap: 8px;
`;

const buttonStyle = css`
  display: flex;
  align-items: center;
`;

const dividerStyle = css`
  display: flex;
  align-items: center;
  color: ${COLOR.GRAY200};
`;

const strategyWrapperStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 24px;
  width: 1132px;
  border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 4px;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
  margin-top: 24px;
`;

const tagsAndTitleStyle = css`
  display: flex;
  flex-direction: column;
`;

const tagStyle = css`
  display: flex;
  gap: 8px;
`;

const strategyTextStyle = css`
  margin-top: 16px;
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.REGULAR};
`;

const profileStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const nicknameStyle = css`
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const inputStyle = css`
  margin-top: 32px;
  padding: 20px 36px;
  width: 100%;
  min-height: 300px;
`;

const listWrapperStyle = css`
  width: 100%;
  margin-top: 16px;
`;

const listItemStyle = css`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 24px;
  border-top: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  &:last-child {
    border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  }
`;

const stepperStyle = css`
  flex: 1;
  text-align: center;
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const listItemTilteStyle = css`
  flex: 8;
  margin-left: 16px;
  text-decoration: none;
  color: ${COLOR.TEXT_BLACK};
`;

const listItemDateStyle = css`
  flex: 1;
  text-align: center;
`;

const goListBtnStyle = css`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 24px;
`;

const commentIconStyle = css`
  width: 24px;
  height: 24px;
  color: ${COLOR.POINT};
  position: relative;
  transform: translateY(-10%);
  vertical-align: middle;
  margin-right: 8px;
`;
