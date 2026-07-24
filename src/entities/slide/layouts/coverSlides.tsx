import { asLines, asText, type SlideProps } from "@/entities/slide/types";
import { GreedyLogo, GreenSlide } from "@/entities/slide/SlideFrame";

/* 표지·간지·마무리 — 그린 배경 계열과 팀 넘김 간지 */

export function Cover({ data }: SlideProps) {
  const meta = asLines(data.meta);
  return (
    <GreenSlide>
      <div className="absolute inset-x-[64px] top-[196px]">
        <h1 className="text-center text-[76px] leading-[1.1] font-bold tracking-[-0.02em]">
          {asText(data.title)}
        </h1>
        {asText(data.subtitle) ? (
          <p className="mt-[16px] text-center text-[28px] text-white/80">
            {asText(data.subtitle)}
          </p>
        ) : null}
      </div>
      <div className="absolute inset-x-[24px] top-[338px] h-[6px] bg-white" />
      <div className="absolute right-[56px] top-[376px] flex flex-col items-end gap-[14px]">
        {meta.map((line, i) => (
          <p key={i} className="text-[28px] font-semibold">
            {line}
          </p>
        ))}
      </div>
      <GreedyLogo className="bottom-[16px] right-[16px]" size={200} />
    </GreenSlide>
  );
}

/** 발표 중 팀이 바뀔 때 넘기는 간지. 위아래 그린 라인 사이에 팀 이름만. */
export function TeamDivider({ data }: SlideProps) {
  return (
    <div className="slide-canvas bg-white text-slide-ink">
      <GreedyLogo className="top-[20px] right-[24px]" />
      <div className="absolute inset-x-0 top-[276px] h-[6px] bg-slide-green" />
      <div className="absolute inset-x-0 top-[438px] h-[6px] bg-slide-green" />
      <div className="absolute inset-x-0 top-[282px] flex h-[156px] items-center justify-center">
        <h1 className="text-[80px] leading-none font-bold tracking-[-0.02em]">
          {asText(data.title)}
        </h1>
      </div>
      {asText(data.subtitle) ? (
        <p className="absolute inset-x-0 top-[464px] text-center text-[26px] text-slide-muted">
          {asText(data.subtitle)}
        </p>
      ) : null}
    </div>
  );
}

export function Section({ data }: SlideProps) {
  return (
    <GreenSlide>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[80px]">
        <h1 className="text-center text-[72px] leading-[1.15] font-bold tracking-[-0.02em]">
          {asText(data.title)}
        </h1>
        {asText(data.subtitle) ? (
          <p className="mt-[20px] text-center text-[28px] text-white/80">
            {asText(data.subtitle)}
          </p>
        ) : null}
      </div>
      <GreedyLogo className="top-[20px] right-[24px]" size={200} />
    </GreenSlide>
  );
}

export function Quote({ data }: SlideProps) {
  return (
    <GreenSlide>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[120px]">
        <p className="text-center text-[52px] leading-[1.4] font-bold tracking-[-0.02em] whitespace-pre-line">
          {asText(data.quote)}
        </p>
        {asText(data.author) ? (
          <p className="mt-[36px] text-[26px] text-white/75">
            {asText(data.author)}
          </p>
        ) : null}
      </div>
      <GreedyLogo className="bottom-[16px] right-[16px]" size={200} />
    </GreenSlide>
  );
}

export function Closing({ data }: SlideProps) {
  return (
    <GreenSlide>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-[72px] leading-[1.15] font-bold tracking-[-0.02em]">
          {asText(data.title)}
        </h1>
        {asText(data.subtitle) ? (
          <p className="mt-[18px] text-[28px] text-white/80">
            {asText(data.subtitle)}
          </p>
        ) : null}
      </div>
      <GreedyLogo className="bottom-[16px] right-[16px]" size={200} />
    </GreenSlide>
  );
}
