import { useEffect, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { PATH } from '@/constants/path';
import {
  useCreateStrategy,
  useGetMethodAndStock,
} from '@/hooks/useStrategyApi';
import useAuthStore from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

const useStrategyAdd = () => {
  const navigate = useNavigate();
  const { roleCode } = useAuthStore();
  const { openModal } = useModalStore();

  const [methodOptions, setMethodOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [stockOptions, setStockOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [title, setTitle] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [cycle, setCycle] = useState<string>('');
  const [stocks, setStocks] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [submitErrorData, setSubmitErrorData] = useState<string[]>([]);
  const [noticeMessage, setNoticeMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: methodsAndStocks } = useGetMethodAndStock();
  const { mutate: submitMutate } = useCreateStrategy();

  useEffect(() => {
    if (roleCode === 'TRADER' && methodsAndStocks) {
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
    }
  }, [roleCode]);

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

  const validateInputs = (): string[] => {
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
      errors.push('운용 종목');
    }

    if (isInvalidInput(content)) {
      errors.push('전략소개');
    }

    return errors;
  };

  const handleSubmitButton = () => {
    const errors = validateInputs();

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
    }

    submitMutate(formData, {
      onSuccess: (res) => {
        if (res.code === 200) {
          navigate(PATH.MYPAGE_STRATEGIES_EDIT(res.data.strategyId));
        }
      },
      onError: (err) => {
        if (err instanceof AxiosError && err.response?.status === 409) {
          setNoticeMessage('입력하신 전략명은 이미 사용 중입니다.');
          openModal('notice', 400);
        } else {
          console.error(err);
        }
      },
    });
  };

  return {
    methodOptions,
    stockOptions,
    title,
    setTitle,
    setMethod,
    setCycle,
    stocks,
    setStocks,
    content,
    setContent,
    file,
    setFile,
    fileInputRef,
    submitErrorData,
    noticeMessage,
    handleCheckboxChange,
    handleBrowseClick,
    handleFileChange,
    handleFileDelete,
    handleSubmitButton,
    validateInputs,
    roleCode,
  };
};

export default useStrategyAdd;
