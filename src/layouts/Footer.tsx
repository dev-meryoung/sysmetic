import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { PATH } from '@/constants/path';

const Footer = () => (
  <footer css={wrapperStyle}>
    <section css={footerTopStyle}>
      <div css={layoutStyle}>
        <div className='layout-info'>
          <div className='link-style'>
            <Link to={PATH.ROOT}>
              <img
                src={'/src/assets/images/simbol.png'}
                alt='아이콘'
                style={{ width: 80 }}
              />
            </Link>
            <div css={menuStyle}>
              <Link to='/'>서비스 이용약관</Link>
              <Link to='/'>개인정보처리방침</Link>
              <Link to={PATH.NOTICES}>공지사항</Link>
              <Link to='/'>회사소개</Link>
              <Link to='/'>교육안내</Link>
            </div>
          </div>
          <span>
            사업자 등록번호 : 711-86-00050 &nbsp;&nbsp; 통신판매업신고 :
            제2020-서울 영등포-2864호 &nbsp;&nbsp; 특허출원번호 :
            10-2016-00262203 <br /> 대표이사: 홍길동 &nbsp;&nbsp; 주소지: 서울시
            영등포구 당산로41길 11, E동 1202 <br /> © SYSMETIC Corp. All Rights
            Reserved.
          </span>
        </div>
        <button>관리자모드 바로가기</button>
      </div>
    </section>
    <section css={footerBottomStyle}>
      <div>
        시스메틱의 모든 사이트의 내용은 정보를 제공하기 위함이며, 투자권유와
        주식 및 파생상품 매매를 목적으로 하고 있지 않습니다. 따라서 본 사이트의
        수익률과 관련정보에 대해서는 (주)시스메틱은 어떠한 책임도 없습니다. 또한
        본 사이트를 통해 제공받게 되는 운용성과의 결과에 대해서도 (주)시스메틱은
        어떠한 책임이 없으며 모든 책임과 활용되는 모든 정보는 투자자 본인의
        책임입니다.
      </div>
    </section>
  </footer>
);

const wrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const footerTopStyle = css`
  background-color: #333333;
  width: 100%;
  height: 224px;

  button {
    border: 1px solid #cccccc;
    border-radius: 2px;
    width: 161px;
    height: 50px;
    background: 0;
    color: #ffffff;
  }
`;

const footerBottomStyle = css`
  background-color: #111111;
  padding: 14px 0;
  width: 100%;
  height: 80px;

  div {
    color: #ffffff;
    max-width: 1200px;
    padding: 0 10px;
    margin: 0 auto;
    font-size: 14px;
    line-height: 26px;
    font-weight: 500;
  }
`;

const layoutStyle = css`
  max-width: 1200px;
  height: 100%;
  padding: 43px 10px;
  display: flex;
  justify-content: space-between;
  gap: 230px;
  margin: 0 auto;

  .layout-info {
    display: flex;
    flex-direction: column;
    gap: 30px;

    .link-style {
      display: flex;
      align-items: center;
      gap: 59px;
    }

    span {
      line-height: 26px;
      color: #868686;
      font-weight: 400;
    }
  }
`;

const menuStyle = css`
  display: flex;
  gap: 24px;

  a {
    text-decoration: none;
    color: #868686;
    font-weight: 700;
  }

  a:nth-of-type(2) {
    color: #bbbbbb;
  }
`;

export default Footer;
