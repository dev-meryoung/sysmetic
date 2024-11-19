import { useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import TagTest from '@/assets/images/test-tag.jpg';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';


// 테이블 컴포넌트 가져와서 스타일 수정 예정

const QnaList = () => {
  const POSTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const navigate = useNavigate();

  const strategyOptions = [
    { label: '최신순', value: '최신순' },
    { label: '전략순', value: '전략순' }
  ];

  const statusOptions = [
    { label: '전체', value: '전체' },
    { label: '답변대기', value: '답변대기' },
    { label: '답변완료', value: '답변완료' }
  ];
  // 나중에 필터링 할 때 사용
  const [_selectedStrategy, setSelectedStrategy] = useState<string>('all');
  const [_selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleStrategyChange = (value: string) => {
    setSelectedStrategy(value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  // 임시 게시글 데이터 (나중에 삭제)
  const [posts] = useState(
    Array.from({ length: 2 }, (_, index) => ({
      qnaId: `qna-${index + 1}`,
      title: `게시글 ${index + 1}`,
      status: index % 2 === 0 ? '답변 완료' : '답변 대기',
    }))
  );

  const currentPosts = posts.slice(
    currentPage * POSTS_PER_PAGE,
    (currentPage + 1) * POSTS_PER_PAGE
  );

  const totalPage = Math.ceil(posts.length / POSTS_PER_PAGE);

  const handleGoDetail = () => {
    navigate(PATH.MYPAGE_QNA_DETAIL());
  };

  return (
    <div css={wrapperStyle}>
      <div css={filterStyle}>
        <div css={filerWrapperStyle}>
          <SelectBox
            options={strategyOptions}
            placeholder='정렬 기준'
            handleChange={handleStrategyChange}
          />
        </div>
        <div css={filerWrapperStyle}>
          <SelectBox
            options={statusOptions}
            placeholder='답변 상태'
            handleChange={handleStatusChange}
          />
        </div>
      </div>

      <div css={postListStyle}>
        <div css={postTitleStyle}>
          <span>제목</span>
          <span>진행상태</span>
        </div>
        {currentPosts.length > 0 ? (
          <ul css={postItemsStyle}>
            {currentPosts.map((post) => (
              <li
                key={post.qnaId}
                onClick={handleGoDetail}
                css={postItemStyle(post.status)}
              >
                <span>{post.title}</span>
                <span>{post.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p css={emptyMessageStyle}>게시글이 없습니다.</p>
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

export default QnaList;

const wrapperStyle = css`
  padding-bottom: 181px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  box-sizing: border-box;
`;

const filterStyle = css`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  margin-bottom: 24px;
  gap: 16px;
`;

const filerWrapperStyle = css`
  position: relative;
  align-items: center;
`;

const postListStyle = css`
  width: 100%;
  border-top: 1px solid ${COLOR.PRIMARY700};
`;

const postTitleStyle = css`
  height: 48px;
  display: grid;
  grid-template-columns: 6fr 1fr;
  align-items: center;
  text-align: center;
  background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.BOLD};
  padding: 10px 16px;

  span:last-of-type {
    border-left: 1px solid ${COLOR.GRAY300};
    padding-left: 16px;
    text-align: center;
  }
`;

const postItemsStyle = css`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const postItemStyle = (status: string) => css`
  display: grid;
  grid-template-columns: 6fr 1fr;
  align-items: center;
  height: 64px;
  padding: 0 16px;
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.BOLD};
  color: ${COLOR.TEXT_BLACK};
  cursor: pointer;

  span:last-of-type {
    border-left: 1px solid ${COLOR.GRAY300};
    padding-left: 16px;
    text-align: center;
    color: ${status === '답변 완료' ? COLOR.CHECK_GREEN : COLOR.TEXT_BLACK};
    font-weight: ${FONT_WEIGHT.BOLD};
  }
`;

const emptyMessageStyle = css`
  text-align: center;
  font-size: ${FONT_SIZE.TEXT_MD};
  color: ${COLOR.GRAY700};
  margin-top: 20px;
`;
