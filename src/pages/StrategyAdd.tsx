import { css } from '@emotion/react';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import addInfoImage from '@/assets/images/strategy-add-page.png';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Modal from '@/components/Modal';
import SelectBox from '@/components/SelectBox';
import TextArea from '@/components/TextArea';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import useStrategyAdd from '@/hooks/useStrategyAdd';

const StrategyAdd = () => {
  const {
    methodOptions,
    stockOptions,
    title,
    setTitle,
    setMethod,
    setCycle,
    stocks,
    content,
    setContent,
    file,
    fileInputRef,
    submitErrorData,
    noticeMessage,
    handleCheckboxChange,
    handleBrowseClick,
    handleFileChange,
    handleFileDelete,
    handleSubmitButton,
    roleCode,
  } = useStrategyAdd();

  const navigate = useNavigate();

  const CYCLE_OPTIONS = [
    { label: '데이', value: 'D' },
    { label: '포지션', value: 'P' },
  ];

  const conditionalRender = {
    trader: (
      <div css={addContentBoxStyle}>
        <div className='form-box'>
          <div className='form-item'>
            <span>전략명</span>
            <TextInput
              value={title}
              handleChange={(e) => setTitle(e.target.value)}
              width={700}
              maxLength={30}
            />
          </div>
          <div className='form-item'>
            <span>매매방식</span>
            <SelectBox
              placeholder='매매방식 선택'
              options={methodOptions}
              handleChange={setMethod}
            />
          </div>
          <div className='form-item'>
            <span>주기</span>
            <SelectBox
              placeholder='주기 선택'
              options={CYCLE_OPTIONS}
              handleChange={setCycle}
            />
          </div>
          <div className='form-item'>
            <span>운용 종목</span>
            {stockOptions.map((option: { label: string; value: string }) => (
              <Checkbox
                key={option.value}
                checked={stocks.includes(option.value)}
                label={option.label}
                handleChange={() => handleCheckboxChange(option.value)}
              />
            ))}
          </div>
          <div className='form-item form-item-top'>
            <span>
              전략소개
              <br />
              <span className='explain-text'>(500자내외)</span>
            </span>
            <TextArea
              value={content}
              handleChange={(e) => setContent(e.target.value)}
              maxLength={500}
            />
          </div>
          <div className='form-item form-item-last'>
            <span>제안서</span>
            <div className='file-box'>
              <div>
                <TextInput
                  value={file ? file.name : ''}
                  iconNum='single'
                  handleChange={() => {}}
                  disabled={true}
                />
                {file && (
                  <Close
                    className='delete'
                    onClick={handleFileDelete}
                    sx={{ fontSize: 20, color: COLOR.POINT }}
                  />
                )}
              </div>
              <Button
                label='찾아보기'
                handleClick={handleBrowseClick}
                width={80}
              />
              <input
                type='file'
                ref={fileInputRef}
                accept='.pdf'
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        <div className='button-box'>
          <Button
            label='이전'
            handleClick={() => navigate(-1)}
            border={true}
            width={120}
          />
          <Button
            label='전략등록'
            handleClick={handleSubmitButton}
            width={120}
          />
        </div>
      </div>
    ),
    none: (
      <div css={infoBoxStyle}>
        <img className='add-image' src={addInfoImage} alt='add' />
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
  };

  return (
    <div css={wrapperStyle}>
      <div css={titleBoxStyle}>
        <h5>전략 등록</h5>
        <span>
          시스메틱에서 투자전략을 등록하고 공유해보세요.
          <br />
          트레이더라면 투자자들이 당신의 전략에 투자할 수 있습니다.
        </span>
      </div>
      {roleCode === 'TRADER'
        ? conditionalRender.trader
        : conditionalRender.none}
      <Modal
        id='submit'
        content={
          <div css={modalStyle}>
            {submitErrorData.length > 0 ? (
              <>
                <span style={{ fontWeight: FONT_WEIGHT.BOLD }}>
                  [ {submitErrorData.join(', ')} ]{' '}
                </span>
                <span>필수 입력 항목을 모두 입력한 후 다시 시도해주세요.</span>
              </>
            ) : null}
          </div>
        }
      />
      <Modal
        id='notice'
        content={
          <div css={modalStyle}>
            <span>{noticeMessage}</span>
          </div>
        }
      />
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

        div {
          position: relative;

          .delete {
            position: absolute;
            top: 50%;
            right: 16px;
            transform: translateY(-50%);
            cursor: pointer;
          }
        }
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

const modalStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 8px;
  line-height: 24px;
`;

export default StrategyAdd;
