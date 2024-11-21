import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import tempImage from '@/assets/images/test-profile.png';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import SelectBox from '@/components/SelectBox';
import TextArea from '@/components/TextArea';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

const StrategyAdd = () => {
  const navigate = useNavigate();

  const conditionalRender = {
    none: (
      <div css={infoBoxStyle}>
        <img className='add-image' src={tempImage} alt='add' />
        <div className='text-box'>
          <h6>트레이더가 되시면 투자전략을 등록하고 공유할 수 있습니다.</h6>
          <span>
            시스메틱에서 당신의 투자전략을 공유하시면
            <br />
            전문가들의 투자전략 데이터 분석 서비스를 제공해 드립니다.
          </span>
        </div>
        <div className='button-box'>
          <Button
            label='메인가기'
            border={true}
            width={120}
            fontWeight={500}
            handleClick={() => navigate(PATH.ROOT)}
          />
          <Button
            label='트레이더 가입'
            width={120}
            handleClick={() => navigate(PATH.SIGN_UP)}
          />
        </div>
      </div>
    ),
    trader: (
      <div css={addContentBoxStyle}>
        <div className='form-box'>
          <div className='form-item'>
            <span>전략명</span>
            <TextInput value='' handleChange={() => {}} width={700} />
          </div>
          <div className='form-item'>
            <span>매매방식</span>
            <SelectBox
              placeholder='매매방식 선택'
              options={[]}
              handleChange={() => {}}
            />
          </div>
          <div className='form-item'>
            <span>주기</span>{' '}
            <SelectBox
              placeholder='주기 선택'
              options={[
                { label: '데이', value: 'day' },
                { label: '포지션', value: 'position' },
              ]}
              handleChange={() => {}}
            />
          </div>
          <div className='form-item'>
            <span>운용 종목</span>
            <Checkbox
              checked={true}
              handleChange={() => {}}
              label='해외 주식'
            />
            <Checkbox
              checked={true}
              handleChange={() => {}}
              label='해외 주식'
            />
            <Checkbox
              checked={true}
              handleChange={() => {}}
              label='해외 주식'
            />
            <Checkbox
              checked={true}
              handleChange={() => {}}
              label='해외 주식'
            />
          </div>
          <div className='form-item form-item-top'>
            <span>
              전략소개
              <br />
              <span className='explain-text'>(500자내외)</span>
            </span>
            <TextArea value='' handleChange={() => {}} />
          </div>
          <div className='form-item form-item-last'>
            <span>제안서</span>
            <div className='file-box'>
              <TextInput value='제안서.pdf' handleChange={() => {}} />
              <Button label='찾아보기' handleClick={() => {}} width={80} />
            </div>
          </div>
        </div>
        <div className='button-box'>
          <Button
            label='이전'
            handleClick={() => {}}
            border={true}
            width={120}
          />
          <Button label='전략등록' handleClick={() => {}} width={120} />
        </div>
      </div>
    ),
  };

  return (
    <div css={wrapperStyle}>
      <div css={titleBoxStyle}>
        <h5>전략등록</h5>
        <span>
          시스메틱에서 투자전략을 등록하고 공유해보세요.
          <br />
          트레이더라면 투자자들이 당신의 전략에 투자할 수 있습니다.
        </span>
      </div>
      {conditionalRender.none}
    </div>
  );
};
const wrapperStyle = css`
  max-width: 1200px;
  height: 100%;
  padding: 0 10px;
  margin: 0 auto;

  span {
    line-height: 24px;
  }
`;

const titleBoxStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 96px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};
`;

const infoBoxStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;

  .add-image {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
    margin-top: 56px;
  }

  .text-box {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 40px 0 72px 0;
  }

  .button-box {
    display: flex;
    gap: 16px;
    padding-bottom: 360px;
  }
`;

const addContentBoxStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .form-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 24px;
    margin-bottom: 80px;
    border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
    border-radius: 4px;

    .form-item {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

      span {
        width: 84px;
        font-weight: ${FONT_WEIGHT.BOLD};

        .explain-text {
          font-size: ${FONT_SIZE.TEXT_SM};
          font-weight: ${FONT_WEIGHT.REGULAR};
        }
      }

      .file-box {
        display: flex;
        gap: 16px;
      }
    }

    .form-item-top {
      align-items: flex-start;
    }

    .form-item-last {
      border: 0;
    }
  }

  .button-box {
    display: flex;
    gap: 16px;
    padding-bottom: 168px;
  }
`;

export default StrategyAdd;
