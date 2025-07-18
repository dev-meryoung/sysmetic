// --- 헬퍼 함수 ---
const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min: number, max: number, decimals: number) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const getRandomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString()
    .split('T')[0];

// --- 타입 정의 ---
export interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  roleCode: 'USER' | 'TRADER' | 'USER_MANAGER' | 'TRADER_MANAGER' | 'ADMIN';
  profileImage: string;
  phoneNumber: string;
  birth: string;
  totalFollowerCount: number;
  totalStrategyCount: number;
  receiveInfoConsent: boolean;
  receiveMarketingConsent: boolean;
}

export interface Strategy {
  id: number;
  name: string;
  traderId: number;
  methodId: number;
  methodName: string;
  methodIconPath: string;
  stockList: {
    stockIds: number[];
    stockNames: string[];
    stockIconPath: string[];
  };
  cycle: 'D' | 'W' | 'M';
  content: string;
  followerCount: number;
  cagr: number; // 누적 손익률
  mdd: number;
  smScore: number;
  winningRate: number; // 승률 필드 추가
  isOpen: boolean;
  isApproved: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
}

export interface Method {
  id: number;
  name: string;
  iconPath: string;
}

export interface Stock {
  id: number;
  name: string;
  iconPath: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  writerNickname: string;
  createdAt: string;
  hits: number;
  isPinned: boolean;
  isOpen: boolean;
}

