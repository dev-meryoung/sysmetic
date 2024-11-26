import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import TagTest from '@/assets/images/test-tag.jpg';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import TabButton from '@/components/TabButton';
import Table from '@/components/Table';
import Tag from '@/components/Tag';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import qna from '@/mocks/qna.json';
import { useTableStore } from '@/stores/useTableStore';


interface AdminQnaDataProps {
  no: number;
  traderName: string;
  strategyName: string;
  date: string;
  author: string;
  state: string;
}

const SearchOption = [
  { label: '트레이더', value: 'trader' },
  { label: '작성자', value: 'investor' },
];

const PAGE_SIZE = 10;

const AdminQna = () => {
  const [tab, setTab] = useState(0);
  const [value, setValue] = useState('');
  const [selectiedOption, setSelectedOption] = useState('');
  const [curPage, setCurPage] = useState(0);
  const [data, setData] = useState<AdminQnaDataProps[]>([]);
  //페이지네이션
  const [totalPage, setTotalPage] = useState(0);
  const getPaginatedData = (page: number) => {
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return data.slice(startIndex, endIndex);
  };
  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const paginatedData = getPaginatedData(curPage);
  const columns = [
    {
      key: 'no' as keyof AdminQnaDataProps,
      header: '순서',
    },
    {
      key: 'traderName' as keyof AdminQnaDataProps,
      header: '트레이더',
    },
    {
      key: 'strategyName' as keyof AdminQnaDataProps,
      header: '전략명',
      render: (value: string | number) => (
        <div css={tagStyle}>
          <div>
            <Tag src={TagTest} alt='tag' />
          </div>
          {value}
        </div>
      ),
    },
    {
      key: 'date' as keyof AdminQnaDataProps,
      header: '문의날짜',
    },
    {
      key: 'author' as keyof AdminQnaDataProps,
      header: '작성자',
    },
    {
      key: 'state' as keyof AdminQnaDataProps,
      header: '상태',
    },
    {
      key: 'status' as keyof AdminQnaDataProps,
      header: '관리',
      render: () => (
        <Button
          label='상세보기'
          shape='round'
          size='xs'
          color='primary'
          border={true}
          width={80}
          handleClick={() => {}}
        />
      ),
    },
  ];

  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );

  useEffect(() => {
    console.log(selectiedOption);
  }, [selectiedOption]);

  useEffect(() => {
    // 순서를 기준으로
    const sortedData = [...qna].sort((a, b) => b.no - a.no);
    const arrangedData = sortedData.map((item, index) => ({
      ...item,
      no: index + 1,
    }));
    setData(arrangedData);

    const pages = Math.ceil(arrangedData.length / PAGE_SIZE);
    setTotalPage(pages);
  }, []);

  return (
    <div css={adminQnaWrapperStyle}>
      <div css={adminQnaHeaderStyle}>
        <h5>문의관리</h5>
        <p>
          시스메틱 투자자가 트레이더에게 문의한 내용과 답변 내용을 확인하고
          관리할 수 있는 페이지입니다.
        </p>
      </div>
      <div css={adminQnaTabStyle}>
        <TabButton
          tabs={['전체', '답변대기', '답변완료']}
          currentTab={tab}
          handleTabChange={setTab}
          shape='round'
        />
      </div>
      <div css={adminQnaSearchStyle}>
        <SelectBox
          color='skyblue'
          options={SearchOption}
          handleChange={handleOptionChange}
        />
        <TextInput
          placeholder='전략명'
          color='skyblue'
          value={value}
          handleChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div css={adminQnaInfoStyle}>
        <p>
          총 <span>40개</span>의 문의가 있습니다.
        </p>
        <Button
          width={80}
          color='black'
          label='삭제'
          handleClick={() => console.log('삭제')}
        />
      </div>
      <div css={adminQnaListStyle}>
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
      <div css={adminQnaPaginationStyle}>
        <Pagination
          totalPage={totalPage}
          currentPage={curPage}
          handlePageChange={setCurPage}
        />
      </div>
    </div>
  );
};

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

const adminQnaTabStyle = css`
  padding: 40px 0;
`;

const adminQnaSearchStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  height: 120px;

  background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
  border-radius: 2px;
`;

const adminQnaInfoStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 40px 0 24px;

  p {
    font-size: ${FONT_SIZE.TITLE_XS};
    letter-spacing: -0.4px;
  }

  span {
    font-weight: ${FONT_WEIGHT.BOLD};
  }
`;

const adminQnaListStyle = css`
  table > thead > tr > th {
    padding: 0;
    height: 48px;

    &:nth-of-type(1) {
      width: 60px;
    }
    &:nth-of-type(2) {
      width: 80px;
    }
    &:nth-of-type(3) {
      width: 160px;
    }
    &:nth-of-type(4) {
      width: 380px;
    }
    &:nth-of-type(5) {
      width: 120px;
    }
    &:nth-of-type(6) {
      width: 160px;
    }
    &:nth-of-type(7) {
      width: 100px;
    }
    &:nth-of-type(8) {
      width: 120px;
    }
  }

  div {
    justify-content: center;
  }
`;

const adminQnaPaginationStyle = css`
  margin-top: 32px;
`;

const tagStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`;
export default AdminQna;
