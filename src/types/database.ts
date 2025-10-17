// 데이터베이스 테이블과 매핑되는 타입 정의

/**
 * 유저 타입
 * users 테이블의 구조와 일치
 */
export interface User {
  id: string;
  username: string;
  password: string; // 해시된 비밀번호
  created_at: string;
}

/**
 * 교환일기 타입
 * diaries 테이블의 구조와 일치
 */
export interface Diary {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
  is_trashed: boolean;
  trashed_at: string | null;
}

/**
 * 일기 열람 기록 타입
 * diary_reads 테이블의 구조와 일치
 */
export interface DiaryRead {
  id: string;
  diary_id: string;
  reader_name: string;
  read_at: string;
}

/**
 * 일기 작성 시 필요한 데이터
 * (id, created_at은 서버에서 자동 생성)
 */
export interface CreateDiaryInput {
  author_name: string;
  content: string;
}

/**
 * 열람 기록 생성 시 필요한 데이터
 */
export interface CreateDiaryReadInput {
  diary_id: string;
  reader_name: string;
}

/**
 * 회원가입 시 필요한 데이터
 */
export interface RegisterInput {
  username: string;
  password: string;
}

/**
 * 로그인 시 필요한 데이터
 */
export interface LoginInput {
  username: string;
  password: string;
}
