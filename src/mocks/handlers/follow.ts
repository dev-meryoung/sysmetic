import { HttpResponse, http } from 'msw';
import { db } from '../data/database';

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
  http.get('*/v1/member/folder', () => {
    const userId = 1;
    const userFolders = db.folders
      .filter((f) => f.userId === userId)
      .map((f) => ({
        id: f.id,
        name: f.name,
        count: db.interestStrategies.filter((i) => i.folderId === f.id).length,
      }));
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: userFolders,
    });
  }),

  // 새 폴더 생성
  http.post('*/v1/member/folder', async ({ request }) => {
    const { name } = (await request.json()) as { name: string };
    const newFolder = {
      id:
        db.folders.length > 0
          ? Math.max(...db.folders.map((f) => f.id)) + 1
          : 1,
      userId: 1,
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
    const { folderId, folderName } = (await request.json()) as {
      folderId: number;
      folderName: string;
    };
    const folder = db.folders.find((f) => f.id === folderId);
    if (folder) folder.name = folderName;
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: { folderId: folder?.id, folderName: folder?.name },
    });
  }),

  // 폴더 삭제
  http.delete('*/v1/member/folder/:folderId', ({ params }) => {
    const folderId = Number(params.folderId);
    db.folders = db.folders.filter((f) => f.id !== folderId);
    db.interestStrategies = db.interestStrategies.filter(
      (i) => i.folderId !== folderId
    );
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: null,
    });
  }),

  // 특정 폴더 내 관심 전략 목록 조회
  http.get('*/v1/member/interestStrategy', ({ request }) => {
    const url = new URL(request.url);
    const folderId = Number(url.searchParams.get('folderId'));
    const pageNum = Number(url.searchParams.get('page') || '0');
    const pageSize = 10;
    const interestsInFolder = db.interestStrategies.filter(
      (i) => i.folderId === folderId
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
          isFollow: true,
          methodIconPath: strategy?.methodIconPath,
          cycle: strategy?.cycle,
          stockList: strategy?.stockList,
          stockIconPath: strategy?.stockList.stockIconPath, // 프론트엔드에서 기대하는 위치에 추가
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
    const { folderId, strategyId } = (await request.json()) as {
      folderId: number;
      strategyId: number;
    };
    const newInterest = {
      id:
        db.interestStrategies.length > 0
          ? Math.max(...db.interestStrategies.map((i) => i.id)) + 1
          : 1,
      userId: 1,
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
  http.delete('*/v1/strategy/follow/:strategyId', ({ params }) => {
    const strategyId = Number(params.strategyId);
    const index = db.interestStrategies.findIndex(
      (i) => i.strategyId === strategyId && i.userId === 1
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
    const body = (await request.json()) as any;
    const idsToDelete =
      body.strategyId || body.strategyIds || body.idList || [];

    idsToDelete.forEach((id: number) => {
      const index = db.interestStrategies.findIndex(
        (i) => i.strategyId === id && i.userId === 1
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
    const { folderId, strategyIds } = (await request.json()) as {
      folderId: number;
      strategyIds: number[];
    };
    strategyIds.forEach((strategyId) => {
      const interest = db.interestStrategies.find(
        (i) => i.strategyId === strategyId && i.userId === 1
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
