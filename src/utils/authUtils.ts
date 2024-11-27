// JWT 토큰 복호화를 통해 로그인한 사용자의 정보를 확인하는 함수
export const parseUserToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const payloadBase64 = token.split('.')[1];
  if (!payloadBase64) return null;

  try {
    const binaryString = atob(payloadBase64);
    const binaryArray = Uint8Array.from(binaryString, (char) =>
      char.charCodeAt(0)
    );
    const decodedPayload = new TextDecoder('utf-8').decode(binaryArray);

    return JSON.parse(decodedPayload);
  } catch (err) {
    console.error('JWT 복호화 실패 : ', err);
    return null;
  }
};
