아래는 바이브 코딩의 결과물입니다. 검수를 하지 않은 상태로, 잘못된 정보가 포함되어 있습니다

---
# 교환일기 📖

Next.js와 Supabase를 활용한 교환일기 웹 애플리케이션입니다.

## 🎯 프로젝트 개요

누구나 자유롭게 일기를 작성하고 읽을 수 있는 교환일기 플랫폼입니다.  
별도의 회원가입 없이 이름만 입력하면 바로 사용할 수 있습니다.

### 주요 기능

- ✍️ **일기 작성**: 간단한 이름 입력만으로 일기 작성 가능
- 📚 **일기 목록**: 작성된 일기 목록 확인 (내용은 비공개)
- 👀 **일기 읽기**: 클릭하면 내용 확인 가능 + 열람자 기록
- 📊 **열람 기록**: 누가 언제 일기를 읽었는지 자동 기록

## 🛠️ 기술 스택

- **Frontend**: Next.js 15.5.5 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL)
- **Storage**: Browser LocalStorage (사용자 이름 저장)

## 📁 프로젝트 구조

```
exchange-diary/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── page.tsx           # 메인 페이지 (이름 입력 + 리스트)
│   │   ├── write/             # 일기 작성 페이지
│   │   └── diary/[id]/        # 일기 상세보기 페이지
│   ├── components/            # React 컴포넌트
│   │   ├── NameInputForm.tsx  # 이름 입력 폼
│   │   └── DiaryList.tsx      # 일기 목록
│   ├── lib/                   # 유틸리티 함수
│   │   ├── supabase.ts        # Supabase 클라이언트
│   │   ├── api.ts             # DB 작업 함수
│   │   └── storage.ts         # 로컬 스토리지 관리
│   └── types/                 # TypeScript 타입 정의
│       └── database.ts
├── supabase-schema.sql        # 데이터베이스 스키마
└── .env.local                 # 환경 변수 (직접 생성 필요)
```

## 🚀 시작하기

### 1. 저장소 클론 및 패키지 설치

```bash
git clone <repository-url>
cd exchange-diary
npm install
```

### 2. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정 생성
2. 새 프로젝트 생성
3. 프로젝트 대시보드 → **Settings** → **API** 메뉴로 이동
4. 다음 정보 확인:
   - `Project URL`
   - `anon public` 키

### 3. 환경 변수 설정

`.env.local` 파일을 열고 Supabase 정보를 입력하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. 데이터베이스 테이블 생성

1. Supabase 대시보드 → **SQL Editor** 메뉴로 이동
2. **New Query** 클릭
3. `supabase-schema.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭하여 실행

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📊 데이터베이스 스키마

### diaries 테이블

| 컬럼명      | 타입        | 설명        |
| ----------- | ----------- | ----------- |
| id          | UUID        | 기본 키     |
| author_name | TEXT        | 작성자 이름 |
| content     | TEXT        | 일기 내용   |
| created_at  | TIMESTAMPTZ | 작성 시간   |

### diary_reads 테이블

| 컬럼명      | 타입        | 설명           |
| ----------- | ----------- | -------------- |
| id          | UUID        | 기본 키        |
| diary_id    | UUID        | 일기 ID (FK)   |
| reader_name | TEXT        | 읽은 사람 이름 |
| read_at     | TIMESTAMPTZ | 읽은 시간      |

## 🎨 사용자 플로우

1. **첫 접속**: 이름 입력 화면
2. **이름 입력**: 로컬 스토리지에 저장 → 일기 목록 화면으로 이동
3. **일기 목록**: 작성된 일기 목록 표시 (내용은 숨김)
4. **일기 작성**: "새 일기 작성하기" 버튼 클릭 → 작성 화면
5. **일기 읽기**: 목록에서 일기 클릭 → 내용 표시 + 열람 기록 저장

## 🔐 보안 정책

- Row Level Security (RLS) 활성화
- 인증 없이 모든 사용자에게 읽기/쓰기 권한 부여 (MVP용)
- 실제 서비스 시 적절한 인증 및 권한 관리 필요

## 📝 개발 노트

### 좋은 코드를 위한 설계 원칙

1. **명확한 책임 분리**

   - 컴포넌트: UI 렌더링
   - lib/api.ts: 데이터베이스 작업
   - lib/storage.ts: 로컬 스토리지 관리

2. **타입 안정성**

   - TypeScript를 활용한 타입 정의
   - 인터페이스를 통한 데이터 구조 명시

3. **사용자 경험**

   - 로딩 상태 표시
   - 에러 핸들링 및 사용자 피드백
   - 유효성 검사

4. **재사용성**
   - 컴포넌트 분리
   - 유틸리티 함수 모듈화

## 🚢 배포

### Vercel 배포 (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

환경 변수를 Vercel 대시보드에서 설정하는 것을 잊지 마세요!

## 📚 추가 개선 아이디어

- [ ] 일기 수정/삭제 기능
- [ ] 일기 검색 기능
- [ ] 좋아요/댓글 기능
- [ ] 이미지 첨부 기능
- [ ] 카테고리/태그 기능
- [ ] 실제 사용자 인증 구현
- [ ] 반응형 디자인 개선

## 📄 라이선스

MIT License

## 🤝 기여

이슈와 PR을 환영합니다!

---

Made with ❤️ using Next.js and Supabase
