import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TagTest from '@/assets/images/test-tag.jpg';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import Table from '@/components/Table';
import Tag from '@/components/Tag';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import adminStrategies from '@/mocks/adminStrategies.json';
import { useTableStore } from '@/stores/useTableStore';

interface AdminStrategyDataProps {
  no: number;
  traderName: string;
  strategyName: string;
  enrollDate: string;
  isOn: boolean;
  staged: string;
}

const StatusOption = [
  { label: '공개', value: 'on' },
  { label: '비공개', value: 'off' },
];

const StagedOption = [
  { label: '승인', value: 'approval' },
  { label: '반려', value: 'companion' },
  { label: '요청전', value: 'unstaged' },
  { label: '승인요청', value: 'staging' },
];

const ApprovalOption = [
  { label: '승인요청', value: 'approvaling' },
  { label: '승인', value: 'approved' },
];

const PAGE_SIZE = 10;

const AdminStrategies = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedStaged, setSelectedStaged] = useState('');
  const [selectedApproval, setSelectedApproval] = useState('');
  const [value, SetValue] = useState('');
  //테이블 관련
  const [curPage, setCurPage] = useState(0);
  const [data, setData] = useState<AdminStrategyDataProps[]>([]);
  //페이지네이션 관련
  const [totalPage, setTotalPage] = useState(0);

  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const handleStagedChange = (value: string) => {
    setSelectedStaged(value);
  };

  const handleApprovalChange = (value: string) => {
    setSelectedApproval(value);
  };

  const handleIconClick = () => {
    console.log(value);
  };

  useEffect(() => {
    console.log(selectedStatus);
  }, [selectedStatus]);

  useEffect(() => {
    console.log(selectedStaged);
  }, [selectedStaged]);

  useEffect(() => {
    console.log(selectedApproval);
  }, [selectedApproval]);

  const getPaginatedData = (page: number) => {
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return data.slice(startIndex, endIndex);
  };

  const paginatedData = getPaginatedData(curPage);

  useEffect(() => {
    // 순서를 기준으로
    const sortedData = [...adminStrategies].sort((a, b) => b.no - a.no);
    const arrangedData = sortedData.map((item, index) => ({
      ...item,
      no: index + 1,
    }));
    setData(arrangedData);

    const pages = Math.ceil(arrangedData.length / PAGE_SIZE);
    setTotalPage(pages);
  }, []);

  const columns = [
    {
      key: 'no' as keyof AdminStrategyDataProps,
      header: '순위',
    },
    {
      key: 'traderName' as keyof AdminStrategyDataProps,
      header: '트레이더',
    },
    {
      key: 'strategyName' as keyof AdminStrategyDataProps,
      header: '전략명',
      render: (value: string | number | undefined | boolean) => (
        <div css={tagStyle}>
          <div>
            <Tag src={TagTest} alt='tag' />
          </div>
          {value}
        </div>
      ),
    },
    {
      key: 'enrollDate' as keyof AdminStrategyDataProps,
      header: '전략등록일자',
    },
    {
      key: 'isOn' as keyof AdminStrategyDataProps,
      header: '공개여부',
    },
    {
      key: 'staged' as keyof AdminStrategyDataProps,
      header: '승인단계',
    },
    {
      key: 'state' as keyof AdminStrategyDataProps,
      header: '상태',
      render: () => (
        <div css={buttonStyle}>
          <Button
            label='관리'
            shape='round'
            size='xs'
            color='primary'
            border={true}
            width={80}
            handleClick={() => {}}
          />
        </div>
      ),
    },
  ];

  return (
    <div css={strategyWrapperStyle}>
      <div css={strategySearchDivStyle}>
        <SelectBox
          color='skyblue'
          options={StatusOption}
          handleChange={handleStatusChange}
        />
        <SelectBox
          color='skyblue'
          options={StagedOption}
          handleChange={handleStagedChange}
        />
        <div className='search-input'>
          <TextInput
            placeholder='전략명'
            iconNum='single'
            color='skyblue'
            value={value}
            handleChange={(e) => SetValue(e.target.value)}
          />
          <SearchOutlinedIcon css={iconStyle} onClick={handleIconClick} />
        </div>
      </div>
      <div css={strategyInfoStyle}>
        <p>
          총 <span>40</span>개의 전략이 검색되었습니다.
        </p>
        <div className='control-button'>
          <Button
            label='등록'
            width={80}
            handleClick={() => console.log('삭제')}
          />
          <Button
            width={80}
            color='black'
            label='삭제'
            handleClick={() => console.log('삭제')}
          />
        </div>
      </div>
      <div css={startegytableStyle}>
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
      <div css={changeApprovalDivStyle}>
        <p>
          <span>선택한 전략</span>을
        </p>
        <SelectBox
          color='skyblue'
          placeholder='승인단계 선택'
          options={ApprovalOption}
          handleChange={handleApprovalChange}
        />
        <Button
          fontSize='14px'
          width={80}
          label='변경'
          handleClick={() => console.log('변경')}
        />
      </div>
      <div>
        <Pagination
          totalPage={totalPage}
          currentPage={curPage}
          handlePageChange={setCurPage}
        />
      </div>
    </div>
  );
};

const strategyWrapperStyle = css`
  display: flex;
  flex-direction: column;
  margin: 96px auto 96px;
  padding: 0 10px;
  max-width: 1200px;
`;

const strategySearchDivStyle = css`
  display: flex;
  gap: 16px;
  height: 120px;
  justify-content: center;
  align-items: center;
  background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};

  .search-input {
    position: relative;
  }
`;

const iconStyle = css`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  cursor: pointer;
`;

const strategyInfoStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 40px 0 24px;

  .control-button {
    display: flex;
    gap: 16px;
  }
`;

const startegytableStyle = css`
  table > thead > tr > th {
    padding: 16px 20px;
  }

  table > tbody > tr > td {
    padding: 16px 20px;
  }
`;

const changeApprovalDivStyle = css`
  display: flex;
  gap: 16px;
  height: 120px;
  justify-content: center;
  align-items: center;
  background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
  margin: 40px 0 32px;
`;

const buttonStyle = css``;

const tagStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`;

export default AdminStrategies;
