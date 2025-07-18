import { db } from './data/database';

// 토큰을 기반으로 사용자 ID를 반환하는 함수
export const getUserIdFromRequest = (request: Request): number | null => {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // 모의 환경에서는 토큰을 사용자 ID로 직접 사용합니다.
    const userId = parseInt(token, 10);
    const user = db.users.find((u) => u.id === userId);
    return user ? user.id : null;
  }
  return null;
};
