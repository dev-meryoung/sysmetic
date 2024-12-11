import { ReactNode, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  QueryObserverResult,
  RefetchOptions,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayIcon from '@/assets/images/day-icon.png';
import positionIcon from '@/assets/images/position-icon.png';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import ProfileImage from '@/components/ProfileImage';
import Table, { ColumnProps } from '@/components/Table';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useCheckFolderAvailability,
  useCreatFolder,
  useDeleteFolder,
  useDeleteInterestStrategy,
  useGetUserFolderList,
  useInterestStrategy,
  useUpdateFolderName,
} from '@/hooks/useStrategyApi';
import useModalStore from '@/stores/useModalStore';
import { useTableStore } from '@/stores/useTableStore';
import getColorStyleBasedOnValue from '@/utils/tableUtils';
interface MyInterestListDataProps {
  ranking?: number;
  id: number;
  strategyName: string;
  traderId: number;
  traderName: string;
  traderProfileImage: string;
  methodId: number;
  methodIconPath: string;
  stockIconPath: string[] | null;
  cycle: string;
  stockList: {
    stockIds: number[];
    stockNames: string[];
    stockIconPath?: string[];
  };
  followerCount: number;
  accumulatedProfitRatio: number;
  smScore: number;
  mdd: number;
  actions?: ReactNode;
}

interface FolderProps {
  id: number | string;
  name: string;
  isEmpty: boolean;
  strategies: MyInterestListDataProps[];
}

const PAGE_SIZE = 10;

const CheckModalContent = () => (
  <div css={checkModalStyle}>내관심전략에서 삭제할 전략을 선택해주세요.</div>
);

const DeleteFolderModalContent = ({ folderId }: { folderId: number }) => {
  const { closeModal } = useModalStore();
  const [errorMessage, setErrorMessage] = useState<string | null>('');

  const deleteFolderMutation = useDeleteFolder();
  const { refetch: refetchFolders } = useGetUserFolderList();

  const handleFolderDelete = () => {
    deleteFolderMutation.mutate(folderId, {
      onSuccess: () => {
        setErrorMessage('');
        refetchFolders();
        closeModal('folder-delete-modal');
      },
      onError: (error) => {
        setErrorMessage(`${error.message}`);
      },
    });
  };

  return (
    <div css={modalStyle}>
      폴더를 삭제하면 <br />
      해당 관심전략도 모두 삭제됩니다.
      <br /> 삭제하시겠습니까?
      {errorMessage && <span className='delete-error-msg'>{errorMessage}</span>}
      <div className='btn-area'>
        <Button
          label='취소'
          border={true}
          width={120}
          handleClick={() => closeModal('folder-delete-modal')}
        />
        <Button label='삭제하기' width={120} handleClick={handleFolderDelete} />
      </div>
    </div>
  );
};

const DeleteSingleStrategyModalContent = ({
  singleStrategy,
  refetchStrategies,
}: {
  singleStrategy: number;
  refetchStrategies: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
}) => {
  const { closeModal } = useModalStore();
  const { toggleAllCheckboxes } = useTableStore();
  const deleteSingleStrategyMutation = useDeleteInterestStrategy();

  const handleSingleStrategyDelete = () => {
    deleteSingleStrategyMutation.mutate(
      { strategyId: [singleStrategy] },
      {
        onSuccess: () => {
          toggleAllCheckboxes(0);
          closeModal('delete-single-strategy-modal');
          refetchStrategies();
        },
        onError: (error) => {
          alert(`삭제에 실패했습니다: ${error.message}`);
        },
      }
    );
  };

  return (
    <div css={modalStyle}>
      해당전략을 관심취소 하시겠습니까?
      <div className='btn-area'>
        <Button
          label='아니오'
          border={true}
          width={120}
          handleClick={() => closeModal('delete-single-strategy-modal')}
        />
        <Button
          label='예'
          width={120}
          handleClick={handleSingleStrategyDelete}
        />
      </div>
    </div>
  );
};

