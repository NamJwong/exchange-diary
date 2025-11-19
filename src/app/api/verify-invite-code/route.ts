import { NextRequest, NextResponse } from 'next/server';

/**
 * 초대 코드 검증 API
 * POST /api/verify-invite-code
 */
export async function POST(request: NextRequest) {
  try {
    const { inviteCode } = await request.json();

    // 환경 변수에서 초대 코드 가져오기 (NEXT_PUBLIC 없이)
    const validInviteCode = process.env.INVITE_CODE;

    if (!validInviteCode) {
      return NextResponse.json({ error: '서버 설정 오류입니다' }, { status: 500 });
    }

    // 초대 코드 검증
    const isValid = inviteCode?.trim() === validInviteCode;

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('초대 코드 검증 실패:', error);
    return NextResponse.json({ error: '검증 중 오류가 발생했습니다' }, { status: 500 });
  }
}
