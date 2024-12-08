import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useNavigate } from 'react-router-dom';
import dayIcon from '@/assets/images/day-icon.png';
import positionIcon from '@/assets/images/position-icon.png';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import ProfileImage from '@/components/ProfileImage';
import RadioButton from '@/components/RadioButton';
import Table, { ColumnProps } from '@/components/Table';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useCreateFollowFolder,
  useDeleteSingleInterestStrategy,
  useGetTradersStrategyList,
  useGetUserFolderList,
} from '@/hooks/useStrategyApi';
import useAuthStore from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';
import getColorStyleBasedOnValue from '@/utils/tableUtils';

const PAGE_SIZE = 10;

interface StrategyDataProps {
  ranking?: number;
  traderNickname: string;
  strategyId: number;
  methodId: number;
  cycle: string;
  strategyName: string;
  mdd: number;
  smScore: number;
  accumulatedProfitLossRate: number;
  followerCount: number;
  methodIconPath?: string;
  stockList: {
    stockIds: number[];
    stockNames: string[];
    stockIconPath?: string[];
  };
  strategy?: any;
  isFollow?: boolean;
}

interface AddInterestModalProps {
  strategyId: number;
  traderStrategRefetch: () => void;
}

interface DeleteInterestModalProps {
  deleteStrategyId: number;
  traderStrategRefetch: () => void;
}

const SignupnModalContent = () => {
  const { closeModal } = useModalStore();
  const navigate = useNavigate();

  return (
    <div css={modalStyle}>
      투자자 회원가입이 필요한 서비스 입니다.
      <br />
      회원가입을 진행해주세요.
      <div className='btn-area'>
        <Button
          label='취소'
          border={true}
          width={120}
          handleClick={() => {
            closeModal('sign-up-modal-01');
          }}
        />
        <Button
          label='회원가입하기'
          width={120}
          handleClick={() => {
            navigate(PATH.SIGN_UP);
            closeModal('sign-up-modal-01');
          }}
        />
      </div>
    </div>
  );
};
const CheckLoginModalContent = () => {
  const { closeModal } = useModalStore();
  const navigate = useNavigate();

  return (
    <div css={modalStyle}>
      로그인이 필요합니다.
      <br />
      로그인하시겠습니까?
      <div className='btn-area'>
        <Button
          label='메인가기'
          border={true}
          width={120}
          handleClick={() => {
            navigate(PATH.ROOT);
            closeModal('check-login-modal-01');
          }}
        />
        <Button
          label='로그인'
          width={120}
          handleClick={() => {
            navigate(PATH.SIGN_IN);
            closeModal('check-login-modal-01');
          }}
        />
      </div>
    </div>
  );
};

const AddInterestModalContent = ({
  strategyId,
  traderStrategRefetch,
}: AddInterestModalProps) => {
  const { closeModal } = useModalStore();
  const addCompleteModal = useModalStore();

  const { data: folderListData } = useGetUserFolderList();
  const { mutate: createFollowFolder } = useCreateFollowFolder();
  const [selectedOption, setSelectedOption] = useState<string | ''>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const folderOptions =
    folderListData?.data.map((folder: any) => ({
      value: folder.id,
      label: folder.name,
    })) || [];

  const handleRadioChange = (value: string) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      setSelectedOption(value);
      setErrorMessage('');
    }
  };

  const validateRequest = (
    folderId: number | '',
    strategyId: number
  ): boolean => {
    if (!folderId) {
      setErrorMessage('폴더를 선택해주세요.');
      return false;
    }

    if (!Number.isInteger(strategyId) || strategyId <= 0) {
      setErrorMessage('유효하지 않은 전략 ID입니다.');
      return false;
    }

    return true;
  };

  const handleAddButtonClick = () => {
    const selectedOptionNumber = Number(selectedOption);

    if (!validateRequest(selectedOptionNumber, strategyId)) {
      return;
    }

    const requestBody = {
      folderId: selectedOptionNumber,
      strategyId: Number(strategyId),
    };

    createFollowFolder(requestBody, {
      onSuccess: () => {
        closeModal('add-interest-modal-01');
        traderStrategRefetch();
        addCompleteModal.openModal('add-complete-modal-01');
        setErrorMessage('');
        setSelectedOption('');
      },
    });
  };

  return (
    <div css={addInteresmodalStyle}>
      <span>관심등록</span>
      <RadioButton
        options={folderOptions}
        name='folder-radio'
        selected={selectedOption}
        handleChange={handleRadioChange}
      />
      {errorMessage && <span className='error-msg'>{errorMessage}</span>}
      <Button
        label='등록하기'
        size='sm'
        handleClick={handleAddButtonClick}
        disabled={!selectedOption}
      />
    </div>
  );
};

