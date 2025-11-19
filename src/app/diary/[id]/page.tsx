'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUserName } from '@/lib/storage';
import { getDiary, recordDiaryRead, getDiaryReaders } from '@/lib/api';
import type { Diary } from '@/types/database';

/**
 * 일기 상세보기 페이지
 * 일기 내용을 보여주고 열람 기록을 저장합니다
 */
export default function DiaryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const diaryId = params.id as string;

  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const [readers, setReaders] = useState<string[]>([]);

  const loadDiary = useCallback(
    async (readerName: string) => {
      try {
        setLoading(true);

        // 일기 불러오기
        const data = await getDiary(diaryId);

        if (!data) {
          alert('일기를 찾을 수 없습니다.');
          router.push('/');
          return;
        }

        setDiary(data);

        // 열람 기록 저장 (자신의 일기가 아닐 때만)
        if (data.author_name !== readerName) {
          await recordDiaryRead({
            diary_id: diaryId,
            reader_name: readerName,
          });
        }

        // 읽은 사람 목록 불러오기
        const readersList = await getDiaryReaders(diaryId);
        setReaders(readersList);
      } catch (error) {
        console.error('일기 불러오기 실패:', error);
        alert('일기를 불러오는데 실패했습니다.');
        router.push('/');
      } finally {
        setLoading(false);
      }
    },
    [diaryId, router]
  );

  useEffect(() => {
    // 사용자 이름 확인
    const name = getUserName();
    if (!name) {
      router.push('/');
      return;
    }

    // 일기 불러오기 및 열람 기록
    loadDiary(name);
  }, [loadDiary, router]);

  const handleBack = () => {
    router.push('/');
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

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">일기를 불러오는 중...</p>
      </div>
    );
  }

  // 일기가 없는 경우 (이미 리다이렉트 처리되지만 안전장치)
  if (!diary) {
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
          <h1 className="text-2xl font-bold text-gray-800">{diary.author_name}님의 일기</h1>
          <p className="text-sm text-gray-600">{formatDate(diary.created_at)}</p>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* 일기 내용 */}
          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{diary.content}</p>
          </div>

          {/* 열람 정보 */}
          {readers.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                {readers.join(', ')}님이 이 일기를 읽었습니다 📖
              </p>
            </div>
          )}
        </div>

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
