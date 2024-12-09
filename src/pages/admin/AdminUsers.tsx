import { useState, useEffect, SetStateAction } from 'react';
import { css } from '@emotion/react';
import SearchIcon from '@mui/icons-material/Search';
import { AdminUserData, RoleCodeTypes } from '@/api';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import TabButton from '@/components/TabButton';
import Table from '@/components/Table';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import {
  useDeleteAdminUser,
  useGetAdminUserList,
  useUpdateAdminUserRole,
} from '@/hooks/useAdminApi';
import useAuthStore from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';
import { useTableStore } from '@/stores/useTableStore';

interface UsersTableProps {
  no: number;
  isManager: RoleCodeTypes;
  grade: RoleCodeTypes;
  email: string;
  name: string;
  nickname: string;
  birth: string;
  tel: string;
}

const SearchOptions = [
  { label: '전체', value: 'ALL' },
  { label: '이메일', value: 'EMAIL' },
  { label: '이름', value: 'NAME' },
  { label: '닉네임', value: 'NICKNAME' },
  { label: '전화번호', value: 'PHONENUMBER' },
];

const GradeOptions = [
  { label: '관리자 임명', value: 'setManager' },
  { label: '관리자 해임', value: 'getManager' },
  { label: '탈퇴', value: 'resign' },
];

