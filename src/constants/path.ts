export const PATH = {
  ROOT: '/',
  SIGN_IN: '/signin',
  SIGN_FIND_ID: '/signin/find/id',
  SIGN_FIND_PW: '/signin/find/pw',
  SIGN_UP: '/signup',
  SIGN_UP_TYPE: (type = ':type') => `/signup/step/${type}`,
  SIGN_UP_FORM: (type = ':type') => `/signup/step/${type}/form`,
  SIGN_UP_DONE: (type = ':type') => `/signup/step/${type}/done`,
  STRATEGIES_LIST: '/strategies',
  TRADERS: '/strategies/traders',
  TRADER_STRATEGIES: (userId = ':userId') => `/strategies/traders/${userId}`,
  STRATEGIES_DETAIL: (strategyId = ':strategyId') =>
    `/strategies/${strategyId}`,
  STRATEGIES_DETAIL_DAILY: (strategyId = ':strategyId') =>
    `/strategies/${strategyId}/daily`,
  STRATEGIES_DETAIL_MONTHLY: (strategyId = ':strategyId') =>
    `/strategies/${strategyId}/monthly`,
  STRATEGIES_DETAIL_ACCOUNT: (strategyId = ':strategyId') =>
    `/strategies/${strategyId}/account`,
  STRATEGIES_QNA: (strategyId = ':strategyId') =>
    `/strategies/${strategyId}/qna`,
  STRATEGIES_ADD: '/strategies/add',
  MYPAGE: '/mypage',
  MYPAGE_STRATEGIES_EDIT: (strategyId = ':strategyId') =>
    `/mypage/strategies/${strategyId}`,
  MYPAGE_PROFILE: (userId = ':userId') => `/mypage/${userId}/profile`,
  MYPAGE_PROFILE_EDIT: (userId = ':userId') => `/mypage/${userId}/profile/edit`,
  MYPAGE_QNA_EDIT: (qnaId = ':qnaId') => `/mypage/qna/${qnaId}/edit`,
  MYPAGE_PASSWORD: (userId = ':userId') => `/mypage/${userId}/password`,
  MYPAGE_OPT: (userId = ':userId') => `/mypage/${userId}/opt`,
  MYPAGE_WITHDRAW: '/mypage/withdraw',
  MYPAGE_QNA: (userId = ':userId') => `/mypage/${userId}/qna`,
  MYPAGE_QNA_DETAIL: (userId = ':userId', qnaId = ':qnaId') =>
    `/mypage/${userId}/qna/${qnaId}`,
  MYPAGE_QNA_ANSWER: (userId = ':userId', qnaId = ':qnaId') =>
    `/mypage/${userId}/qna/${qnaId}/answer`,
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_NOTICES: '/admin/notices',
  ADMIN_NOTICES_ADD: '/admin/notices/add',
  ADMIN_NOTICES_EDIT: (noticeId = ':noticeId') =>
    `/admin/notices/${noticeId}/edit`,
  ADMIN_NOTICES_DETAIL: (noticeId = ':noticeId') =>
    `/admin/notices/${noticeId}`,
  ADMIN_STRATEGIES: '/admin/strategies',
  ADMIN_METHODS: '/admin/strategies/methods',
  ADMIN_STOCKS: '/admin/strategies/stocks',
  ADMIN_STRATEGIES_CONTROL: (strategyId = ':strategyId') =>
    `/admin/strategies/${strategyId}`,
  ADMIN_QNA: '/admin/qna',
  ADMIN_QNA_DETAIL: (qnaId = ':qnaId') => `/admin/qna/${qnaId}`,
  NOTICES: '/notices',
  NOTICES_DETAIL: (noticeId = ':noticeId') => `/notices/${noticeId}`,
  FAQ: '/faq',
  POLICY: '/policy',
  NOT_FOUND: '*',
};

