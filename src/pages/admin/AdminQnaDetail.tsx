import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import ProfileImage from '@/components/ProfileImage';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useDeleteDetailInquiry,
  useGetAdminInquiryDetail,
} from '@/hooks/useAdminApi';
import useModalStore from '@/stores/useModalStore';
import { extractDate } from '@/utils/dataUtils';

interface AdminQnaDetailDataProps {
  answerContent: string;
  answerRegistrationDate: string;
  answerTitle: string;
  closed: string;
  cycle: string;
  inquirerNickname: string;
  inquiryAnswerId: number;
  inquiryContent: string;
  inquiryId: number;
  inquiryRegistrationDate: string;
  inquiryStatus: string;
  inquiryTitle: string;
  methodIconPath: string;
  methodId: number;
  nextTitle: string | null;
  nextWriteDate: string | null;
  page: number;
  previousTitle: string | null;
  previousWriteDate: string | null;
  searchText: string;
  searchType: string;
  statusCode: string;
  stockList: StockListProps;
  stockIds: number[];
  stockNames: string[];
  strategyId: number;
  strategyName: string;
  traderId: number;
  traderNickname: string;
  traderProfileImagePath: string;
  previousId: number;
  nextId: number;
}

interface StockListProps {
  stockIconPath: string[];
}

const FailModal = () => <div css={ModalStyle}>문의 삭제에 실패했습니다.</div>;

const DelModal = ({
  inquiryId,
  inquiryDetailDataRefetch,
}: {
  inquiryId: number;
  inquiryDetailDataRefetch: () => void;
}) => {
  const { closeModal } = useModalStore();
  const failModal = useModalStore();
  const navigate = useNavigate();
  const { mutate: deleteMutaion } = useDeleteDetailInquiry();

  const qnaId = inquiryId;

  const handleDelete = (qnaId: number) => {
    deleteMutaion(qnaId, {
      onSuccess: () => {
        inquiryDetailDataRefetch();
        closeModal('delete');
        navigate(PATH.ADMIN_QNA);
      },
      onError: () => {
        failModal.openModal('fail-modal');
      },
    });
  };

  return (
    <div css={ModalStyle}>
      <p>해당 문의를 삭제하시겠습니까?</p>
      <div className='btn'>
        <Button
          width={120}
          border={true}
          label='아니오'
          handleClick={() => closeModal('delete')}
        />
        <Button
          width={120}
          label='예'
          handleClick={() => {
            handleDelete(qnaId);
          }}
        />
      </div>
    </div>
  );
};

const AdminQnaDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const deleteModal = useModalStore();
  const [qnaId, setQnaId] = useState(1);

  const [data, setData] = useState<AdminQnaDetailDataProps>();

  const { data: inquiryDetailData, refetch: inquiryDetailDataRefetch } =
    useGetAdminInquiryDetail(qnaId);

  useEffect(() => {
    const urlNumber = Number(window.location.pathname.split('/').pop()) || null;
    if (urlNumber && urlNumber !== qnaId) {
      setQnaId(urlNumber);
    }
  }, [location.pathname, qnaId]);

  useEffect(() => {
    if (inquiryDetailData?.data) {
      setData(inquiryDetailData.data);
    }
  }, [inquiryDetailData]);

  useEffect(() => {
    if (qnaId) {
      inquiryDetailDataRefetch();
    }
  }, [qnaId, inquiryDetailDataRefetch]);

  return (
    <div css={adminQnaWrapperStyle}>
      <div css={adminQnaHeaderStyle}>
        <h5>문의 상세내용</h5>
        <p>
          시스메틱 투자자가 트레이더에게 문의한 내용과 답변 내용을 확인하고
          관리할 수 있는 페이지입니다.
        </p>
      </div>
      <div css={adminQDivStyle}>
        <div css={adminQTitleStyle}>
          <h6>{data?.inquiryTitle}</h6>
          <div className='info'>
            <div>
              <p>작성일</p>
              <p>{data?.inquiryRegistrationDate}</p>
            </div>
            <div>
              <p>작성자</p>
              <p>{data?.inquirerNickname}</p>
            </div>
            <Button
              width={25}
              shape='none'
              size='xxs'
              label='삭제'
              handleClick={() => deleteModal.openModal('delete')}
            />
          </div>
        </div>
        <div css={adminQStrategyStyle}>
          <div className='strategyName'>
            <div className='tag'>
              <Tag src={data?.methodIconPath || ''} />
              {data?.stockList?.stockIconPath &&
                data?.stockList?.stockIconPath.map(
                  (stock: string, index: number) => (
                    <Tag key={index} src={stock || ''} alt='tag' />
                  )
                )}
            </div>
            <p>{data?.strategyName}</p>
          </div>
          <div className='profile'>
            <ProfileImage src={data?.traderProfileImagePath} />
            <p>{data?.traderNickname}</p>
          </div>
        </div>
        <div css={adminQContentStyle}>
          <p>{data?.inquiryContent}</p>
        </div>
        <div css={adminATitleStyle}>
          <div className='answer'>
            <div className='title'>
              <SubdirectoryArrowRightOutlinedIcon css={iconStyle} />
              <h6>{data?.answerTitle}</h6>
            </div>
            <div className='info'>
              <p>작성일</p>
              <p>{extractDate(data?.answerRegistrationDate || '')}</p>
            </div>
          </div>
          <div className='profile'>
            <ProfileImage src={data?.traderProfileImagePath} />
            <p>{data?.traderNickname}</p>
          </div>
        </div>
        <div css={adminQContentStyle}>
          <p>{data?.answerContent}</p>
        </div>
      </div>
      <div css={adminQnaNavStyle}>
        <Link className='back-qna' to={`/admin/qna/${data?.previousId}`}>
          <div>
            <p>이전</p>
            <p>{data?.previousTitle}</p>
          </div>
          <p>{extractDate(data?.previousWriteDate || '')}</p>
        </Link>
        <Link to={`/admin/qna/${data?.nextId}`} className='next-qna'>
          <div>
            <p>다음</p>
            <p>{data?.nextTitle}</p>
          </div>
          <p>{extractDate(data?.nextWriteDate || '')}</p>
        </Link>
      </div>
      <div css={buttonStyle}>
        <Button
          width={80}
          color='textBlack'
          label='목록보기'
          handleClick={() => navigate(PATH.ADMIN_QNA)}
        />
      </div>
      <Modal
        content={
          <DelModal
            inquiryId={data?.inquiryId || 0}
            inquiryDetailDataRefetch={inquiryDetailDataRefetch}
          />
        }
        id='delete'
      />
      <Modal content={<FailModal />} id='fail-modal' />
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

const adminQDivStyle = css`
  padding-top: 40px;
`;

const adminQTitleStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 120px;
  background-color: ${COLOR.GRAY100};
  padding: 32px 24px;

  .info {
    display: flex;
    align-items: center;
    gap: 32px;

    div {
      display: flex;
      gap: 8px;
    }

    button {
      padding: 0;
    }
  }
`;

const adminQStrategyStyle = css`
  display: flex;
  justify-content: space-between;
  margin: 24px;
  padding: 32px 24px;

  border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 4px;

  .strategyName {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .tag {
      display: flex;
      gap: 4px;
    }
  }

  .profile {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

const adminQContentStyle = css`
  margin: 20px 24px;
  line-height: 160%;
  height: 320px;
  overflow: auto;
`;

const adminATitleStyle = css`
  display: flex;
  justify-content: space-between;
  height: 120px;
  background-color: ${COLOR.GRAY100};
  padding: 32px 24px;

  .answer {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .profile {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

const iconStyle = css`
  font-size: ${FONT_SIZE.TITLE_SM};
  color: ${COLOR.POINT};
`;

const adminQnaNavStyle = css`
  display: flex;
  flex-direction: column;
  height: 128px;
  border-top: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

  .back-qna {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    height: 64px;
    border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
    text-decoration: none;
    color: inherit;

    div {
      display: flex;
      gap: 40px;
      p {
        &:nth-of-type(1) {
          font-weight: ${FONT_WEIGHT.BOLD};
        }
      }
    }
  }

  .next-qna {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    height: 64px;
    border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
    text-decoration: none;
    color: inherit;

    div {
      display: flex;
      gap: 40px;

      p {
        &:nth-of-type(1) {
          font-weight: ${FONT_WEIGHT.BOLD};
        }
      }
    }
  }
`;

const buttonStyle = css`
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
`;

const ModalStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding-top: 8px;

  p {
    line-height: 160%;
  }

  .btn {
    display: flex;
    gap: 16px;
  }
`;

export default AdminQnaDetail;
