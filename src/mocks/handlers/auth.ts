import { HttpResponse, http } from 'msw';
import { db } from '../data/database';

const authHandlers = [
  // 로그인 API
  http.post('/v1/auth/login', async ({ request }) => {
    const loginData = (await request.json()) as { email?: string };
    const user = db.users.find((u) => u.email === loginData.email);

    if (!user) {
      return HttpResponse.json(
        {
          code: 401,
          message: '가입되지 않은 이메일입니다.',
          data: null,
        },
        { status: 401 }
      );
    }

    return HttpResponse.json(
      {
        code: 200,
        message: '요청이 성공했습니다.',
        data: null,
      },
      {
        headers: {
          Authorization: `Bearer sample_access_token_for_user_${user.id}`,
        },
      }
    );
  }),

  // Token 유효성 검증 및 회원 정보 조회 API
  http.get('/v1/auth', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const userId = parseInt(authHeader?.split('_').pop() || '1', 10);
    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      return HttpResponse.json(
        {
          code: 401,
          message: '유효하지 않은 토큰이거나 토큰이 누락되었습니다.',
          data: null,
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: {
        memberId: user.id,
        roleCode: user.roleCode,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        totalFollowerCount: user.totalFollowerCount,
        totalStrategyCount: user.totalStrategyCount,
        receiveInfoConsent: user.receiveInfoConsent,
        receiveMarketingConsent: user.receiveMarketingConsent,
      },
    });
  }),

  // 로그아웃 API
  http.post('/v1/auth/logout', () =>
    HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: '로그아웃이 성공적으로 처리되었습니다.',
    })
  ),

  // 이메일 찾기 API
  http.post('/v1/auth/find-email', async ({ request }) => {
    const body = (await request.json()) as { name?: string };
    const user = db.users.find((u) => u.name === body.name);
    const maskedEmail = user
      ? `${user.email.substring(0, 4)}****@${user.email.split('@')[1]}`
      : 'user****@sysmetic.co.kr';

    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: maskedEmail,
    });
  }),

  // 이메일 중복 확인 API
  http.get('*/v1/auth/check-duplicate-email', ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const isDuplicate = db.users.some((u) => u.email === email);

    if (isDuplicate) {
      return HttpResponse.json(
        {
          code: 400,
          message: '사용할 수 없는 이메일입니다.',
          data: null,
        },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      code: 200,
      message: '요청이 성공했습니다.',
      data: null,
    });
  }),

  // 닉네임 중복 확인 API
  http.get('*/v1/auth/check-nickname', ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');
    const isDuplicate = db.users.some((u) => u.nickname === nickname);
    if (isDuplicate) {
      return HttpResponse.json(
        { code: 400, message: '사용할 수 없는 닉네임입니다.' },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      code: 200,
      message: '사용 가능한 닉네임입니다.',
      data: null,
    });
  }),

  // 이메일 인증 코드 전송 API (공용)
  http.get('*/v1/auth/email-code', () =>
    // 실제 이메일 전송은 하지 않으므로 항상 성공 응답
    HttpResponse.json({
      code: 200,
      message: '인증 코드가 전송되었습니다.',
      data: null,
    })
  ),

  // 이메일 인증 코드 확인 API (공용)
  http.post('*/v1/auth/email-code', async () =>
    // 실제 코드 검증은 하지 않고 항상 성공으로 응답
    HttpResponse.json({
      code: 200,
      message: '이메일 인증이 완료되었습니다.',
      data: { authCode: 'STATIC_AUTH_CODE' },
    })
  ),

  // 비밀번호 재설정 이메일 코드 전송 API
  http.get('*/v1/auth/reset-password', () =>
    HttpResponse.json({
      code: 200,
      message: '인증 코드가 전송되었습니다.',
      data: null,
    })
  ),

  // 비밀번호 재설정 API
  http.post('*/v1/auth/reset-password', async () =>
    HttpResponse.json({
      code: 200,
      message: '비밀번호가 재설정되었습니다.',
      data: null,
    })
  ),

  // 회원가입 API
  http.post('*/v1/auth/register', async ({ request }) => {
    const formData = await request.formData();
    const dto = JSON.parse(formData.get('memberRegisterRequestDto') as string);

    const newUser = {
      id: db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1,
      email: dto.email,
      name: dto.name,
      nickname: dto.nickname,
      roleCode: dto.roleCode as 'USER' | 'TRADER',
      profileImage: `https://i.pravatar.cc/150?u=${dto.nickname}`,
      phoneNumber: dto.phoneNumber,
      birth: dto.birth,
      totalFollowerCount: 0,
      totalStrategyCount: 0,
      receiveInfoConsent: dto.receiveInfoConsent,
      receiveMarketingConsent: dto.receiveMarketingConsent,
    };
    db.users.push(newUser);

    return HttpResponse.json({
      code: 200,
      message: '회원가입이 완료되었습니다.',
      data: null,
    });
  }),

  // (이하 다른 핸들러들은 기존 코드 유지)
];

export { authHandlers };
