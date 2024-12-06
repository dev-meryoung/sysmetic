import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import Pagination from '@/components/Pagination';
import { useGetStrategyAccount } from '@/hooks/useStrategyApi';

const StrategyDetailAccount = () => {
  const { strategyId } = useParams();

  const [accountPage, setAccountPage] = useState<number>(0);
  const [accountTotalPage, setAccountTotalPage] = useState<string>('');
  const { data: strategyAccount } = useGetStrategyAccount(
    strategyId as string,
    accountPage
  );

  useEffect(() => {
    if (strategyAccount)
      setAccountTotalPage(strategyAccount.totalPages.toString());
  }, [strategyAccount]);

  return (
    <div css={wrapperStyle}>
      <div css={accountBoxStyle}>
        <div className='account-box'>
          {strategyAccount?.content && strategyAccount.content.length > 0 ? (
            strategyAccount.content.map((account) => (
              <div className='account' key={account.accountImageId}>
                <img
                  src={account.imageUrl}
                  onClick={() =>
                    window.open(
                      account.imageUrl,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                />
                <span>{account.title}</span>
              </div>
            ))
          ) : (
            <div
              style={{ textAlign: 'center', width: '100%', padding: '64px' }}
            >
              해당하는 데이터가 없습니다.
            </div>
          )}
        </div>
        {strategyAccount?.content && strategyAccount.content.length > 0 && (
          <Pagination
            currentPage={accountPage}
            totalPage={+accountTotalPage}
            handlePageChange={setAccountPage}
          />
        )}
      </div>
    </div>
  );
};

const wrapperStyle = css`
  display: flex;
  width: 100%;
`;

const accountBoxStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;

  .buttons {
    display: flex;
    width: 100%;
    gap: 16px;
    justify-content: end;
  }

  .account-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    row-gap: 32px;
    margin-bottom: 8px;

    .account {
      width: 220px;
      height: 208px;
      position: relative;
      overflow: hidden;

      &:hover {
        cursor: pointer;
      }

      div {
        position: absolute;
        top: 0;
      }

      img {
        width: 100%;
        height: 144px;
        object-fit: cover;
        margin-bottom: 16px;
      }

      span {
        padding-bottom: 10px;
        line-height: 24px;
      }
    }
  }
`;

export default StrategyDetailAccount;
