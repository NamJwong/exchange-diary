'use client';

import { useEffect, useState } from 'react';
import { getUserName } from '@/lib/storage';
import LoginForm from '@/components/LoginForm';
import DiaryList from '@/components/DiaryList';

/**
 * 메인 페이지
 * 로그인된 사용자는 일기 리스트를, 그렇지 않으면 로그인 폼을 보여줍니다
 */
export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 클라이언트에서만 실행 (로컬 스토리지 접근)
    const name = getUserName();
    setUserName(name);
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (username: string) => {
    setUserName(username);
  };

  // 로딩 중에는 빈 화면 (깜빡임 방지)
  if (isLoading) {
    return null;
  }

  // 로그인 안 되어 있으면 로그인 폼, 되어 있으면 리스트
  return userName ? <DiaryList /> : <LoginForm onLoginSuccess={handleLoginSuccess} />;
}
