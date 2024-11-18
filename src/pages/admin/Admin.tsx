import { useState } from 'react';
import { css } from '@emotion/react';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import TabButton from '@/components/TabButton';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

const SearchOptions = [
  { label: '이메일', value: 'email' },
  { label: '이름', value: 'name' },
  { label: '닉네임', value: 'nickname' },
  { label: '전화번호', value: 'phone' },
];

const GradeOptions = [
  { label: '트레이더', value: 'trader' },
  { label: '관리자', value: 'admin' },
  { label: '일반회원', value: 'normal' },
];

const Admin = () => {
  const [tab, setTab] = useState(0);
  const [value, setValue] = useState('');
  const [curPage, setCurPage] = useState(0);

  return (
    <div css={adminWrapperStyle}>
      <div css={adminHeaderStyle}>
        <h1>회원관리</h1>
        <p>회원들의 정보 관리를 위한 페이지입니다.</p>
      </div>
      <div css={categoryDivStyle}>
        <TabButton
          tabs={['전체회원', '일반회원', '트레이더', '관리자']}
          handleTabChange={setTab}
          currentTab={tab}
          shape='round'
        />
      </div>
      <div css={searchDivStyle}>
        <SelectBox
          options={SearchOptions}
          handleChange={(value) => console.log(value)}
        />
        <TextInput
          color='skyblue'
          value={value}
          handleChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div css={tableStyle}>여기서부터 표</div>
      <div css={changeLvDivStyle}>
        <p>
          <span>선택한 회원</span>을
        </p>
        <SelectBox
          placeholder='회원타입 선택'
          options={GradeOptions}
          handleChange={(value) => console.log(value)}
        />
        <Button
          fontSize='14px'
          width={80}
          label='변경'
          handleClick={() => console.log('click')}
        />
        <Button
          fontSize='14px'
          color='black'
          width={80}
          label='탈퇴'
          handleClick={() => console.log('click')}
        />
      </div>
      <div css={paginationDivStyle}>
        <Pagination
          totalPage={120}
          currentPage={curPage}
          handlePageChange={(page) => setCurPage(page)}
        />
      </div>
    </div>
  );
};

const adminWrapperStyle = css`
  display: flex;
  flex-direction: column;
  margin: 96px auto 96px;
  padding: 0 10px;
  max-width: 1200px;
`;

const adminHeaderStyle = css`
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

const categoryDivStyle = css`
  display: flex;
  gap: 16px;
  margin: 40px 0;
`;

const searchDivStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  height: 120px;
  margin-bottom: 40px;
  background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
`;

const tableStyle = css`
  height: 688px;
  background-color: ${COLOR.GRAY400};
`;

const changeLvDivStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 40px 0 32px;
  height: 120px;
  background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};

  letter-spacing: -0.32px;

  span {
    font-weight: ${FONT_WEIGHT.BOLD};
  }
`;

const paginationDivStyle = css``;

export default Admin;
