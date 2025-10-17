'use client';

import { useEffect, useState } from 'react';
import { getUserName } from '@/lib/storage';
import NameInputForm from '@/components/NameInputForm';
import DiaryList from '@/components/DiaryList';

/**
 * 메인 페이지
 * 사용자 이름이 있으면 리스트를 보여주고, 없으면 이름 입력 폼을 보여줍니다
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

  const handleNameSet = (name: string) => {
    setUserName(name);
  };

  // 로딩 중에는 빈 화면 (깜빡임 방지)
  if (isLoading) {
    return null;
  }

  // 이름이 없으면 입력 폼, 있으면 리스트
  return userName ? <DiaryList /> : <NameInputForm onNameSet={handleNameSet} />;
}