export const BREADCRUMB_MAP: {
  [key: string]: { label: string; path?: string }[];
} = {
  [PATH.SIGN_FIND_ID]: [
    { label: '계정(이메일) 찾기', path: PATH.SIGN_FIND_ID },
  ],
  [PATH.SIGN_FIND_PW]: [{ label: '비밀번호 재설정', path: PATH.SIGN_FIND_PW }],
  [PATH.SIGN_UP]: [{ label: '회원가입', path: PATH.SIGN_UP }],
  [PATH.SIGN_UP_TYPE()]: [
    { label: '회원가입', path: PATH.SIGN_UP },
    { label: 'STEP1. 약관동의', path: PATH.SIGN_UP_TYPE() },
  ],
  [PATH.SIGN_UP_FORM()]: [
    { label: '회원가입', path: PATH.SIGN_UP },
    { label: 'STEP2. 정보입력', path: PATH.SIGN_UP_FORM() },
  ],
  [PATH.SIGN_UP_DONE()]: [
    { label: '회원가입', path: PATH.SIGN_UP },
    { label: 'STEP3. 가입완료', path: PATH.SIGN_UP_DONE() },
  ],
  [PATH.STRATEGIES_LIST]: [
    { label: '전략 탐색', path: PATH.STRATEGIES_LIST },
    { label: '전략 목록', path: PATH.STRATEGIES_LIST },
  ],
  [PATH.TRADERS]: [
    { label: '전략 탐색', path: PATH.STRATEGIES_LIST },
    { label: '트레이더 목록', path: PATH.TRADERS },
  ],
  [PATH.TRADER_STRATEGIES()]: [
    { label: '전략 탐색', path: PATH.STRATEGIES_LIST },
    { label: '트레이더 목록', path: PATH.TRADERS },
    { label: '전략 정보', path: PATH.TRADER_STRATEGIES() },
  ],
  [PATH.STRATEGIES_DETAIL()]: [
    { label: '전략 탐색', path: PATH.STRATEGIES_LIST },
    { label: '전략 목록', path: PATH.STRATEGIES_LIST },
    { label: '상세 보기', path: PATH.STRATEGIES_DETAIL() },
  ],
  [PATH.STRATEGIES_QNA()]: [
    { label: '전략 탐색', path: PATH.STRATEGIES_LIST },
    { label: '전략 목록', path: PATH.STRATEGIES_LIST },
    { label: '상세 보기', path: PATH.STRATEGIES_DETAIL() },
    { label: '문의하기', path: PATH.STRATEGIES_QNA() },
  ],
  [PATH.STRATEGIES_ADD]: [{ label: '전략 등록', path: PATH.STRATEGIES_ADD }],
  [PATH.MYPAGE]: [
    { label: '마이페이지', path: PATH.MYPAGE },
    { label: '내 전략', path: PATH.MYPAGE },
  ],
  [PATH.MYPAGE_PROFILE()]: [
    { label: '마이페이지', path: PATH.MYPAGE },
    { label: '내 정보 변경', path: PATH.MYPAGE_PROFILE() },
  ],
  [PATH.MYPAGE_PROFILE_EDIT()]: [
    { label: '마이페이지', path: PATH.MYPAGE },
    { label: '내 정보 변경', path: PATH.MYPAGE_PROFILE() },
    { label: '계정정보 변경', path: PATH.MYPAGE_PROFILE_EDIT() },
  ],
  [PATH.MYPAGE_PASSWORD()]: [
    { label: '마이페이지', path: PATH.MYPAGE },
    { label: '내 정보 변경', path: PATH.MYPAGE_PROFILE() },
    { label: '비밀번호 변경', path: PATH.MYPAGE_PASSWORD() },
  ],
  [PATH.MYPAGE_OPT()]: [
    { label: '마이페이지', path: PATH.MYPAGE },
    { label: '내 정보 변경', path: PATH.MYPAGE_PROFILE() },
    { label: '정보 수신 동의 변경', path: PATH.MYPAGE_OPT() },
  ],
  [PATH.MYPAGE_QNA()]: [
    { label: '마이페이지', path: PATH.MYPAGE },
    { label: '상담문의', path: PATH.MYPAGE_QNA() },
  ],
  [PATH.MYPAGE_QNA_DETAIL()]: [
    { label: '마이페이지', path: PATH.MYPAGE },
    { label: '상담문의', path: PATH.MYPAGE_QNA_DETAIL() },
  ],
  [PATH.MYPAGE_QNA_EDIT()]: [
    { label: '마이페이지', path: PATH.MYPAGE },
    { label: '상담문의', path: PATH.MYPAGE_QNA() },
    { label: '문의 글 수정', path: PATH.MYPAGE_QNA_EDIT() },
  ],
  [PATH.MYPAGE_WITHDRAW]: [
    { label: '마이페이지', path: PATH.MYPAGE },
    { label: '내 정보 변경', path: PATH.MYPAGE_PROFILE() },
    { label: '회원 탈퇴', path: PATH.MYPAGE_WITHDRAW },
  ],
  [PATH.MYPAGE_STRATEGIES_EDIT()]: [
    { label: '마이페이지', path: PATH.MYPAGE },
    { label: '내 전략', path: PATH.MYPAGE },
    { label: '전략 수정', path: PATH.MYPAGE_STRATEGIES_EDIT() },
  ],
  [PATH.ADMIN_USERS]: [{ label: '회원 관리', path: PATH.ADMIN_USERS }],
  [PATH.ADMIN_NOTICES]: [{ label: '공지 관리', path: PATH.ADMIN_NOTICES }],
  [PATH.ADMIN_NOTICES_ADD]: [
    { label: '공지 관리', path: PATH.ADMIN_NOTICES },
    { label: '공지 작성', path: PATH.ADMIN_NOTICES_ADD },
  ],
  [PATH.ADMIN_NOTICES_EDIT()]: [
    { label: '공지 관리', path: PATH.ADMIN_NOTICES },
    { label: '공지 수정', path: PATH.ADMIN_NOTICES_EDIT() },
  ],
  [PATH.ADMIN_NOTICES_DETAIL()]: [
    { label: '공지 관리', path: PATH.ADMIN_NOTICES },
  ],
  [PATH.ADMIN_STRATEGIES]: [
    { label: '전략 관리', path: PATH.ADMIN_STRATEGIES },
    { label: '전략 목록', path: PATH.ADMIN_STRATEGIES },
  ],
  [PATH.ADMIN_METHODS]: [
    { label: '전략 관리', path: PATH.ADMIN_STRATEGIES },
    { label: '매매방식 관리', path: PATH.ADMIN_METHODS },
  ],
  [PATH.ADMIN_STOCKS]: [
    { label: '전략 관리', path: PATH.ADMIN_STRATEGIES },
    { label: '종목 관리', path: PATH.ADMIN_STOCKS },
  ],
  [PATH.ADMIN_QNA]: [{ label: '문의 관리', path: PATH.ADMIN_QNA }],
  [PATH.NOTICES]: [{ label: '공지사항', path: PATH.NOTICES }],
  [PATH.NOTICES_DETAIL()]: [{ label: '공지사항', path: PATH.NOTICES_DETAIL() }],
  [PATH.FAQ]: [{ label: '자주 묻는 질문', path: PATH.FAQ }],
  [PATH.POLICY]: [{ label: '개인정보처리방침', path: PATH.POLICY }],
};
