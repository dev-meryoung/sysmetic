import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import pageNotFoundImage from '@/assets/images/page-not-found.png';
import Button from '@/components/Button';
import { PATH } from '@/constants/path';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div css={wrapperStyle}>
      <div css={contentStyle}>
        <img src={pageNotFoundImage} alt='404' />
        <div className='text-box'>
          <h3>죄송합니다. 페이지를 찾을 수 없습니다.</h3>
          <span>이 페이지는 현재 존재하지 않거나 삭제되었습니다.</span>
        </div>
        <Button
          label='메인 페이지로 이동'
          width={160}
          border={true}
          handleClick={() => navigate(PATH.ROOT)}
        />
      </div>
    </div>
  );
};

const wrapperStyle = css`
  max-width: 1200px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 150px 10px;
  margin: 0 auto;
`;

const contentStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 230px;
    margin-bottom: 40px;
  }

  .text-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin-bottom: 80px;
  }
`;

export default NotFound;
