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

/** 본문 줄 나열. bullet에 따라 머리 기호가 바뀌어요. */
export function BodyLines({
  value,
  bullet = "none",
  size = 26,
  gap = 20,
  align = "left",
}: {
  value: unknown;
  bullet?: string;
  size?: number;
  gap?: number;
  /** center면 글이 적을 때 가운데로 모아요 (머리 기호 없을 때만 자연스러워요) */
  align?: "left" | "center";
}) {
  const lines = asLines(value);
  if (!lines.length) return null;

  const centered = align === "center";

  return (
    <ul
      className={`flex flex-col ${centered ? "items-center" : ""}`}
      style={{ gap }}
    >
      {lines.map((line, i) => (
        <li
          key={i}
          className={`flex text-slide-muted ${centered ? "text-center" : ""}`}
          style={{ fontSize: size, lineHeight: 1.45, gap: 14 }}
        >
          {bullet === "dot" ? (
            <span className="text-slide-green" aria-hidden>
              ●
            </span>
          ) : null}
          {bullet === "number" ? (
            <span className="font-semibold text-slide-green" aria-hidden>
              {i + 1}.
            </span>
          ) : null}
          <span className={centered ? "" : "flex-1"}>{line}</span>
        </li>
      ))}
    </ul>
  );
}
