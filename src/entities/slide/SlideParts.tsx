import { asLines } from "@/entities/slide/types";

/** 사진이 아직 없으면 자리만 잡아둬요. 인쇄·내보내기에서도 그대로 보입니다. */
export function SlideImage({
  src,
  className = "",
  rounded = "rounded-[8px]",
}: {
  src?: string;
  className?: string;
  rounded?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-slide-mint/60 text-[18px] text-slide-green-deep ${rounded} ${className}`}
      >
        사진 자리
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 외부 URL·업로드 이미지를 그대로 씁니다
    <img
      src={src}
      alt=""
      className={`object-cover ${rounded} ${className}`}
      draggable={false}
    />
  );
}

/**
 * 내용이 적을수록 크게 보여줘요. 줄 수에 따라 글자·간격을 골라 줍니다.
 * 한 장에 두세 줄뿐인데 작게 왼쪽 위에 몰려 있으면 허전하니까요.
 */
export function densityByCount(
  count: number,
  steps: { upTo: number; size: number; gap: number }[],
) {
  const step = steps.find((s) => count <= s.upTo) ?? steps[steps.length - 1];
  return { size: step.size, gap: step.gap, sparse: count <= steps[0].upTo };
}

/** 줄 맨 앞의 "- " 또는 "• "를 머리 기호 표시로 봐요. */
const MARK = /^[-•]\s+/;

/**
 * 본문 줄 나열.
 * - 줄 앞에 "- "를 붙이면 그 줄만 점(●)이 붙고, 안 붙인 줄은 소제목처럼 나와요(줄별 제어).
 * - 대시가 하나도 없으면 예전처럼 bullet(none·dot·number)을 줄 전체에 적용해요(하위 호환).
 */
export function BodyLines({
  value,
  bullet = "none",
  size = 28,
  gap = 22,
  align = "left",
}: {
  value: unknown;
  bullet?: string;
  size?: number;
  gap?: number;
  /** center면 글이 적을 때 가운데로 모아요 (머리 기호 없을 때만 자연스러워요) */
  align?: "left" | "center";
}) {
  const raw = asLines(value);
  if (!raw.length) return null;

  const centered = align === "center";
  const perLine = raw.some((l) => MARK.test(l)); // 대시가 하나라도 있으면 줄별 모드

  return (
    <ul
      className={`flex flex-col ${centered ? "items-center" : ""}`}
      style={{ gap }}
    >
      {raw.map((line, i) => {
        const marked = MARK.test(line);
        const text = marked ? line.replace(MARK, "") : line;
        const bulleted = perLine ? marked : bullet !== "none";
        // 번호는 대시 없는 섹션 모드에서만(모든 줄이 항목) → i+1을 그대로 써요.
        const numbered = bulleted && !perLine && bullet === "number";
        // 줄별 모드에서 점 없는 줄은 소제목처럼 살짝 진하게 보여줘요.
        const isHeader = perLine && !marked;
        return (
          <li
            key={i}
            className={`flex ${centered ? "text-center" : ""} ${
              isHeader ? "font-bold text-slide-ink" : "text-slide-muted"
            }`}
            style={{ fontSize: size, lineHeight: 1.45, gap: 14 }}
          >
            {bulleted && !numbered ? (
              <span className="text-slide-green" aria-hidden>
                ●
              </span>
            ) : null}
            {numbered ? (
              <span className="font-semibold text-slide-green" aria-hidden>
                {i + 1}.
              </span>
            ) : null}
            <span className={centered ? "" : "flex-1"}>{text}</span>
          </li>
        );
      })}
    </ul>
  );
}
