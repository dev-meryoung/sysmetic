import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import TabButton from '@/components/TabButton';
import Table from '@/components/Table';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import users from '@/mocks/users.json';
import { useTableStore } from '@/stores/useTableStore';

interface NoticeDataProps {
  no: number;
  grade: 'ALL' | 'USER' | 'TRADER' | 'MANAGER';
  email: string;
  name: string;
  nickname: string;
  birth: string;
  tel: string;
}
const SearchOptions = [
  { label: '전체', value: 'default' },
  { label: '이메일', value: 'email' },
  { label: '이름', value: 'name' },
  { label: '닉네임', value: 'nickname' },
  { label: '전화번호', value: 'phone' },
];

const GradeOptions = [
  { label: '관리자 임명', value: 'setAdmin' },
  { label: '관리자 해임', value: 'getAdmin' },
  { label: '탈퇴', value: 'resign' },
];

const PAGE_SIZE = 10;

const AdminUsers = () => {
  const [tab, setTab] = useState(0);
  const [value, setValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [curPage, setCurPage] = useState(0);
  const [data, setData] = useState<NoticeDataProps[]>([]);
  const [totalPage, setTotalPage] = useState(0);

  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    // 필터관련 함수 작성 예정
  };

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    // 등급관련 함수 작성 예정
  };

  useEffect(() => {
    console.log(selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    console.log(selectedGrade);
  }, [selectedGrade]);

  const getPaginatedData = (page: number) => {
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return data.slice(startIndex, endIndex);
  };

  const paginatedData = getPaginatedData(curPage);

  useEffect(() => {
    // 순서를 기준으로
    const sortedUser = [...users].sort((a, b) => b.no - a.no);
    const arrangedUser = sortedUser.map((user, index) => ({
      ...user,
      no: index + 1,
    }));
    setData(arrangedUser);

    const pages = Math.ceil(arrangedUser.length / PAGE_SIZE);
    setTotalPage(pages);
  }, []);

  const columns = [
    {
      key: 'no' as keyof NoticeDataProps,
      header: '순서',
    },
    {
      key: 'isManager' as keyof NoticeDataProps,
      header: '권한',
    },
    { key: 'grade' as keyof NoticeDataProps, header: '회원등급' },
    {
      key: 'email' as keyof NoticeDataProps,
      header: '계정(이메일)',
    },
    {
      key: 'name' as keyof NoticeDataProps,
      header: '이름',
    },
    {
      key: 'nickname' as keyof NoticeDataProps,
      header: '닉네임',
    },
    {
      key: 'birth' as keyof NoticeDataProps,
      header: '생년월일',
    },
    { key: 'tel' as keyof NoticeDataProps, header: '전화번호' },
  ];

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
          color='skyblue'
          options={SearchOptions}
          handleChange={handleFilterChange}
        />
        <TextInput
          placeholder='검색'
          color='skyblue'
          value={value}
          handleChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div css={tableStyle}>
        <Table
          data={paginatedData}
          columns={columns}
          hasCheckbox={true}
          checkedItems={checkedItems}
          handleCheckboxChange={toggleCheckbox}
          handleHeaderCheckboxChange={() =>
            toggleAllCheckboxes(paginatedData.length)
          }
        />
      </div>
      <div css={changeLvDivStyle}>
        <p>
          <span>선택한 회원</span>을
        </p>
        <SelectBox
          color='skyblue'
          placeholder='선택'
          options={GradeOptions}
          handleChange={handleGradeChange}
        />
        <Button
          fontSize='14px'
          width={80}
          label='변경'
          handleClick={() => console.log('변경')}
        />
        {/* <Button
          fontSize='14px'
          color='black'
          width={80}
          label='탈퇴'
          handleClick={() => console.log('탈퇴')}
        /> */}
      </div>
      <div css={paginationDivStyle}>
        <Pagination
          totalPage={totalPage}
          currentPage={curPage}
          handlePageChange={setCurPage}
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
  table > thead > tr > th {
    padding: 16px 20px;
  }
  table > tbody > tr > td {
    padding: 24px 20px;
  }
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

export default AdminUsers;
