// Supabase 데이터베이스 작업 함수들
import { supabase } from './supabase';
import type { Diary, CreateDiaryInput, CreateDiaryReadInput } from '@/types/database';

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
