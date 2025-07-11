import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Pagination from '@/components/Pagination';
import TabButton from '@/components/TabButton';
import TextInput from '@/components/TextInput';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

const FaqList = [
  {
    id: '1',
    question: 'Q1',
    title: '아이디 또는 비밀번호를 분실했습니다.',
    answer:
      '홈페이지 상단의 [로그인] 버튼을 클릭하여 창에 있는 [계정(이메일) 찾기], [비밀번호 재설정] 버튼을 클릭합니다.\n\n※ 계정(이메일) 찾기\n이름과 휴대번호를 입력하여 계정(이메일) 확인 가능.\n\n※ 비밀번호 찾기\n계정(이메일) 입력 후 인증번호 확인을 통하여 본인인증 후,\n비밀번호를 새로 설정하여 주시기 바랍니다.',
    category: '회원가입',
  },
  {
    id: '2',
    question: 'Q2',
    title: '회원정보 수정은 어떻게 하나요?',
    answer:
      '아래에 경로를 통해 회원정보를 수정하실 수 있습니다.\n우선 로그인 후 홈페이지 상단에 [마이페이지] 버튼을 클릭해주세요.\n[계정 정보] 우측에 [변경하기] 버튼을 클릭해주세요.\n변경희망하시는 정보를 수정해주시고, [수정완료] 버튼을 클릭해주시면 정보 수정이 가능합니다.',
    category: '회원가입',
  },
  {
    id: '3',
    question: 'Q3',
    title: '비밀번호 변경은 어떻게 하나요?',
    answer:
      '아래에 경로를 통해 비밀번호를 재설정 하실 수 있습니다.\n우선 로그인 후 홈페이지 상단에 [마이페이지] 버튼을 클릭해주세요.\n[비밀번호] 우측에 [변경하기] 버튼을 클릭해주세요.\n변경희망하시는 비밀번호를 입력해주시고 [수정완료] 버튼을 클릭해주시면 정보 수정이 가능합니다.',
    category: '회원가입',
  },
  {
    id: '4',
    question: 'Q4',
    title: '정보수신동의 변경은 어디서 하나요?',
    answer:
      '아래에 경로를 통해 정보수신동의를 변경하실 수 있습니다.\n우선 로그인 후 홈페이지 상단에 [마이페이지] 버튼을 클릭해주세요.\n[정보수신동의] 우측에 [변경하기] 버튼을 클릭해주세요.\n변경희망하시는 정보를 수정해주시고, [수정완료] 버튼을 클릭해주시면 정보 수정이 가능합니다.',
    category: '회원가입',
  },
  {
    id: '5',
    question: 'Q5',
    title: '회원탈퇴는 어떻게 하나요?',
    answer:
      '아래에 경로를 통해 회원탈퇴를 하실 수 있습니다.\n우선 로그인 후 홈페이지 상단에 [마이페이지] 버튼을 클릭해주세요.\n좌측 하단에 [회원탈퇴] 버튼을 클릭해주세요.\n안내 사항에 동의하시고 [회원탈퇴] 버튼을 [클릭]하시면, 탈퇴가 완료됩니다.\n탈퇴한 아이디는 본인과 타인 모두 재사용 및 복구가 불가하오니 신중하게 선택하시기 바랍니다.',
    category: '회원가입',
  },
  {
    id: '6',
    question: 'Q6',
    title: '회원 가입은 아무나 가능한가요?',
    answer:
      '14세 미만의 고객님의 경우 회원가입 시 보호자 동의서가 필요합니다.\n보호자 동의서를 작성하신 후 팩스로 보내주시면 내용 확인 후 회원 가입을 승인해 드리고 있습니다.\n(FAX : 02-1111-1111)\n14세 이상 내/외국인인 경우 본인 인증 후에 회원 가입이 가능합니다.',
    category: '회원가입',
  },
  {
    id: '7',
    question: 'Q1',
    title: '어떻게 회원 가입을 할 수 있나요?',
    answer:
      '회원 가입은 홈페이지 상단의 회원가입 버튼을 클릭하고, 투자자 가입 버튼을 통해 진행하시면 됩니다.\n기본 정보를 입력한 뒤 이메일 인증을 거쳐야 하며, 모든 이용약관에 동의하여야 계정을 생성할 수 있습니다.',
    category: '투자자',
  },
  {
    id: '8',
    question: 'Q2',
    title: '트레이더가 작성한 전략 글은 어디에서 볼 수 있나요?',
    answer:
      '트레이더가 작성한 전략은 홈페이지 상단의 전략탐색 카테고리를 통해 확인할 수 있습니다.\n원하는 전략 또는 트레이더를 검색하여 전략을 탐색할 수 있습니다.',
    category: '투자자',
  },
  {
    id: '9',
    question: 'Q3',
    title: '특정 전략을 팔로우하려면 어떻게 하나요?',
    answer:
      '회원 가입은 홈페이지 상단의 회원가입 버튼을 클릭하고, 투자자 가입 버튼을 통해 진행하시면 됩니다.\n기본 정보를 입력한 뒤 이메일 인증을 거쳐야 하며, 모든 이용약관에 동의하여야 계정을 생성할 수 있습니다.',
    category: '투자자',
  },
  {
    id: '10',
    question: 'Q4',
    title: '팔로우한 전략을 취소하려면 어떻게 하나요?',
    answer:
      '마이페이지의 내관심전략에서 해당 전략의 오른쪽에 위치한 관심취소 버튼을 클릭하면 됩니다.',
    category: '투자자',
  },
  {
    id: '11',
    question: 'Q5',
    title: '트레이더에게 문의는 어떻게 하나요?',
    answer:
      '전략의 상세보기 버튼을 클릭한 뒤, 글 상단에 위치한 문의하기 버튼을 클릭하여 문의 내용을 작성하면 트레이더에게 해당 문의가 전달됩니다.',
    category: '투자자',
  },
  {
    id: '12',
    question: 'Q6',
    title: '문의에 대한 답변은 어디에서 확인할 수 있나요?',
    answer:
      '문의한 내용과 답변은 마이페이지의 상담문의에서 확인할 수 있습니다.',
    category: '투자자',
  },
  {
    id: '13',
    question: 'Q7',
    title: '문의에 대한 답변 상태는 어디에서 확인할 수 있나요?',
    answer:
      '문의한 내용에 대한 답변 상태는 마이페이지의 상담문의 버튼을 클릭 한 뒤, 해당 문의별 진행상태를 통해 확인하실 수 있습니다.',
    category: '투자자',
  },
  {
    id: '14',
    question: 'Q8',
    title: '작성한 문의를 수정하거나 삭제할 수 있나요?',
    answer:
      '문의 내용은 마이페이지의 상담문의에서 수정하거나 삭제할 수 있습니다.\n다만, 트레이더가 답변한 문의는 수정 및 삭제가 불가능합니다.',
    category: '투자자',
  },
  {
    id: '16',
    question: 'Q9',
    title: '게시글에 대한 신고는 어떻게 하나요?',
    answer:
      '문제가 있는 게시글을 발견한 경우, 관리자에게 문의하여 주시기 바랍니다.',
    category: '투자자',
  },
  {
    id: '17',
    question: 'Q1',
    title: '트레이더는 어떻게 등록할 수 있나요?',
    answer:
      "트레이더로 회원가입을 진행해야 합니다.\n회원 가입은 홈페이지 상단의 회원가입 버튼을 클릭하고, '트레이더 가입' 버튼을 통해 진행하시면 됩니다.\n기본 정보를 입력한 뒤 이메일 인증을 거쳐야 하며, 모든 이용약관에 동의하여야 계정을 생성할 수 있습니다.",
    category: '트레이더',
  },
  {
    id: '18',
    question: 'Q2',
    title: '전략 글은 어떻게 작성하나요?',
    answer:
      '홈페이지의 상단에 위치한 전략등록 카테고리를 통해 전략을 작성할 수 있습니다.\n단, 트레이더 회원인 경우에만 전략을 등록할 수 있습니다.',
    category: '트레이더',
  },
  {
    id: '19',
    question: 'Q3',
    title: '작성한 전략을 수정하거나 삭제할 수 있나요?',
    answer:
      '본인이 작성한 전략은 마이페이지의 내투자전략 페이지에서 전략별로 수정하거나 삭제할 수 있습니다.',
    category: '트레이더',
  },
  {
    id: '20',
    question: 'Q4',
    title: '일반 회원의 문의는 어디에서 확인하나요?',
    answer:
      '투자자의 문의는 마이페이지의 상담문의 페이지에서 확인할 수 있습니다.\n각 문의에 대해 답변을 작성하면 문의자에게 해당 내용이 보여집니다.',
    category: '트레이더',
  },
  {
    id: '21',
    question: 'Q5',
    title: '문의 답변은 어디서 할 수 있나요?',
    answer:
      '마이페이지의 상담문의 페이지에서 특정 문의를 클릭한 뒤에 답변하기 버튼을 클릭하면 됩니다.\n단, 이미 답변을 한 경우 새로운 답변을 달 수 없습니다.',
    category: '트레이더',
  },
  {
    id: '22',
    question: 'Q6',
    title: '작성한 답변을 수정하거나 삭제할 수 있나요?',
    answer: '이미 작성된 답변은 수정 및 삭제가 어렵습니다.',
    category: '트레이더',
  },
  {
    id: '23',
    question: 'Q7',
    title: '내가 작성한 전략을 팔로우한 회원 목록을 확인할 수 있나요?',
    answer:
      '마이페이지의 내투자전략 페이지에서 총 관심수를 확인하실 수 있으며, 각 전략별 관심수는 개별 전략선택을 통해 확인할 수 있습니다.\n관심수만 확인할 수 있으며 개별 회원에 대한 정보는 보호되므로 회원 목록을 조회하는 것은 어렵습니다.',
    category: '트레이더',
  },
  {
    id: '24',
    question: 'Q8',
    title: '전략에 대한 부정적인 댓글을 관리할 수 있나요?',
    answer:
      '부정적인 댓글을 삭제하고자 하는 경우 관리자에게 문의하여 주시기 바랍니다.',
    category: '트레이더',
  },
];

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
