import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { css } from '@emotion/react';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { MethodsParameterProps } from '@/api';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import Tag from '@/components/Tag';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import {
  useCreateAdminMethods,
  useDeleteAdminMethods,
  useGetAdminMethods,
} from '@/hooks/useAdminApi';
import useModalStore from '@/stores/useModalStore';
import { useTableStore } from '@/stores/useTableStore';

interface AdminMethodsDataProps {
  no: number;
  methodsName: string;
  filePath: string;
}

interface AddModalProps {
  setFetch: Dispatch<SetStateAction<boolean>>;
  methods: AdminMethodsDataProps[];
}

interface DelModalProps {
  checkedItems: number[];
  methods: AdminMethodsDataProps[];
  setFetch: Dispatch<SetStateAction<boolean>>;
  toggleAllCheckBoxes: (value: number) => void;
}

const DelModal: React.FC<DelModalProps> = ({
  toggleAllCheckBoxes,
  checkedItems,
  methods,
  setFetch,
}) => {
  const delModal = useModalStore();
  const checkedStocks = checkedItems.map((idx) => methods[idx].no);
  //삭제 mutation
  const { mutate: deleteAdminMethodsMutation } = useDeleteAdminMethods();

  const handleDeleteClick = () => {
    deleteAdminMethodsMutation(checkedStocks, {
      onSuccess: () => {
        delModal.closeModal('delete');
        setFetch(true);
        toggleAllCheckBoxes(0);
      },
      onError: (error) => {
        console.error('종목 삭제 중 오류 발생!', error);
      },
    });
  };

  return (
    <div css={delModalStyle}>
      <p>해당 종목을 삭제하시겠습니까?</p>
      <div className='del-modal-btn'>
        <Button
          width={120}
          border={true}
          label='아니오'
          handleClick={() => delModal.closeModal('delete')}
        />
        <Button width={120} label='예' handleClick={handleDeleteClick} />
      </div>
    </div>
  );
};

const AddModal: React.FC<AddModalProps> = ({ setFetch, methods }) => {
  const addModal = useModalStore();
  const [methodsValue, setMethodsValue] = useState('');
  const [iconValue, setIconValue] = useState('');
  const [iconImg, setIconImg] = useState('');
  const [isDuplicated, setIsDuplicated] = useState(false);

  const handleOpenFileExplorer = () => {
    const fileInput = document.getElementById('file-input');
    fileInput?.click();
  };

  const checkDuplicate = (value: string) => {
    const isDuplicate = methods.some((method) => method.methodsName === value);
    setIsDuplicated(isDuplicate);
  };

  const handleMethodsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMethodsValue(e.target.value);
    checkDuplicate(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setIconImg(imageUrl);
        setIconValue(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const { mutate: createAdminMethodsMutation } = useCreateAdminMethods();

  const handleCreateClick = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      alert('파일을 첨부해주세요.');
      return;
    }

    const formData = {
      methodPostRequestDto: {
        name: methodsValue,
        checkDupl: !isDuplicated,
      },
      file,
    };

    createAdminMethodsMutation(formData, {
      onSuccess: () => {
        addModal.closeModal('add');
        setFetch(true);
      },
      onError: (error) => {
        console.error('등록 실패', error);
      },
    });
  };

  return (
    <div css={addModalStyle}>
      <p>매매방식 등록</p>
      <table>
        <thead>
          <tr>
            <th>매매방식</th>
            <th>아이콘</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <TextInput
                width={224}
                value={methodsValue}
                handleChange={handleMethodsChange}
              />
              {/* <p>1글자 이상 입력하세요.</p> */}
            </td>
            <td>
              <div css={thumbnailStyle}>
                <p>등록아이콘</p>
                {iconImg && <img src={iconImg} alt='미리보기' />}
              </div>
              <div>
                <TextInput
                  width={302}
                  value={iconValue}
                  handleChange={(e) => setIconValue(e.target.value)}
                />
                <IconButton
                  color='white'
                  iconBgSize='lg'
                  iconSize='md'
                  IconComponent={AddPhotoAlternateOutlinedIcon}
                  handleClick={handleOpenFileExplorer}
                />
                <input
                  id='file-input'
                  type='file'
                  accept='image/jpg,image/jpeg,image/png'
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
              {/* <p>jp(e)g, png 형식의 파일만 첨부 가능합니다.</p> */}
            </td>
          </tr>
        </tbody>
      </table>
      <div className='btn'>
        <Button
          border={true}
          width={120}
          label='취소'
          handleClick={() => addModal.closeModal('add')}
        />
        <Button width={120} label='등록하기' handleClick={handleCreateClick} />
      </div>
    </div>
  );
};