const AddCompleteModalContent = () => {
  const { closeModal } = useModalStore();
  const navigate = useNavigate();

  return (
    <div css={modalStyle}>
      해당전략을 관심등록했습니다.
      <br />
      마이페이지에서 확인하세요.
      <div className='btn-area'>
        <Button
          label='마이페이지 가기'
          border={true}
          width={120}
          handleClick={() => {
            navigate(PATH.MYPAGE);
            closeModal('add-complete-modal-01');
          }}
        />
        <Button
          label='계속하기'
          width={120}
          handleClick={() => {
            closeModal('add-complete-modal-01');
          }}
        />
      </div>
    </div>
  );
};

const DeleteInterestModalContent = ({
  deleteStrategyId,
  traderStrategRefetch,
}: DeleteInterestModalProps) => {
  const { closeModal } = useModalStore();
  const deleteCompleteModal = useModalStore();

  const { mutate: deleteInteresMutate } = useDeleteSingleInterestStrategy();

  const handleDeleteInteres = () => {
    deleteInteresMutate(deleteStrategyId, {
      onSuccess: () => {
        closeModal('delete-modal-01');
        traderStrategRefetch();
        deleteCompleteModal.openModal('delete-complete-modal-01');
      },
    });
  };

  return (
    <div css={modalStyle}>
      해당전략을 관심취소하시겠습니까?
      <div className='btn-area'>
        <Button
          label='아니오'
          border={true}
          width={120}
          handleClick={() => {
            closeModal('delete-modal-01');
          }}
        />
        <Button
          label='예'
          width={120}
          handleClick={() => {
            handleDeleteInteres();
          }}
        />
      </div>
    </div>
  );
};

const DeleteCompleteModalContent = () => {
  const { closeModal } = useModalStore();
  const navigate = useNavigate();

  return (
    <div css={modalStyle}>
      해당전략을 관심취소했습니다.
      <div className='btn-area'>
        <Button
          label='마이페이지 가기'
          border={true}
          width={120}
          handleClick={() => {
            navigate(PATH.MYPAGE);
            closeModal('delete-complete-modal-01');
          }}
        />
        <Button
          label='계속하기'
          width={120}
          handleClick={() => {
            closeModal('delete-complete-modal-01');
          }}
        />
      </div>
    </div>
  );
};

