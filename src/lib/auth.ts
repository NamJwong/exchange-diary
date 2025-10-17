// 회원가입/로그인 관련 함수
import bcrypt from 'bcryptjs';
import { supabase } from './supabase';
import type { User, RegisterInput, LoginInput } from '@/types/database';

/**
 * username 중복 체크
 */
export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const { data, error } = await supabase.from('users').select('username').eq('username', username).single();

  if (error && error.code === 'PGRST116') {
    // 데이터가 없으면 사용 가능
    return true;
  }

  // 데이터가 있으면 이미 사용 중
  return !data;
}

/**
 * 회원가입
 */
export async function registerUser(input: RegisterInput): Promise<User> {
  // 1. username 중복 체크
  const isAvailable = await checkUsernameAvailable(input.username);
  if (!isAvailable) {
    throw new Error('이미 사용 중인 유저 이름입니다');
  }

  // 2. 비밀번호 해싱
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(input.password, salt);

  // 3. DB에 저장
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        username: input.username,
        password: hashedPassword,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('회원가입 실패:', error);
    throw new Error('회원가입에 실패했습니다');
  }

  return data;
}

/**
 * 로그인
 */
export async function loginUser(input: LoginInput): Promise<User> {
  // 1. username으로 사용자 찾기
  const { data, error } = await supabase.from('users').select('*').eq('username', input.username).single();

  if (error || !data) {
    throw new Error('유저 이름 또는 비밀번호가 올바르지 않습니다');
  }

  // 2. 비밀번호 확인
  const isPasswordValid = await bcrypt.compare(input.password, data.password);
  if (!isPasswordValid) {
    throw new Error('유저 이름 또는 비밀번호가 올바르지 않습니다');
  }

  return data;
}

/**
 * 현재 로그인한 사용자 정보 가져오기 (username으로)
 */
export async function getCurrentUser(username: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select('*').eq('username', username).single();

  if (error || !data) {
    return null;
  }

  return data;
}