const ModModal = () => {
  const modModal = useModalStore();
  const [methodsValue, setMethodsValue] = useState('');
  const [iconValue, setIconValue] = useState('');

  return (
    <div css={addModalStyle}>
      <p>매매방식 수정</p>
      <table>
        <thead>
          <tr>
            <th>매매방식</th>
            <th>아이콘</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <TextInput
                width={224}
                value={methodsValue}
                handleChange={(e) => setMethodsValue(e.target.value)}
              />
              <p>1글자 이상 입력하세요.</p>
            </td>
            <td>
              <p>등록아이콘</p>
              <div>
                <TextInput
                  width={302}
                  value={iconValue}
                  handleChange={(e) => setIconValue(e.target.value)}
                />
                <IconButton
                  color='white'
                  iconBgSize='lg'
                  iconSize='md'
                  IconComponent={AddPhotoAlternateOutlinedIcon}
                  handleClick={() => console.log('클릭')}
                />
              </div>
              <p>jp(e)g, png 형식의 파일만 첨부 가능합니다.</p>
            </td>
          </tr>
        </tbody>
      </table>
      <div className='btn'>
        <Button
          border={true}
          width={120}
          label='취소'
          handleClick={() => modModal.closeModal('modify')}
        />
        <Button
          width={120}
          label='등록하기'
          handleClick={() => console.log('click')}
        />
      </div>
    </div>
  );
};

const AdminMethods = () => {
  const [delDisabled, setDelDisabled] = useState(true);
  const [fetch, setFetch] = useState(true);
  //테이블 관련
  const [curPage, setCurPage] = useState(0);
  // const [data, setData] = useState<AdminMethodsDataProps[]>([]);
  //페이지네이션 관련
  // const [totalPage, setTotalPage] = useState(0);
  // const getPaginatedData = (page: number) => {
  //   const startIndex = page * PAGE_SIZE;
  //   const endIndex = startIndex + PAGE_SIZE;
  //   return data.slice(startIndex, endIndex);
  // };

  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );

  // const [imgIcon, setImgIcon] = useState('');
  // const paginatedData = getPaginatedData(curPage);
  const columns = [
    {
      key: 'no' as keyof AdminMethodsDataProps,
      header: '순서',
    },
    {
      key: 'methodsName' as keyof AdminMethodsDataProps,
      header: '상품유형',
    },
    {
      key: 'filePath' as keyof AdminMethodsDataProps,
      header: '아이콘',
      render: (value: string | number) => (
        <div css={tagStyle}>
          <div>
            <Tag src={value as string} alt='tag' />
          </div>
        </div>
      ),
    },
    {
      key: 'state' as keyof AdminMethodsDataProps,
      header: '상태',
      render: () => (
        <Button
          label='방식수정'
          shape='round'
          size='xs'
          color='primary'
          border={true}
          width={80}
          handleClick={openModifyModal}
        />
      ),
    },
  ];

  //모달 관련
  const delModal = useModalStore();
  const addModal = useModalStore();
  const modModal = useModalStore();

  const openDeleteModal = () => {
    if (checkedItems.length > 0) {
      delModal.openModal('delete');
    }
  };
  const openAddModal = () => {
    addModal.openModal('add', 648);
  };
  const openModifyModal = () => {
    modModal.openModal('modify', 648);
  };

  // useEffect(() => {
  //   // 순서를 기준으로
  //   const sortedData = [...adminMethods].sort((a, b) => b.no - a.no);
  //   const arrangedData = sortedData.map((item, index) => ({
  //     ...item,
  //     no: index + 1,
  //   }));
  //   setData(arrangedData);

  //   const pages = Math.ceil(arrangedData.length / PAGE_SIZE);
  //   setTotalPage(pages);
  // }, []);

  const params: MethodsParameterProps = {
    page: curPage,
  };

  const { data, refetch } = useGetAdminMethods(params, fetch);
  const totalPage = data?.totalPages || 0;
  const totalElement = data?.totalElement || 0;

  const methods: AdminMethodsDataProps[] =
    data?.content?.map((stock) => ({
      no: stock.id,
      methodsName: stock.name,
      filePath: stock.filePath,
    })) || [];

  useEffect(() => {
    if (fetch) {
      refetch();
      setFetch(false);
    }
  }, [fetch, refetch]);

  useEffect(() => {
    if (checkedItems.length > 0) {
      setDelDisabled(false);
    } else {
      setDelDisabled(true);
    }
  }, [checkedItems]);
  return (
    <div css={methodsWrapperStyle}>
      <div css={methodsInfoStyle}>
        <p>
          총 <span>{totalElement}개</span>의 매매방식이 있습니다.
        </p>
        <div className='manage-btn'>
          <Button width={80} label='등록' handleClick={openAddModal} />
          <Button
            width={80}
            color='black'
            label='삭제'
            handleClick={openDeleteModal}
            disabled={delDisabled}
          />
        </div>
      </div>
      <div css={methodsTableStyle}>
        <Table
          data={methods}
          columns={columns}
          hasCheckbox={true}
          checkedItems={checkedItems}
          handleCheckboxChange={toggleCheckbox}
          handleHeaderCheckboxChange={() => toggleAllCheckboxes(methods.length)}
        />
      </div>
      <div css={methodsPaginationStyle}>
        <Pagination
          totalPage={totalPage}
          currentPage={curPage}
          handlePageChange={setCurPage}
        />
      </div>
      <Modal
        content={
          <DelModal
            checkedItems={checkedItems}
            methods={methods}
            setFetch={setFetch}
            toggleAllCheckBoxes={toggleAllCheckboxes}
          />
        }
        id='delete'
      />
      <Modal
        content={<AddModal setFetch={setFetch} methods={methods} />}
        id='add'
      />
      <Modal content={<ModModal />} id='modify' />
    </div>
  );
};

