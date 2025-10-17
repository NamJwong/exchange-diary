# 🏗️ 프로젝트 아키텍처 설명

이 문서는 교환일기 프로젝트의 구조와 코드 작성 패턴을 설명합니다.

## 📁 폴더 구조

```
exchange-diary/
├── src/
│   ├── app/                          # Next.js App Router 페이지
│   │   ├── page.tsx                 # 메인 페이지 (/)
│   │   ├── layout.tsx               # 루트 레이아웃
│   │   ├── globals.css              # 전역 스타일
│   │   ├── write/
│   │   │   └── page.tsx            # 일기 작성 페이지 (/write)
│   │   └── diary/
│   │       └── [id]/
│   │           └── page.tsx        # 일기 상세 페이지 (/diary/:id)
│   │
│   ├── components/                   # 재사용 가능한 React 컴포넌트
│   │   ├── NameInputForm.tsx        # 이름 입력 폼
│   │   └── DiaryList.tsx            # 일기 목록 표시
│   │
│   ├── lib/                          # 유틸리티 및 설정
│   │   ├── supabase.ts              # Supabase 클라이언트 초기화
│   │   ├── api.ts                   # 데이터베이스 작업 함수
│   │   └── storage.ts               # 로컬 스토리지 관리
│   │
│   └── types/                        # TypeScript 타입 정의
│       └── database.ts              # DB 테이블 타입
│
├── supabase-schema.sql              # 데이터베이스 스키마 정의
├── .env.local                       # 환경 변수 (Git에 안 올라감)
├── .env.example                     # 환경 변수 예시
├── package.json                     # 프로젝트 의존성
└── tsconfig.json                    # TypeScript 설정
```

---

## 🔄 데이터 흐름

### 1. 일기 작성 플로우

```
사용자 입력 (write/page.tsx)
    ↓
createDiary() 호출 (lib/api.ts)
    ↓
Supabase 클라이언트 (lib/supabase.ts)
    ↓
Supabase 서버
    ↓
diaries 테이블에 저장
    ↓
성공 응답 → 메인 페이지로 이동
```

### 2. 일기 목록 불러오기 플로우

```
DiaryList 컴포넌트 마운트
    ↓
getDiaries() 호출 (lib/api.ts)
    ↓
Supabase 클라이언트
    ↓
diaries 테이블에서 데이터 조회 (최신순)
    ↓
데이터 반환 → 화면에 렌더링
```

### 3. 일기 읽기 플로우

```
일기 클릭 → diary/[id]/page.tsx 이동
    ↓
getDiary(id) 호출 (lib/api.ts)
    ↓
일기 데이터 조회
    ↓
recordDiaryRead() 호출 (lib/api.ts)
    ↓
diary_reads 테이블에 열람 기록 저장
    ↓
일기 내용 표시
```

---

## 🎨 코드 작성 패턴

### 원칙 1: 명확한 책임 분리

각 파일과 함수는 **하나의 명확한 역할**만 담당합니다.

#### 예시: 데이터 작업은 `lib/api.ts`에서만

❌ **나쁜 예**: 컴포넌트에서 직접 Supabase 호출

```typescript
// DiaryList.tsx (나쁜 예)
const { data } = await supabase.from('diaries').select('*');
```

✅ **좋은 예**: API 함수를 통해 호출

```typescript
// DiaryList.tsx (좋은 예)
const diaries = await getDiaries(); // api.ts에 정의된 함수

// lib/api.ts
export async function getDiaries() {
  const { data, error } = await supabase.from('diaries').select('*');
  if (error) throw error;
  return data;
}
```

**이유**:

- 데이터 작업 로직을 한 곳에서 관리
- 에러 처리를 일관되게 적용
- 나중에 API 변경 시 한 파일만 수정하면 됨

---

### 원칙 2: 타입 안정성

TypeScript 타입을 명확히 정의하여 실수를 방지합니다.

#### 예시: 데이터베이스 타입 정의

```typescript
// types/database.ts
export interface Diary {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

// lib/api.ts
export async function getDiaries(): Promise<Diary[]> {
  // 반환 타입이 명확하므로 자동완성이 잘 됨
}
```

**이유**:

- IDE에서 자동완성 지원
- 컴파일 시 타입 오류 미리 발견
- 코드의 의도가 명확해짐

---

### 원칙 3: 사용자 경험 고려

#### 3-1. 로딩 상태 표시

```typescript
const [loading, setLoading] = useState(true);

// 로딩 중 UI
if (loading) {
  return <div>로딩 중...</div>;
}
```

#### 3-2. 에러 처리

```typescript
try {
  await createDiary({ author_name, content });
  alert('성공!');
} catch (error) {
  console.error('실패:', error);
  alert('실패했습니다. 다시 시도해주세요.');
}
```

#### 3-3. 유효성 검사

```typescript
if (!content.trim()) {
  setError('내용을 입력해주세요');
  return;
}
```

