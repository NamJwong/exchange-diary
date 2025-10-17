'use client';

import { useState, FormEvent } from 'react';
import { saveUserName } from '@/lib/storage';

interface NameInputFormProps {
  onNameSet: (name: string) => void;
}

/**
 * 사용자 이름 입력 폼
 * 처음 접속한 사용자에게 이름을 입력받습니다
 */
export default function NameInputForm({ onNameSet }: NameInputFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('이름을 입력해주세요');
      return;
    }

    // 로컬 스토리지에 저장
    saveUserName(trimmedName);

    // 부모 컴포넌트에 알림
    onNameSet(trimmedName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">교환일기</h1>
        <p className="text-gray-600 mb-8">일기를 작성하고 읽을 때 사용할 이름을 입력해주세요</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="이름을 입력하세요"
              maxLength={20}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
}
