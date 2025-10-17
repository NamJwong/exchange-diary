'use client';

import { useState, FormEvent } from 'react';
import { registerUser, loginUser } from '@/lib/auth';
import { saveUserName } from '@/lib/storage';

interface LoginFormProps {
  onLoginSuccess: (username: string) => void;
}

type TabType = 'login' | 'register';

/**
 * 로그인/회원가입 폼
 * 탭으로 두 화면을 전환할 수 있습니다
 */
export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 초대코드 (환경 변수에서 가져오기)
  const VALID_INVITE_CODE = process.env.NEXT_PUBLIC_INVITE_CODE || '';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError('유저 이름을 입력해주세요');
      return;
    }

    if (trimmedUsername.length < 2 || trimmedUsername.length > 20) {
      setError('유저 이름은 2-20자로 입력해주세요');
      return;
    }

    if (!password) {
      setError('비밀번호를 입력해주세요');
      return;
    }

    if (password.length < 4) {
      setError('비밀번호는 4자 이상 입력해주세요');
      return;
    }

    // 회원가입 시 추가 검증
    if (activeTab === 'register') {
      // 비밀번호 확인
      if (password !== passwordConfirm) {
        setError('비밀번호가 일치하지 않습니다');
        return;
      }

      // 초대코드 확인
      if (!inviteCode.trim()) {
        setError('초대코드를 입력해주세요');
        return;
      }

      if (inviteCode.trim() !== VALID_INVITE_CODE) {
        setError('올바르지 않은 초대코드입니다');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      if (activeTab === 'register') {
        // 회원가입
        await registerUser({ username: trimmedUsername, password });
        alert('회원가입이 완료되었습니다! 🎉\n이제 로그인해주세요.');
        // 로그인 탭으로 전환
        setActiveTab('login');
        setPassword('');
        setPasswordConfirm('');
      } else {
        // 로그인
        await loginUser({ username: trimmedUsername, password });
        // 로컬 스토리지에 username 저장
        saveUserName(trimmedUsername);
        // 성공 콜백
        onLoginSuccess(trimmedUsername);
      }
    } catch (err: any) {
      console.error('인증 실패:', err);
      setError(err.message || '요청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    setError('');
    setUsername('');
    setPassword('');
    setPasswordConfirm('');
    setInviteCode('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">교환일기</h1>
        <p className="text-gray-600 mb-6">함께 쓰는 교환일기</p>

        {/* 탭 */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => switchTab('login')}
            className={`flex-1 pb-3 text-center font-medium transition-colors ${
              activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => switchTab('register')}
            className={`flex-1 pb-3 text-center font-medium transition-colors ${
              activeTab === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}>
          {/* 유저 이름 */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              유저 이름
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="유저 이름 (2-20자)"
              maxLength={20}
              disabled={isSubmitting}
            />
          </div>

          {/* 비밀번호 */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="비밀번호 (4자 이상)"
              disabled={isSubmitting}
            />
          </div>

          {/* 비밀번호 확인 (회원가입 시에만) */}
          {activeTab === 'register' && (
            <>
              <div className="mb-4">
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="비밀번호 확인"
                  disabled={isSubmitting}
                />
              </div>

              {/* 초대코드 */}
              <div className="mb-4">
                <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
                  초대코드 🎟️
                </label>
                <input
                  id="inviteCode"
                  type="text"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="운영자에게 받은 초대코드"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">교환일기 운영자에게 초대코드를 받아야 가입할 수 있습니다</p>
              </div>
            </>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '처리 중...' : activeTab === 'login' ? '로그인' : '가입하기'}
          </button>
        </form>

        {/* 안내 문구 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {activeTab === 'login' ? (
            <p>
              계정이 없으신가요?{' '}
              <button type="button" onClick={() => switchTab('register')} className="text-blue-600 hover:underline">
                회원가입
              </button>
            </p>
          ) : (
            <p>
              이미 계정이 있으신가요?{' '}
              <button type="button" onClick={() => switchTab('login')} className="text-blue-600 hover:underline">
                로그인
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