const AdminUsers = () => {
  const [tab, setTab] = useState(0);
  const [value, setValue] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [curPage, setCurPage] = useState(0);

  const [fetch, setFetch] = useState(true);
  //현재 유저정보 가져오기
  const curUser = useAuthStore();
  const curUserGrade = curUser.roleCode;
  //회원목록 가져오기
  const params: AdminUserData = {
    role:
      tab === 0 ? 'ALL' : tab === 1 ? 'USER' : tab === 2 ? 'TRADER' : 'MANAGER',
    searchKeyword,
    page: curPage,
    searchType: 'ALL',
  };

  const { data, refetch } = useGetAdminUserList(params, fetch);
  const totalPage = data?.totalPages || 0;
  const users: UsersTableProps[] =
    data?.content?.map((user) => ({
      no: user.id,
      isManager: user.roleCode,
      grade: user.roleCode,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      birth: user.birth,
      tel: user.phoneNumber,
    })) || [];

  const [isDisabled, setIsDisabled] = useState(true);
  const [hasManagerRights, setHasManagerRights] = useState(false);
  //모달
  const delConfirmModal = useModalStore();
  //체크박스
  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );
  const selectedUserIds = checkedItems.map((index) => users[index].no);
  // 회원 강제 탈퇴
  const { mutate: deleteAdminUser } = useDeleteAdminUser();

  const handleModalDelClick = () => {
    deleteAdminUser(selectedUserIds, {
      onSuccess: (data) => {
        if (data?.code === 200) {
          setFetch(true);
          toggleAllCheckboxes(0);
        }
      },
      onError: (error) => {
        console.error('회원 탈퇴 중 오류 발생', error);
      },
    });
    delConfirmModal.closeModal('del-confirm');
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    // 필터관련 함수 작성 예정
  };

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    // setCurPage(0);
    // 등급관련 함수 작성 예정
  };

  const handleSearchClick = () => {
    setSearchKeyword(value);
    setFetch(true);
    setCurPage(0); // 검색 시 페이지를 초기화
    toggleAllCheckboxes(0);
  };

  useEffect(() => {
    if (fetch) {
      refetch();
      setFetch(false);
    }
  }, [fetch, refetch]);

  useEffect(() => {
    console.log(selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    setHasManagerRights(selectedGrade === 'setManager');
  }, [selectedGrade]);

  const columns = [
    {
      key: 'no' as keyof UsersTableProps,
      header: '순서',
    },
    {
      key: 'isManager' as keyof UsersTableProps,
      header: '권한',
      render: (value: RoleCodeTypes | string | number) =>
        value === 'USER_MANAGER' || value === 'TRADER_MANAGER' ? '관리자' : '-',
    },
    {
      key: 'grade' as keyof UsersTableProps,
      header: '회원등급',
      render: (value: RoleCodeTypes | string | number) =>
        value === 'USER' || value === 'USER_MANAGER' ? '일반회원' : '트레이더',
    },
    {
      key: 'email' as keyof UsersTableProps,
      header: '계정(이메일)',
    },
    {
      key: 'name' as keyof UsersTableProps,
      header: '이름',
    },
    {
      key: 'nickname' as keyof UsersTableProps,
      header: '닉네임',
    },
    {
      key: 'birth' as keyof UsersTableProps,
      header: '생년월일',
    },
    { key: 'tel' as keyof UsersTableProps, header: '전화번호' },
  ];

  const handleTabClick = (tab: SetStateAction<number>) => {
    setTab(tab);
    setFetch(true);
    setSelectedFilter('ALL');
    setValue('');
    setSearchKeyword('');
    setCurPage(0);
    toggleAllCheckboxes(0);
  };

  const handlePaginationClick = (value: SetStateAction<number>) => {
    setCurPage(value);
    setFetch(true);
    toggleAllCheckboxes(0);
  };

  // 회원 등급 변경
  const { mutate: updateAdminUserRoleMutation } = useUpdateAdminUserRole();

  const handleBtnClick = () => {
    //페이지 내 순번과 실제 유저의 no 순번을 일치
    const selectedUserIds = checkedItems.map((index) => users[index].no);

    if (selectedGrade === 'resign') {
      delConfirmModal.openModal('del-confirm');
    } else {
      const params = {
        memberId: selectedUserIds,
        hasManagerRights,
      };

      updateAdminUserRoleMutation(params, {
        onSuccess: (data) => {
          if (data?.code === 200) {
            console.log('업데이트 성공');
          }
          setFetch(true);
          toggleAllCheckboxes(0);
        },
        onError: (error) => {
          console.error('회원 등급 변경 중 오류 발생!', error);
        },
      });
    }
  };

  useEffect(() => {
    console.log(selectedGrade);
  }, [selectedGrade]);

  // 변경버튼 on/off
  useEffect(() => {
    if (curUserGrade === 'ADMIN') {
      if (checkedItems.length > 0 && selectedGrade) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }
  }, [checkedItems, selectedGrade, curUserGrade]);

  return (
    <div css={adminWrapperStyle}>
      <div css={adminHeaderStyle}>
        <h1>회원관리</h1>
        <p>회원들의 정보 관리를 위한 페이지입니다.</p>
      </div>
      <div css={categoryDivStyle}>
        <TabButton
          tabs={['전체회원', '일반회원', '트레이더', '관리자']}
          handleTabChange={handleTabClick}
          currentTab={tab}
          shape='round'
        />
      </div>
      <div css={searchDivStyle}>
        <SelectBox
          placeholder='전체'
          color='skyblue'
          options={SearchOptions}
          handleChange={handleFilterChange}
        />
        <div className='search-div'>
          <TextInput
            placeholder='검색'
            color='skyblue'
            value={value}
            handleChange={(e) => setValue(e.target.value)}
          />
          <SearchIcon css={iconStyle} onClick={handleSearchClick} />
        </div>
      </div>
      <div css={tableStyle}>
        {users.length !== 0 ? (
          <Table
            data={users}
            columns={columns}
            hasCheckbox={true}
            checkedItems={checkedItems}
            handleCheckboxChange={toggleCheckbox}
            handleHeaderCheckboxChange={() => toggleAllCheckboxes(users.length)}
          />
        ) : (
          <div css={searchNoneStyle}>
            <p>해당 검색어에 대한 검색결과가 존재하지 않습니다.</p>
          </div>
        )}
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
          handleClick={handleBtnClick}
          disabled={isDisabled}
        />
      </div>
      <div css={paginationDivStyle}>
        <Pagination
          totalPage={totalPage}
          currentPage={curPage}
          handlePageChange={handlePaginationClick}
        />
      </div>
      <Modal
        content={
          <div css={ModalStyle}>
            <p>정말 해당 회원을 탈퇴시키겠습니까?</p>
            <div className='del-confirm-btn'>
              <Button
                width={120}
                border={true}
                label='아니오'
                handleClick={() => delConfirmModal.closeModal('del-confirm')}
              />
              <Button
                width={120}
                label='예'
                handleClick={handleModalDelClick}
              />
            </div>
          </div>
        }
        id='del-confirm'
      />
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

  .search-div {
    position: relative;
  }
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

const iconStyle = css`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  cursor: pointer;
`;

const searchNoneStyle = css`
  height: 80px;
  background-color: ${COLOR.GRAY100};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: ${FONT_SIZE.TEXT_LG};
`;

const ModalStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 8px 16px 0;
  font-size: ${FONT_SIZE.TEXT_MD};

  .del-confirm-btn {
    display: flex;
    gap: 16px;
  }
`;
export default AdminUsers;
