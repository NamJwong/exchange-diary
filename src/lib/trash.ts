// 휴지통 관련 비즈니스 로직

import type { Diary, DiaryRead } from '@/types/database';

/**
 * 일기가 3일 이상 지났는지 확인
 */
export function isOlderThan3Days(createdAt: string): boolean {
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3일을 밀리초로
  const createdDate = new Date(createdAt).getTime();
  const now = Date.now();

  return now - createdDate >= threeDaysInMs;
}

/**
 * 작성자 외 다른 사람이 읽었는지 확인
 */
export function hasBeenReadByOthers(diary: Diary, reads: DiaryRead[]): boolean {
  // 해당 일기의 읽기 기록만 필터링
  const diaryReads = reads.filter((read) => read.diary_id === diary.id);

  // 작성자가 아닌 다른 사람이 읽은 기록이 있는지 확인
  return diaryReads.some((read) => read.reader_name !== diary.author_name);
}

/**
 * 일기가 휴지통으로 가야 하는지 판단
 * 조건: 3일 이상 지났고 + 작성자 외 아무도 읽지 않음
 */
export function shouldMoveToTrash(diary: Diary, reads: DiaryRead[]): boolean {
  // 이미 휴지통에 있으면 체크 불필요
  if (diary.is_trashed) {
    return false;
  }

  // 1. 3일 이상 지났는지 확인
  if (!isOlderThan3Days(diary.created_at)) {
    return false;
  }

  // 2. 작성자 외 다른 사람이 읽었는지 확인
  if (hasBeenReadByOthers(diary, reads)) {
    return false;
  }

  // 두 조건을 모두 만족하면 휴지통으로
  return true;
}

/**
 * 여러 일기 중 휴지통으로 가야 할 일기 ID들 반환
 */
export function findDiariesToTrash(diaries: Diary[], allReads: DiaryRead[]): string[] {
  return diaries.filter((diary) => shouldMoveToTrash(diary, allReads)).map((diary) => diary.id);
}
