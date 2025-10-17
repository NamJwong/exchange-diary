import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트의 URL과 공개 키를 환경 변수에서 가져옵니다
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수가 설정되지 않았을 때 명확한 에러 메시지 표시
if (!supabaseUrl || supabaseUrl === 'your-project-url-here') {
  throw new Error(
    '🚨 Supabase URL이 설정되지 않았습니다!\n\n' +
      '다음 단계를 따라주세요:\n' +
      '1. .env.local 파일을 열어주세요\n' +
      '2. NEXT_PUBLIC_SUPABASE_URL에 실제 Supabase 프로젝트 URL을 입력하세요\n' +
      '3. 자세한 설정 방법은 SETUP_GUIDE.md 파일을 참고하세요\n\n' +
      '아직 Supabase 프로젝트가 없다면 https://supabase.com 에서 생성해주세요.'
  );
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key-here') {
  throw new Error(
    '🚨 Supabase Anon Key가 설정되지 않았습니다!\n\n' +
      '다음 단계를 따라주세요:\n' +
      '1. .env.local 파일을 열어주세요\n' +
      '2. NEXT_PUBLIC_SUPABASE_ANON_KEY에 실제 Supabase anon 키를 입력하세요\n' +
      '3. 자세한 설정 방법은 SETUP_GUIDE.md 파일을 참고하세요'
  );
}

// Supabase 클라이언트를 생성합니다
// 이 클라이언트를 통해 데이터베이스에 접근할 수 있습니다
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
