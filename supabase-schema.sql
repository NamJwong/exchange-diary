-- ============================================
-- 교환일기 데이터베이스 스키마
-- ============================================
-- 이 SQL 파일을 Supabase 대시보드의 SQL Editor에서 실행하세요
-- (Supabase 대시보드 -> SQL Editor -> New Query -> 아래 코드 붙여넣기 -> Run)

-- 1. 교환일기 테이블
CREATE TABLE IF NOT EXISTS diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,        -- 작성자 이름
  content TEXT NOT NULL,             -- 일기 내용
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()  -- 작성 시간 (자동 기록)
);

-- 2. 일기 열람 기록 테이블
CREATE TABLE IF NOT EXISTS diary_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,  -- 어떤 일기를 읽었는지
  reader_name TEXT NOT NULL,        -- 읽은 사람 이름
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW()  -- 읽은 시간 (자동 기록)
);

-- 3. 인덱스 생성 (검색 속도 향상)
-- diaries 테이블: 최신 일기를 빨리 찾기 위해
CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON diaries(created_at DESC);

-- diary_reads 테이블: 특정 일기의 열람 기록을 빨리 찾기 위해
CREATE INDEX IF NOT EXISTS idx_diary_reads_diary_id ON diary_reads(diary_id);

-- 4. Row Level Security (RLS) 정책 활성화
-- Supabase는 기본적으로 보안을 위해 RLS를 권장합니다
-- 우리는 인증 없이 모든 사람이 읽고 쓸 수 있도록 설정합니다
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_reads ENABLE ROW LEVEL SECURITY;

-- 5. 모든 사용자에게 읽기/쓰기/수정 권한 부여
-- (인증 없는 MVP이므로 누구나 접근 가능하도록 설정)
CREATE POLICY "누구나 일기를 읽을 수 있습니다" ON diaries
  FOR SELECT USING (true);

CREATE POLICY "누구나 일기를 작성할 수 있습니다" ON diaries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "누구나 일기를 수정할 수 있습니다" ON diaries
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "누구나 열람 기록을 읽을 수 있습니다" ON diary_reads
  FOR SELECT USING (true);

CREATE POLICY "누구나 열람 기록을 작성할 수 있습니다" ON diary_reads
  FOR INSERT WITH CHECK (true);

