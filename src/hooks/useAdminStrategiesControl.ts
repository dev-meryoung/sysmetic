import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH } from '@/constants/path';
import {
  useApproveAdminStrategy,
  useRejectAdminStrategy,
} from '@/hooks/useAdminApi';
import {
  useDeleteTraderAddStrategyList,
  useGetMethodAndStock,
  useGetStrategyAccount,
  useGetStrategyDaily,
  useGetStrategyInfo,
  useGetStrategyMonthly,
} from '@/hooks/useStrategyApi';
import useModalStore from '@/stores/useModalStore';

const useAdminStrategiesControl = () => {
  const navigate = useNavigate();
  const { openModal, closeModal } = useModalStore();
  const { strategyId } = useParams();

  const [currentTab, setCurrentTab] = useState<number>(0);
  const [dailyPage, setDailyPage] = useState<number>(0);
  const [monthlyPage, setMonthlyPage] = useState<number>(0);
  const [accountPage, setAccountPage] = useState<number>(0);
  const [stockOptions, setStockOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [status, setStatus] = useState<string>('PRIVATE');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [dailyStartDate, setDailyStartDate] = useState<string>('');
  const [dailyEndDate, setDailyEndDate] = useState<string>('');
  const [dailyTotalPage, setDailyTotalPage] = useState<string>('');
  const [monthlyStartYearMonth, setMonthlyStartYearMonth] =
    useState<string>('');
  const [monthlyEndYearMonth, setMonthlyEndYearMonth] = useState<string>('');
  const [monthlyTotalPage, setMonthlyTotalPage] = useState<string>('');
  const [accountTotalPage, setAccountTotalPage] = useState<string>('');

  const { data: methodsAndStocks } = useGetMethodAndStock();
  const {
    data: strategyInfo,
    isError: strategyInfoIsError,
    refetch: refetchStrategyInfo,
  } = useGetStrategyInfo(strategyId as string);
  const { data: strategyDaily } = useGetStrategyDaily(
    strategyId as string,
    dailyPage,
    dailyStartDate,
    dailyEndDate
  );
  const { data: strategyMonthly } = useGetStrategyMonthly(
    strategyId as string,
    monthlyPage,
    monthlyStartYearMonth,
    monthlyEndYearMonth
  );
  const { data: strategyAccount } = useGetStrategyAccount(
    strategyId as string,
    accountPage
  );
  const { mutate: approveMutate } = useApproveAdminStrategy();
  const { mutate: rejectMutate } = useRejectAdminStrategy();
  const { mutate: deleteMutate } = useDeleteTraderAddStrategyList();

  useEffect(() => {
    if (strategyInfoIsError) navigate(PATH.ROOT);

    if (methodsAndStocks && strategyInfo) {
      setStockOptions(
        methodsAndStocks.stockList.map(
          (stock: { id: number; name: string }) => ({
            label: stock.name,
            value: stock.id.toString(),
          })
        )
      );

      setStatus(strategyInfo.statusCode);
    }
  }, [strategyInfo, strategyInfoIsError]);

  useEffect(() => {
    if (strategyDaily) setDailyTotalPage(strategyDaily.totalPages.toString());
  }, [strategyDaily]);

  useEffect(() => {
    if (strategyMonthly)
      setMonthlyTotalPage(strategyMonthly.totalPages.toString());
  }, [strategyMonthly]);

  useEffect(() => {
    if (strategyAccount)
      setAccountTotalPage(strategyAccount.totalPages.toString());
  }, [strategyAccount]);

  const handleApproveButton = () => {
    if (strategyId) {
      approveMutate(
        { strategyId: [+strategyId] },
        {
          onSuccess: () => {
            closeModal('approve');
            refetchStrategyInfo();
          },
        }
      );
    }
  };

  const handleRejectButton = () => {
    if (strategyId) {
      rejectMutate(
        { strategyId: +strategyId, rejectReason },
        {
          onSuccess: () => {
            closeModal('reject');
            refetchStrategyInfo();
          },
        }
      );
    }
  };

  const handleDeleteStrategyButton = () => {
    if (strategyId) {
      deleteMutate(
        {
          idList: [+strategyId],
        },
        {
          onSuccess: () => {
            closeModal('delete');
            navigate(PATH.ADMIN_STRATEGIES);
          },
        }
      );
    }
  };

  return {
    navigate,
    openModal,
    closeModal,
    strategyId,
    currentTab,
    setCurrentTab,
    dailyPage,
    setDailyPage,
    monthlyPage,
    setMonthlyPage,
    accountPage,
    setAccountPage,
    stockOptions,
    status,
    setStatus,
    rejectReason,
    setRejectReason,
    dailyStartDate,
    setDailyStartDate,
    dailyEndDate,
    setDailyEndDate,
    dailyTotalPage,
    monthlyStartYearMonth,
    setMonthlyStartYearMonth,
    monthlyEndYearMonth,
    setMonthlyEndYearMonth,
    monthlyTotalPage,
    accountTotalPage,
    methodsAndStocks,
    strategyInfo,
    strategyDaily,
    strategyMonthly,
    strategyAccount,
    handleApproveButton,
    handleRejectButton,
    handleDeleteStrategyButton,
  };
};

export default useAdminStrategiesControl;
