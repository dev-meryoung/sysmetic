import { HttpResponse, http } from 'msw';
import { db } from '../data/database';
import { getUserIdFromRequest } from '../utils';

const createPageResponse = (
  content: any[],
  pageNum: number,
  totalElements: number,
  pageSize: number
) => ({
  currentPage: pageNum,
  pageSize,
  totalElement: totalElements,
  totalPages: Math.ceil(totalElements / pageSize),
  content,
});

const commonHandlers = [
  // 메인페이지 조회 API
  http.get('/v1/main/info', () => {
    const rankedTrader = db.users
      .filter((u) => u.roleCode === 'TRADER')
      .sort((a, b) => b.totalFollowerCount - a.totalFollowerCount)
      .slice(0, 3)
      .map((u) => {
        const traderStrategies = db.strategies.filter(
          (s) => s.traderId === u.id
        );
        const avgCagr =
          traderStrategies.reduce((acc, s) => acc + s.cagr, 0) /
            traderStrategies.length || 0;
        return {
          id: u.id,
          nickname: u.nickname,
          traderProfileImage: u.profileImage,
          followerCount: u.totalFollowerCount,
          accumProfitLossRate: avgCagr,
        };
      });

    const smScoreTopFives = db.strategies
      .filter((s) => s.isOpen && s.isApproved === 'APPROVED')
      .sort((a, b) => b.smScore - a.smScore)
      .slice(0, 5)
      .map((s) => {
        const trader = db.users.find((u) => u.id === s.traderId);
        return {
          id: s.id,
          traderId: s.traderId,
          traderProfileImage: trader?.profileImage,
          nickname: trader?.nickname,
          name: s.name,
          tradingStyle: s.methodName,
          assetClass: s.stockList.stockNames.join(', '),
          stocks: s.stockList,
          smScore: s.smScore,
          accumulatedProfitLossRate: s.cagr,
        };
      });

    const response = {
      rankedTrader,
      totalTraderCount: db.users.filter((u) => u.roleCode === 'TRADER').length,
      totalStrategyCount: db.strategies.length,
      smScoreTopFives,
    };

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 메인페이지 차트 정보 조회 API
  http.get('/v1/main/analysis', () => {
    const days = 365; // 1년치 데이터를 제공

    const topStrategy = db.strategies
      .filter((s) => s.isOpen && s.isApproved === 'APPROVED')
      .sort((a, b) => b.smScore - a.smScore)[0];

    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      return date.toISOString();
    });

    // 현실적인 차트 데이터 생성 함수
    const generateRealisticData = (
      length: number,
      initialValue: number,
      trend: number,
      volatilityFactor: number,
      dips: { start: number; end: number; impact: number }[]
    ) => {
      const data = [];
      let value = initialValue;
      for (let i = 0; i < length; i++) {
        // 일반적인 변동성 및 추세 반영
        const volatility = (Math.random() - 0.48) * volatilityFactor;
        value += trend + volatility;

        // 특정 구간에 하락 이벤트 추가
        const dip = dips.find((d) => i >= d.start && i <= d.end);
        if (dip) {
          value -= dip.impact * Math.random();
        }

        // 값이 너무 비현실적으로 떨어지는 것을 방지
        if (value < 0 && initialValue > 0) {
          value = Math.random() * volatilityFactor;
        }

        data.push(value);
      }
      return data;
    };

    // 'Sysmetic Traders 통합기준가' 데이터 생성
    const averageStandardAmount = generateRealisticData(
      days,
      10000, // 시작값
      15, // 일일 평균 상승 트렌드
      400, // 변동성 계수
      [
        // 하락 구간 설정
        { start: 80, end: 120, impact: 80 },
        { start: 250, end: 280, impact: 120 },
      ]
    );

    // 'SM Score 1위' 데이터 생성 (더 높은 변동성)
    const accumulatedProfitLossRate = generateRealisticData(
      days,
      10, // 시작값
      0.15, // 일일 평균 상승 트렌드
      4, // 변동성 계수
      [
        // 하락 구간 설정
        { start: 50, end: 80, impact: 0.8 },
        { start: 180, end: 220, impact: 1.2 },
        { start: 300, end: 310, impact: 1.5 },
      ]
    );

    const response = {
      smScoreTopStrategyName: topStrategy.name,
      xaxisAverageStandardAmount: dates,
      averageStandardAmount,
      xaxisAccumulatedProfitLossRate: dates,
      accumulatedProfitLossRate,
    };

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 공지사항 조회 및 검색 API
  http.get('/v1/notice', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('page') || '0', 10);
    const searchText = url.searchParams.get('searchText') || '';
    const pageSize = 10;

    const filteredNotices = db.notices
      .filter((n) => n.isOpen && n.title.includes(searchText))
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

    const content = filteredNotices
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((n) => ({
        noticeId: n.id,
        noticeTitle: n.title,
        writerNickname: n.writerNickname,
        writeDate: n.createdAt,
        hits: n.hits,
        fileExist: false, // 첨부파일 없음으로 수정
      }));

    const response = createPageResponse(
      content,
      pageNum,
      filteredNotices.length,
      pageSize
    );
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 공지사항 상세 조회 API
  http.get('/v1/notice/:noticeId', ({ params }) => {
    const noticeId = parseInt(params.noticeId as string, 10);
    const notice = db.notices.find((n) => n.id === noticeId);

    if (!notice) {
      return HttpResponse.json(
        { code: 404, message: '공지사항을 찾을 수 없습니다.', data: null },
        { status: 404 }
      );
    }

    const sortedNotices = db.notices.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const currentIndex = sortedNotices.findIndex((n) => n.id === noticeId);
    const prevNotice = sortedNotices[currentIndex + 1];
    const nextNotice = sortedNotices[currentIndex - 1];

    const response = {
      noticeId: notice.id,
      noticeTitle: notice.title,
      noticeContent: notice.content,
      writeDate: notice.createdAt,
      writerNickname: notice.writerNickname,
      hits: notice.hits,
      fileExist: false,
      imageExist: false,
      fileDtoList: [],
      imageList: [],
      previousId: prevNotice?.id,
      previousTitle: prevNotice?.title,
      nextId: nextNotice?.id,
      nextTitle: nextNotice?.title,
    };
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // --- 문의 관련 (사용자/트레이더) ---
  // 질문자 문의 목록 조회
  http.get('*/v1/member/qna', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('page') || '0', 10);
    const closed = url.searchParams.get('closed'); // 'true' or 'false'
    const pageSize = 10;
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return HttpResponse.json(
        { code: 401, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    let userInquiries = db.inquiries.filter((i) => i.userId === userId);

    if (closed) {
      const isAnswered = closed === 'true';
      userInquiries = userInquiries.filter((i) => i.isAnswered === isAnswered);
    }

    const content = userInquiries
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((i) => {
        const strategy = db.strategies.find((s) => s.id === i.strategyId);
        return {
          inquiryId: i.id,
          inquiryTitle: i.title,
          inquiryStatus: i.isAnswered ? 'closed' : 'unclosed',
          inquiryRegistrationDate: i.createdAt,
          strategyName: strategy?.name,
          methodIconPath: strategy?.methodIconPath,
          cycle: strategy?.cycle,
          stockList: strategy?.stockList,
        };
      });

    const response = createPageResponse(
      content,
      pageNum,
      userInquiries.length,
      pageSize
    );
    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: response,
    });
  }),

  // 트레이더 문의 목록 조회
  http.get('*/v1/trader/qna', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('page') || '0', 10);
    const closed = url.searchParams.get('closed');
    const pageSize = 10;
    const traderId = getUserIdFromRequest(request);

    if (!traderId) {
      return HttpResponse.json(
        { code: 401, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const traderStrategyIds = db.strategies
      .filter((s) => s.traderId === traderId)
      .map((s) => s.id);

    let traderInquiries = db.inquiries.filter((i) =>
      traderStrategyIds.includes(i.strategyId)
    );

    if (closed) {
      const isAnswered = closed === 'true';
      traderInquiries = traderInquiries.filter(
        (i) => i.isAnswered === isAnswered
      );
    }

    const content = traderInquiries
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((i) => {
        const user = db.users.find((u) => u.id === i.userId);
        const strategy = db.strategies.find((s) => s.id === i.strategyId);
        return {
          inquiryId: i.id,
          inquiryTitle: i.title,
          inquiryStatus: i.isAnswered ? 'closed' : 'unclosed',
          inquiryRegistrationDate: i.createdAt,
          inquirerNickname: user?.nickname,
          strategyName: strategy?.name,
          methodIconPath: strategy?.methodIconPath,
          cycle: strategy?.cycle,
          stockList: strategy?.stockList,
        };
      });

    const response = createPageResponse(
      content,
      pageNum,
      traderInquiries.length,
      pageSize
    );
    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: response,
    });
  }),

  // 문의 등록
  http.post('*/v1/strategy/:strategyId/qna', async ({ request, params }) => {
    const { inquiryTitle, inquiryContent } = (await request.json()) as {
      inquiryTitle: string;
      inquiryContent: string;
    };
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return HttpResponse.json(
        { code: 401, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const newInquiry = {
      id:
        db.inquiries.length > 0
          ? Math.max(...db.inquiries.map((i) => i.id)) + 1
          : 1,
      strategyId: Number(params.strategyId),
      title: inquiryTitle,
      content: inquiryContent,
      userId,
      createdAt: new Date().toISOString(),
      isAnswered: false,
      answer: null,
    };
    db.inquiries.push(newInquiry);
    return HttpResponse.json({
      code: 200,
      message: '문의가 등록되었습니다.',
      data: null,
    });
  }),

  // 질문자 문의 상세 조회
  http.get('*/v1/member/qna/:qnaId', ({ params }) => {
    const qnaId = parseInt(params.qnaId as string, 10);
    const inquiry = db.inquiries.find((i) => i.id === qnaId);

    if (!inquiry) {
      return HttpResponse.json(
        { code: 404, message: '문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const strategy = db.strategies.find((s) => s.id === inquiry.strategyId);
    const trader = db.users.find((u) => u.id === strategy?.traderId);
    const inquirer = db.users.find((u) => u.id === inquiry.userId);

    const response = {
      inquiryId: inquiry.id,
      inquiryTitle: inquiry.title,
      inquiryContent: inquiry.content,
      inquiryRegistrationDate: inquiry.createdAt,
      inquiryStatus: inquiry.isAnswered ? 'closed' : 'unclosed',
      inquirerNickname: inquirer?.nickname,
      answerTitle: inquiry.answer ? `RE: ${inquiry.title}` : null,
      answerContent: inquiry.answer?.content,
      answerRegistrationDate: inquiry.answer?.answeredAt,
      strategyId: strategy?.id,
      strategyName: strategy?.name,
      traderNickname: trader?.nickname,
      traderProfileImagePath: trader?.profileImage,
      methodIconPath: strategy?.methodIconPath,
      cycle: strategy?.cycle,
      stockList: strategy?.stockList,
    };

    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: response,
    });
  }),

  // 트레이더 문의 상세 조회
  http.get('*/v1/trader/qna/:qnaId', ({ params }) => {
    const qnaId = parseInt(params.qnaId as string, 10);
    const inquiry = db.inquiries.find((i) => i.id === qnaId);

    if (!inquiry) {
      return HttpResponse.json(
        { code: 404, message: '문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const strategy = db.strategies.find((s) => s.id === inquiry.strategyId);
    const trader = db.users.find((u) => u.id === strategy?.traderId);
    const inquirer = db.users.find((u) => u.id === inquiry.userId);

    const response = {
      inquiryId: inquiry.id,
      inquiryTitle: inquiry.title,
      inquiryContent: inquiry.content,
      inquiryRegistrationDate: inquiry.createdAt,
      inquiryStatus: inquiry.isAnswered ? 'closed' : 'unclosed',
      inquirerNickname: inquirer?.nickname,
      answerTitle: inquiry.answer ? `RE: ${inquiry.title}` : null,
      answerContent: inquiry.answer?.content,
      answerRegistrationDate: inquiry.answer?.answeredAt,
      strategyId: strategy?.id,
      strategyName: strategy?.name,
      traderNickname: trader?.nickname,
      traderProfileImagePath: trader?.profileImage,
      methodIconPath: strategy?.methodIconPath,
      cycle: strategy?.cycle,
      stockList: strategy?.stockList,
    };

    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: response,
    });
  }),

  // 질문자 문의 수정 화면 조회
  http.get('*/v1/member/qna/:qnaId/modify', ({ params }) => {
    const qnaId = parseInt(params.qnaId as string, 10);
    const inquiry = db.inquiries.find((i) => i.id === qnaId);

    if (!inquiry) {
      return HttpResponse.json(
        { code: 404, message: '문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: {
        inquiryTitle: inquiry.title,
        inquiryContent: inquiry.content,
      },
    });
  }),

  // 질문자 문의 수정
  http.put('*/v1/member/qna/:qnaId', async ({ params, request }) => {
    const qnaId = parseInt(params.qnaId as string, 10);
    const { inquiryTitle, inquiryContent } = (await request.json()) as {
      inquiryTitle: string;
      inquiryContent: string;
    };
    const inquiry = db.inquiries.find((i) => i.id === qnaId);

    if (!inquiry) {
      return HttpResponse.json(
        { code: 404, message: '문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    inquiry.title = inquiryTitle;
    inquiry.content = inquiryContent;

    return HttpResponse.json({
      code: 200,
      message: '문의가 수정되었습니다.',
      data: null,
    });
  }),
];

export { commonHandlers };