**이유**:

- 사용자가 무슨 일이 일어나는지 알 수 있음
- 에러 발생 시 명확한 피드백
- 잘못된 입력 방지

---

### 원칙 4: 재사용 가능한 코드

자주 사용하는 로직은 함수로 분리합니다.

#### 예시: 날짜 포맷팅

❌ **나쁜 예**: 여러 곳에서 반복

```typescript
// DiaryList.tsx
new Date(diary.created_at).toLocaleDateString('ko-KR', { ... })

// DiaryDetail.tsx
new Date(diary.created_at).toLocaleDateString('ko-KR', { ... })
```

✅ **좋은 예**: 유틸리티 함수로 분리

```typescript
// lib/utils.ts
export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 사용
formatDate(diary.created_at);
```

**이유**:

- 코드 중복 제거
- 수정이 필요할 때 한 곳만 변경
- 테스트하기 쉬움

---

## 🔐 보안 설계

### 1. 환경 변수

민감한 정보는 `.env.local`에 보관:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

- `NEXT_PUBLIC_` 접두사: 브라우저에서 접근 가능
- `.env.local`은 Git에 커밋되지 않음

### 2. Row Level Security (RLS)

Supabase에서 테이블별 접근 권한 설정:

```sql
-- 누구나 읽기 가능
CREATE POLICY "누구나 일기를 읽을 수 있습니다" ON diaries
  FOR SELECT USING (true);

-- 누구나 쓰기 가능
CREATE POLICY "누구나 일기를 작성할 수 있습니다" ON diaries
  FOR INSERT WITH CHECK (true);
```

> ⚠️ **주의**: 현재는 MVP이므로 모든 사용자에게 권한 부여.  
> 실제 서비스에서는 인증 기반 권한 관리 필요.

---

## 📱 클라이언트 측 상태 관리

### 로컬 스토리지 활용

사용자 이름은 브라우저에 저장:

```typescript
// 저장
localStorage.setItem('exchange_diary_user_name', name);

// 불러오기
localStorage.getItem('exchange_diary_user_name');
```

**장점**:

- 페이지 새로고침해도 유지
- 서버 통신 불필요
- 간단한 구현

**단점**:

- 브라우저를 바꾸면 초기화
- 시크릿 모드에서 작동 안 함

---

## 🎯 Next.js App Router 활용

### 파일 기반 라우팅

```
app/page.tsx          → /
app/write/page.tsx    → /write
app/diary/[id]/page.tsx → /diary/123
```

### Dynamic Route (동적 라우트)

```typescript
// app/diary/[id]/page.tsx
export default function DiaryDetailPage() {
  const params = useParams();
  const diaryId = params.id; // URL에서 ID 가져오기
}
```

### Client Component

```typescript
'use client'; // 클라이언트 컴포넌트 선언

// useState, useEffect 등 사용 가능
const [data, setData] = useState(null);
```

---

## 🔄 개선 가능한 부분

### 1. 에러 바운더리

현재는 각 컴포넌트에서 에러 처리.  
→ 전역 에러 바운더리로 통합 가능

### 2. 로딩 상태 통합

현재는 각 페이지에서 개별 관리.  
→ Suspense와 loading.tsx 활용 가능

### 3. 캐싱 전략

현재는 매번 새로 데이터 조회.  
→ React Query나 SWR로 캐싱 가능

### 4. 실시간 업데이트

현재는 새로고침 필요.  
→ Supabase Realtime으로 자동 업데이트 가능

---

## 📚 참고 자료

- **Next.js App Router**: [https://nextjs.org/docs/app](https://nextjs.org/docs/app)
- **Supabase JavaScript Client**: [https://supabase.com/docs/reference/javascript](https://supabase.com/docs/reference/javascript)
- **TypeScript Handbook**: [https://www.typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook)
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## 💡 코드 작성 팁

### 1. 함수명은 동사로 시작

```typescript
✅ getDiaries()
✅ createDiary()
✅ recordDiaryRead()

❌ diaries()
❌ diary()
```

### 2. 컴포넌트명은 명사로, PascalCase

```typescript
✅ DiaryList
✅ NameInputForm

❌ diaryList
❌ showDiaries
```

### 3. 상수는 UPPER_SNAKE_CASE

```typescript
✅ const USER_NAME_KEY = 'exchange_diary_user_name';

❌ const userNameKey = 'exchange_diary_user_name';
```

### 4. 주석은 "왜"를 설명

```typescript
❌ // 일기 목록 가져오기 (코드를 보면 알 수 있음)

✅ // 최신순으로 정렬하여 첫 화면에 최신 글이 보이도록 함
const { data } = await supabase
  .from('diaries')
  .select('*')
  .order('created_at', { ascending: false });
```

---

이 아키텍처는 **확장 가능하고 유지보수하기 쉬운 구조**를 목표로 설계되었습니다.  
질문이 있으시면 이슈를 열어주세요! 🚀