export interface Comment {
  id: number;
  strategyId: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface Inquiry {
  id: number;
  strategyId: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  isAnswered: boolean;
  answer: {
    content: string;
    answeredAt: string;
  } | null;
}

export interface Folder {
  id: number;
  userId: number;
  name: string;
}

export interface InterestStrategy {
  id: number;
  userId: number;
  folderId: number;
  strategyId: number;
  createdAt: string;
}

// --- 데이터 배열 선언 ---
const users: User[] = [];
const strategies: Strategy[] = [];
const notices: Notice[] = [];
const comments: Comment[] = [];
const inquiries: Inquiry[] = [];
const folders: Folder[] = [];
const interestStrategies: InterestStrategy[] = [];

// --- 기본 데이터 ---
// "매매방식" 데이터
const METHODS: Method[] = [
  { id: 1, name: '자동', iconPath: '/assets/images/method_auto.png' },
  { id: 2, name: '반자동', iconPath: '/assets/images/method_semi_auto.png' },
  { id: 3, name: '수동', iconPath: '/assets/images/method_manual.png' },
];

// "운용종목" 데이터
const STOCKS: Stock[] = [
  { id: 1, name: '국내주식', iconPath: '/assets/images/asset_kr_stock.png' },
  { id: 2, name: '해외주식', iconPath: '/assets/images/asset_us_stock.png' },
  { id: 3, name: '국내 ETF', iconPath: '/assets/images/asset_kr_etf.png' },
  { id: 4, name: '해외 ETF', iconPath: '/assets/images/asset_us_etf.png' },
  { id: 5, name: '국내선물', iconPath: '/assets/images/asset_kr_futures.png' },
  { id: 6, name: '해외선물', iconPath: '/assets/images/asset_us_futures.png' },
  { id: 7, name: 'F/X', iconPath: '/assets/images/asset_fx.png' },
];

const USER_NAMES = [
  '김민준',
  '이서연',
  '박도윤',
  '최지우',
  '정시우',
  '강하은',
  '조은우',
  '윤서아',
  '장예준',
  '임지아',
  '한선우',
  '오채원',
  '송지호',
  '권유나',
  '황민서',
  '안수현',
  '홍준우',
  '문다은',
  '양지훈',
  '배하윤',
];
const TRADER_NICKNAMES = [
  '주식읽는남자',
  '닥터퀀트',
  '월가아재',
  '수급단타왕',
  '가치투자여행가',
  '차트술사',
  '스윙의정석',
  '경제적자유연구소',
  '시장을이기는자',
  '여의도키움맨',
  '미스터마켓',
  '사이클투자자',
  '네오밸류',
  '돈깡',
  '알고리즘트레이더',
];
const COMMENT_CONTENTS = [
  'MDD 관리가 인상적이네요. 백테스팅 기간은 어느 정도인가요?',
  '최근 시장에 잘 맞는 것 같습니다. 팔로우합니다!',
  '좋은 전략 공유 감사합니다. 혹시 최대 레버리지 비율은 어떻게 되나요?',
  '수익률 곡선이 아름답네요. 운영 철학이 궁금합니다.',
  '이 종목 편입 비중이 높은 이유가 있을까요?',
  '구독 시작했습니다. 앞으로 좋은 성과 기대하겠습니다.',
  '손절 라인은 어떻게 잡고 계신가요? 궁금합니다.',
  '시장 변동성이 클 때도 잘 버텨줄지 지켜보겠습니다.',
  '포트폴리오에 참고하겠습니다. 감사합니다.',
  '트레이더님의 다른 전략도 있나요?',
];

// --- 데이터 생성 로직 ---

// 사용자 생성
const shuffledTraderNicknames = [...TRADER_NICKNAMES].sort(
  () => 0.5 - Math.random()
);
let userIdCounter = 1;

// 1. 관리자 계정 생성
users.push({
  id: userIdCounter++,
  email: 'admin@sysmetic.co.kr',
  name: '관리자',
  nickname: '관리자',
  roleCode: 'ADMIN',
  profileImage: `https://i.pravatar.cc/150?u=admin`,
  phoneNumber: `010-0000-0000`,
  birth: '1990-01-01',
  totalFollowerCount: 0,
  totalStrategyCount: 0,
  receiveInfoConsent: true,
  receiveMarketingConsent: true,
});

// 2. 트레이더 계정 생성 (10개)
for (let i = 1; i <= 10; i++) {
  const name = getRandomElement(USER_NAMES);
  const nickname = shuffledTraderNicknames.pop() || `트레이더${i}`;
  users.push({
    id: userIdCounter++,
    email: `trader${i}@sysmetic.co.kr`,
    name,
    nickname,
    roleCode: 'TRADER',
    profileImage: `https://i.pravatar.cc/150?u=trader${i}`,
    phoneNumber: `010-${getRandomInt(1000, 9999)}-${getRandomInt(1000, 9999)}`,
    birth: getRandomDate(new Date(1980, 0, 1), new Date(2000, 0, 1)),
    totalFollowerCount: getRandomInt(50, 3000),
    totalStrategyCount: 0, // 나중에 업데이트됨
    receiveInfoConsent: Math.random() > 0.5,
    receiveMarketingConsent: Math.random() > 0.3,
  });
}

// 3. 일반 사용자 계정 생성 (29개, 총 40개 계정)
for (let i = 1; i <= 29; i++) {
  const name = getRandomElement(USER_NAMES);
  users.push({
    id: userIdCounter++,
    email: `user${i}@sysmetic.co.kr`,
    name,
    nickname: `${name}${i}`,
    roleCode: 'USER',
    profileImage: `https://i.pravatar.cc/150?u=user${i}`,
    phoneNumber: `010-${getRandomInt(1000, 9999)}-${getRandomInt(1000, 9999)}`,
    birth: getRandomDate(new Date(1985, 0, 1), new Date(2005, 0, 1)),
    totalFollowerCount: 0,
    totalStrategyCount: 0,
    receiveInfoConsent: Math.random() > 0.5,
    receiveMarketingConsent: Math.random() > 0.3,
  });
}

// 전략 생성 (35개)
const traders = users.filter((u) => u.roleCode === 'TRADER');

// 현실성을 높이기 위해 전략 테마별로 이름, 설명, 운용 종목을 묶어서 정의
const strategyThemes = [
  {
    name: '코스피 우량주 스윙',
    description:
      '기본적 분석으로 선별된 코스피 우량주를 대상으로, 기술적 지표를 활용해 스윙 매매를 진행합니다. 안정성과 수익성을 동시에 추구합니다.',
    validStocks: ['국내주식', '국내 ETF'],
    cycle: 'W',
  },
  {
    name: '나스닥 100 변동성 돌파',
    description:
      '나스닥 100 지수의 변동성이 특정 임계점을 넘을 때 추세 방향으로 진입합니다. 기술주 중심의 적극적인 수익 추구형 전략입니다.',
    validStocks: ['해외주식', '해외 ETF'],
    cycle: 'D',
  },
  {
    name: 'S&P500 듀얼 모멘텀',
    description:
      'S&P500 지수와 미국 장기채의 모멘텀을 비교하여 더 강한 자산에 투자합니다. 시장 하락기에 효과적인 방어력을 보여주는 자산배분 전략입니다.',
    validStocks: ['해외주식', '해외 ETF'],
    cycle: 'M',
  },
  {
    name: '미국 배당성장주 장기투자',
    description:
      '꾸준히 배당을 늘려온 미국 기업에 장기 투자하여 복리 효과를 극대화합니다. 안정적인 현금 흐름 창출을 최우선 목표로 합니다.',
    validStocks: ['해외주식'],
    cycle: 'M',
  },
  {
    name: '글로벌 All-Weather 자산배분',
    description:
      '주식, 채권, 원자재 등 다양한 자산군에 분산 투자하여 어떠한 경제 상황에서도 안정적인 수익을 추구하는 포트폴리오입니다.',
    validStocks: ['국내주식', '해외주식', '국내 ETF', '해외 ETF', '해외선물'],
    cycle: 'M',
  },
  {
    name: '원자재 슈퍼사이클 추종',
    description:
      '경기 사이클에 따라 수요가 급증하는 원자재(구리, 원유 등) 관련 ETF에 투자하여 초과 수익을 추구합니다. 거시 경제 지표 분석이 핵심입니다.',
    validStocks: ['국내선물', '해외선물'],
    cycle: 'W',
  },
  {
    name: '달러-엔 캐리 트레이드',
    description:
      '저금리 통화(엔)를 빌려 고금리 통화(달러)에 투자하여 금리 차이와 환차익을 동시에 노리는 FX 트레이딩 전략입니다. 레버리지 관리가 중요합니다.',
    validStocks: ['F/X'],
    cycle: 'D',
  },
  {
    name: '퀀트 기반 롱숏 뉴트럴',
    description:
      '계량 모델을 통해 고평가된 자산을 매도(숏)하고 저평가된 자산을 매수(롱)하여 시장 방향과 무관한 절대 수익을 추구하는 고도화된 전략입니다.',
    validStocks: ['국내주식', '해외주식'],
    cycle: 'D',
  },
  {
    name: 'IPO 공모주 단기 차익',
    description:
      '신규 상장(IPO) 기업의 공모주를 배정받아 상장 초기에 매도하여 단기 차익을 얻습니다. 시장 분석과 청약 경쟁률 예측이 중요합니다.',
    validStocks: ['국내주식'],
    cycle: 'D',
  },
];

for (let i = 1; i <= 35; i++) {
  const trader = getRandomElement(traders);
  const method = getRandomElement(METHODS);
  const theme = getRandomElement(strategyThemes);

  // 테마에 맞는 운용 종목 중에서 1~2개를 랜덤으로 선택
  const validStockObjects = STOCKS.filter((s) =>
    theme.validStocks.includes(s.name)
  );
  const numStocks = Math.min(getRandomInt(1, 2), validStockObjects.length);
  const selectedStocks = [];
  const availableStocks = [...validStockObjects];
  for (let j = 0; j < numStocks; j++) {
    if (availableStocks.length > 0) {
      const index = getRandomInt(0, availableStocks.length - 1);
      selectedStocks.push(availableStocks.splice(index, 1)[0]);
    }
  }

  strategies.push({
    id: 100 + i,
    name: theme.name,
    traderId: trader.id,
    methodId: method.id,
    methodName: method.name,
    methodIconPath: method.iconPath,
    stockList: {
      stockIds: selectedStocks.map((s) => s.id),
      stockNames: selectedStocks.map((s) => s.name),
      stockIconPath: selectedStocks.map((s) => s.iconPath),
    },
    cycle: theme.cycle as 'D' | 'W' | 'M',
    content: theme.description,
    followerCount: getRandomInt(0, trader.totalFollowerCount),
    cagr: getRandomFloat(5, 80, 2),
    mdd: getRandomFloat(-30, -5, 2),
    smScore: getRandomFloat(60, 98, 2),
    winningRate: getRandomFloat(50, 90, 2),
    isOpen: Math.random() > 0.2,
    isApproved:
      Math.random() > 0.15
        ? 'APPROVED'
        : getRandomElement(['PENDING', 'REJECTED']),
    createdAt: getRandomDate(new Date(2020, 0, 1), new Date()),
  });
}

// 트레이더의 전략 개수 업데이트
users.forEach((user) => {
  if (user.roleCode === 'TRADER') {
    user.totalStrategyCount = strategies.filter(
      (s) => s.traderId === user.id
    ).length;
  }
});

// 공지사항 생성 (30개)
const noticeThemes = [
  {
    title: '[점검] 서버 안정화를 위한 정기 점검 안내',
    content:
      '보다 안정적인 서비스 제공을 위해 서버 정기 점검을 실시합니다. 점검 시간에는 서비스 이용이 일시적으로 중단될 수 있으니 양해 부탁드립니다.',
    isPinned: false,
  },
  {
    title: "[업데이트] '포트폴리오 시뮬레이터' 기능 출시",
    content:
      "나만의 투자 전략을 과거 데이터로 검증하는 '포트폴리오 시뮬레이터'가 출시되었습니다. '전략 상세' 페이지에서 지금 바로 확인해보세요.",
    isPinned: false,
  },
  {
    title: '[필독] 개인정보처리방침 개정 안내 (시행일: 2024-08-01)',
    content:
      '2024년 8월 1일부로 개인정보처리방침이 개정됩니다. 변경되는 내용을 확인하시고 서비스 이용에 참고하시기 바랍니다.',
    isPinned: true,
  },
  {
    title: '[이벤트] 제 3회 시스메틱 실전 투자 대회 개최',
    content:
      '총 상금 1,000만원! 제 3회 시스메틱 실전 투자 대회가 개최됩니다. 최고의 트레이더에 도전하고 푸짐한 상금의 주인공이 되어보세요.',
    isPinned: true,
  },
  {
    title: '[리포트] 주간 시장 동향 및 주요 이슈 (7월 3주차)',
    content:
      '금주 글로벌 증시 동향과 다음 주 주요 경제 지표 발표 일정을 공유해드립니다. 투자에 참고하시기 바랍니다.',
    isPinned: false,
  },
  {
    title: '[중요] 시스메틱 사칭 피싱/스미싱 주의 안내',
    content:
      '최근 시스메틱을 사칭한 피싱 문자가 발견되고 있습니다. 당사는 절대 회원님의 비밀번호나 개인 금융 정보를 요구하지 않습니다. 각별히 주의 바랍니다.',
    isPinned: false,
  },
  {
    title: "[선정] 6월의 우수 트레이더 '수급단타왕'님",
    content:
      "안정적인 MDD 관리와 꾸준한 수익률을 보여주신 '수급단타왕'님께서 6월의 우수 트레이더로 선정되었습니다. 축하드립니다!",
    isPinned: false,
  },
  {
    title: '[안내] 모바일 앱(AOS/iOS) v1.2 업데이트 안내',
    content:
      '차트 기능 개선 및 푸시 알림 설정 기능이 추가된 v1.2 업데이트가 배포되었습니다. 지금 바로 앱 스토어에서 업데이트하세요.',
    isPinned: false,
  },
  {
    title: '[안내] 고객센터 운영 시간 변경 안내',
    content:
      '내부 워크샵 진행으로 인해 7월 25일(목) 고객센터 운영 시간이 10:00 ~ 15:00로 단축됩니다. 이용에 참고 부탁드립니다.',
    isPinned: false,
  },
  {
    title: '[공지] 일부 구형 브라우저 지원 종료 안내',
    content:
      '보안 강화 및 서비스 품질 유지를 위해 2024년 9월 1일부터 Internet Explorer 등 일부 구형 브라우저에 대한 지원이 종료됩니다.',
    isPinned: false,
  },
  {
    title: '[이벤트] 신규 가입 회원 대상 웰컴 리워드 이벤트',
    content:
      '시스메틱에 새로 가입하신 모든 회원님께 투자 지원금 10,000 포인트를 드립니다! 지금 바로 가입하고 혜택을 받으세요.',
    isPinned: false,
  },
  {
    title: "[교육] '초보자를 위한 퀀트 투자' 온라인 웨비나 개최 안내",
    content:
      "퀀트 투자가 어려운 초보자분들을 위해 '닥터퀀트'님과 함께하는 온라인 웨비나를 준비했습니다. 많은 참여 바랍니다.",
    isPinned: false,
  },
  {
    title: '[리포트] 2024년 하반기 증시 전망 리포트',
    content:
      '시스메틱 리서치 센터에서 발간한 2024년 하반기 증시 전망 리포트를 공유합니다. 투자 전략 수립에 활용하시기 바랍니다.',
    isPinned: false,
  },
  {
    title: '[업데이트] 전략 검색 필터 기능 강화 안내',
    content:
      "사용자 여러분의 의견을 반영하여 전략 검색 필터에 '승률', '거래 빈도' 등 새로운 조건을 추가했습니다. 더 정교하게 원하는 전략을 찾아보세요.",
    isPinned: false,
  },
  {
    title: '[안내] 추석 연휴 고객센터 휴무 안내',
    content:
      '추석 연휴 기간 동안 고객센터가 휴무에 들어갑니다. 문의사항은 1:1 문의 게시판에 남겨주시면 연휴 이후 순차적으로 답변드리겠습니다.',
    isPinned: false,
  },
  {
    title: '[결과] 제 2회 실전 투자 대회 결과 발표',
    content:
      '치열했던 제 2회 실전 투자 대회의 최종 순위와 수상자를 발표합니다. 참여해주신 모든 분들께 감사드립니다.',
    isPinned: false,
  },
  {
    title: '[안내] 서비스 이용약관 개정 안내',
    content:
      '서비스 이용약관이 일부 개정되어 안내드립니다. 변경된 내용은 8월 1일부터 효력이 발생합니다.',
    isPinned: false,
  },
  {
    title: '[업데이트] 다크 모드 지원 시작',
    content:
      '이제 시스메틱을 다크 모드로 이용하실 수 있습니다. 프로필 설정에서 다크 모드를 활성화해보세요.',
    isPinned: false,
  },
  {
    title: '[리포트] 월간 시장 동향 및 주요 이슈 (6월)',
    content:
      '6월 글로벌 증시 동향과 주요 경제 지표 발표 일정을 공유해드립니다. 투자에 참고하시기 바랍니다.',
    isPinned: false,
  },
  {
    title: '[안내] 연말정산용 거래내역서 발급 안내',
    content:
      '2024년도 연말정산을 위한 거래내역서 발급 방법을 안내드립니다. 마이페이지에서 직접 출력하실 수 있습니다.',
    isPinned: false,
  },
];

// 30개의 공지사항을 생성
for (let i = 1; i <= 30; i++) {
  const date = new Date();
  // 날짜를 약간 불규칙하게 설정하여 현실성을 높임
  date.setDate(date.getDate() - i * 2 - getRandomInt(0, 3));
  const createdAt = date.toISOString();

  // 20개의 테마 풀에서 랜덤하게 하나를 선택
  const theme = getRandomElement(noticeThemes);

  // 최신 공지 중 일부만 isPinned가 될 수 있도록 조정
  const isPinned = i <= 2 && theme.isPinned;

  notices.push({
    id: i,
    title: theme.title,
    content: theme.content,
    writerNickname: '관리자',
    createdAt,
    hits: getRandomInt(10, 5000),
    isPinned,
    isOpen: Math.random() > 0.1,
  });
}

// 댓글 생성 (50개)
for (let i = 1; i <= 50; i++) {
  const strategy = getRandomElement(
    strategies.filter((s) => s.isApproved === 'APPROVED')
  );
  const user = getRandomElement(users.filter((u) => u.roleCode === 'USER'));
  comments.push({
    id: i,
    strategyId: strategy.id,
    userId: user.id,
    content: getRandomElement(COMMENT_CONTENTS),
    createdAt: getRandomDate(new Date(2024, 0, 1), new Date()).toString(),
  });
}

// 문의 생성 (20개)
const inquiryThemes = [
  {
    question: (s: Strategy) =>
      `안녕하세요. '${s.name}' 전략의 MDD가 ${s.mdd}%로 인상적이어서 문의드립니다. 특별한 리스크 관리 비법이 있으신가요?`,
    answer: (s: Strategy) =>
      `좋은 질문 감사합니다. 저희 '${s.name}' 전략은 최대 손실폭을 엄격하게 제한하는 룰 기반 손절 원칙과, 변동성이 큰 시기에는 현금 비중을 늘리는 동적 자산배분을 통해 MDD를 관리하고 있습니다.`,
  },
  {
    question: (s: Strategy) =>
      `'${s.name}' 전략의 누적 수익률(${s.cagr}%)이 높은데, 주로 어떤 시장 상황에서 강점을 보이나요?`,
    answer: () =>
      `저희 전략은 주로 추세가 명확한 상승장에서 가장 좋은 성과를 냅니다. 다만, 횡보장이나 하락장에서도 손실을 최소화하는 헷지 전략을 일부 포함하고 있어 안정성을 높였습니다.`,
  },
  {
    question: (s: Strategy) =>
      `운용 종목에 '${s.stockList.stockNames[0]}'이(가) 포함되어 있는데, 해당 종목을 선택하신 특별한 이유가 궁금합니다.`,
    answer: (s: Strategy) =>
      `문의주신 '${s.stockList.stockNames[0]}' 종목은 저희 퀀트 모델 분석 결과, 장기적인 성장 잠재력과 현재 시장 모멘텀 점수가 가장 높아 포트폴리오에 편입하게 되었습니다.`,
  },
  {
    question: () => `백테스팅 기간과 실제 운용 기간은 각각 얼마나 되나요?`,
    answer: (s: Strategy) =>
      `해당 전략은 10년간의 과거 데이터로 백테스팅을 마쳤으며, 실제 운용은 ${new Date(s.createdAt).getFullYear()}년부터 시작하여 꾸준히 트래킹하고 있습니다.`,
  },
  {
    question: () => `수수료 및 슬리피지를 고려한 수익률인가요?`,
    answer: () =>
      `네, 공개된 모든 성과 지표는 일반적인 증권사 수수료(0.015%)와 보수적인 슬리피지(0.1%)를 모두 차감하여 계산된 실질 수익률에 가깝습니다.`,
  },
];

for (let i = 1; i <= 20; i++) {
  const user = getRandomElement(
    users.filter((u) => u.roleCode === 'USER' || u.roleCode === 'TRADER')
  );
  const strategy = getRandomElement(
    strategies.filter((s) => s.isApproved === 'APPROVED')
  );
  const theme = getRandomElement(inquiryThemes);
  const isAnswered = Math.random() > 0.4;

  inquiries.push({
    id: i,
    strategyId: strategy.id, // <-- strategyId 추가
    title: `'${strategy.name}' 전략 관련 문의`,
    content: theme.question(strategy),
    userId: user.id,
    createdAt: getRandomDate(new Date(2024, 5, 1), new Date()).toString(),
    isAnswered,
    answer: isAnswered
      ? {
          content: theme.answer(strategy),
          answeredAt: getRandomDate(
            new Date(2024, 6, 1),
            new Date()
          ).toString(),
        }
      : null,
  });
}

// 모든 사용자에게 '기본 폴더'가 있는지 확인하고 없으면 생성
let folderIdCounter =
  folders.length > 0 ? Math.max(...folders.map((f) => f.id)) + 1 : 1;
users.forEach((user) => {
  const hasDefaultFolder = folders.some(
    (folder) => folder.userId === user.id && folder.name === '기본 폴더'
  );
  if (!hasDefaultFolder) {
    folders.push({
      id: folderIdCounter++,
      userId: user.id,
      name: '기본 폴더',
    });
  }
});

// 일반 투자자에게 관심 전략 2~3개씩 추가
const normalUsers = users.filter((u) => u.roleCode === 'USER');
const approvedStrategies = strategies.filter(
  (s) => s.isApproved === 'APPROVED'
);
let interestIdCounter = 1;

if (approvedStrategies.length > 0) {
  normalUsers.forEach((user) => {
    const defaultFolder = folders.find(
      (f) => f.userId === user.id && f.name === '기본 폴더'
    );
    if (defaultFolder) {
      const numStrategiesToAdd = getRandomInt(2, 3);
      const availableStrategies = [...approvedStrategies];

      for (let i = 0; i < numStrategiesToAdd; i++) {
        if (availableStrategies.length === 0) break;

        const strategyIndex = getRandomInt(0, availableStrategies.length - 1);
        const selectedStrategy = availableStrategies.splice(
          strategyIndex,
          1
        )[0];

        const isAlreadyAdded = interestStrategies.some(
          (is) => is.userId === user.id && is.strategyId === selectedStrategy.id
        );

        if (!isAlreadyAdded) {
          interestStrategies.push({
            id: interestIdCounter++,
            userId: user.id,
            folderId: defaultFolder.id,
            strategyId: selectedStrategy.id,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }
  });
}

// --- 최종 데이터베이스 객체 ---
export const db = {
  users,
  strategies,
  methods: METHODS,
  stocks: STOCKS,
  notices,
  comments,
  inquiries,
  folders,
  interestStrategies,
};
