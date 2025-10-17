// 로컬 스토리지를 사용한 클라이언트 측 데이터 저장
// 브라우저를 닫아도 사용자 이름을 기억합니다

const USER_NAME_KEY = 'exchange_diary_user_name';

/**
 * 로컬 스토리지에 사용자 이름 저장
 */
export function saveUserName(name: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_NAME_KEY, name);
  }
}

/**
 * 로컬 스토리지에서 사용자 이름 불러오기
 * @returns 저장된 이름 또는 null
 */
export function getUserName(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(USER_NAME_KEY);
  }
  return null;
}

/**
 * 로컬 스토리지에서 사용자 이름 삭제
 */
export function clearUserName(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_NAME_KEY);
  }
}
