# 🚀 교환일기 설정 가이드

이 문서는 **백엔드 지식이 없는 프론트엔드 개발자**를 위한 단계별 설정 가이드입니다.

## 📚 목차

1. [Supabase란?](#supabase란)
2. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
3. [데이터베이스 테이블 생성](#2-데이터베이스-테이블-생성)
4. [환경 변수 설정](#3-환경-변수-설정)
5. [개발 서버 실행](#4-개발-서버-실행)
6. [테스트하기](#5-테스트하기)
7. [문제 해결](#문제-해결)

---

## Supabase란?

**Supabase**는 백엔드 서버 없이 프론트엔드에서 직접 데이터베이스를 사용할 수 있게 해주는 서비스입니다.

### 기존 방식 (백엔드 필요)

```
프론트엔드 → 백엔드 서버 → 데이터베이스
```

### Supabase 방식 (백엔드 불필요)

```
프론트엔드 → Supabase (자동으로 데이터베이스 관리)
```

**장점:**

- ✅ 백엔드 서버를 직접 만들 필요 없음
- ✅ 데이터베이스 설정이 간단함
- ✅ 무료 플랜 제공 (프로젝트 2개까지)
- ✅ 실시간 데이터 동기화 지원

---

## 1. Supabase 프로젝트 생성

### 1-1. 계정 만들기

1. [https://supabase.com](https://supabase.com) 접속
2. 우측 상단 **Start your project** 클릭
3. GitHub 또는 이메일로 회원가입

![Supabase 홈페이지](https://supabase.com/brand-assets/supabase-logo-wordmark--dark.png)

### 1-2. 새 프로젝트 만들기

1. 로그인 후 대시보드에서 **New Project** 클릭
2. 프로젝트 정보 입력:

   - **Name**: `exchange-diary` (원하는 이름)
   - **Database Password**: 안전한 비밀번호 입력 (꼭 기억하세요!)
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국 서버)
   - **Pricing Plan**: Free 선택

3. **Create new project** 클릭
4. ⏱️ 약 2분 정도 기다리면 프로젝트가 생성됩니다

### 1-3. API 키 확인하기

프로젝트가 생성되면:

1. 좌측 메뉴에서 **Settings** (톱니바퀴 아이콘) 클릭
2. **API** 메뉴 클릭
3. 다음 정보를 **복사**해서 메모장에 저장하세요:
   - `Project URL` (예: `https://abcdefgh.supabase.co`)
   - `anon public` 키 (긴 문자열)

> 💡 **Tip**: 이 정보는 나중에 `.env.local` 파일에 사용됩니다.

---

## 2. 데이터베이스 테이블 생성

### 2-1. SQL Editor 열기

1. Supabase 대시보드 좌측 메뉴에서 **SQL Editor** 클릭
2. **New Query** 버튼 클릭

### 2-2. SQL 코드 실행하기

1. 프로젝트의 `supabase-schema.sql` 파일 열기
2. 파일 내용 전체를 **복사** (Cmd+A, Cmd+C)
3. SQL Editor에 **붙여넣기** (Cmd+V)
4. 우측 하단의 **Run** 버튼 클릭 (또는 Cmd+Enter)

### 2-3. 테이블 생성 확인

1. 좌측 메뉴에서 **Table Editor** 클릭
2. 다음 2개의 테이블이 보이면 성공! ✅
   - `diaries` (일기 테이블)
   - `diary_reads` (열람 기록 테이블)

### 📊 테이블 구조 이해하기

#### `diaries` 테이블

- **역할**: 작성된 일기 저장
- **컬럼**:
  - `id`: 일기의 고유 번호 (자동 생성)
  - `author_name`: 작성자 이름
  - `content`: 일기 내용
  - `created_at`: 작성 시간 (자동 기록)

#### `diary_reads` 테이블

- **역할**: 누가 일기를 읽었는지 기록
- **컬럼**:
  - `id`: 기록의 고유 번호 (자동 생성)
  - `diary_id`: 어떤 일기를 읽었는지
  - `reader_name`: 읽은 사람 이름
  - `read_at`: 읽은 시간 (자동 기록)

---

## 3. 환경 변수 설정

### 3-1. 환경 변수란?

**환경 변수**는 코드에 직접 넣기 어려운 비밀 정보(API 키, 비밀번호 등)를 따로 보관하는 파일입니다.

- `.env.local` 파일은 Git에 올라가지 않아 안전합니다
- `NEXT_PUBLIC_` 으로 시작하는 변수는 브라우저에서 접근 가능합니다

### 3-2. 환경 변수 파일 수정하기

1. 프로젝트 루트에 이미 생성된 `.env.local` 파일 열기
2. 1-3 단계에서 복사한 정보로 수정:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. 파일 저장 (Cmd+S)

> ⚠️ **중요**: 실제 값으로 바꿔야 합니다! `your-project-id`가 그대로 있으면 안 됩니다.

---

## 4. 개발 서버 실행

### 4-1. 패키지 설치 확인

터미널에서 프로젝트 폴더로 이동 후:

```bash
npm install
```

### 4-2. 개발 서버 시작

```bash
npm run dev
```

다음과 같은 메시지가 나오면 성공! ✅

```
✓ Ready in 2.3s
○ Local:   http://localhost:3000
```

### 4-3. 브라우저에서 확인

브라우저를 열고 [http://localhost:3000](http://localhost:3000) 접속

---

## 5. 테스트하기

### 5-1. 이름 입력하기

1. 첫 화면에서 이름 입력 (예: "테스트")
2. **시작하기** 버튼 클릭

### 5-2. 일기 작성하기

1. **+ 새 일기 작성하기** 버튼 클릭
2. 일기 내용 입력 (최소 10글자)
3. **작성 완료** 버튼 클릭

### 5-3. 일기 읽기

1. 목록에서 방금 작성한 일기 클릭
2. 내용이 보이면 성공! 🎉

### 5-4. Supabase에서 데이터 확인

1. Supabase 대시보드 → **Table Editor** 클릭
2. `diaries` 테이블 클릭 → 방금 작성한 일기가 보임
3. `diary_reads` 테이블 클릭 → 열람 기록이 보임

---

## 문제 해결

### ❌ "Failed to fetch" 에러가 나요

**원인**: Supabase 연결 정보가 잘못되었습니다.

**해결**:

1. `.env.local` 파일의 URL과 키가 정확한지 확인
2. Supabase 대시보드 → Settings → API에서 정보 재확인
3. 개발 서버 재시작 (Ctrl+C 후 `npm run dev`)

### ❌ "Row Level Security" 에러가 나요

**원인**: RLS 정책이 제대로 설정되지 않았습니다.

**해결**:

1. `supabase-schema.sql` 파일 전체를 다시 실행
2. 또는 Supabase 대시보드에서:
   - **Authentication** → **Policies** 메뉴
   - `diaries`, `diary_reads` 테이블에 정책이 4개 있는지 확인

### ❌ 테이블이 안 보여요

**원인**: SQL이 제대로 실행되지 않았습니다.

**해결**:

1. SQL Editor에서 에러 메시지 확인
2. 기존 테이블 삭제 후 재실행:
   ```sql
   DROP TABLE IF EXISTS diary_reads;
   DROP TABLE IF EXISTS diaries;
   ```
3. 다시 `supabase-schema.sql` 전체 실행

### ❌ 로컬 스토리지에 이름이 저장 안 돼요

**원인**: 브라우저 시크릿 모드이거나 쿠키가 차단되었습니다.

**해결**:

1. 일반 브라우저 창에서 실행
2. 브라우저 설정에서 쿠키/로컬 스토리지 허용

---

## 🎓 개념 용어 설명

### PostgreSQL

- 세계에서 가장 많이 쓰이는 오픈소스 데이터베이스 중 하나
- Supabase는 PostgreSQL을 사용합니다

### UUID

- 고유한 ID를 자동으로 만들어주는 형식
- 예: `123e4567-e89b-12d3-a456-426614174000`

### Row Level Security (RLS)

- 데이터베이스의 각 행(row)에 대한 접근 권한 설정
- 누가 어떤 데이터를 읽고 쓸 수 있는지 제어

### API Key

- 앱이 Supabase와 통신하기 위한 인증 키
- `anon public` 키는 브라우저에서 사용해도 안전함

---

## 📞 추가 도움

- **Supabase 공식 문서**: [https://supabase.com/docs](https://supabase.com/docs)
- **Next.js 공식 문서**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **프로젝트 이슈**: GitHub Issues 탭에서 질문하세요

---

**축하합니다! 🎉**  
이제 교환일기 프로젝트가 완전히 설정되었습니다.
