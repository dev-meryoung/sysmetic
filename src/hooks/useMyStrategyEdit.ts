import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH } from '@/constants/path';
import {
  CreateMyStrategyDailyRequest,
  useCancelApproveStrategy,
  useChangePrivateStrategy,
  useCreateMyStrategyAccount,
  useCreateMyStrategyDaily,
  useDeleteMyStrateAccount,
  useDeleteMyStrateDaily,
  useGetExampleExcelLink,
  useGetMethodAndStock,
  useGetMyStrategyInfo,
  useGetStrategyAccount,
  useGetStrategyDaily,
  useRequestApproveStrategy,
  useUpdateMyStrategyDaily,
  useUpdateStrategy,
  useUploadDailyExcel,
} from '@/hooks/useStrategyApi';
import useAuthStore from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

const useMyStrategyEdit = () => {
  const navigate = useNavigate();
  const { roleCode } = useAuthStore();
  const { openModal, closeModal } = useModalStore();
  const { strategyId } = useParams();

  const [currentTab, setCurrentTab] = useState<number>(0);
  const [dailyPage, setDailyPage] = useState<number>(0);
  const [accountPage, setAccountPage] = useState<number>(0);
  const [methodOptions, setMethodOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [stockOptions, setStockOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [status, setStatus] = useState<string>('PRIVATE');
  const [statusToggle, setStatusToggle] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [cycle, setCycle] = useState<string>('');
  const [stocks, setStocks] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [dailyStartDate, setDailyStartDate] = useState<string>('');
  const [dailyEndDate, setDailyEndDate] = useState<string>('');
  const [dailyTotalPage, setDailyTotalPage] = useState<string>('');
  const [newDailyData, setNewDailyData] = useState<
    CreateMyStrategyDailyRequest[]
  >(
    Array(5).fill({
      date: '',
      depositWithdrawalAmount: 0,
      dailyProfitLossAmount: 0,
    })
  );
  const [editingDailyId, setEditingDailyId] = useState<number>(0);
  const [editedDailyData, setEditedDailyData] = useState({
    date: '',
    depositWithdrawalAmount: 0,
    dailyProfitLossAmount: 0,
  });
  const [deleteDailyId, setDeleteDailyId] = useState<number>(0);
  const [accountTotalPage, setAccountTotalPage] = useState<string>('');
  const [newAccountData, setNewAccountData] = useState<
    {
      title: string;
      image: File | null;
    }[]
  >(Array(5).fill({ title: '', image: null }));
  const [checkedAccount, setCheckedAccount] = useState<number[]>([]);
  const [submitErrorData, setSubmitErrorData] = useState<string[]>([]);
  const [noticeMessage, setNoticeMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const excelFileInputRef = useRef<HTMLInputElement>(null);

  const { data: methodsAndStocks } = useGetMethodAndStock();
  const {
    data: strategyInfo,
    isError: strategyInfoIsError,
    refetch: refetchStrategyInfo,
  } = useGetMyStrategyInfo(strategyId as string);
  const { data: strategyDaily, refetch: refetchDaily } = useGetStrategyDaily(
    strategyId as string,
    dailyPage,
    dailyStartDate,
    dailyEndDate
  );
  const { data: strategyAccount, refetch: refetchAccount } =
    useGetStrategyAccount(strategyId as string, accountPage);
  const { data: exampleLink } = useGetExampleExcelLink();
  const { mutate: submitStrategyMutate } = useUpdateStrategy();
  const { mutate: requestApproveMutate } = useRequestApproveStrategy();
  const { mutate: cancelApproveMutate } = useCancelApproveStrategy();
  const { mutate: changePrivateMutate } = useChangePrivateStrategy();
  const { mutate: uploadDailyExcelMutate } = useUploadDailyExcel();
  const { mutate: createDailyMutate } = useCreateMyStrategyDaily();
  const { mutate: updateDailyMutate } = useUpdateMyStrategyDaily();
  const { mutate: deleteDailyMutate } = useDeleteMyStrateDaily();
  const { mutate: createAccountMutate } = useCreateMyStrategyAccount();
  const { mutate: deleteAccountMutate } = useDeleteMyStrateAccount();

  useEffect(() => {
    if (strategyInfoIsError) navigate(PATH.MYPAGE);

    if (roleCode === 'TRADER' && methodsAndStocks && strategyInfo) {
      setMethodOptions(
        methodsAndStocks.methodList.map(
          (method: { id: number; name: string }) => ({
            label: method.name,
            value: method.id.toString(),
          })
        )
      );
      setStockOptions(
        methodsAndStocks.stockList.map(
          (stock: { id: number; name: string }) => ({
            label: stock.name,
            value: stock.id.toString(),
          })
        )
      );

      setStatus(strategyInfo.statusCode);
      setStatusToggle(strategyInfo.statusCode === 'PUBLIC');
      setTitle(strategyInfo.name);
      setMethod(strategyInfo.methodId.toString());
      setCycle(strategyInfo.cycle);
      setStocks(strategyInfo.stockList.stockIds.map(String));
      setContent(strategyInfo.content);

      if (strategyInfo?.fileWithInfoResponse) {
        const { url, originalName } = strategyInfo.fileWithInfoResponse;

        fetch(url)
          .then((response) => response.blob())
          .then((blob) => {
            const file = new File([blob], originalName, {
              type: blob.type,
              lastModified: Date.now(),
            });

            setFile(file);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [roleCode, strategyInfo, strategyInfoIsError]);

  useEffect(() => {
    if (strategyDaily) setDailyTotalPage(strategyDaily.totalPages.toString());
  }, [strategyDaily]);

  useEffect(() => {
    if (strategyAccount)
      setAccountTotalPage(strategyAccount.totalPages.toString());
  }, [strategyAccount]);

  const resetNewDailyData = () => {
    setNewDailyData(
      Array(5).fill({
        date: '',
        depositWithdrawalAmount: 0,
        dailyProfitLossAmount: 0,
      })
    );
  };

  const handleCheckboxChange = (value: string) => {
    setStocks((prev) =>
      prev.includes(value)
        ? prev.filter((stock) => stock !== value)
        : [...prev, value]
    );
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setNoticeMessage('제안서 파일은 PDF 확장자만 첨부 가능합니다.');
        openModal('notice', 400);
        setFile(null);
      } else if (selectedFile.size > 5 * 1024 * 1024) {
        setNoticeMessage('제안서 파일 용량은 5MB를 초과할 수 없습니다.');
        openModal('notice', 400);
        setFile(null);
      } else {
        setNoticeMessage('');
        setFile(selectedFile);
      }
    }

    e.target.value = '';
  };

  const handleFileDelete = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateStrategyInputs = (): string[] => {
    const errors: string[] = [];

    const isInvalidInput = (input: string) =>
      !input || input.trim() === '' || /^[　\s]+$/.test(input);

    if (isInvalidInput(title)) {
      errors.push('전략명');
    }

    if (!method) {
      errors.push('매매방식');
    }

    if (!cycle) {
      errors.push('주기');
    }

    if (stocks.length === 0) {
      errors.push('운용종목');
    }

    if (isInvalidInput(content)) {
      errors.push('전략소개');
    }

    return errors;
  };

  const handleStrategySubmitButton = () => {
    const errors = validateStrategyInputs();

    if (errors.length > 0) {
      setSubmitErrorData(errors);
      openModal('submit', 400);
      return;
    }

    setSubmitErrorData([]);

    const formData = new FormData();

    formData.append(
      'requestDto',
      JSON.stringify({
        name: title,
        methodId: method,
        cycle,
        stockIdList: stocks,
        content,
      })
    );

    if (file) {
      formData.append('file', file);
    } else {
      formData.append('file', new Blob(), '');
    }

    submitStrategyMutate(
      { strategyId: strategyId!, formData },
      {
        onSuccess: (res) => {
          if (res.code === 200) {
            setNoticeMessage('전략이 수정되었습니다.');
            openModal('notice', 400);
          } else if (res.code === 409) {
            setNoticeMessage('입력하신 전략명은 이미 사용 중입니다.');
            openModal('notice', 400);
          }
        },
      }
    );
  };

  const handleRequestApproveButton = () => {
    if (!strategyDaily || (strategyDaily.totalElement as number) < 3) {
      setNoticeMessage('일간분석 데이터를 3개 이상 등록해 주세요.');
      openModal('notice', 400);
      return;
    }

    if (strategyId) {
      requestApproveMutate(strategyId, {
        onSuccess: () => {
          refetchStrategyInfo();
          setNoticeMessage('전략 승인이 요청되었습니다.');
          openModal('notice', 400);
        },
      });
    }
  };

  const handleCancelApproveButton = () => {
    if (strategyId) {
      cancelApproveMutate(strategyId, {
        onSuccess: () => {
          refetchStrategyInfo();
          setNoticeMessage('전략 승인 요청이 취소되었습니다.');
          openModal('notice', 400);
        },
      });
    }
  };

  const handleDailyAddButton = () => {
    openModal('daily-add', 800);
  };

  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (
        selectedFile.type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        setNoticeMessage('엑셀 파일은 .xlsx 확장자만 첨부 가능합니다.');
        openModal('notice', 400);
        return;
      } else if (selectedFile.size > 5 * 1024 * 1024) {
        setNoticeMessage('엑셀 파일 용량은 5MB를 초과할 수 없습니다.');
        openModal('notice', 400);
        return;
      } else {
        if (strategyId) {
          const formData = new FormData();
          formData.append('file', selectedFile);

          uploadDailyExcelMutate(
            { strategyId: +strategyId, formData },
            {
              onSuccess: () => {
                setNoticeMessage('엑셀 파일이 성공적으로 업로드되었습니다.');
                openModal('notice', 400);
                refetchDaily();
              },
              onError: () => {
                setNoticeMessage('파일 업로드에 실패했습니다.');
                openModal('notice', 400);
              },
            }
          );
        }
      }
    }

    e.target.value = '';
  };

  const handleNewDailyDataChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setNewDailyData((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDailySubmitButton = () => {
    if (strategyId)
      createDailyMutate(
        {
          strategyId: +strategyId,
          dailyData: newDailyData.filter(
            (data) => data.date && data.date.trim() !== ''
          ),
        },
        {
          onSuccess: (res) => {
            if (res.code === 200) {
              closeModal('daily-add');
              resetNewDailyData();
              refetchDaily();
            }
          },
          onError: () => {
            closeModal('daily-add');
            resetNewDailyData();
            setNoticeMessage('입력한 날짜 및 데이터가 올바르지 않습니다.');
            openModal('notice', 400);
          },
        }
      );
  };

  const handleDailyEditButton = (daily: {
    dailyId: number;
    date: string;
    depositWithdrawalAmount: number;
    profitLossAmount: number;
  }) => {
    setEditingDailyId(daily.dailyId);
    setEditedDailyData({
      date: daily.date,
      depositWithdrawalAmount: daily.depositWithdrawalAmount,
      dailyProfitLossAmount: daily.profitLossAmount,
    });
  };

  const handleDailyUpdateButton = () => {
    updateDailyMutate(
      {
        dailyId: editingDailyId,
        updatedData: editedDailyData,
      },
      { onSuccess: () => refetchDaily() }
    );

    setEditingDailyId(0);
  };

  const handleDailyDeleteButton = () => {
    deleteDailyMutate(deleteDailyId, { onSuccess: () => refetchDaily() });
    closeModal('daily-delete');
  };

  const handleAccountAddButton = () => {
    openModal('account-add', 800);
  };

  const handleBrowseImageClick = (index: number) => {
    const input = document.getElementById(
      `image-input-${index}`
    ) as HTMLInputElement;
    if (input) input.click();
  };

  const handleImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setNoticeMessage('이미지는 JPG, PNG 확장자만 첨부 가능합니다.');
        openModal('notice', 400);
      } else if (selectedFile.size > 5 * 1024 * 1024) {
        setNoticeMessage('이미지 파일 용량은 5MB를 초과할 수 없습니다.');
        openModal('notice', 400);
      } else {
        setNewAccountData((prev) =>
          prev.map((item, idx) =>
            idx === index ? { ...item, image: selectedFile } : item
          )
        );
      }
    }

    e.target.value = '';
  };

  const handleImageFileDelete = (index: number) => {
    setNewAccountData((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, image: null } : item))
    );
  };

  const handleAccountSubmitButton = () => {
    if (strategyId) {
      const formData = new FormData();

      const validData = newAccountData.filter(
        (data) => data.title.trim() !== '' && data.image !== null
      );

      const requestDtoList = validData.map((data) => ({
        title: data.title.trim(),
      }));

      formData.append('requestDtoList', JSON.stringify(requestDtoList));

      validData.forEach((data) => {
        if (data.image) {
          formData.append('images', data.image);
        }
      });

      createAccountMutate(
        { strategyId, formData },
        {
          onSuccess: (res) => {
            if (res.code === 200) {
              closeModal('account-add');
              refetchAccount();
              setNewAccountData(Array(5).fill({ title: '', image: null }));
            } else {
              setNoticeMessage('실계좌 인증 이미지 등록에 실패했습니다.');
              openModal('notice', 400);
            }
          },
          onError: () => {
            setNoticeMessage('실계좌 인증 이미지 등록에 실패했습니다.');
            openModal('notice', 400);
          },
        }
      );
    }
  };

  const handleAccountCheckboxChange = (accountId: number) => {
    setCheckedAccount((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleAccountCheckAllButton = () => {
    if (checkedAccount.length === strategyAccount?.content.length) {
      setCheckedAccount([]);
    } else {
      setCheckedAccount(
        strategyAccount?.content.map((account) => account.accountImageId) || []
      );
    }
  };

  const handleAccountDeleteButton = () => {
    deleteAccountMutate(
      { accountImageId: checkedAccount },
      {
        onSuccess: () => {
          closeModal('account-delete');
          setCheckedAccount([]);
          refetchAccount();
        },
      }
    );
  };

  return {
    currentTab,
    setCurrentTab,
    dailyPage,
    setDailyPage,
    accountPage,
    setAccountPage,
    methodOptions,
    stockOptions,
    status,
    statusToggle,
    title,
    setTitle,
    method,
    setMethod,
    cycle,
    setCycle,
    stocks,
    setStocks,
    content,
    setContent,
    file,
    setFile,
    dailyStartDate,
    setDailyStartDate,
    dailyEndDate,
    setDailyEndDate,
    dailyTotalPage,
    newDailyData,
    setNewDailyData,
    editingDailyId,
    setEditingDailyId,
    editedDailyData,
    setEditedDailyData,
    deleteDailyId,
    setDeleteDailyId,
    accountTotalPage,
    newAccountData,
    setNewAccountData,
    checkedAccount,
    setCheckedAccount,
    submitErrorData,
    setSubmitErrorData,
    noticeMessage,
    setNoticeMessage,
    fileInputRef,
    excelFileInputRef,
    methodsAndStocks,
    strategyInfo,
    strategyDaily,
    strategyAccount,
    exampleLink,
    handleCheckboxChange,
    handleBrowseClick,
    handleFileChange,
    handleFileDelete,
    handleStrategySubmitButton,
    handleRequestApproveButton,
    handleCancelApproveButton,
    handleDailyAddButton,
    handleExcelFileChange,
    handleNewDailyDataChange,
    handleDailySubmitButton,
    handleDailyEditButton,
    handleDailyUpdateButton,
    handleDailyDeleteButton,
    handleAccountAddButton,
    handleBrowseImageClick,
    handleImageFileChange,
    handleImageFileDelete,
    handleAccountSubmitButton,
    handleAccountCheckboxChange,
    handleAccountCheckAllButton,
    handleAccountDeleteButton,
    openModal,
    closeModal,
    navigate,
    roleCode,
    refetchStrategyInfo,
    refetchDaily,
    refetchAccount,
    changePrivateMutate,
  };
};

export default useMyStrategyEdit;