const DeleteStrategyModalContent = ({
  strategyIds,
  refetchStrategies,
}: {
  strategyIds: number[];
  refetchStrategies: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
}) => {
  const { closeModal } = useModalStore();
  const { toggleAllCheckboxes } = useTableStore();

  const { mutate: deleteStrategyMutation } = useDeleteInterestStrategy();

  const handleStrategyDelete = () => {
    deleteStrategyMutation(
      { strategyId: strategyIds },
      {
        onSuccess: async () => {
          refetchStrategies();
          toggleAllCheckboxes(0);
          closeModal('delete-strategy-modal');
        },
        onError: (error) => {
          console.error('Strategy deletion failed:', error);
          alert(`삭제에 실패했습니다: ${error.message}`);
        },
      }
    );
  };

  return (
    <div css={modalStyle}>
      {strategyIds?.length}개의 전략을 삭제하시겠습니까?
      <div className='btn-area'>
        <Button
          label='아니오'
          border={true}
          width={120}
          handleClick={() => closeModal('delete-strategy-modal')}
        />
        <Button label='예' width={120} handleClick={handleStrategyDelete} />
      </div>
    </div>
  );
};

const MyInterestList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteModal = useModalStore();
  const deleteSingleInterestModal = useModalStore();
  const deleteInterestModal = useModalStore();
  const checkModal = useModalStore();

  const [folders, setFolders] = useState<FolderProps[]>([]);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [deletingFolderId, setDeletingFolderId] = useState<number | string>(0);
  const [tempFolderName, setTempFolderName] = useState<string>('');
  const [folderErrors, setFolderErrors] = useState<Record<string, string>>({});
  const [editingFolderId, setEditingFolderId] = useState<
    string | number | null
  >(null);

  const [tableData, setTableData] = useState<MyInterestListDataProps[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [totalElement, setTotalElement] = useState(0);
  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );

  const [isSelectedFolder, setIsSelectedFolder] = useState<{
    folderName: string;
    folderId: string | number;
    isEmpty: boolean;
  }>({
    folderName: '',
    folderId: 1,
    isEmpty: false,
  });

  const { data: folderListData, refetch: folderListRefetch } =
    useGetUserFolderList();
  const { mutate: createFolderMutation } = useCreatFolder();
  const { mutate: updateFolderNameMutation } = useUpdateFolderName();
  const { mutate: checkFolderMutation } =
    useCheckFolderAvailability(tempFolderName);

  const {
    data: strategyData,
    refetch: refetchStrategies,
    isLoading: strategyisLoading,
  } = useInterestStrategy(
    typeof isSelectedFolder.folderId === 'string'
      ? parseInt(isSelectedFolder.folderId, 10)
      : isSelectedFolder.folderId,
    currentPage
  );

  const handleFolderClick = (folder: FolderProps) => {
    if (!isEditingMode && folder.name !== '') {
      setCurrentPage(0);
      setIsSelectedFolder({
        folderName: folder.name,
        folderId: folder.id,
        isEmpty: folder.isEmpty,
      });
    }
  };

  const handleStartEditing = (folder: FolderProps) => {
    if (!isEditingMode) return;

    setEditingFolderId(folder.id);
    setTempFolderName(folder.name);
  };

  const handleSaveFolder = () => {
    const errorKey = String(editingFolderId);
    setFolderErrors({});

    if (tempFolderName.length < 3 || tempFolderName.length > 20) {
      setFolderErrors({
        [errorKey]: '폴더명은 3-20자로 입력해주세요',
      });
      return;
    }

    checkFolderMutation(tempFolderName, {
      onSuccess: (data) => {
        if (data?.code === 200) {
          const isNewFolder = String(editingFolderId).startsWith('empty-');

          if (isNewFolder) {
            createFolderMutation(
              { name: tempFolderName, checkDupl: true },
              {
                onSuccess: () => {
                  queryClient
                    .invalidateQueries({ queryKey: ['userFolderList'] })
                    .then(() => {
                      setFolders((prev) =>
                        prev.map((folder) =>
                          folder.id === editingFolderId
                            ? { ...folder, isEmpty: false }
                            : folder
                        )
                      );
                      folderListRefetch();
                      setEditingFolderId(null);
                      setTempFolderName('');
                    });
                },
                onError: (error) => {
                  setFolderErrors({
                    [errorKey]: `${error.message}`,
                  });
                },
              }
            );
          } else {
            updateFolderNameMutation(
              {
                folderId: editingFolderId as number,
                folderName: tempFolderName,
                checkDupl: true,
              },
              {
                onSuccess: () => {
                  queryClient
                    .invalidateQueries({ queryKey: ['folderList'] })
                    .then(() => {
                      queryClient.refetchQueries({ queryKey: ['folderList'] });
                      setEditingFolderId(null);
                      setTempFolderName('');
                    });
                },
                onError: () => {
                  setFolderErrors({
                    [errorKey]: '폴더 수정에 실패했습니다',
                  });
                },
              }
            );
          }
        } else if (data?.code === 409) {
          setFolderErrors({
            [errorKey]: '이미 존재하는 폴더명입니다',
          });
        }
      },
      onError: (error: Error, _, __) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 409) {
            setFolderErrors({
              [errorKey]: '이미 존재하는 폴더명입니다',
            });
          } else {
            setFolderErrors({
              [errorKey]: '폴더 중복 검사 중 오류가 발생했습니다',
            });
          }
        } else {
          setFolderErrors({
            [errorKey]: '알 수 없는 오류가 발생했습니다',
          });
        }
      },
    });
  };

  const getSelectedStrategyIds = () => {
    const selectedStrategyIds = checkedItems
      .map((index) => tableData[index]?.id)
      .filter((id) => id !== undefined);

    return selectedStrategyIds;
  };

  const strategyIds = getSelectedStrategyIds();

  const handleDeleteInterestStrategy = () => {
    if (checkedItems?.length > 0) {
      deleteInterestModal.openModal('delete-strategy-modal', 336);
    } else {
      checkModal.openModal('check-modal', 336);
    }
  };

  const [singleStrategy, setSingleStrategy] = useState(0);

  const handleDeleteSingleInterestStrategy = (id: number) => {
    setSingleStrategy(id);
    deleteSingleInterestModal.openModal('delete-single-strategy-modal', 336);
  };

  const handleDeleteButtonClick = (folderId: number | string) => {
    setDeletingFolderId(folderId);
    deleteModal.openModal('folder-delete-modal', 360);
  };

  useEffect(() => {
    if (!isEditingMode) {
      setFolderErrors({});
      setTempFolderName('');
    }
  }, [isEditingMode]);

  useEffect(() => {
    if (folderListData?.data) {
      const fetchedFolders = folderListData.data;
      const emptyFolders = Array.from(
        { length: 5 - fetchedFolders.length },
        (_, i) => ({
          id: `empty-${fetchedFolders.length + i}`,
          name: '',
          isEmpty: true,
          strategies: [],
        })
      );

      const allFolders = [...fetchedFolders, ...emptyFolders];
      setFolders(allFolders);
    }
  }, [folderListData]);

  useEffect(() => {
    if (strategyData?.data) {
      setTableData(strategyData.data.content || []);
      setTotalPage(strategyData.data.totalPages || 0);
      setTotalElement(strategyData.data.totalElement || 0);
    } else {
      setTableData([]);
      refetchStrategies();
    }
  }, [strategyData, isSelectedFolder, refetchStrategies]);

  useEffect(() => {
    if (folders.length > 0 && !isEditingMode) {
      const firstFolder = folders[0];
      setIsSelectedFolder({
        folderName: firstFolder.name,
        folderId: firstFolder.id,
        isEmpty: firstFolder.isEmpty,
      });
    }
  }, [folders, isEditingMode]);

  const columns: ColumnProps<MyInterestListDataProps>[] = [
    {
      key: 'ranking',
      header: '순서',
      render: (_, __, rowIndex: number) =>
        rowIndex + 1 + currentPage * PAGE_SIZE,
    },
    {
      key: 'traderName',
      header: '트레이더',
      render: (_, item) => (
        <div css={traderStyle}>
          <ProfileImage src={item.traderProfileImage} />
          {item.traderName}
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
            {item?.stockIconPath &&
              item?.stockIconPath.map((stock: string, index: number) => (
                <Tag key={index} src={stock} alt='tag' />
              ))}
          </div>
          <span>{item.strategyName}</span>
        </div>
      ),
    },
    {
      key: 'accumulatedProfitRatio',
      header: '누적 손익률',
      render: (_, item) => {
        const itemValue = item.accumulatedProfitRatio;

        const { text, style } = getColorStyleBasedOnValue(itemValue);

        return (
          <div css={fontStyle} style={style}>
            {text || 0}
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
            {text || 0}
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
            {text || 0}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: '상태',
      render: (_, item) => (
        <div css={buttonStyle}>
          <Button
            label='관심취소'
            shape='round'
            size='xs'
            color='point'
            width={80}
            handleClick={() => handleDeleteSingleInterestStrategy(item.id)}
          />
          <Button
            label='상세보기'
            shape='round'
            size='xs'
            width={80}
            handleClick={() =>
              navigate(PATH.STRATEGIES_DETAIL(String(item.id)))
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div css={interestListWrapperStyle}>
      <section className='folder'>
        <Button
          label={isEditingMode ? ' 편집완료' : '폴더편집'}
          width={80}
          handleClick={() => {
            setIsEditingMode((prev) => !prev);
          }}
        />
        <section css={folderWrapper}>
          {folders.map((folder) => (
            <section css={folderBtnWrapperStyle} key={folder.id}>
              {isEditingMode && (
                <div css={buttonWrapperStyle}>
                  {editingFolderId === folder.id ? (
                    <Button
                      label='완료'
                      shape='none'
                      size='xxs'
                      handleClick={() => {
                        handleSaveFolder();
                      }}
                    />
                  ) : folder.name === '' ? (
                    <></>
                  ) : (
                    <>
                      <Button
                        label='수정'
                        shape='none'
                        size='xxs'
                        handleClick={() => handleStartEditing(folder)}
                      />
                      <span></span>
                      <Button
                        label='삭제'
                        shape='none'
                        size='xxs'
                        handleClick={() => handleDeleteButtonClick(folder.id)}
                      />
                    </>
                  )}
                </div>
              )}
              <div
                css={folderBtnStyle(
                  folder.isEmpty,
                  isSelectedFolder.folderId === folder.id,
                  isEditingMode
                )}
                onClick={() => handleFolderClick(folder)}
              >
                {editingFolderId === folder.id ? (
                  <textarea
                    value={tempFolderName}
                    onChange={(e) => setTempFolderName(e.target.value)}
                    placeholder='폴더명 3 ~ 20자'
                    minLength={3}
                    maxLength={20}
                    autoFocus
                  />
                ) : folder.name === '' ? (
                  isEditingMode ? (
                    <AddCircleOutlineIcon
                      onClick={() => {
                        handleStartEditing(folder);
                      }}
                    />
                  ) : (
                    ''
                  )
                ) : (
                  <span>{folder.name}</span>
                )}
              </div>
              {folder.id === editingFolderId &&
                folderErrors[editingFolderId] && (
                  <span className='error-message'>
                    {folderErrors[editingFolderId] ||
                      '알 수 없는 오류가 발생했습니다.'}
                  </span>
                )}
            </section>
          ))}
        </section>
      </section>

      {!isEditingMode && (
        <>
          <section className='folder-name'>
            <h5>{isSelectedFolder.folderName}</h5>
          </section>
          <section css={tableStyle}>
            {tableData?.length > 0 && (
              <div className='table-info'>
                <h6 className='info-text'>
                  총 <strong>{totalElement}</strong>개의 리스트
                </h6>
                <Button
                  label='삭제'
                  width={80}
                  color='black'
                  handleClick={handleDeleteInterestStrategy}
                />
              </div>
            )}
            <Table
              data={tableData || []}
              columns={columns}
              hasCheckbox={tableData?.length > 0}
              checkedItems={checkedItems}
              handleCheckboxChange={toggleCheckbox}
              handleHeaderCheckboxChange={() =>
                toggleAllCheckboxes(tableData?.length || 0)
              }
            />
            {strategyisLoading && (
              <div css={loadingStyle}>
                <Loading />
              </div>
            )}
            {!strategyisLoading &&
              (tableData?.length > 0 ? (
                <Pagination
                  totalPage={totalPage}
                  currentPage={currentPage}
                  handlePageChange={setCurrentPage}
                />
              ) : (
                <div css={emptyContents}>
                  <span>
                    해당 폴더에 등록된 전략이 없습니다. 새로운 전략을
                    탐색해보세요!
                  </span>
                  <Button
                    label='전략 탐색하기'
                    border={true}
                    width={100}
                    size='sm'
                    handleClick={() => {
                      navigate(PATH.STRATEGIES_LIST);
                    }}
                  />
                </div>
              ))}
          </section>
        </>
      )}
      <Modal
        content={
          <DeleteFolderModalContent folderId={deletingFolderId as number} />
        }
        id='folder-delete-modal'
      />
      <Modal
        content={
          <DeleteStrategyModalContent
            strategyIds={strategyIds as number[]}
            refetchStrategies={refetchStrategies}
          />
        }
        id='delete-strategy-modal'
      />
      <Modal
        content={
          <DeleteSingleStrategyModalContent
            singleStrategy={singleStrategy as number}
            refetchStrategies={refetchStrategies}
          />
        }
        id='delete-single-strategy-modal'
      />
      <Modal content={<CheckModalContent />} id='check-modal' />
    </div>
  );
};

const interestListWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 105px;

  .folder {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 24px;
  }

  .folder-name {
    position: relative;
    padding: 28px 0;

    h5::after {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: ${COLOR_OPACITY.BLACK_OPACITY30};
    }
  }
`;

const loadingStyle = css`
  width: 100%;
  height: 100vh;
  padding: 100px;
`;

const folderWrapper = css`
  display: flex;
  gap: 20px;
  width: 100%;
`;

const fontStyle = css`
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const folderBtnWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: flex-end;
  justify-content: flex-end;
  position: relative;

  .error-message {
    color: ${COLOR.ERROR_RED};
    font-size: ${FONT_SIZE.TEXT_SM};
    margin-top: 4px;
    width: 100%;
    text-align: start;
    position: absolute;
    top: 126px;
  }
`;

const folderBtnStyle = (
  isEmpty: boolean,
  isSelected: boolean,
  isEditingMode: boolean
) => css`
  display: flex;
  background: transparent;
  border-width: 1px;
  border-style: ${isEmpty ? 'dashed' : 'solid'};
  border-color: ${!isEditingMode && isSelected
    ? COLOR.PRIMARY
    : COLOR.PRIMARY100};
  border-radius: 4px;
  padding: 24px;
  min-height: 94px;
  max-height: 94px;
  width: 100%;

  textarea {
    border: none;
    outline: none;
    font-weight: ${FONT_WEIGHT.MEDIUM};
    font-size: ${FONT_SIZE.TEXT_MD};
    color: ${COLOR.PRIMARY};
    background-color: ${COLOR.GRAY100};
    width: 100%;
    height: 40px;
    resize: none;
    overflow-y: hidden;
  }

  span {
    font-weight: ${FONT_WEIGHT.BOLD};
    color: ${COLOR.PRIMARY};
    line-height: 160%;
  }

  svg {
    font-size: ${FONT_SIZE.TITLE_XL};
    color: ${COLOR.PRIMARY100};
    width: 100%;
  }

  :hover {
    cursor: pointer;
    background: ${isEmpty ? '' : COLOR_OPACITY.PRIMARY_OPACITY10};
    transition: 0.2s;

    svg {
      color: ${isEmpty ? COLOR.PRIMARY : ''};
    }
  }
`;

const buttonWrapperStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    width: 1px;
    height: 14px;
    background: ${COLOR.GRAY600};
  }
`;

const tableStyle = css`
  display: flex;
  flex-direction: column;
  gap: 32px;

  table > thead > tr > th {
    &:nth-of-type(1) {
      width: 80px;
      display: flex;
      justify-content: center;
    }
    &:nth-of-type(2) {
      width: 80px;
    }
    &:nth-of-type(3) {
      width: 202px;
    }
    &:nth-of-type(4) {
      width: 280px;
    }
    &:nth-of-type(5) {
      width: 196px;
    }
    &:nth-of-type(6) {
      width: 120px;
    }
    &:nth-of-type(7) {
      width: 120px;
    }
    &:nth-of-type(8) {
      width: 120px;
    }
  }

  table > tbody > tr > td {
    &:nth-of-type(1) div {
      display: flex;
      justify-content: center;
    }
    &:nth-of-type(3) div {
      justify-content: center;
    }
    &:nth-of-type(4) {
      text-align: left;
    }
  }

  .table-info {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .info-text {
      font-weight: ${FONT_WEIGHT.REGULAR};

      strong {
        font-weight: ${FONT_WEIGHT.BOLD};
      }
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

const traderStyle = css`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const modalStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  line-height: 160%;
  text-align: center;
  margin-top: 8px;

  .btn-area {
    display: flex;
    gap: 16px;
  }

  .delete-error-msg {
    color: ${COLOR.ERROR_RED};
    font-size: ${FONT_SIZE.TEXT_SM};
  }
`;

const checkModalStyle = css`
  display: flex;
  margin-top: 8px;
  gap: 24px;
  padding: 24px 0;
`;

const emptyContents = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  border-radius: 4px;
  line-height: 160%;
  text-align: center;
`;

const tagStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .tag {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
  }
`;

export default MyInterestList;
