import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import ProfileImage from '@/components/ProfileImage';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useGetFilterdTrader } from '@/hooks/useStrategyApi';

interface TraderProps {
  nicknameListDto: {
    id: number;
    nickname: string;
    roleCode: string;
    totalFollow: number;
    publicStrategyCount: number;
  };
  traderProfileImage: string;
}

const TraderList = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [totalElement, setTotalElement] = useState(0);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputValue, setInputValue] = useState('');

  const { data: traderData, isLoading } = useGetFilterdTrader(
    searchQuery,
    currentPage
  );

  const traderList = traderData?.data?.content;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearchClick = () => {
    const trimmedSearch = inputValue.replace(/\s+/g, '');

    if (trimmedSearch === '') {
      return;
    }

    if (trimmedSearch !== searchQuery) {
      setSearchQuery(trimmedSearch);
      setCurrentPage(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  useEffect(() => {
    if (traderData?.data) {
      setTotalPage(traderData.data.totalPages);
      setTotalElement(traderData.data.totalElement);
      if (currentPage >= traderData.data.totalPages) {
        setCurrentPage(Math.max(0, traderData.data.totalPages - 1));
      }
    }
  }, [traderData, currentPage]);

  return (
    <div css={traderyWrapperStyle}>
      <section className='search-box-bg'>
        <div className='search-box'>
          <TextInput
            type='text'
            iconNum='single'
            placeholder='닉네임'
            color='skyblue'
            value={inputValue}
            width={360}
            handleChange={handleInputChange}
            handleKeyDown={handleKeyDown}
          />
          <div className='searchIcon' onClick={handleSearchClick}>
            <SearchOutlinedIcon />
          </div>
        </div>
      </section>

      <section css={contentsWrapper}>
        <h6 className='info-text'>
          총 <strong>{totalElement ?? 0}명</strong>의 트레이더를 보실 수
          있습니다
        </h6>
        {traderData?.data?.content.length > 0 && !isLoading ? (
          <div css={cardWrapper}>
            {traderData?.data?.content.map(
              (profile: TraderProps, index: number) => (
                <div
                  key={index}
                  className='card'
                  onClick={() =>
                    navigate(
                      PATH.TRADER_STRATEGIES(
                        String(profile?.nicknameListDto?.id)
                      )
                    )
                  }
                >
                  <ProfileImage
                    src={profile?.traderProfileImage || ''}
                    size='xl'
                    alt='트레이더 이미지'
                  />
                  <div className='card-info'>
                    <div className='card-info-top'>
                      <div className='nickname-area'>
                        <span>트레이더</span>
                        <h6>{profile?.nicknameListDto?.nickname}</h6>
                      </div>
                      <Button
                        size='xs'
                        shape='round'
                        label='전략정보'
                        width={80}
                        handleClick={() =>
                          navigate(
                            PATH.TRADER_STRATEGIES(
                              String(profile?.nicknameListDto?.id)
                            )
                          )
                        }
                      />
                    </div>
                    <div className='card-info-btm'>
                      <span className='option'>관심 수</span>
                      <span>{profile?.nicknameListDto?.totalFollow}</span>
                      <span className='line'></span>
                      <span className='option'>전략 수</span>
                      <span>
                        {profile?.nicknameListDto?.publicStrategyCount}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : searchQuery ? (
          <span css={emptyContents}>검색결과가 없습니다.</span>
        ) : (
          <span css={emptyContents}>트레이더가 없습니다.</span>
        )}
        {traderList?.length > 0 && (
          <Pagination
            totalPage={totalPage}
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
          />
        )}
      </section>
    </div>
  );
};

const BG_COLOR = `#F1F7FE;`;

const traderyWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 40px;

  .search-box-bg {
    padding: 36px;
    width: 100%;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    border: 1px solid ${COLOR.PRIMARY100};
    background-color: ${BG_COLOR};

    .search-box {
      position: relative;

      .searchIcon {
        position: absolute;
        width: 48px;
        height: 48px;
        padding: 12px;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        cursor: pointer;

        svg {
          font-size: ${FONT_SIZE.TITLE_SM};
        }
      }
    }
  }
`;

const contentsWrapper = css`
  display: flex;
  flex-direction: column;
  gap: 32px;

  .info-text {
    font-weight: ${FONT_WEIGHT.REGULAR};

    strong {
      font-weight: ${FONT_WEIGHT.BOLD};
    }
  }
`;

const cardWrapper = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  .card {
    display: flex;
    gap: 16px;
    border-radius: 4px;
    border: 1px solid ${COLOR.PRIMARY100};
    padding: 24px;

    :hover {
      cursor: pointer;
    }

    .card-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;

      .card-info-top {
        display: flex;
        justify-content: space-between;

        .nickname-area {
          display: flex;
          flex-direction: column;
          gap: 4px;

          span {
            color: ${COLOR.PRIMARY};
            font-size: ${FONT_SIZE.TEXT_XS};
          }
        }
        button {
          font-size: ${FONT_SIZE.TEXT_SM};
          background-color: ${COLOR.WHITE};
          color: ${COLOR.PRIMARY};
          border: 1px solid ${COLOR.PRIMARY};

          :hover {
            background-color: ${COLOR.PRIMARY600};
            color: ${COLOR.WHITE};
          }
        }
      }

      .card-info-btm {
        display: flex;
        gap: 8px;

        .line {
          height: 100%;
          width: 1.5px;
          background-color: ${COLOR.GRAY};
        }

        .option {
          color: ${COLOR.GRAY700};
        }
      }
    }
  }
`;

const emptyContents = css`
  padding: 32px;
  border-radius: 4px;
  background: ${COLOR.GRAY100};
  text-align: center;
`;

export default TraderList;