const TraderStrategyList = () => {
  const navigate = useNavigate();
  const { isLoggedIn, roleCode } = useAuthStore();

  const url = window.location.pathname;
  const traderId = url.split('/').pop();

  const checkLoginModal = useModalStore();
  const addInterestModal = useModalStore();
  const signUpModal = useModalStore();
  const deleteInterestModal = useModalStore();

  const [tableData, setTableData] = useState<StrategyDataProps[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [strategyId, setStrategyId] = useState(0);
  const [deleteStrategyId, setDeleteStrategyId] = useState(0);

  const { data: traderStrategyData, refetch: traderStrategRefetch } =
    useGetTradersStrategyList(Number(traderId), currentPage);

  const handleAddButtonClick = (id: number) => {
    setStrategyId(id);
    addInterestModal.openModal('add-interest-modal-01', 216);
  };

  const handleDeleteButtonClick = (id: number) => {
    setDeleteStrategyId(id);
    deleteInterestModal.openModal('delete-modal-01');
  };

  useEffect(() => {
    setTableData(traderStrategyData?.data?.strategyListDto?.content);
    setTotalPage(traderStrategyData?.data?.strategyListDto?.totalPages);
  }, [traderStrategyData]);

  const columns: ColumnProps<StrategyDataProps>[] = [
    {
      key: 'ranking',
      header: '순위',
      render: (_, __, rowIndex) => {
        const ranking = currentPage * PAGE_SIZE + (rowIndex + 1);
        return ranking;
      },
    },
    {
      key: 'traderNickname',
      header: '트레이더',
      render: () => (
        <div css={traderNicknameStyle}>
          <ProfileImage
            src={traderStrategyData?.data?.traderProfileImage}
            alt='profile'
          />
          {traderStrategyData?.data?.traderNickname}
        </div>
      ),
    },
    {
      key: 'strategyName',
      header: '전략명',
      render: (_, item) => (
        <div css={tagStyle}>
          <div className='tag'>
            <Tag src={item?.methodIconPath || ''} alt='tag' />
            <Tag src={item?.cycle === 'D' ? dayIcon : positionIcon} />
            {item?.stockList?.stockIconPath &&
              item?.stockList?.stockIconPath.map(
                (stock: string, index: number) => (
                  <Tag key={index} src={stock} alt='tag' />
                )
              )}
          </div>
          {item.strategyName}
        </div>
      ),
    },
    {
      key: 'accumulatedProfitLossRate',
      header: '누적 손익률',
      render: (_, item) => {
        const itemValue = item.accumulatedProfitLossRate;

        const { text, style } = getColorStyleBasedOnValue(itemValue);

        return (
          <div css={fontStyle} style={style}>
            {text}
          </div>
        );
      },
    },
    {
      key: 'mdd',
      header: 'MDD',
      render: (_, item) => {
        const itemValue = item.mdd;

        const { text, style } = getColorStyleBasedOnValue(itemValue);

        return (
          <div css={fontStyle} style={style}>
            {text}
          </div>
        );
      },
    },
    {
      key: 'smScore',
      header: 'SM Score',
      render: (_, item) => {
        const itemValue = item.smScore;

        const { text, style } = getColorStyleBasedOnValue(itemValue);

        return (
          <div css={fontStyle} style={style}>
            {text}
          </div>
        );
      },
    },
    {
      key: 'strategy',
      header: '전략',
      render: (_, item) => (
        <div css={buttonStyle}>
          {item.isFollow && (
            <Button
              label={'관심취소'}
              shape='round'
              size='xs'
              color='point'
              width={80}
              handleClick={() => {
                if (roleCode === 'USER') {
                  if (isLoggedIn) {
                    handleDeleteButtonClick(item.strategyId);
                  } else {
                    checkLoginModal.openModal('check-login-modal-01', 360);
                  }
                } else {
                  signUpModal.openModal('sign-up-modal-01', 360);
                }
              }}
            />
          )}
          {!item.isFollow && (
            <Button
              label={'관심등록'}
              shape='round'
              size='xs'
              color='point'
              width={80}
              handleClick={() => {
                if (roleCode === 'USER') {
                  if (isLoggedIn) {
                    handleAddButtonClick(item.strategyId);
                  } else {
                    checkLoginModal.openModal('check-login-modal-01', 360);
                  }
                } else {
                  signUpModal.openModal('sign-up-modal-01', 360);
                }
              }}
            />
          )}
          <Button
            label='상세보기'
            shape='round'
            size='xs'
            width={80}
            handleClick={() => {
              navigate(PATH.STRATEGIES_DETAIL(String(item.strategyId)));
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div css={strategyListWrapperStyle}>
      <Modal content={<CheckLoginModalContent />} id='check-login-moda-01' />
      <Modal
        content={
          <AddInterestModalContent
            strategyId={strategyId}
            traderStrategRefetch={traderStrategRefetch}
          />
        }
        id='add-interest-modal-01'
      />
      <Modal content={<AddCompleteModalContent />} id='add-complete-modal-01' />
      <Modal content={<SignupnModalContent />} id='sign-up-modal-01' />
      <Modal
        content={
          <DeleteInterestModalContent
            deleteStrategyId={deleteStrategyId}
            traderStrategRefetch={traderStrategRefetch}
          />
        }
        id='delete-modal-01'
      />
      <Modal
        content={<DeleteCompleteModalContent />}
        id='delete-complete-modal-01'
      />
      <section css={infoStyle}>
        <div className='info-area'>
          <ProfileImage
            src={traderStrategyData?.data?.traderProfileImage}
            alt='profile'
            size='xl'
          />
          <div className='info'>
            <span>트레이더</span>
            <h6>{traderStrategyData?.data?.traderNickname}</h6>
          </div>
        </div>
        <div className='button-area'>
          <div className='button'>
            <span>관심수</span>
            <div className='icon-btn'>
              <FavoriteBorderOutlinedIcon />
              {traderStrategyData?.data?.followerCount ?? 0}
            </div>
          </div>
          <div className='button'>
            <span>전략수</span>
            <div className='icon-btn'>
              <ContentCopyOutlinedIcon />
              {traderStrategyData?.data?.strategyCount ?? 0}
            </div>
          </div>
        </div>
      </section>
      <section css={tableWrapperStyle}>
        <div className='title-area'>
          <h5>트레이더 전략정보</h5>
        </div>
        <Table data={tableData || []} columns={columns} />
        {tableData?.length > 0 ? (
          <Pagination
            totalPage={totalPage}
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
          />
        ) : (
          <span css={emptyContents}>트레이더의 전략 정보가 없습니다.</span>
        )}
      </section>
    </div>
  );
};

const traderNicknameStyle = css`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const strategyListWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1200px;
  padding: 96px 10px;
  margin: 0 auto;
`;

const infoStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-radius: 4px;
  border: 1px solid ${COLOR.GRAY};

  .info-area {
    display: flex;
    align-items: center;
    gap: 16px;

    .info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      span {
        color: ${COLOR.PRIMARY};
        font-size: ${FONT_SIZE.TEXT_XS};
      }
    }
  }

  .button-area {
    display: flex;
    gap: 40px;

    .button {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .icon-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      color: ${COLOR.POINT};

      svg {
        color: ${COLOR.POINT};
        font-size: ${FONT_SIZE.TITLE_XS};
      }
    }
  }
`;

const modalStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  line-height: 160%;
  padding-top: 8px;
  text-align: center;

  .btn-area {
    display: flex;
    gap: 16px;
  }
`;

const tableWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 29px;

  table > thead > tr > th {
    &:nth-of-type(1) {
      width: 80px;
    }
    &:nth-of-type(2) {
      width: 202px;
    }
    &:nth-of-type(3) {
      width: 280px;
    }
    &:nth-of-type(4) {
      width: 120px;
    }
    &:nth-of-type(5) {
      width: 120px;
    }
    &:nth-of-type(6) {
      width: 120px;
    }
    &:nth-of-type(7) {
      width: 120px;
    }
  }

  table > tbody > tr > td {
    &:nth-of-type(2) div {
      display: flex;
      justify-content: center;
    }
  }

  .title-area {
    position: relative;
    padding: 28px 0;

    h5::after {
      content: '';
      position: absolute;
      height: 1px;
      width: 100%;
      left: 0;
      bottom: 0;
      background-color: ${COLOR.GRAY};
    }
  }
`;

const buttonStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  button:nth-of-type(1) {
    background: none;
    border: 1px solid ${COLOR.POINT};
    color: ${COLOR.POINT};

    :hover {
      background: ${COLOR_OPACITY.POINT_OPACITY10};
      transition: 0.3s;
    }
  }

  button:nth-of-type(2) {
    background: none;
    border: 1px solid ${COLOR.PRIMARY};
    color: ${COLOR.PRIMARY};

    :hover {
      background: ${COLOR_OPACITY.PRIMARY_OPACITY10};
      transition: 0.3s;
    }
  }
`;

const tagStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  text-align: start;

  .tag {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const addInteresmodalStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;

  .css-1o97835 {
    flex-direction: column;
  }
  span {
    font-size: ${FONT_SIZE.TEXT_SM};
    font-weight: ${FONT_WEIGHT.MEDIUM};
  }
  .error-msg {
    color: ${COLOR.ERROR_RED};
    font-size: ${FONT_SIZE.TEXT_SM};
  }
`;

const fontStyle = css`
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const emptyContents = css`
  padding: 32px;
  border-radius: 4px;
  background: ${COLOR.GRAY100};
  text-align: center;
`;

export default TraderStrategyList;
