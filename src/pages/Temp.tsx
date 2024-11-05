const Temp = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    라우팅 테스트 페이지
    <a href='/signin'>로그인</a>
    <a href='/signup'>회원가입</a>
    <a href='/'>메인</a>
    <a href='/strategies/info/user'>전략탐색(안내)</a>
    <a href='/strategies'>전략 목록</a>
    <a href='/strategies/1 '>전략상세</a>
    <a href='/strategies/1/qna/add'>문의 질문 등록</a>
    <a href='/traders'>트레이더 목록</a>
    <a href='/traders/1'>트레이더별 전략목록</a>
    <a href='/strategies/search'>전략 상세 검색</a>
    <a href='/strategies/info/trader'>전략 등록(안내)</a>
    <a href='/strategies/add'>전략 등록</a>
    <a href='/mypage'>마이페이지(메인)</a>
    <a href='/mypage/check'>비밀번호 확인</a>
    <a href='/mypage/profile'>개인정보</a>
    <a href='/mypage/profile/edit'>개인정보 수정</a>
    <a href='/mypage/user/qna'>나의 문의 목록(일반회원)</a>
    <a href='/mypage/trader/qna'>나의 문의 목록(트레이더)</a>
    <a href='/mypage/qna/1/edit'>문의(질문) 수정</a>
    <a href='/mypage/withdraw'>회원탈퇴</a>
    <a href='/mypage/interests'>나의 관심 전략</a>
    <a href='/mypage/strategies'>나의 전략 목록</a>
    <a href='/mypage/strategies/1'>전략관리</a>
    <a href='/admin'>관리자(메인)</a>
    <a href='/admin/users'>회원 목록(관리)</a>
    <a href='/admin/notices'>공지사항 목록</a>
    <a href='/admin/notices/add'>공지사항 등록</a>
    <a href='/admin/notices/1/edit'>공지사항 수정</a>
    <a href='/admin/stocks'>종목 목록(관리)</a>
    <a href='/admin/methods'>매매방식 목록(관리)</a>
    <a href='/admin/strategies'>전략 목록(관리)</a>
    <a href='/admin/qna'>문의 목록(관리)</a>
    <a href='/notices'>공지사항 목록</a>
    <a href='/notices/1'>공지사항 상세</a>
    <a href='/faq'>FAQ</a>
    <a href='/3'>page not found</a>
  </div>
);

export default Temp;
