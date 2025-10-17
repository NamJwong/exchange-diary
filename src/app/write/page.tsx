'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getUserName } from '@/lib/storage';
import { createDiary } from '@/lib/api';

/**
 * 일기 작성 페이지
 * 새로운 교환일기를 작성합니다
 */
export default function WritePage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 사용자 이름 확인
    const name = getUserName();
    if (!name) {
      // 이름이 없으면 메인 페이지로 리다이렉트
      router.push('/');
      return;
    }
    setUserName(name);
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError('일기 내용을 입력해주세요');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Supabase에 저장
      await createDiary({
        author_name: userName,
        content: trimmedContent,
      });

      // 성공 시 메인 페이지로 이동
      alert('일기가 작성되었습니다! 🎉');
      router.push('/');
    } catch (err) {
      console.error('일기 작성 실패:', err);
      setError('일기 작성에 실패했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (content.trim() && !confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
      return;
    }
    router.push('/');
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
          <h1 className="text-2xl font-bold text-gray-800">새 일기 작성</h1>
          <p className="text-sm text-gray-600">{userName}님의 일기</p>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          {/* 작성자 정보 (읽기 전용) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">작성자</label>
            <input
              type="text"
              value={userName}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          {/* 일기 내용 */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              일기 내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="오늘 하루는 어땠나요? 자유롭게 작성해보세요..."
              rows={12}
              maxLength={2000}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">{content.length} / 2,000자</span>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '작성 중...' : '작성 완료'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
