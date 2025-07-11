import { HttpResponse, http } from 'msw';
import { db } from '../data/database';

const userHandlers = [
  // 회원 정보 수정 API
  http.patch('/v1/member/info/:userId', async ({ params, request }) => {
    const userId = Number(params.userId);
    const formData = await request.formData();
    const nickname = formData.get('nickname') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    // const file = formData.get('file') as File; // 파일 처리 로직은 필요시 추가

    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      return HttpResponse.json(
        { code: 404, message: '사용자를 찾을 수 없습니다.', data: null },
        { status: 404 }
      );
    }

    // 닉네임, 전화번호 업데이트
    if (nickname) user.nickname = nickname;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    // 프로필 이미지 URL은 이 예제에서 변경하지 않음 (필요시 로직 추가)

    console.log(`[MSW] 회원 정보 수정 완료 (userId: ${userId}):`, user);

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: null,
    });
  }),

  // 회원 비밀번호 수정 API
  http.patch('/v1/member/info/:userId/password', async ({ params }) => {
    const userId = Number(params.userId);
    // const body = await request.json(); // 실제 비밀번호 변경 로직은 보안상 목업에서 생략
    console.log(
      `[MSW] 비밀번호 수정 요청 (userId: ${userId}) - 실제 변경은 생략됨`
    );

    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json(
        { code: 404, message: '사용자를 찾을 수 없습니다.', data: null },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: null,
    });
  }),

  // 회원 정보성 수신동의 변경 API
  http.patch('/v1/member/consent/:userId', async ({ params, request }) => {
    const userId = Number(params.userId);
    const body = (await request.json()) as {
      receiveInfoConsent?: boolean;
      receiveMarketingConsent?: boolean;
    };

    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      return HttpResponse.json(
        { code: 404, message: '사용자를 찾을 수 없습니다.', data: null },
        { status: 404 }
      );
    }

    if (typeof body.receiveInfoConsent === 'boolean') {
      user.receiveInfoConsent = body.receiveInfoConsent;
    }
    if (typeof body.receiveMarketingConsent === 'boolean') {
      user.receiveMarketingConsent = body.receiveMarketingConsent;
    }

    console.log(`[MSW] 수신동의 변경 완료 (userId: ${userId}):`, user);

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: null,
    });
  }),

  // 회원 탈퇴 API
  http.delete('/v1/member/:userId', ({ params }) => {
    const userId = Number(params.userId);
    const userIndex = db.users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return HttpResponse.json(
        { code: 404, message: '사용자를 찾을 수 없습니다.', data: null },
        { status: 404 }
      );
    }

    // 사용자를 db에서 제거
    const deletedUser = db.users.splice(userIndex, 1);
    console.log(`[MSW] 회원 탈퇴 완료 (userId: ${userId}):`, deletedUser[0]);

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: null,
    });
  }),
];

export { userHandlers };
