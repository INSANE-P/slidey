import type { ReactNode } from "react";

/*
 * 슬라이드 좌표계는 1280x720 고정이에요.
 * 원본 PPT(960x540pt)에서 1pt = 1.333px로 옮겼습니다.
 * 여백·글자 크기를 바꾸려면 아래 상수만 만지세요.
 */
export const CANVAS = { w: 1280, h: 720 };
export const PAD = 64;
/** 제목 밑 그린 라인은 오른쪽 기린 엠블럼을 피해서 끊겨요. */
export const RULE_RIGHT = 190;
export const CONTENT_TOP = 168;

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
        <div className="absolute top-[28px]" style={{ left: PAD }}>
          <SlideBadge>{badge}</SlideBadge>
        </div>
      ) : null}
      {title ? (
        <h2
          className="absolute truncate text-[52px] leading-[1.15] font-bold tracking-[-0.02em]"
          style={{
            left: PAD,
            right: RULE_RIGHT,
            top: badge ? 76 : 34,
          }}
        >
          {title}
        </h2>
      ) : null}
      <div
        className="absolute h-[5px] bg-slide-green"
        style={{ left: PAD, right: RULE_RIGHT, top: badge ? 150 : 122 }}
      />
      <div
        className="absolute"
        style={{
          left: PAD,
          right: PAD,
          top: badge ? CONTENT_TOP + 26 : CONTENT_TOP,
          bottom: 56,
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
