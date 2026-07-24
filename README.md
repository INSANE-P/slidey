<img src="public/slidey-wordmark.svg" alt="Slidey" height="44" />

그리디 디자인 틀에 맞춰 발표 자료를 만들고, 발표하고, 내려받는 사이트예요.

디자인은 고를 수 없습니다. 내용만 채우면 항상 같은 틀로 나와요.
기존 그리디 PPT 자료를 기반으로 색과 레이아웃을 잡았습니다.

## 실행

```bash
pnpm install
pnpm dev
```

## 폴더 구조

그리디 웹사이트와 같은 축소형 FSD예요. import는 `app → widgets → features → entities → shared` 한 방향으로만 흘러요.

| 슬라이스 | 담는 것 |
| --- | --- |
| `src/app` | 라우트. 홈(`/`), 편집(`/e/[id]`), 발표(`/d/[id]`, `?print=1`이면 PDF용) |
| `src/widgets` | 페이지 조각. `SiteHeader`, `SiteFooter` |
| `src/features/editor` | 편집 UI. `SlideForm`, `ImageInput`, `LayoutPicker` |
| `src/features/export` | `exportPptx` — 슬라이드를 PowerPoint 파일로 |
| `src/entities/slide` | 슬라이드 도메인. `types`, `layouts`(스키마), 렌더(`SlideView`, `SlideStage`, `SlideFrame`, `SlideParts`, `layouts/*`) |
| `src/entities/deck` | 덱 도메인. `types`, `deck`(생성·이동), `presets`, `storage` |
| `src/shared/ui` | 디자인 시스템 컴포넌트 (`Button`, `Card`, `Badge`, `Field`, `TextLink`, `Wordmark`, `Toast`, `ConfirmDialog`) |
| `src/shared/lib`, `src/shared/styles` | `cn` 헬퍼, 디자인 토큰(`tokens.css`) |

## 좌표 규칙

슬라이드는 **1280 × 720px 고정**으로 그려요. 화면 크기에 맞추는 건 통째로 축소만 합니다.

- 원본 PPT는 960 × 540pt → 1pt = 1.333px로 옮겼어요
- 96px = 1inch라 PowerPoint의 13.333 × 7.5in와 **1:1로 떨어집니다**
- 덕분에 미리보기 · 발표 · PDF · PPTX가 전부 같은 그림이에요

## 레이아웃 추가하기

1. `entities/slide/layouts.ts`에 `LayoutDef` 한 덩어리를 더해요 (id, 필드, 기본값)
2. `entities/slide/layouts/`의 그룹 파일에 같은 id로 렌더 컴포넌트를 만들고 `SlideView`에 등록해요
3. `features/export/exportPptx.ts`의 `renderSlide` switch에 같은 id를 더해요

폼은 1번만 하면 저절로 생깁니다. 2·3번은 그리는 코드예요.

## 색

토큰은 `shared/styles/tokens.css`가 원본이에요.

| 갈래 | 이름 | 쓰임 |
| --- | --- | --- |
| 사이트 UI | `brand`, `surface`, `border`, `text` … | 홈·편집기·발표 컨트롤 |
| 슬라이드 | `slide-green` `#007355`, `slide-mint` `#D9EAD3`, `slide-ink`, `slide-muted` | 슬라이드 캔버스 안쪽(PPT 원본 색) |
