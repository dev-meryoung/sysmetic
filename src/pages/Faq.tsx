import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Pagination from '@/components/Pagination';
import TabButton from '@/components/TabButton';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import FaqList from '@/mocks/faq-list.json';

const POSTS_PER_PAGE = 10;
const tabs = ['회원가입', '투자자', '트레이더'];

const Faq: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openAnswer, setOpenAnswer] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [filteredData, setFilteredData] = useState(FaqList);

  const handleSearch = () => {
    const trimmedSearch = search.trim().toLowerCase();
    const result = trimmedSearch
      ? FaqList.filter(
          (item) =>
            item.title.toLowerCase().includes(trimmedSearch) ||
            item.question.toLowerCase().includes(trimmedSearch)
        )
      : FaqList;

    if (result.length > 0) {
      const firstCategory = result[0].category;
      const tabIndex = tabs.indexOf(firstCategory);
      setCurrentTab(tabIndex);
    }
    setFilteredData(result);
    setCurrentPage(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const tabFilteredData = filteredData.filter(
    (item) => item.category === tabs[currentTab]
  );

  useEffect(() => {
    if (!search.trim()) {
      setCurrentTab(0);
      setFilteredData(FaqList.filter((item) => item.category === tabs[0]));
    }
  }, [search]);

  useEffect(() => {
    setFilteredData(
      FaqList.filter((item) => item.category === tabs[currentTab])
    );
  }, [currentTab]);

  const totalPage = Math.ceil(tabFilteredData.length / POSTS_PER_PAGE);
  const paginatedData = tabFilteredData.slice(
    currentPage * POSTS_PER_PAGE,
    (currentPage + 1) * POSTS_PER_PAGE
  );

  const toggleOpen = (id: string) =>
    setOpenAnswer((prev) => (prev === id ? null : id));

  return (
    <div css={wrapperStyle}>
      <div css={indexStyle}>
        <div css={titleStyle}>자주 묻는 질문</div>
        <div css={descriptionStyle}>
          자주 묻는 질문과 답변을 한눈에 확인하실 수 있습니다.
        </div>
      </div>

      <div css={searchWrapperStyle}>
        <div css={searchStyle}>
          <TextInput
            value={search}
            handleChange={handleChange}
            placeholder='검색어를 입력하세요'
            color='skyblue'
            iconNum='single'
            handleKeyDown={handleKeyDown}
          />
          <SearchOutlinedIcon onClick={handleSearch} css={searchIconStyle} />
        </div>
      </div>

      <div css={tabWrapperStyle}>
        <TabButton
          tabs={tabs}
          currentTab={currentTab}
          handleTabChange={(tabIndex) => {
            setCurrentTab(tabIndex);
            setCurrentPage(0);
          }}
          shape='line'
        />
      </div>

      <div css={faqListStyle}>
        {paginatedData.map((item, idx) => (
          <div key={item.id}>
            <div
              css={[
                faqQuestionStyle,
                idx === 0 &&
                  css`
                    border-top: 1px solid ${COLOR.BLACK};
                  `,
              ]}
              onClick={() => toggleOpen(item.id)}
            >
              <div css={faqQuestionAndTitleStyle}>
                <span>{item.question}</span>
                <span css={faqTitleStyle}>{item.title}</span>
              </div>
              <KeyboardArrowDownIcon
                css={arrowIconStyle(openAnswer === item.id)}
              />
            </div>
            <div css={faqAnswerStyle(openAnswer === item.id)}>
              {item.answer.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {paginatedData.length === 0 && (
          <div css={noResultsStyle}>검색 결과가 없습니다.</div>
        )}
      </div>

      {paginatedData.length > 0 && (
        <Pagination
          totalPage={totalPage}
          currentPage={currentPage}
          handlePageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default Faq;

const wrapperStyle = css`
  padding-top: 96px;
  padding-bottom: 186px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
`;

const indexStyle = css`
  width: 100%;
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};
  height: 127px;
  margin-bottom: 40px;
`;

const titleStyle = css`
  font-size: ${FONT_SIZE.TITLE_SM};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const descriptionStyle = css`
  margin-top: 16px;
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.REGULAR};
  line-height: 1.6;
`;

const tabWrapperStyle = css`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const searchWrapperStyle = css`
  background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
  height: 120px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;

const searchStyle = css`
  display: flex;
  position: relative;
  width: 80%;
  max-width: 400px;
`;

const searchIconStyle = css`
  font-size: 28px;
  cursor: pointer;
  position: absolute;
  right: 48px;
  top: 50%;
  transform: translateY(-50%);
  color: ${COLOR.GRAY600};
`;

const faqListStyle = css`
  width: 100%;
  margin-top: 20px;
  margin-bottom: 32px;
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const faqQuestionStyle = css`
  padding: 24px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid ${COLOR.GRAY};
  min-height: 72px;
  position: relative;
`;

const faqQuestionAndTitleStyle = css`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const faqTitleStyle = css`
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.REGULAR};
  color: ${COLOR.GRAY800};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const faqAnswerStyle = (isOpen: boolean) => css`
  overflow: hidden;
  max-height: ${isOpen ? '1000px' : '0'};
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: ${isOpen ? '24px' : '0'};
  font-size: ${FONT_SIZE.TEXT_SM};
  font-weight: ${FONT_WEIGHT.REGULAR};
  color: ${COLOR.GRAY800};
  opacity: ${isOpen ? '1' : '0'};
  transform: ${isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease,
    transform 0.3s ease,
    padding 0.3s ease;
  border-bottom: ${isOpen ? `1px solid ${COLOR.GRAY}` : 'none'};
`;

const noResultsStyle = css`
  text-align: center;
  color: ${COLOR.GRAY600};
  font-size: ${FONT_SIZE.TEXT_MD};
  margin-top: 80px;
`;

const arrowIconStyle = (isOpen: boolean) => css`
  transform: ${isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.3s ease;
  font-size: 32px;
`;
