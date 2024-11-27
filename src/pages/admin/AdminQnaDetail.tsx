import { css } from '@emotion/react';
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined';
import TagTest from '@/assets/images/test-tag.jpg';
import Button from '@/components/Button';
import ProfileImage from '@/components/ProfileImage';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

const AdminQnaDetail = () => (
  <div css={adminQnaWrapperStyle}>
    <div css={adminQnaHeaderStyle}>
      <h5>문의 상세내용</h5>
      <p>
        시스메틱 투자자가 트레이더에게 문의한 내용과 답변 내용을 확인하고 관리할
        수 있는 페이지입니다.
      </p>
    </div>
    <div css={adminQDivStyle}>
      <div css={adminQTitleStyle}>
        <h6>미국발 경제악화가 한국 증시에 미치는 영향은 무엇인가요?</h6>
        <div className='info'>
          <div>
            <p>작성일</p>
            <p>2024. 11. 28.</p>
          </div>
          <div>
            <p>작성자</p>
            <p>주식초보123</p>
          </div>
          <Button
            width={25}
            shape='none'
            size='xxs'
            label='삭제'
            handleClick={() => console.log('click')}
          />
        </div>
      </div>
      <div css={adminQStrategyStyle}>
        <div className='strategyName'>
          <Tag src={TagTest} />
          <p>따라하면 너도나도 부자되는 전략</p>
        </div>
        <div className='profile'>
          <ProfileImage />
          <p>트레이더123</p>
        </div>
      </div>
      <div css={adminQContentStyle}>
        <p>미국발 경제악화가 한국 증시에 미치는 영향이 뭔가요?</p>
      </div>
      <div css={adminATitleStyle}>
        <div className='answer'>
          <div className='title'>
            <SubdirectoryArrowRightOutlinedIcon css={iconStyle} />
            <h6>답변 드립니다.</h6>
          </div>
          <div className='info'>
            <p>작성일</p>
            <p>2024. 11. 28.</p>
          </div>
        </div>
        <div className='profile'>
          <ProfileImage />
          <p>트레이더123</p>
        </div>
      </div>
      <div css={adminQContentStyle}>
        <p>
          안녕하세요 트레이더 트레이더123입니다. <br />
          말씀드리기 어렵습니다 ㅈㅅㅈㅅ ㅋㅋ <br />
          감사합니다 땡큐
        </p>
      </div>
    </div>
    <div css={adminQnaNavStyle}>
      <div className='back-qna'>
        <div>
          <p>이전</p>
          <p>시스메틱 12월에도 놀러와 이벤트에 오신 것을 환영합니다.</p>
        </div>
        <p>2024. 11. 30</p>
      </div>
      <div className='next-qna'>
        <div>
          <p>다음</p>
          <p>변경 내용에 대해 다시 알려드립니다.</p>
        </div>
        <p>2024. 11. 25</p>
      </div>
    </div>
    <div css={buttonStyle}>
      <Button
        width={80}
        color='textBlack'
        label='목록보기'
        handleClick={() => console.log('목록보기')}
      />
    </div>
  </div>
);

const adminQnaWrapperStyle = css`
  display: flex;
  flex-direction: column;
  margin: 96px auto 96px;
  padding: 0 10px;
  max-width: 1200px;
`;

const adminQnaHeaderStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 40px;
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};

  h5 {
    letter-spacing: -0.48px;
  }
`;

const adminQDivStyle = css`
  padding-top: 40px;
`;
const adminQTitleStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 120px;
  background-color: ${COLOR.GRAY100};
  padding: 32px 24px;

  .info {
    display: flex;
    align-items: center;
    gap: 32px;

    div {
      display: flex;
      gap: 8px;
    }

    button {
      padding: 0;
    }
  }
`;

const adminQStrategyStyle = css`
  display: flex;
  justify-content: space-between;
  margin: 24px;
  padding: 32px 24px;

  border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 4px;

  .strategyName {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .profile {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

const adminQContentStyle = css`
  margin: 20px 24px;
  line-height: 160%;
  height: 320px;
  overflow: auto;
`;

const adminATitleStyle = css`
  display: flex;
  justify-content: space-between;
  height: 120px;
  background-color: ${COLOR.GRAY100};
  padding: 32px 24px;

  .answer {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .info {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .profile {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

const iconStyle = css`
  font-size: ${FONT_SIZE.TITLE_SM};
  color: ${COLOR.POINT};
`;

const adminQnaNavStyle = css`
  display: flex;
  flex-direction: column;
  height: 128px;
  border-top: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

  .back-qna {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    height: 64px;
    border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

    div {
      display: flex;
      gap: 40px;
      width: 1040px;

      p {
        &:nth-of-type(1) {
          font-weight: ${FONT_WEIGHT.BOLD};
        }
      }
    }
  }

  .next-qna {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    height: 64px;
    border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

    div {
      display: flex;
      gap: 40px;
      width: 1040px;

      p {
        &:nth-of-type(1) {
          font-weight: ${FONT_WEIGHT.BOLD};
        }
      }
    }
  }
`;

const buttonStyle = css`
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
`;

export default AdminQnaDetail;
