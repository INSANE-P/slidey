import type { ReactNode } from "react";

/*
 * 슬라이드 좌표계는 1280x720 고정이에요. 원본 그리디 PPT(10인치=1280px)를
 * 픽셀로 실측해 맞췄습니다 — 제목 글자높이 ~67px, 그린 라인 두께 ~11px, 좌측 여백 ~24~48px.
 */
export const CANVAS = { w: 1280, h: 720 };
export const PAD = 64;
/** 제목·본문 왼쪽 여백. 원본은 거의 플러시(~44~48). */
export const TITLE_LEFT = 48;
/** 그린 라인은 제목보다 더 왼쪽에서 시작해요(~24). */
export const RULE_LEFT = 24;
/** 제목 밑 그린 라인은 오른쪽 기린 엠블럼을 피해서 끊겨요. */
export const RULE_RIGHT = 190;
export const CONTENT_TOP = 176;

/**
 * 슬라이드 코너의 그리디 엠블럼이에요. 원본 PPT처럼 우측에 둡니다.
 * 표지·간지 같은 그린 배경은 크게(~200), 본문은 기본(128)으로 써요.
 */
export function GreedyLogo({
  className = "",
  size = 128,
}: {
  className?: string;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 슬라이드는 고정 크기라 최적화가 필요 없어요
    <img
      src="/greedy-logo.png"
      alt=""
      aria-hidden
      className={`absolute select-none ${className}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
}

/** 슬라이드 제목 위에 붙는 연녹색 말머리 칩(디자인 시스템 Badge와 별개예요). */
function SlideBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-[6px] bg-slide-mint px-[16px] py-[6px] text-[20px] font-semibold text-slide-green-deep">
      {children}
    </span>
  );
}

/** 흰 배경 본문 슬라이드의 공통 뼈대 — 제목, 그린 라인, 기린 로고 */
export function WhiteSlide({
  title,
  badge,
  children,
}: {
  title?: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="slide-canvas bg-white text-slide-ink">
      <GreedyLogo className="top-[20px] right-[24px]" />
      {badge ? (
        <div className="absolute top-[26px]" style={{ left: TITLE_LEFT }}>
          <SlideBadge>{badge}</SlideBadge>
        </div>
      ) : null}
      {title ? (
        <h2
          className="absolute truncate text-[68px] leading-[1.1] font-bold tracking-[-0.02em]"
          style={{
            left: TITLE_LEFT,
            right: RULE_RIGHT,
            top: badge ? 78 : 22,
          }}
        >
          {title}
        </h2>
      ) : null}
      <div
        className="absolute h-[10px] bg-slide-green"
        style={{ left: RULE_LEFT, right: RULE_RIGHT, top: badge ? 164 : 122 }}
      />
      <div
        className="absolute"
        style={{
          left: TITLE_LEFT,
          right: PAD,
          top: badge ? CONTENT_TOP + 30 : CONTENT_TOP,
          bottom: 52,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** 그린 배경 슬라이드 — 표지·간지·마무리가 공유해요 */
export function GreenSlide({ children }: { children: ReactNode }) {
  return (
    <div className="slide-canvas bg-slide-green text-white">{children}</div>
  );
}
