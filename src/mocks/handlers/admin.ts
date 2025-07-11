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

const adminHandlers = [
  // 관리자 메인페이지 조회 API
  http.get('*/v1/admin/main', () => {
    const memberCount = {
      totalMemberCount: db.users.length,
      userMemberCount: db.users.filter((u) => u.roleCode === 'USER').length,
      traderMemberCount: db.users.filter((u) => u.roleCode === 'TRADER').length,
    };
    const strategyCount = {
      totalStrategyCount: db.strategies.length,
      waitingStrategyCount: db.strategies.filter(
        (s) => s.isApproved === 'PENDING'
      ).length,
      openStrategyCount: db.strategies.filter((s) => s.isOpen).length,
    };
    const inquiryCount = {
      inquiryCount: db.inquiries.length,
      waitingInquiryCount: db.inquiries.filter((i) => !i.isAnswered).length,
      answeredInquiryCount: db.inquiries.filter((i) => i.isAnswered).length,
    };
    let adminNoticeResponse = db.notices
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((n) => ({
        noticeId: n.id,
        noticeTitle: n.title,
        noticeRegistrationDate: n.createdAt.split('T')[0],
      }));
    if (adminNoticeResponse.length === 0) {
      adminNoticeResponse = [
        {
          noticeId: 0,
          noticeTitle: '등록된 공지사항이 없습니다.',
          noticeRegistrationDate: new Date().toISOString().split('T')[0],
        },
      ];
    }
    const runReportResponseDto = {
      activeUser: 123,
      avgSessionDuration: '5분 30초',
      topVisitedUrls: { '/strategies': 540, '/traders': 320, '/notices': 150 },
    };
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: {
        memberCount,
        strategyCount,
        adminInquiryResponseDto: inquiryCount,
        adminNoticeResponse,
        runReportResponseDto,
      },
    });
  }),

  // 회원 목록 조회 API
  http.get('*/v1/admin/members', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('page') || '0', 10);
    const role = url.searchParams.get('role') || 'ALL';
    const searchType = url.searchParams.get('searchType') || 'ALL';
    const searchKeyword = url.searchParams.get('searchKeyword') || '';
    const pageSize = 10;
    let filteredUsers = db.users;
    if (role !== 'ALL') {
      if (role === 'MANAGER') {
        filteredUsers = filteredUsers.filter(
          (u) => u.roleCode === 'ADMIN' || u.roleCode === 'MANAGER'
        );
      } else {
        filteredUsers = filteredUsers.filter((u) => u.roleCode === role);
      }
    }
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filteredUsers = filteredUsers.filter((u) => {
        const email = u.email.toLowerCase();
        const name = u.name.toLowerCase();
        const nickname = u.nickname.toLowerCase();
        const { phoneNumber } = u;
        switch (searchType) {
          case 'EMAIL':
            return email.includes(keyword);
          case 'NAME':
            return name.includes(keyword);
          case 'NICKNAME':
            return nickname.includes(keyword);
          case 'PHONENUMBER':
            return phoneNumber.includes(keyword);
          default:
            return (
              email.includes(keyword) ||
              name.includes(keyword) ||
              nickname.includes(keyword) ||
              phoneNumber.includes(keyword)
            );
        }
      });
    }
    const content = filteredUsers
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((u) => ({
        id: u.id,
        roleCode: u.roleCode,
        email: u.email,
        name: u.name,
        nickname: u.nickname,
        birth: u.birth,
        phoneNumber: u.phoneNumber,
      }));
    const response = createPageResponse(
      content,
      pageNum,
      filteredUsers.length,
      pageSize
    );
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 회원 등급 변경 API
  http.patch('*/v1/admin/members', async ({ request }) => {
    const { memberId, hasManagerRights } = (await request.json()) as {
      memberId: number[];
      hasManagerRights: boolean;
    };
    db.users.forEach((user) => {
      if (memberId.includes(user.id)) {
        user.roleCode = hasManagerRights ? 'ADMIN' : 'USER';
      }
    });
    return HttpResponse.json({
      code: 200,
      message: '선택한 회원의 등급이 변경되었습니다.',
      data: null,
    });
  }),

  // 회원 강제 탈퇴 API
  http.delete('*/v1/admin/members/:memberIds', ({ params }) => {
    const memberIds = (params.memberIds as string).split(',').map(Number);
    db.users = db.users.filter((u) => !memberIds.includes(u.id));
    return HttpResponse.json({
      code: 200,
      message: '선택한 회원이 탈퇴 처리되었습니다.',
      data: null,
    });
  }),

  // 전략 목록 조회 API
  http.get('*/v1/admin/strategy', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('page') || '0', 10);
    const openStatus = url.searchParams.get('openStatus');
    const approvalStatus = url.searchParams.get('approvalStatus');
    const keyword = url.searchParams.get('keyword') || '';
    const pageSize = 10;

    let filteredStrategies = db.strategies;

    if (openStatus) {
      const isOpen = openStatus === 'PUBLIC';
      filteredStrategies = filteredStrategies.filter(
        (s) => s.isOpen === isOpen
      );
    }
    if (approvalStatus) {
      const approvalMap: { [key: string]: string } = {
        SA000: 'PENDING',
        SA001: 'PENDING',
        SA002: 'APPROVED',
        SA003: 'REJECTED',
      };
      const mappedStatus = approvalMap[approvalStatus];
      if (mappedStatus) {
        filteredStrategies = filteredStrategies.filter(
          (s) => s.isApproved === mappedStatus
        );
      }
    }
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredStrategies = filteredStrategies.filter((s) => {
        const trader = db.users.find((u) => u.id === s.traderId);
        return (
          s.name.toLowerCase().includes(lowerKeyword) ||
          (trader && trader.nickname.toLowerCase().includes(lowerKeyword))
        );
      });
    }

    const content = filteredStrategies
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((s) => {
        const trader = db.users.find((u) => u.id === s.traderId);
        const approvalMap: { [key: string]: string } = {
          PENDING: '승인요청',
          APPROVED: '승인',
          REJECTED: '반려',
        };
        return {
          strategyId: s.id,
          strategyName: s.name,
          traderName: trader?.nickname,
          openStatusCode: s.isOpen ? 'PUBLIC' : 'PRIVATE',
          approvalStatusCode: approvalMap[s.isApproved] || '요청 전',
          strategyCreateDate: s.createdAt,
          methodIconPath: s.methodIconPath,
          stockList: s.stockList,
        };
      });

    const response = createPageResponse(
      content,
      pageNum,
      filteredStrategies.length,
      pageSize
    );
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: response,
    });
  }),

  // 관리자 전략 상세 정보 조회 API
  http.get('*/v1/admin/strategy/:strategyId', ({ params }) => {
    const strategyId = parseInt(params.strategyId as string, 10);
    const strategy = db.strategies.find((s) => s.id === strategyId);

    if (!strategy) {
      return HttpResponse.json(
        { code: 404, message: '전략을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const trader = db.users.find((u) => u.id === strategy.traderId);

    const statusMap: { [key: string]: string } = {
      PENDING: 'REQUEST',
      APPROVED: 'PUBLIC',
      REJECTED: 'RETURN',
    };
    const status = statusMap[strategy.isApproved] || 'PRIVATE';

    const response = {
      strategyId: strategy.id,
      name: strategy.name,
      methodName: strategy.methodName,
      cycle: strategy.cycle,
      stockList: strategy.stockList,
      content: strategy.content,
      fileWithInfoResponse: {
        url: 'https://example.com/strategy.pdf',
        originalName: 'strategy_guide.pdf',
      },
      traderProfileImage: trader?.profileImage,
      traderNickname: trader?.nickname,
      followerCount: strategy.followerCount,
      status,
      // 탭 데이터 추가
      strategyDaily: { content: [], totalPages: 0 },
      strategyMonthly: { content: [], totalPages: 0 },
      strategyAccount: { content: [], totalPages: 0 },
    };

    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: response,
    });
  }),

  // 전략 승인 API
  http.patch('*/v1/admin/strategy/allow', async ({ request }) => {
    const { strategyId } = (await request.json()) as { strategyId: number[] };
    db.strategies.forEach((s) => {
      if (strategyId.includes(s.id)) {
        s.isApproved = 'APPROVED';
        s.isOpen = true;
      }
    });
    return HttpResponse.json({
      code: 200,
      message: '전략이 승인되었습니다.',
      data: null,
    });
  }),

  // 전략 반려 API
  http.patch('*/v1/admin/strategy/reject', async ({ request }) => {
    const { strategyId, rejectReason } = (await request.json()) as {
      strategyId: number;
      rejectReason: string;
    };
    const strategy = db.strategies.find((s) => s.id === strategyId);
    if (strategy) {
      strategy.isApproved = 'REJECTED';
      console.log(`[MSW] 전략 반려 (ID: ${strategyId}, 사유: ${rejectReason})`);
    }
    return HttpResponse.json({
      code: 200,
      message: '전략이 반려되었습니다.',
      data: null,
    });
  }),

  // 공지 목록 조회 API
  http.get('*/v1/admin/notice', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('page') || '0', 10);
    const searchType = url.searchParams.get('searchType') || 'title';
    const searchText = url.searchParams.get('searchText') || '';
    const pageSize = 10;
    let filteredNotices = db.notices;
    if (searchText) {
      const keyword = searchText.toLowerCase();
      filteredNotices = filteredNotices.filter((n) => {
        const title = n.title.toLowerCase();
        const content = n.content.toLowerCase();
        const writer = n.writerNickname.toLowerCase();
        switch (searchType) {
          case 'content':
            return content.includes(keyword);
          case 'titleContent':
            return title.includes(keyword) || content.includes(keyword);
          case 'writer':
            return writer.includes(keyword);
          default:
            return title.includes(keyword);
        }
      });
    }
    const content = filteredNotices
      .sort((a, b) => b.id - a.id)
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((n) => ({
        noticeId: n.id,
        noticeTitle: n.title,
        writerNickname: n.writerNickname,
        writeDate: n.createdAt,
        hits: n.hits,
        fileExist: false,
        isOpen: n.isOpen,
      }));
    const response = createPageResponse(
      content,
      pageNum,
      filteredNotices.length,
      pageSize
    );
    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: response,
    });
  }),

  // 공지 상세 조회 API
  http.get('*/v1/admin/notice/:noticeId', ({ params }) => {
    const noticeId = parseInt(params.noticeId as string, 10);
    const notice = db.notices.find((n) => n.id === noticeId);
    if (!notice)
      return HttpResponse.json(
        { code: 404, message: '공지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    const sortedNotices = [...db.notices].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const currentIndex = sortedNotices.findIndex((n) => n.id === noticeId);
    const prevNotice =
      currentIndex > 0 ? sortedNotices[currentIndex - 1] : null;
    const nextNotice =
      currentIndex < sortedNotices.length - 1
        ? sortedNotices[currentIndex + 1]
        : null;
    const response = {
      noticeId: notice.id,
      noticeTitle: notice.title,
      noticeContent: notice.content,
      writeDate: notice.createdAt,
      correctDate: notice.createdAt,
      writerNickname: notice.writerNickname,
      hits: notice.hits,
      fileExist: false,
      imageExist: false,
      isOpen: notice.isOpen,
      isPinned: notice.isPinned,
      fileDtoList: [],
      previousTitle: prevNotice?.title,
      previousWriteDate: prevNotice?.createdAt,
      nextTitle: nextNotice?.title,
      nextWriteDate: nextNotice?.createdAt,
      previousId: prevNotice?.id,
      nextId: nextNotice?.id,
    };
    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: response,
    });
  }),

  // 공지 작성 API
  http.post('*/v1/admin/notice', async ({ request }) => {
    const { title, content, isPinned } = (await request.json()) as {
      title: string;
      content: string;
      isPinned: boolean;
    };
    const newNotice = {
      id:
        db.notices.length > 0
          ? Math.max(...db.notices.map((n) => n.id)) + 1
          : 1,
      title,
      content,
      writerNickname: 'SysmeticAdmin',
      createdAt: new Date().toISOString(),
      hits: 0,
      isPinned,
      isOpen: true,
    };
    db.notices.push(newNotice);
    return HttpResponse.json({
      code: 200,
      message: '공지가 등록되었습니다.',
      data: { noticeId: newNotice.id },
    });
  }),

  // 공지 수정 API
  http.put('*/v1/admin/notice/:noticeId', async ({ params, request }) => {
    const noticeId = parseInt(params.noticeId as string, 10);
    const formData = await request.formData();
    const dto = JSON.parse(formData.get('NoticeModifyRequestDto') as string);

    const noticeIndex = db.notices.findIndex((n) => n.id === noticeId);
    if (noticeIndex === -1)
      return HttpResponse.json(
        { code: 404, message: '공지를 찾을 수 없습니다.' },
        { status: 404 }
      );

    db.notices[noticeIndex] = {
      ...db.notices[noticeIndex],
      title: dto.noticeTitle,
      content: dto.noticeContent,
      isOpen: dto.isOpen,
    };
    return HttpResponse.json({
      code: 200,
      message: '공지가 수정되었습니다.',
      data: { noticeId },
    });
  }),

  // 공지 수정 화면 조회 API
  http.get('*/v1/admin/notice/:noticeId/modify', ({ params }) => {
    const noticeId = parseInt(params.noticeId as string, 10);
    const notice = db.notices.find((n) => n.id === noticeId);

    if (!notice) {
      return HttpResponse.json(
        { code: 404, message: '공지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const response = {
      noticeTitle: notice.title,
      noticeContent: notice.content,
      isOpen: notice.isOpen,
      fileDtoList: [],
    };
    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: response,
    });
  }),

  // 공지 공개 여부 수정 API
  http.patch('*/v1/admin/notice/:noticeId/open-close', ({ params }) => {
    const noticeId = parseInt(params.noticeId as string, 10);
    const notice = db.notices.find((n) => n.id === noticeId);
    if (notice) notice.isOpen = !notice.isOpen;
    return HttpResponse.json({
      code: 200,
      message: '공개 여부가 변경되었습니다.',
      data: null,
    });
  }),

  // 공지 목록 삭제 API
  http.delete('*/v1/admin/notice', async ({ request }) => {
    const { noticeIds } = (await request.json()) as { noticeIds: number[] };
    db.notices = db.notices.filter((n) => !noticeIds.includes(n.id));
    return HttpResponse.json({
      code: 200,
      message: '선택한 공지가 삭제되었습니다.',
      data: null,
    });
  }),

  // 문의 목록 조회 API
  http.get('*/v1/admin/qna', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('page') || '0', 10);
    const closed = url.searchParams.get('closed') || 'all';
    const keyword = (url.searchParams.get('searchText') || '').toLowerCase();
    const pageSize = 10;
    let filteredInquiries = db.inquiries;

    if (closed !== 'all') {
      const isAnswered = closed === 'closed';
      filteredInquiries = filteredInquiries.filter(
        (i) => i.isAnswered === isAnswered
      );
    }

    if (keyword) {
      filteredInquiries = filteredInquiries.filter((i) => {
        const user = db.users.find((u) => u.id === i.userId);
        return (
          i.title.toLowerCase().includes(keyword) ||
          (user && user.nickname.toLowerCase().includes(keyword))
        );
      });
    }

    const content = filteredInquiries
      .sort((a, b) => b.id - a.id)
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((i) => {
        const user = db.users.find((u) => u.id === i.userId);
        const strategy = db.strategies.find((s) => s.id === i.strategyId);
        const trader = db.users.find((u) => u.id === strategy?.traderId);
        return {
          inquiryId: i.id,
          traderNickname: trader?.nickname || '알수없음',
          strategyName: strategy?.name || '전략 없음',
          methodIconPath: strategy?.methodIconPath,
          cycle: strategy?.cycle,
          stockList: strategy?.stockList,
          inquiryRegistrationDate: i.createdAt,
          inquirerNickname: user?.nickname || '알수없음',
          inquiryStatus: i.isAnswered ? 'closed' : 'unclosed',
        };
      });

    const response = createPageResponse(
      content,
      pageNum,
      filteredInquiries.length,
      pageSize
    );
    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: response,
    });
  }),

  // 문의 상세 조회 API
  http.get('*/v1/admin/qna/:qnaId', ({ params }) => {
    const inquiryId = parseInt(params.qnaId as string, 10);
    const inquiry = db.inquiries.find((i) => i.id === inquiryId);

    if (!inquiry) {
      return HttpResponse.json(
        { code: 404, message: '문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const user = db.users.find((u) => u.id === inquiry.userId);
    const strategy = db.strategies.find((s) => s.id === inquiry.strategyId);
    const trader = db.users.find((u) => u.id === strategy?.traderId);

    const sortedInquiries = [...db.inquiries].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const currentIndex = sortedInquiries.findIndex((i) => i.id === inquiryId);
    const prevInquiry =
      currentIndex > 0 ? sortedInquiries[currentIndex - 1] : null;
    const nextInquiry =
      currentIndex < sortedInquiries.length - 1
        ? sortedInquiries[currentIndex + 1]
        : null;

    const response = {
      inquiryId: inquiry.id,
      inquiryTitle: inquiry.title,
      inquiryContent: inquiry.content,
      inquiryRegistrationDate: inquiry.createdAt,
      inquirerNickname: user?.nickname || '알수없음',
      inquiryStatus: inquiry.isAnswered ? 'closed' : 'unclosed',
      answerTitle: inquiry.answer ? `RE: ${inquiry.title}` : null,
      answerContent: inquiry.answer?.content,
      answerRegistrationDate: inquiry.answer?.answeredAt,
      strategyName: strategy?.name,
      traderNickname: trader?.nickname,
      traderProfileImagePath: trader?.profileImage,
      cycle: strategy?.cycle,
      methodIconPath: strategy?.methodIconPath,
      stockList: strategy?.stockList,
      previousId: prevInquiry?.id,
      previousTitle: prevInquiry?.title,
      previousWriteDate: prevInquiry?.createdAt,
      nextId: nextInquiry?.id,
      nextTitle: nextInquiry?.title,
      nextWriteDate: nextInquiry?.createdAt,
    };
    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: response,
    });
  }),

  // 문의 답변 등록/수정 API
  http.post('*/v1/admin/qna/:qnaId', async ({ params, request }) => {
    const inquiryId = parseInt(params.qnaId as string, 10);
    const { content } = (await request.json()) as { content: string };
    const inquiry = db.inquiries.find((i) => i.id === inquiryId);
    if (!inquiry)
      return HttpResponse.json(
        { code: 404, message: '문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    inquiry.isAnswered = true;
    inquiry.answer = { content, answeredAt: new Date().toISOString() };
    return HttpResponse.json({
      code: 200,
      message: '답변이 등록되었습니다.',
      data: null,
    });
  }),

  // 문의 목록 삭제 API
  http.delete('*/v1/admin/qna', async ({ request }) => {
    const { inquiryIdList } = (await request.json()) as {
      inquiryIdList: number[];
    };
    db.inquiries = db.inquiries.filter((i) => !inquiryIdList.includes(i.id));
    return HttpResponse.json({
      code: 200,
      message: '선택한 문의가 삭제되었습니다.',
      data: null,
    });
  }),

  // 매매방식 목록 조회
  http.get('*/v1/admin/methodlist', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('page') || '0', 10);
    const pageSize = 10;
    const content = db.methods
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((m) => ({
        id: m.id,
        name: m.name,
        filePath: m.iconPath,
      }));
    const response = createPageResponse(
      content,
      pageNum,
      db.methods.length,
      pageSize
    );
    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: response,
    });
  }),

  // 매매방식 등록
  http.post('*/v1/admin/method', async ({ request }) => {
    const formData = await request.formData();
    const dto = JSON.parse(formData.get('methodPostRequestDto') as string);
    const newMethod = {
      id:
        db.methods.length > 0
          ? Math.max(...db.methods.map((m) => m.id)) + 1
          : 1,
      name: dto.name,
      iconPath: '/assets/images/new_method.png',
    };
    db.methods.push(newMethod);
    return HttpResponse.json({
      code: 200,
      message: '등록되었습니다.',
      data: null,
    });
  }),

  // 매매방식 수정
  http.put('*/v1/admin/method', async ({ request }) => {
    const formData = await request.formData();
    const dto = JSON.parse(formData.get('methodPutRequestDto') as string);
    const method = db.methods.find((m) => m.id === dto.id);
    if (method) {
      method.name = dto.name;
    }
    return HttpResponse.json({
      code: 200,
      message: '수정되었습니다.',
      data: null,
    });
  }),

  // 매매방식 삭제
  http.delete('*/v1/admin/method', async ({ request }) => {
    const { methodIdList } = (await request.json()) as {
      methodIdList: number[];
    };
    db.methods = db.methods.filter((m) => !methodIdList.includes(m.id));
    return HttpResponse.json({
      code: 200,
      message: '삭제되었습니다.',
      data: null,
    });
  }),

  // 종목 목록 조회
  http.get('*/v1/admin/stocklist/:page', ({ params }) => {
    const pageNum = parseInt(params.page as string, 10);
    const pageSize = 10;
    const content = db.stocks
      .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
      .map((s) => ({
        id: s.id,
        name: s.name,
        filePath: s.iconPath,
      }));
    const response = createPageResponse(
      content,
      pageNum,
      db.stocks.length,
      pageSize
    );
    return HttpResponse.json({
      code: 200,
      message: '요청 성공',
      data: response,
    });
  }),

  // 종목 등록
  http.post('*/v1/admin/stock', async ({ request }) => {
    const formData = await request.formData();
    const dto = JSON.parse(formData.get('stockPostRequestDto') as string);
    const newStock = {
      id:
        db.stocks.length > 0 ? Math.max(...db.stocks.map((s) => s.id)) + 1 : 1,
      name: dto.name,
      iconPath: '/assets/images/new_stock.png',
    };
    db.stocks.push(newStock);
    return HttpResponse.json({
      code: 200,
      message: '등록되었습니다.',
      data: null,
    });
  }),

  // 종목 수정
  http.put('*/v1/admin/stock', async ({ request }) => {
    const formData = await request.formData();
    const dto = JSON.parse(formData.get('stockPutRequestDto') as string);
    const stock = db.stocks.find((s) => s.id === dto.id);
    if (stock) {
      stock.name = dto.name;
    }
    return HttpResponse.json({
      code: 200,
      message: '수정되었습니다.',
      data: null,
    });
  }),

  // 종목 삭제
  http.delete('*/v1/admin/stock', async ({ request }) => {
    const { stockIdList } = (await request.json()) as { stockIdList: number[] };
    db.stocks = db.stocks.filter((s) => !stockIdList.includes(s.id));
    return HttpResponse.json({
      code: 200,
      message: '삭제되었습니다.',
      data: null,
    });
  }),
];

export { adminHandlers };
