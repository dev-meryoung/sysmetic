import { HttpResponse, http } from 'msw';
import { Strategy, db } from '../data/database';

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

const strategyHandlers = [
  // 매매방식 및 운용 종목 목록 조회 API
  http.get('*/v1/trader/strategy/method-and-stock', () =>
    HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: {
        methodList: db.methods.map((method) => ({
          ...method,
          filePath: method.iconPath,
        })),
        stockList: db.stocks.map((stock) => ({
          ...stock,
          filePath: stock.iconPath,
        })),
      },
    })
  ),

  // 전략 목록 조회 API (원래 버전)
  http.get('*/v1/strategy/list', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('pageNum') || '0', 10);
    const pageSize = 10;

    const publicStrategies = db.strategies.filter(
      (s) => s.isOpen && s.isApproved === 'APPROVED'
    );

    const content = publicStrategies
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((s) => {
        const trader = db.users.find((u) => u.id === s.traderId);
        const isFollow = db.interestStrategies.some(
          (i) => i.strategyId === s.id && i.userId === 1
        );
        return {
          strategyId: s.id,
          traderId: s.traderId,
          traderNickname: trader?.nickname,
          traderProfileImage: trader?.profileImage,
          methodId: s.methodId,
          methodName: s.methodName,
          methodIconPath: s.methodIconPath,
          name: s.name,
          cycle: s.cycle,
          stockList: s.stockList,
          isFollow,
          accumulatedProfitLossRate: s.cagr,
          mdd: s.mdd,
          smScore: s.smScore,
        };
      });

    const response = createPageResponse(
      content,
      pageNum,
      publicStrategies.length,
      pageSize
    );

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 전략 상세 조건 필터링 API (누적 손익률 필터 추가)
  http.post('*/v1/strategy/search/conditions', async ({ request }) => {
    const pageNum = parseInt(request.headers.get('pageNum') || '0', 10);
    const body = await request.json();
    const {
      methods,
      stockNames,
      cycle,
      period,
      accumulatedProfitLossRateRangeStart,
      accumulatedProfitLossRateRangeEnd,
    } = body as {
      methods?: string[];
      stockNames?: string[];
      cycle?: string[];
      period?: string;
      accumulatedProfitLossRateRangeStart?: string;
      accumulatedProfitLossRateRangeEnd?: string;
    };
    const pageSize = 10;

    let filteredStrategies = db.strategies.filter(
      (s) => s.isOpen && s.isApproved === 'APPROVED'
    );

    if (methods && methods.length > 0) {
      filteredStrategies = filteredStrategies.filter((s) =>
        methods.includes(s.methodName)
      );
    }

    if (stockNames && stockNames.length > 0) {
      filteredStrategies = filteredStrategies.filter(
        (s) =>
          s.stockList &&
          Array.isArray(s.stockList.stockNames) &&
          s.stockList.stockNames.some((stock) => stockNames.includes(stock))
      );
    }

    if (cycle && cycle.length > 0) {
      filteredStrategies = filteredStrategies.filter((s) => {
        if (cycle.includes('D') && s.cycle === 'D') return true;
        if (cycle.includes('P') && (s.cycle === 'W' || s.cycle === 'M'))
          return true;
        return false;
      });
    }

    if (period && period !== 'ALL') {
      const today = new Date();
      filteredStrategies = filteredStrategies.filter((s) => {
        const startDate = new Date(s.createdAt);
        const yearsDiff =
          (today.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365.25);

        switch (period) {
          case 'LESS_THAN_YEAR':
            return yearsDiff <= 1;
          case 'ONE_TO_TWO_YEAR':
            return yearsDiff > 1 && yearsDiff <= 2;
          case 'TWO_TO_THREE_YEAR':
            return yearsDiff > 2 && yearsDiff <= 3;
          case 'THREE_YEAR_MORE':
            return yearsDiff > 3;
          default:
            return true;
        }
      });
    }

    if (
      accumulatedProfitLossRateRangeStart ||
      accumulatedProfitLossRateRangeEnd
    ) {
      const startStr = accumulatedProfitLossRateRangeStart;
      const endStr = accumulatedProfitLossRateRangeEnd;

      filteredStrategies = filteredStrategies.filter((s) => {
        const { cagr } = s;
        let isAfterStart = true;
        let isBeforeEnd = true;

        if (startStr) {
          const startNum = parseFloat(startStr);
          if (!isNaN(startNum)) {
            isAfterStart = cagr >= startNum;
          }
        }

        if (endStr) {
          const endNum = parseFloat(endStr);
          if (!isNaN(endNum)) {
            isBeforeEnd = cagr <= endNum;
          }
        }
        return isAfterStart && isBeforeEnd;
      });
    }

    const totalElements = filteredStrategies.length;

    const content = filteredStrategies
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((s) => {
        const trader = db.users.find((u) => u.id === s.traderId);
        const isFollow = db.interestStrategies.some(
          (i) => i.strategyId === s.id && i.userId === 1
        );
        return {
          strategyId: s.id,
          traderId: s.traderId,
          traderNickname: trader?.nickname,
          traderProfileImage: trader?.profileImage,
          methodId: s.methodId,
          methodName: s.methodName,
          methodIconPath: s.methodIconPath,
          name: s.name,
          cycle: s.cycle,
          stockList: s.stockList,
          isFollow,
          accumulatedProfitLossRate: s.cagr,
          mdd: s.mdd,
          smScore: s.smScore,
        };
      });

    const response = createPageResponse(
      content,
      pageNum,
      totalElements,
      pageSize
    );

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 알고리즘별 전략 필터링 API (신규 추가)
  http.get('*/v1/strategy/search/algorithm', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('pageNum') || '0', 10);
    const algorithm = url.searchParams.get('algorithm') || 'EFFICIENCY';
    const pageSize = 10;

    const baseStrategies = db.strategies.filter(
      (s) => s.isOpen && s.isApproved === 'APPROVED'
    );

    const sortedStrategies = [...baseStrategies].sort((a, b) => {
      switch (algorithm) {
        case 'EFFICIENCY':
          const aEfficiency = a.mdd !== 0 ? a.cagr / Math.abs(a.mdd) : 0;
          const bEfficiency = b.mdd !== 0 ? b.cagr / Math.abs(b.mdd) : 0;
          return bEfficiency - aEfficiency;
        case 'OFFENSIVE':
          return b.cagr - a.cagr;
        case 'DEFENSIVE':
          return b.smScore - a.smScore;
        default:
          return 0;
      }
    });

    const totalElements = sortedStrategies.length;

    const content = sortedStrategies
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((s) => {
        const trader = db.users.find((u) => u.id === s.traderId);
        const isFollow = db.interestStrategies.some(
          (i) => i.strategyId === s.id && i.userId === 1
        );
        return {
          strategyId: s.id,
          traderId: s.traderId,
          traderNickname: trader?.nickname,
          traderProfileImage: trader?.profileImage,
          methodId: s.methodId,
          methodName: s.methodName,
          methodIconPath: s.methodIconPath,
          name: s.name,
          cycle: s.cycle,
          stockList: s.stockList,
          stockIconPath: s.stockList.stockIconPath, // 프론트엔드에서 기대하는 위치에 추가
          isFollow,
          accumulatedProfitLossRate: s.cagr,
          mdd: s.mdd,
          smScore: s.smScore,
        };
      });

    const response = createPageResponse(
      content,
      pageNum,
      totalElements,
      pageSize
    );

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 트레이더명 검색결과 조회 API
  http.get('*/v1/strategy/list/trader', ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname') || '';
    const pageNum = parseInt(url.searchParams.get('pageNum') || '0', 10);
    const pageSize = 10;

    const filteredTraders = db.users.filter(
      (u) => u.roleCode === 'TRADER' && u.nickname.includes(nickname)
    );

    const content = filteredTraders
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((u) => ({
        nicknameListDto: {
          id: u.id,
          nickname: u.nickname,
          roleCode: u.roleCode,
          totalFollow: u.totalFollowerCount,
          publicStrategyCount: db.strategies.filter(
            (s) => s.traderId === u.id && s.isOpen
          ).length,
        },
        traderProfileImage: u.profileImage,
      }));

    const response = createPageResponse(
      content,
      pageNum,
      filteredTraders.length,
      pageSize
    );

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 특정 트레이더 전략 조회 API
  http.get('*/v1/strategy/list/pick', ({ request }) => {
    const url = new URL(request.url);
    const traderId = parseInt(url.searchParams.get('traderId') || '1', 10);
    const pageNum = parseInt(url.searchParams.get('pageNum') || '0', 10);
    const pageSize = 10;

    const trader = db.users.find((u) => u.id === traderId);
    const traderStrategies = db.strategies.filter(
      (s) => s.traderId === traderId && s.isOpen && s.isApproved === 'APPROVED'
    );

    const content = traderStrategies
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((s) => ({
        strategyId: s.id,
        strategyName: s.name,
        methodIconPath: s.methodIconPath,
        methodName: s.methodName,
        stockList: s.stockList,
        cycle: s.cycle,
        accumulatedProfitLossRate: s.cagr,
        isFollow: db.interestStrategies.some(
          (i) => i.strategyId === s.id && i.userId === 1
        ),
        mdd: s.mdd,
        smScore: s.smScore,
      }));

    const pageResponse = createPageResponse(
      content,
      pageNum,
      traderStrategies.length,
      pageSize
    );

    const response = {
      traderId: trader?.id,
      traderNickname: trader?.nickname,
      traderProfileImage: trader?.profileImage,
      followerCount: trader?.totalFollowerCount,
      strategyCount: traderStrategies.length,
      strategyListDto: pageResponse,
    };

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 전략명 검색 API
  http.get('*/v1/strategy/list/name', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';
    const pageNum = parseInt(url.searchParams.get('pageNum') || '0', 10);
    const pageSize = 10;

    const filtered = db.strategies.filter(
      (s) => s.name.includes(keyword) && s.isOpen && s.isApproved === 'APPROVED'
    );
    const content = filtered
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((s) => {
        const trader = db.users.find((u) => u.id === s.traderId);
        const isFollow = db.interestStrategies.some(
          (i) => i.strategyId === s.id && i.userId === 1
        );
        return {
          strategyId: s.id,
          traderId: s.traderId,
          traderNickname: trader?.nickname,
          traderProfileImage: trader?.profileImage,
          methodId: s.methodId,
          methodName: s.methodName,
          methodIconPath: s.methodIconPath,
          name: s.name,
          cycle: s.cycle,
          stockList: s.stockList,
          isFollow,
          accumulatedProfitLossRate: s.cagr,
          mdd: s.mdd,
          smScore: s.smScore,
        };
      });

    const response = createPageResponse(
      content,
      pageNum,
      filtered.length,
      pageSize
    );

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 전략 상세 정보 조회 API
  http.get('*/v1/strategy/detail/:strategyId', ({ params }) => {
    const strategyId = parseInt(params.strategyId as string, 10);
    const strategy = db.strategies.find((s) => s.id === strategyId);
    const trader = db.users.find((u) => u.id === strategy?.traderId);

    if (!strategy || !trader) {
      return HttpResponse.json(
        { code: 404, message: '전략을 찾을 수 없습니다.', data: null },
        { status: 404 }
      );
    }

    const statusMap: { [key: string]: string } = {
      PENDING: 'REQUEST',
      APPROVED: 'PUBLIC',
      REJECTED: 'RETURN',
    };
    const statusCode = statusMap[strategy.isApproved] || 'PRIVATE';

    const response = {
      id: strategy.id,
      traderId: strategy.traderId,
      traderNickname: trader.nickname,
      traderProfileImage: trader.profileImage,
      methodId: strategy.methodId,
      methodName: strategy.methodName,
      methodIconPath: strategy.methodIconPath,
      stockList: strategy.stockList,
      isFollow: db.interestStrategies.some(
        (i) => i.strategyId === strategy.id && i.userId === 1
      ),
      name: strategy.name,
      statusCode,
      cycle: strategy.cycle,
      content: strategy.content,
      followerCount: strategy.followerCount,
      mdd: strategy.mdd,
      kpRatio: 1.23,
      smScore: strategy.smScore,
      accumulatedProfitLossRate: strategy.cagr,
      maximumCapitalReductionAmount: -2000.0,
      averageProfitLossRate: 1.2,
      profitFactor: 2.5,
      winningRate: 65.5,
      monthlyRecord: [
        {
          year: new Date().getFullYear(),
          data: Array.from({ length: new Date().getMonth() + 1 }, (_, i) => ({
            month: i + 1,
            value: parseFloat((Math.random() * 15 - 5).toFixed(2)),
          })),
        },
        {
          year: new Date().getFullYear() - 1,
          data: Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            value: parseFloat((Math.random() * 15 - 5).toFixed(2)),
          })),
        },
      ],
      analysis: null,
      fileWithInfoResponse: null,
    };

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 전략 분석 그래프 데이터 조회 API
  http.get('*/v1/strategy/detail/analysis/:strategyId', () => {
    const dates = Array.from({ length: 100 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (100 - i));
      return date.toISOString().split('T')[0];
    });
    const analysisData = {
      xaxis: dates,
      standardAmounts: Array.from(
        { length: 100 },
        (_, i) => 10000 + i * 100 + Math.random() * 50
      ),
      currentBalance: Array.from(
        { length: 100 },
        (_, i) => 12000 + i * 120 + Math.random() * 60
      ),
      principal: Array.from({ length: 100 }, () => 10000),
      accumulatedDepositWithdrawalAmount: Array.from(
        { length: 100 },
        (_, i) => i * 50
      ),
      depositWithdrawalAmount: Array.from({ length: 100 }, (_, i) =>
        i % 10 === 0 ? 500 : 0
      ),
      dailyProfitLossAmount: Array.from(
        { length: 100 },
        () => Math.random() * 200 - 80
      ),
      dailyProfitLossRate: Array.from(
        { length: 100 },
        () => Math.random() * 2 - 0.8
      ),
      accumulatedProfitLossAmount: Array.from(
        { length: 100 },
        (_, i) => 2000 + i * 120
      ),
      currentCapitalReductionAmount: Array.from(
        { length: 100 },
        () => Math.random() * -500
      ),
      currentCapitalReductionRate: Array.from(
        { length: 100 },
        () => Math.random() * -5
      ),
      averageProfitLossAmount: Array.from(
        { length: 100 },
        (_, i) => (2000 + i * 120) / (i + 1)
      ),
      averageProfitLossRate: Array.from(
        { length: 100 },
        (_, i) => ((2000 + i * 120) / (i + 1) / 10000) * 100
      ),
      winningRate: Array.from({ length: 100 }, (_, i) => 50 + i * 0.1),
      profitFactor: Array.from({ length: 100 }, () => 1.5 + Math.random()),
      roa: Array.from({ length: 100 }, (_, i) => 12 + i * 0.02),
    };
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: analysisData,
    });
  }),

  // 전략 통계 정보 조회 API
  http.get('*/v1/strategy/statistics/:strategyId', ({ params }) => {
    const strategyId = parseInt(params.strategyId as string, 10);
    const strategy = db.strategies.find((s) => s.id === strategyId);
    if (!strategy)
      return HttpResponse.json(
        { code: 404, message: '전략을 찾을 수 없습니다.' },
        { status: 404 }
      );

    const startDate = new Date(strategy.createdAt);
    const endDate = new Date();
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const operationPeriod =
      months > 0 ? `${years}년 ${months}개월` : `${years}년`;

    const response = {
      currentBalance: 230000,
      accumulatedDepositWithdrawalAmount: 468000000,
      principal: 3400000,
      operationPeriod,
      startDate: strategy.createdAt,
      endDate: endDate.toISOString().split('T')[0],
      accumulatedProfitLossAmount: 2460000,
      accumulatedProfitLossRate: strategy.cagr,
      maximumAccumulatedProfitLossAmount: 875000000,
      maximumAccumulatedProfitLossRate: 21.223,
      currentCapitalReductionAmount: 120000,
      currentCapitalReductionRate: 2.5,
      maximumCapitalReductionAmount: strategy.mdd,
      maximumCapitalReductionRate: -15.5,
      averageProfitLossAmount: 3400,
      averageProfitLossRate: 0.56,
      maximumDailyProfitAmount: 58000,
      maximumDailyProfitRate: 2.8,
      maximumDailyLossAmount: -72000,
      maximumDailyLossRate: -3.1,
      totalTradingDays: 260,
      totalProfitDays: 180,
      totalLossDays: 80,
      currentContinuousProfitLossDays: 12,
      maxContinuousProfitDays: 20,
      maxContinuousLossDays: 8,
      winningRate: strategy.winningRate,
      profitFactor: 1.5,
      roa: 12.8,
      highPointRenewalProgress: 25,
    };
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 전략 댓글 조회 API
  http.get('*/v1/strategy/:strategyId/replies', ({ request, params }) => {
    const strategyId = parseInt(params.strategyId as string, 10);
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('page') || '0', 10);
    const pageSize = 10;
    const filteredComments = db.comments.filter(
      (c) => c.strategyId === strategyId
    );
    const content = filteredComments
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((c) => {
        const user = db.users.find((u) => u.id === c.userId);
        return {
          replyId: c.id,
          strategyId: c.strategyId,
          memberId: c.userId,
          memberNickname: user?.nickname,
          content: c.content,
          createdAt: c.createdAt,
          memberProfilePath: user?.profileImage,
        };
      });
    const response = createPageResponse(
      content,
      pageNum,
      filteredComments.length,
      pageSize
    );
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 전략 댓글 등록 API
  http.post('*/v1/strategy/reply', async ({ request }) => {
    const { strategyId, content } = (await request.json()) as {
      strategyId: number;
      content: string;
    };
    const newComment = {
      id: db.comments.length + 1,
      strategyId,
      content,
      userId: 1,
      createdAt: new Date().toISOString(),
    };
    db.comments.unshift(newComment);
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: null,
    });
  }),

  // 전략 댓글 삭제 API
  http.delete('*/v1/strategy/reply', async ({ request }) => {
    const { replyId } = (await request.json()) as { replyId: number };
    const index = db.comments.findIndex((c) => c.id === replyId);
    if (index > -1) db.comments.splice(index, 1);
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: null,
    });
  }),

  // --- 트레이더의 전략 관리 ---
  // 자신의 전략 목록 조회
  http.get('*/v1/trader/member/strategy/:page', ({ params }) => {
    const pageNum = parseInt(params.page as string, 10);
    const pageSize = 10;
    const traderId = 2;
    const myStrategies = db.strategies.filter((s) => s.traderId === traderId);
    const content = myStrategies
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((s) => ({
        strategyId: s.id,
        strategyName: s.name,
        openStatus: s.isOpen,
        approvalStatus: s.isApproved,
      }));
    const response = createPageResponse(
      content,
      pageNum,
      myStrategies.length,
      pageSize
    );
    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: response,
    });
  }),

  // 전략 생성
  http.post('*/v1/trader/strategy', async ({ request }) => {
    const formData = await request.formData();
    const dto = JSON.parse(formData.get('strategyRequestDto') as string);
    const newStrategy: Strategy = {
      id:
        db.strategies.length > 0
          ? Math.max(...db.strategies.map((s) => s.id)) + 1
          : 1,
      name: dto.name,
      traderId: 2,
      methodId: dto.methodId,
      methodName: db.methods.find((m) => m.id === dto.methodId)?.name || '',
      methodIconPath:
        db.methods.find((m) => m.id === dto.methodId)?.iconPath || '',
      stockList: {
        stockIds: dto.stockIds,
        stockNames: db.stocks
          .filter((s) => dto.stockIds.includes(s.id))
          .map((s) => s.name),
        stockIconPath: db.stocks
          .filter((s) => dto.stockIds.includes(s.id))
          .map((s) => s.iconPath),
      },
      cycle: dto.cycle,
      content: dto.content,
      followerCount: 0,
      cagr: 0,
      mdd: 0,
      smScore: 0,
      winningRate: 0,
      isOpen: false,
      isApproved: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    db.strategies.push(newStrategy);
    return HttpResponse.json({
      code: 200,
      message: '전략이 등록되었습니다.',
      data: null,
    });
  }),

  // 전략 수정
  http.patch(
    '*/v1/trader/strategy/:strategyId',
    async ({ params, request }) => {
      const strategyId = parseInt(params.strategyId as string, 10);
      const formData = await request.formData();
      const dto = JSON.parse(formData.get('strategyRequestDto') as string);
      const strategy = db.strategies.find((s) => s.id === strategyId);
      if (strategy) {
        strategy.name = dto.name;
        strategy.content = dto.content;
      }
      return HttpResponse.json({
        code: 200,
        message: '전략이 수정되었습니다.',
        data: null,
      });
    }
  ),

  // 전략 삭제
  http.delete('*/v1/trader/strategy', async ({ request }) => {
    const { idList } = (await request.json()) as { idList: number[] };
    db.strategies = db.strategies.filter((s) => !idList.includes(s.id));
    return HttpResponse.json({
      code: 200,
      message: '선택한 전략이 삭제되었습니다.',
      data: null,
    });
  }),

  // 전략 공개/비공개 전환
  http.patch('*/v1/trader/strategy/:strategyId/visibility', ({ params }) => {
    const strategyId = parseInt(params.strategyId as string, 10);
    const strategy = db.strategies.find((s) => s.id === strategyId);
    if (strategy) strategy.isOpen = !strategy.isOpen;
    return HttpResponse.json({
      code: 200,
      message: '공개 상태가 변경되었습니다.',
      data: null,
    });
  }),

  // --- 엑셀 관련 ---
  http.get(
    '*/v1/excel/daily/:strategyId',
    () =>
      new HttpResponse(new Blob(['excel data']), {
        headers: { 'Content-Type': 'application/vnd.ms-excel' },
      })
  ),
  http.get(
    '*/v1/excel/daily/statistics/:strategyId',
    () =>
      new HttpResponse(new Blob(['excel data']), {
        headers: { 'Content-Type': 'application/vnd.ms-excel' },
      })
  ),
  http.get(
    '*/v1/excel/monthly/:strategyId',
    () =>
      new HttpResponse(new Blob(['excel data']), {
        headers: { 'Content-Type': 'application/vnd.ms-excel' },
      })
  ),
  http.get(
    '*/v1/excel/daily',
    () =>
      new HttpResponse(new Blob(['excel data']), {
        headers: { 'Content-Type': 'application/vnd.ms-excel' },
      })
  ),
  http.post('*/v1/excel/daily/:strategyId', () =>
    HttpResponse.json({
      code: 200,
      message: '엑셀 파일이 업로드되었습니다.',
      data: null,
    })
  ),

  // --- 일간/월간/계좌 상세 정보 ---
  http.get('*/v1/strategy/daily/:strategyId', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('page') || '0', 10);
    const pageSize = 10;
    const content = Array.from({ length: pageSize }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (pageNum * pageSize + i));
      return {
        dailyId: pageNum * pageSize + i + 1,
        date: date.toISOString().split('T')[0], // YYYY-MM-DD 형식으로 수정
        principal: 10000000 + i * 10000,
        depositWithdrawalAmount: i % 5 === 0 ? 100000 : 0,
        profitLossAmount: Math.random() * 20000 - 10000,
        profitLossRate: Math.random() * 2 - 1,
        accumulatedProfitLossAmount: 100000 + i * 5000,
        accumulatedProfitLossRate: 1 + i * 0.05,
      };
    });
    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: createPageResponse(content, pageNum, 50, pageSize),
    });
  }),
  http.get('*/v1/strategy/monthly/:strategyId', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('page') || '0', 10);
    const pageSize = 10;
    const content = Array.from({ length: pageSize }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (pageNum * pageSize + i));
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      return {
        monthId: pageNum * pageSize + i + 1,
        yearMonth: `${year}-${String(month).padStart(2, '0')}`,
        averagePrincipal: 10000000 + i * 100000,
        depositWithdrawalAmount: i % 3 === 0 ? 500000 : 0,
        profitLossAmount: Math.random() * 500000 - 200000,
        profitLossRate: Math.random() * 5 - 2,
        accumulatedProfitLossAmount: 1000000 + i * 200000,
        accumulatedProfitLossRate: 10 + i * 2,
      };
    });
    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: createPageResponse(content, pageNum, 36, pageSize),
    });
  }),
  http.get('*/v1/strategy/account-image/:strategyId', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('page') || '0', 10);
    const pageSize = 4;
    const content = Array.from({ length: pageSize }, (_, i) => ({
      accountImageId: pageNum * pageSize + i + 1,
      imageUrl: `/thumbnail.png`,
      title: `2024년 ${i + 1}월 실계좌 인증`,
    }));
    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: createPageResponse(content, pageNum, 12, pageSize),
    });
  }),
];

export { strategyHandlers };
