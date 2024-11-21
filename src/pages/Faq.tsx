import { useState, useRef, useEffect } from 'react';
import { css } from '@emotion/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@/components/Pagination';
import TabButton from '@/components/TabButton';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

const POSTS_PER_PAGE = 10;
const tabs = ['회원가입', '투자자', '트레이더'];
const data = [
  {
    id: 1,
    question: 'Q1',
    title: '회원가입은 어떻게 진행하나요?',
    answer: '회원가입 페이지에서 진행하시면 됩니다.',
    category: '회원가입',
  },
  {
    id: 2,
    question: 'Q2',
    title: '비밀번호를 잊었어요.',
    answer:
      '1. 로그인 페이지로 이동하세요.\n2. "비밀번호 재설정"을 클릭하세요.\n3. 이메일을 확인 후 비밀번호를 재설정하세요.',
    category: '회원가입',
  },
  {
    id: 3,
    question: 'Q1',
    title: '투자자 질문',
    answer: '답변',
    category: '투자자',
  },
  {
    id: 4,
    question: 'Q1',
    title: '트레이더 질문',
    answer: '답변',
    category: '트레이더',
  },
];

const Faq: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openAnswer, setOpenAnswer] = useState<number | null>(null);
  const [contentHeights, setContentHeights] = useState<Record<number, number>>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);

  const isSearching = search.trim() !== '';

  const searchedData = data.filter(
    (item) => item.title.includes(search) || item.question.includes(search)
  );

  const tabFilteredData = isSearching
    ? searchedData
    : searchedData.filter((item) => item.category === tabs[currentTab]);

  const totalPage = Math.ceil(tabFilteredData.length / POSTS_PER_PAGE);

  const paginatedData = tabFilteredData.slice(
    currentPage * POSTS_PER_PAGE,
    (currentPage + 1) * POSTS_PER_PAGE
  );

  const answerRefs = useRef<Record<number, HTMLDivElement | null>>(
    data.reduce((acc, item) => ({ ...acc, [item.id]: null }), {})
  );

  const toggleOpen = (id: number) =>
    setOpenAnswer((prev) => (prev === id ? null : id));

  const calculateHeights = () => {
    const newHeights = Object.entries(answerRefs.current).reduce(
      (acc, [id, ref]) => ({ ...acc, [id]: ref?.scrollHeight || 0 }),
      {}
    );
    setContentHeights(newHeights);
  };

  useEffect(() => {
    calculateHeights();
    window.addEventListener('resize', calculateHeights);
    return () => window.removeEventListener('resize', calculateHeights);
  }, []);

  return (
    <div css={wrapperStyle}>
      <div css={indexStyle}>
        <div css={titleStyle}>자주 묻는 질문</div>
        <div css={descriptionStyle}>
          회원탈퇴를 신청하기 전에 안내사항을 꼭 확인해주세요.
          <br />
          탈퇴한 아이디는 본인과 다인 모두 재사용 및 복구가 불가하오니 신중하게
          선택하시기 바랍니다.
        </div>
      </div>

      <div css={searchWrapperStyle}>
        <div css={searchStyle}>
          <TextInput
            value={search}
            handleChange={(e) => setSearch(e.target.value)}
            placeholder='검색어를 입력하세요'
          />
          <SearchIcon css={searchIconStyle} />
        </div>
      </div>

      <div css={tabWrapperStyle}>
        <TabButton
          tabs={tabs}
          currentTab={currentTab}
          handleTabChange={setCurrentTab}
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
            <div
              ref={(el) => (answerRefs.current[item.id] = el)}
              css={faqAnswerStyle(
                openAnswer === item.id,
                contentHeights[item.id] || 0
              )}
            >
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

      <Pagination
        totalPage={totalPage}
        currentPage={currentPage}
        handlePageChange={(page) => setCurrentPage(page)}
      />
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

const faqAnswerStyle = (isOpen: boolean, contentHeight: number) => css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: ${isOpen ? '24px' : '0'};
  font-size: ${FONT_SIZE.TEXT_SM};
  font-weight: ${FONT_WEIGHT.REGULAR};
  color: ${COLOR.GRAY800};
  max-height: ${isOpen ? `${contentHeight}px` : '0'};
  overflow: hidden;
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
  margin-top: 20px;
`;

const arrowIconStyle = (isOpen: boolean) => css`
  transform: ${isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.3s ease;
  font-size: 32px;
`;