const methodsWrapperStyle = css`
  display: flex;
  flex-direction: column;
  margin: 0 auto 96px;
  padding: 0 10px;
  max-width: 1200px;
`;

const methodsInfoStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${FONT_SIZE.TITLE_XS};
  letter-spacing: -0.4px;
  margin-bottom: 24px;

  p > span {
    font-weight: ${FONT_WEIGHT.BOLD};
  }

  .manage-btn {
    display: flex;
    gap: 16px;
  }
`;

const methodsTableStyle = css`
  display: flex;
  flex-direction: column;
  gap: 29px;

  table > thead > tr > th {
    padding: 16px 0;

    div {
      align-items: center;
      justify-content: center;
    }
  }

  table > tbody > tr > td {
    padding: 16px 0;

    div {
      align-items: center;
      justify-content: center;
    }

    &:nth-of-type(1) {
      width: 60px;
    }
    &:nth-of-type(2) {
      width: 80px;
    }
    &:nth-of-type(3) {
      width: 460px;
    }
    &:nth-of-type(4) {
      width: 460px;
    }
    &:nth-of-type(5) {
      width: 120px;
    }
  }
`;

const methodsPaginationStyle = css`
  margin-top: 32px;
`;

const tagStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`;

const delModalStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 8px 16px 0;

  font-size: ${FONT_SIZE.TEXT_MD};
  letter-spacing: -0.32px;

  .del-modal-btn {
    display: flex;
    gap: 16px;
  }
`;

const addModalStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;

  p {
    font-size: ${FONT_SIZE.TEXT_SM};
    margin-bottom: 20px;
  }

  table > thead > tr {
    display: flex;

    height: 48px;
    background-color: ${COLOR.GRAY100};

    th {
      display: flex;
      justify-content: center;
      align-items: center;

      &:nth-of-type(1) {
        width: 240px;
      }
      &:nth-of-type(2) {
        width: 360px;
      }
    }
  }

  table > tbody > tr {
    display: flex;

    td {
      display: flex;
      flex-direction: column;
      // justify-content: center;
      // align-items: center;
      padding: 8px 0 8px 8px;
      gap: 8px;

      &:nth-of-type(1) {
        width: 240px;
        margin-top: 32px;
      }

      &:nth-of-type(2) {
        width: 360px;
      }

      div {
        display: flex;

        p {
          color: ${COLOR.TEXT_BLACK};
          height: 24px;
          margin: 0;
        }
      }

      p {
        color: ${COLOR.POINT};
      }
    }
  }

  .btn {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding-top: 32px;
    border-top: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  }
`;

const thumbnailStyle = css`
  display: flex;
  align-itmes: center;
  gap: 8px;

  img {
    width: 48px;
    height: 20px;
  }
`;

export default AdminMethods;
