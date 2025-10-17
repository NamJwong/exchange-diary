-- ============================================
-- 휴지통 기능 추가를 위한 마이그레이션
-- ============================================
-- 이 SQL을 Supabase 대시보드의 SQL Editor에서 실행하세요

-- 1. diaries 테이블에 휴지통 관련 컬럼 추가
ALTER TABLE diaries 
  ADD COLUMN IF NOT EXISTS is_trashed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS trashed_at TIMESTAMPTZ;

-- 2. 휴지통 여부로 빠르게 검색하기 위한 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_diaries_is_trashed ON diaries(is_trashed);

-- 3. 기존 데이터 업데이트 (모두 휴지통이 아닌 상태로)
UPDATE diaries 
SET is_trashed = FALSE, trashed_at = NULL 
WHERE is_trashed IS NULL;

-- 4. UPDATE 권한 추가 (휴지통 이동/복구를 위해 필요!)
CREATE POLICY "누구나 일기를 수정할 수 있습니다" ON diaries
  FOR UPDATE USING (true) WITH CHECK (true);

-- 완료!
-- 이제 애플리케이션에서 휴지통 기능을 사용할 수 있습니다.

