'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserName } from '@/lib/storage';
import { getTrashedDiaries } from '@/lib/api';
import type { Diary } from '@/types/database';

/**
 * 휴지통 페이지
 * 3일 동안 아무도 읽지 않은 일기들을 보여줍니다
 */
export default function TrashPage() {
  const router = useRouter();
  const [trashedDiaries, setTrashedDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // 사용자 이름 확인
    const name = getUserName();
    if (!name) {
      router.push('/');
      return;
    }
    setUserName(name);

    // 휴지통 일기 불러오기
    loadTrashedDiaries();
  }, [router]);

  const loadTrashedDiaries = async () => {
    try {
      setLoading(true);
      const data = await getTrashedDiaries();
      setTrashedDiaries(data);
    } catch (error) {
      console.error('휴지통 일기 불러오기 실패:', error);
      alert('휴지통 일기를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleDiaryClick = (diaryId: string) => {
    router.push(`/diary/${diaryId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 로딩 중에는 빈 화면
  if (!userName) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button onClick={handleBack} className="text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-1">
            ← 목록으로 돌아가기
          </button>
          <h1 className="text-2xl font-bold text-gray-800">🗑️ 휴지통</h1>
          <p className="text-sm text-gray-600">{userName}님</p>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 설명 메시지 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">😢 3일 동안 아무도 읽지 않은 일기들</h2>
          <p className="text-yellow-800 text-sm mb-2">
            이곳의 일기들은 작성된 지 3일이 지났지만 아직 아무도 읽어주지 않았어요.
          </p>
          <p className="text-yellow-800 text-sm mb-2">
            교환일기는 서로 읽어주는 것이 중요합니다. 지금이라도 읽어주고 따뜻한 마음을 나눠보세요! 💙
          </p>
          <p className="text-yellow-700 text-xs mt-2 italic">
            * 여기 있는 일기는 읽어도 계속 휴지통에 남습니다. 미안함을 느끼기 위한 공간이에요.
          </p>
        </div>

        {/* 휴지통 목록 */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">휴지통을 확인하는 중...</p>
          </div>
        ) : trashedDiaries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">휴지통이 비어있습니다! 🎉</p>
            <p className="text-gray-500 text-sm mt-2">모든 일기가 사랑받고 있어요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trashedDiaries.map((diary) => (
              <div key={diary.id} className="bg-gray-100 rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-700">{diary.author_name}님의 일기</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(diary.created_at)} 작성 · {getDaysAgo(diary.created_at)}일 전
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">아직 읽지 않음 😢</p>

                <button
                  onClick={() => handleDiaryClick(diary.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  📖 지금 읽기
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="mt-6">
          <button
            onClick={handleBack}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            목록으로 돌아가기
          </button>
        </div>
      </main>
    </div>
  );
}
