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
import traderData from '@/mocks/traders.json';

const PAGE_SIZE = 10;

interface TraderProps {
  profileImage: string;
  nickname: string;
  interestCount: number;
  strategyCount: number;
}

const TraderList = () => {
  const navigate = useNavigate();
  const [traderInfo, setTraderInfo] = useState<TraderProps[]>([]);
  const [filteredTraderInfo, setFilteredTraderInfo] = useState<TraderProps[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [searchedValue, setSearchedValue] = useState('');

  useEffect(() => {
    setTraderInfo(traderData);
    setFilteredTraderInfo(traderData);
    setTotalPage(Math.ceil(traderData.length / PAGE_SIZE));
  }, []);

  const handleSearch = () => {
    setSearchedValue(searchValue);

    let filtered;

    if (searchValue === '') {
      filtered = traderInfo;
    } else {
      const searchTerms = searchValue
        .split(' ')
        .map((term) => term.trim().toLowerCase());

      filtered = traderInfo.filter((trader) =>
        searchTerms.every((term) =>
          trader.nickname.toLowerCase().includes(term)
        )
      );
    }

    setFilteredTraderInfo(filtered);
    setTotalPage(Math.ceil(filtered.length / PAGE_SIZE));
    setCurrentPage(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div css={traderyWrapperStyle}>
      <section className='search-box-bg'>
        <div className='search-box'>
          <TextInput
            type='text'
            iconNum='single'
            placeholder='닉네임'
            color='skyblue'
            value={searchValue}
            width={360}
            handleChange={(e) => setSearchValue(e.target.value)}
            handleKeyDown={handleKeyDown}
          />
          <div className='searchIcon' onClick={handleSearch}>
            <SearchOutlinedIcon />
          </div>
        </div>
      </section>
      <section css={contentsWrapper}>
        <h6 className='info-text'>
          총 <strong>{filteredTraderInfo.length}명</strong>의 트레이더를 보실 수
          있습니다
        </h6>
        {filteredTraderInfo.length > 0 ? (
          <div css={cardWrapper}>
            {filteredTraderInfo
              .slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
              .map((profile, index) => (
                <div
                  key={index}
                  className='card'
                  onClick={() => navigate(PATH.TRADER_STRATEGIES())}
                >
                  <ProfileImage
                    src={profile.profileImage}
                    size='xl'
                    alt='트레이더 이미지'
                  />
                  <div className='card-info'>
                    <div className='card-info-top'>
                      <div className='nickname-area'>
                        <span>트레이더</span>
                        <h6>{profile.nickname}</h6>
                      </div>
                      <Button
                        size='xs'
                        shape='round'
                        label='전략정보'
                        width={80}
                        handleClick={() => navigate(PATH.TRADER_STRATEGIES())}
                      />
                    </div>
                    <div className='card-info-btm'>
                      <span className='option'>관심 수</span>
                      <span>{profile.interestCount}</span>
                      <span className='line'></span>
                      <span className='option'>전략 수</span>
                      <span>{profile.strategyCount}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <span css={emptyContents}>
            <strong>‘{searchedValue}’</strong> 검색결과는 없습니다.
          </span>
        )}
        {filteredTraderInfo.length > 0 && (
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
            font-size: 8px;
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

  strong {
    font-weight: ${FONT_WEIGHT.BOLD};
    color: ${COLOR.POINT};
  }
`;

export default TraderList;
