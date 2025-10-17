// Supabase 데이터베이스 작업 함수들
import { supabase } from './supabase';
import type { Diary, CreateDiaryInput, CreateDiaryReadInput, DiaryRead } from '@/types/database';
import { findDiariesToTrash } from './trash';

/**
 * 모든 일기 목록 가져오기 (최신순)
 */
export async function getDiaries(): Promise<Diary[]> {
  const { data, error } = await supabase.from('diaries').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('일기 목록 불러오기 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 특정 일기 상세 정보 가져오기
 */
export async function getDiary(id: string): Promise<Diary | null> {
  const { data, error } = await supabase.from('diaries').select('*').eq('id', id).single();

  if (error) {
    console.error('일기 불러오기 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 새 일기 작성하기
 */
export async function createDiary(input: CreateDiaryInput): Promise<Diary> {
  const { data, error } = await supabase.from('diaries').insert([input]).select().single();

  if (error) {
    console.error('일기 작성 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 일기 열람 기록 저장하기
 */
export async function recordDiaryRead(input: CreateDiaryReadInput): Promise<void> {
  const { error } = await supabase.from('diary_reads').insert([input]);

  if (error) {
    console.error('열람 기록 저장 실패:', error);
    throw error;
  }
}

/**
 * 특정 일기의 열람자 수 가져오기
 */
export async function getDiaryReadCount(diaryId: string): Promise<number> {
  const { count, error } = await supabase
    .from('diary_reads')
    .select('*', { count: 'exact', head: true })
    .eq('diary_id', diaryId);

  if (error) {
    console.error('열람자 수 불러오기 실패:', error);
    return 0;
  }

  return count || 0;
}

/**
 * 모든 읽기 기록 가져오기
 */
export async function getAllDiaryReads(): Promise<DiaryRead[]> {
  const { data, error } = await supabase.from('diary_reads').select('*');

  if (error) {
    console.error('읽기 기록 불러오기 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 일기를 휴지통으로 이동
 */
export async function moveDiaryToTrash(diaryId: string): Promise<void> {
  const { error } = await supabase
    .from('diaries')
    .update({
      is_trashed: true,
      trashed_at: new Date().toISOString(),
    })
    .eq('id', diaryId);

  if (error) {
    console.error('휴지통 이동 실패:', error);
    throw error;
  }
}

/**
 * 일기를 휴지통에서 복구
 */
export async function restoreDiary(diaryId: string): Promise<void> {
  const { error } = await supabase
    .from('diaries')
    .update({
      is_trashed: false,
      trashed_at: null,
    })
    .eq('id', diaryId);

  if (error) {
    console.error('휴지통 복구 실패:', error);
    throw error;
  }
}

/**
 * 휴지통 일기 목록 가져오기
 */
export async function getTrashedDiaries(): Promise<Diary[]> {
  const { data, error } = await supabase
    .from('diaries')
    .select('*')
    .eq('is_trashed', true)
    .order('trashed_at', { ascending: false });

  if (error) {
    console.error('휴지통 일기 불러오기 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 3일 미읽음 일기를 자동으로 휴지통으로 이동
 */
export async function checkAndMoveUnreadDiariesToTrash(): Promise<number> {
  try {
    // 1. 모든 일기와 읽기 기록 가져오기
    const [diaries, reads] = await Promise.all([getDiaries(), getAllDiaryReads()]);

    // 2. 휴지통으로 가야 할 일기 찾기
    const diaryIdsToTrash = findDiariesToTrash(diaries, reads);

    // 3. 휴지통으로 이동
    if (diaryIdsToTrash.length > 0) {
      await Promise.all(diaryIdsToTrash.map((id) => moveDiaryToTrash(id)));
    }

    return diaryIdsToTrash.length;
  } catch (error) {
    console.error('자동 휴지통 이동 실패:', error);
    return 0;
  }
}
