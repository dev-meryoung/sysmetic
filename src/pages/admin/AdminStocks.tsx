import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { css } from '@emotion/react';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { StocksParameterProps } from '@/api';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import Tag from '@/components/Tag';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { useCreateAdminStocks, useGetAdminStocks } from '@/hooks/useAdminApi';
import useModalStore from '@/stores/useModalStore';
import { useTableStore } from '@/stores/useTableStore';

interface AdminStocksDataProps {
  no: number;
  stocksName: string;
  filePath: string;
}

interface DelModalProps {
  toggleAllCheckBoxes: (value: number) => void;
}

interface AddModalProps {
  setFetch: Dispatch<SetStateAction<boolean>>;
  stocks: AdminStocksDataProps[];
}

// const PAGE_SIZE = 10;

const DelModal: React.FC<DelModalProps> = ({ toggleAllCheckBoxes }) => {
  const delModal = useModalStore();

  const handleDeleteClick = () => {
    //? 데이터 삭제 코드
    //1. data.filter()를 통해 체크된 항목을 제외한 새로운 데이터 생성
    //2. setData(변수명)을 통해 data 상태 업데이트
    //3. 페이지 수 최신화 업데이트

    //4.체크박스 상태 초기화 및 모달 닫기
    toggleAllCheckBoxes(0);
    delModal.closeModal('delete');
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

const AddModal: React.FC<AddModalProps> = ({ setFetch, stocks }) => {
  const addModal = useModalStore();
  const [stocksValue, setStocksValue] = useState('');
  const [iconValue, setIconValue] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [isDuplicated, setIsDuplicated] = useState(false);
  const handleOpenFileExplorer = () => {
    const fileInput = document.getElementById('file-input');
    fileInput?.click();
  };

  const checkDuplicate = (value: string) => {
    const isDuplicate = stocks.some((stock) => stock.stocksName === value);
    setIsDuplicated(isDuplicate);
  };

  const handleStocksChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStocksValue(e.target.value);
    checkDuplicate(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setProfileImg(imageUrl);
        setIconValue(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const { mutate: createAdminStocksMutation } = useCreateAdminStocks();

  const handleCreateClick = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      alert('파일을 첨부해주세요.');
      return;
    }

    const formData = {
      stockPostRequestDto: {
        name: stocksValue,
        checkDuplicate: !isDuplicated,
      },
      file,
    };

    createAdminStocksMutation(formData, {
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
      <p>종목 등록</p>
      <table>
        <thead>
          <tr>
            <th>종목명</th>
            <th>아이콘</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <TextInput
                width={224}
                value={stocksValue}
                handleChange={handleStocksChange}
              />
              {/* <p>1글자 이상 입력하세요.</p> */}
            </td>
            <td>
              <div css={thumbnailStyle}>
                <p>등록아이콘</p>
                {profileImg && <img src={profileImg} alt='미리보기' />}
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
              </div>
              <input
                id='file-input'
                type='file'
                accept='image/jpg,image/jpeg,image/png'
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
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
  const [stocksValue, setStocksValue] = useState('');
  const [iconValue, setIconValue] = useState('');

  return (
    <div css={addModalStyle}>
      <p>종목 수정</p>
      <table>
        <thead>
          <tr>
            <th>종목명</th>
            <th>아이콘</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <TextInput
                width={224}
                value={stocksValue}
                handleChange={(e) => setStocksValue(e.target.value)}
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

const AdminStocks = () => {
  //버튼 on/off
  const [delDisabled, setDelDisabled] = useState(true);
  //테이블 관련
  const [curPage, setCurPage] = useState(0);
  const columns = [
    {
      key: 'no' as keyof AdminStocksDataProps,
      header: '순서',
    },
    {
      key: 'stocksName' as keyof AdminStocksDataProps,
      header: '종목명',
    },
    {
      key: 'filePath' as keyof AdminStocksDataProps,
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
      key: 'state' as keyof AdminStocksDataProps,
      header: '상태',
      render: () => (
        <Button
          label='수정'
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

  //체크박스 관련
  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );

  //모달관련
  const delModal = useModalStore();
  const addModal = useModalStore();
  const modModal = useModalStore();

  //데이터 관련
  const [fetch, setFetch] = useState(true);
  const params: StocksParameterProps = {
    page: curPage,
  };

  const { data, refetch } = useGetAdminStocks(params, fetch);
  const totalPage = data?.totalPages || 0;
  const totalElement = data?.totalElement || 0;

  const stocks: AdminStocksDataProps[] =
    data?.content?.map((stock) => ({
      no: stock.id,
      stocksName: stock.name,
      filePath: stock.filePath,
    })) || [];

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

  const handlePaginationClick = (value: SetStateAction<number>) => {
    setCurPage(value);
    setFetch(true);
    toggleAllCheckboxes(0);
  };

  useEffect(() => {
    if (fetch) {
      refetch();
      setFetch(false);
    }
  }, [fetch, refetch]);

  //삭제버튼 on/off
  useEffect(() => {
    if (checkedItems.length > 0) {
      setDelDisabled(false);
    }
  }, [checkedItems]);

  return (
    <div css={stocksWrapperStyle}>
      <div css={stocksInfoStyle}>
        <p>
          총 <span>{totalElement}개</span>의 종목이 있습니다.
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
      <div css={stocksTableStyle}>
        <Table
          data={stocks}
          columns={columns}
          hasCheckbox={true}
          checkedItems={checkedItems}
          handleCheckboxChange={toggleCheckbox}
          handleHeaderCheckboxChange={() => toggleAllCheckboxes(stocks.length)}
        />
      </div>
      <div css={stocksPaginationStyle}>
        <Pagination
          totalPage={totalPage}
          currentPage={curPage}
          handlePageChange={handlePaginationClick}
        />
      </div>
      <Modal
        content={<DelModal toggleAllCheckBoxes={toggleAllCheckboxes} />}
        id='delete'
      />
      <Modal
        content={<AddModal setFetch={setFetch} stocks={stocks} />}
        id='add'
      />
      <Modal content={<ModModal />} id='modify' />
    </div>
  );
};

const stocksWrapperStyle = css`
  display: flex;
  flex-direction: column;
  margin: 0 auto 96px;
  padding: 0 10px;
  max-width: 1200px;
`;

const stocksInfoStyle = css`
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

const stocksTableStyle = css`
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

const stocksPaginationStyle = css`
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

export default AdminStocks;
