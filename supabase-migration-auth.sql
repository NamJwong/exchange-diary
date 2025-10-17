-- ============================================
-- 회원가입/로그인 기능 추가를 위한 마이그레이션
-- ============================================
-- 이 SQL을 Supabase 대시보드의 SQL Editor에서 실행하세요

-- 1. users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,      -- 유저 이름 (ID로 사용, 중복 불가)
  password TEXT NOT NULL,              -- 비밀번호 해시
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. username으로 빠르게 검색하기 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 3. Row Level Security 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. 모든 사용자에게 읽기 권한 (username 중복 체크용)
CREATE POLICY "누구나 유저 정보를 읽을 수 있습니다" ON users
  FOR SELECT USING (true);

-- 5. 모든 사용자에게 회원가입(INSERT) 권한
CREATE POLICY "누구나 회원가입할 수 있습니다" ON users
  FOR INSERT WITH CHECK (true);

-- 완료!
-- 이제 회원가입/로그인 기능을 사용할 수 있습니다.

