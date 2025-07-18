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

export const followHandlers = [
  // 사용자 폴더 목록 조회
  http.get('*/v1/member/folder', ({ request }) => {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return HttpResponse.json(
        { code: 401, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const userFolders = db.folders
      .filter((f) => f.userId === userId)
      .map((f) => ({
        id: f.id,
        name: f.name,
        count: db.interestStrategies.filter(
          (i) => i.folderId === f.id && i.userId === userId
        ).length,
      }));

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: userFolders,
    });
  }),

  // 새 폴더 생성
  http.post('*/v1/member/folder', async ({ request }) => {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return HttpResponse.json(
        { code: 401, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { name } = (await request.json()) as { name: string };
    const newFolder = {
      id:
        db.folders.length > 0
          ? Math.max(...db.folders.map((f) => f.id)) + 1
          : 1,
      userId,
      name,
    };
    db.folders.push(newFolder);
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: { id: newFolder.id, name: newFolder.name },
    });
  }),

  // 폴더명 수정
  http.put('*/v1/member/folder', async ({ request }) => {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return HttpResponse.json(
        { code: 401, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { folderId, folderName } = (await request.json()) as {
      folderId: number;
      folderName: string;
    };
    const folder = db.folders.find(
      (f) => f.id === folderId && f.userId === userId
    );
    if (folder) {
      folder.name = folderName;
      return HttpResponse.json({
        code: 200,
        message: '요청이 성공했습니다.',
        data: { folderId: folder.id, folderName: folder.name },
      });
    }
    return HttpResponse.json(
      { code: 404, message: '폴더를 찾을 수 없습니다.' },
      { status: 404 }
    );
  }),

  // 폴더 삭제
  http.delete('*/v1/member/folder/:folderId', ({ request, params }) => {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return HttpResponse.json(
        { code: 401, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const folderId = Number(params.folderId);
    const folderIndex = db.folders.findIndex(
      (f) => f.id === folderId && f.userId === userId
    );

    if (folderIndex > -1) {
      db.folders.splice(folderIndex, 1);
      db.interestStrategies = db.interestStrategies.filter(
        (i) => i.folderId !== folderId || i.userId !== userId
      );
      return HttpResponse.json({
        code: 200,
        message: '요청이 성공했습니다.',
        data: null,
      });
    }
    return HttpResponse.json(
      { code: 404, message: '폴더를 찾을 수 없습니다.' },
      { status: 404 }
    );
  }),

  // 특정 폴더 내 관심 전략 목록 조회
  http.get('*/v1/member/interestStrategy', ({ request }) => {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return HttpResponse.json(
        { code: 401, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const folderId = Number(url.searchParams.get('folderId'));
    const pageNum = Number(url.searchParams.get('page') || '0');
    const pageSize = 10;

    const interestsInFolder = db.interestStrategies.filter(
      (i) => i.folderId === folderId && i.userId === userId
    );

    const content = interestsInFolder
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((interest) => {
        const strategy = db.strategies.find(
          (s) => s.id === interest.strategyId
        );
        const trader = db.users.find((u) => u.id === strategy?.traderId);
        return {
          id: strategy?.id,
          strategyId: strategy?.id,
          strategyName: strategy?.name,
          traderName: trader?.nickname,
          traderProfileImage: trader?.profileImage,
          accumulatedProfitRatio: strategy?.cagr,
          mdd: strategy?.mdd,
          smScore: strategy?.smScore,
          isFollow: true, // 이 폴더에 있다는 것 자체가 팔로우 상태임
          methodIconPath: strategy?.methodIconPath,
          cycle: strategy?.cycle,
          stockList: strategy?.stockList,
          stockIconPath: strategy?.stockList.stockIconPath,
        };
      });

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: createPageResponse(
        content,
        pageNum,
        interestsInFolder.length,
        pageSize
      ),
    });
  }),

  // 관심 전략 등록
  http.post('*/v1/strategy/follow', async ({ request }) => {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return HttpResponse.json(
        { code: 401, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { folderId, strategyId } = (await request.json()) as {
      folderId: number;
      strategyId: number;
    };

    // 이미 관심 등록되었는지 확인
    const existing = db.interestStrategies.find(
      (i) => i.strategyId === strategyId && i.userId === userId
    );
    if (existing) {
      return HttpResponse.json(
        { code: 409, message: '이미 관심 등록된 전략입니다.' },
        { status: 409 }
      );
    }

    const newInterest = {
      id:
        db.interestStrategies.length > 0
          ? Math.max(...db.interestStrategies.map((i) => i.id)) + 1
          : 1,
      userId,
      folderId,
      strategyId,
      createdAt: new Date().toISOString(),
    };
    db.interestStrategies.push(newInterest);
    const strategy = db.strategies.find((s) => s.id === strategyId);
    if (strategy) strategy.followerCount++;

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: null,
    });
  }),

  // 관심 전략 단일 삭제
  http.delete('*/v1/strategy/follow/:strategyId', ({ request, params }) => {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return HttpResponse.json(
        { code: 401, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const strategyId = Number(params.strategyId);
    const index = db.interestStrategies.findIndex(
      (i) => i.strategyId === strategyId && i.userId === userId
    );

    if (index > -1) {
      db.interestStrategies.splice(index, 1);
      const strategy = db.strategies.find((s) => s.id === strategyId);
      if (strategy && strategy.followerCount > 0) strategy.followerCount--;
    }

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: null,
    });
  }),

  // 관심 전략 선택 삭제
  http.delete('*/v1/strategy/followlist', async ({ request }) => {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return HttpResponse.json(
        { code: 401, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as any;
    const idsToDelete =
      body.strategyId || body.strategyIds || body.idList || [];

    idsToDelete.forEach((id: number) => {
      const index = db.interestStrategies.findIndex(
        (i) => i.strategyId === id && i.userId === userId
      );
      if (index > -1) {
        db.interestStrategies.splice(index, 1);
        const strategy = db.strategies.find((s) => s.id === id);
        if (strategy && strategy.followerCount > 0) strategy.followerCount--;
      }
    });

    return HttpResponse.json({
      code: 200,
      message: '선택한 관심 전략이 삭제되었습니다.',
      data: null,
    });
  }),

  // 관심 전략 폴더 이동
  http.put('*/v1/strategy/follow', async ({ request }) => {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return HttpResponse.json(
        { code: 401, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { folderId, strategyIds } = (await request.json()) as {
      folderId: number;
      strategyIds: number[];
    };

    strategyIds.forEach((strategyId) => {
      const interest = db.interestStrategies.find(
        (i) => i.strategyId === strategyId && i.userId === userId
      );
      if (interest) {
        interest.folderId = folderId;
      }
    });

    return HttpResponse.json({
      code: 200,
      message: '선택한 관심 전략이 이동되었습니다.',
      data: null,
    });
  }),
];
