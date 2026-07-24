# This is NOT the Next.js you know

이 레포는 Next 16을 써요. API·규칙·파일 구조가 학습된 내용과 다를 수 있어요.
코드를 쓰기 전에 `node_modules/next/dist/docs/`에서 관련 문서를 먼저 확인해요. 폐기(deprecation) 안내를 따라요.

# Slidey 작업 안내

Slidey는 그리디 디자인 틀로 발표 자료를 만들고, 발표하고, 내려받는 사이트예요.
하려는 일에 맞는 곳을 먼저 봐요.

| 하려는 일 | 먼저 봐요 |
| --- | --- |
| 폴더 구조, 새 코드를 어디에 둘지 | [README](README.md#폴더-구조) |
| 레이아웃(슬라이드 틀) 추가·수정 | [README](README.md#레이아웃-추가하기), `entities/slide` |
| 색·간격·타이포 | `shared/styles/tokens.css` |
| 슬라이드 좌표·크기 | [README](README.md#좌표-규칙) |
| 상황별 덱 구성(OT·데모데이 …) | `entities/deck/presets.ts` |
| PowerPoint·PDF로 내보내기 | `features/export/exportPptx.ts` |

## 항상 지키는 것

- import는 `app → widgets → features → entities → shared` 한 방향으로만 흘러요. 거꾸로 참조하지 않아요.
- 색·글자 크기·간격은 토큰만 써요. 사이트 UI는 시맨틱 토큰(`brand`, `text`, `border` …), 슬라이드 캔버스 안쪽은 `slide-*` 토큰을 써요. 이 둘을 섞지 않아요.
- 슬라이드는 **1280 × 720px 고정 좌표**로 그려요. 화면·PDF·PPTX가 같은 그림이 되도록 이 좌표를 화면과 `exportPptx.ts`가 함께 지켜요.
- 레이아웃을 더할 땐 세 곳을 같은 id로 맞춰요: `entities/slide/layouts.ts`(스키마) → `entities/slide/layouts/*`(렌더) → `exportPptx.ts`(내보내기).
- 컴포넌트 파일은 PascalCase(`SlideForm.tsx`), 그 외 모듈은 카멜/소문자(`layouts.ts`, `exportPptx.ts`)로 둬요.
- 사용자에게 보이는 한국어는 해요체로 통일해요.
- 주석은 코드가 왜 이런지를 설명하는 것만 남겨요. 작업 과정이나 다른 레포 사정은 적지 않아요.
