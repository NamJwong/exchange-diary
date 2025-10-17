'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDiaries, checkAndMoveUnreadDiariesToTrash, getTrashedDiaries } from '@/lib/api';
import type { Diary } from '@/types/database';
import { clearUserName, getUserName } from '@/lib/storage';

/**
 * 교환일기 리스트 화면
 * 작성된 일기들을 목록으로 보여줍니다 (내용은 숨김)
 */
export default function DiaryList() {
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [trashedCount, setTrashedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // 사용자 이름 가져오기
    const name = getUserName();
    if (name) {
      setUserName(name);
    }

    // 일기 목록 불러오기
    loadDiaries();
  }, []);

  const loadDiaries = async () => {
    try {
      setLoading(true);

      // 1. 먼저 3일 미읽음 일기를 자동으로 휴지통으로 이동
      await checkAndMoveUnreadDiariesToTrash();

      // 2. 일기 목록 불러오기 (약간의 지연 후)
      // Supabase 업데이트 반영을 위한 짧은 대기
      await new Promise((resolve) => setTimeout(resolve, 100));

      const allDiaries = await getDiaries();

      // 3. 휴지통이 아닌 일기만 필터링
      const activeDiaries = allDiaries.filter((diary) => !diary.is_trashed);
      setDiaries(activeDiaries);

      // 4. 휴지통 개수 확인
      const trashed = await getTrashedDiaries();
      setTrashedCount(trashed.length);
    } catch (error) {
      console.error('일기 목록 불러오기 실패:', error);
      alert('일기 목록을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleDiaryClick = (diaryId: string) => {
    router.push(`/diary/${diaryId}`);
  };

  const handleWriteClick = () => {
    router.push('/write');
  };

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      clearUserName();
      window.location.reload();
    }
  };

  const handleTrashClick = () => {
    router.push('/trash');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">교환일기</h1>
            <p className="text-sm text-gray-600">{userName}님, 환영합니다!</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleTrashClick}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              🗑️ 휴지통
              {trashedCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">{trashedCount}</span>
              )}
            </button>
            <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-800">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 일기 작성 버튼 */}
        <div className="mb-6">
          <button
            onClick={handleWriteClick}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + 새 일기 작성하기
          </button>
        </div>

        {/* 일기 목록 */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">일기를 불러오는 중...</p>
          </div>
        ) : diaries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">아직 작성된 일기가 없습니다.</p>
            <p className="text-gray-500 text-sm mt-2">첫 번째 일기를 작성해보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {diaries.map((diary) => (
              <div
                key={diary.id}
                onClick={() => handleDiaryClick(diary.id)}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{diary.author_name}님의 일기</h3>
                  <span className="text-sm text-gray-500">{formatDate(diary.created_at)}</span>
                </div>
                <p className="text-gray-600 text-sm">내용을 보려면 클릭하세요 📖</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
