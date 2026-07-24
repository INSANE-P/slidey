import { asText, type SlideProps } from "@/entities/slide/types";
import { GreedyLogo, GreenSlide, WhiteSlide } from "@/entities/slide/SlideFrame";
import { BodyLines } from "@/entities/slide/SlideParts";
import { QrCode } from "@/entities/slide/qr";

/* 컨퍼런스(그리디콘) — 연사 세션, QR */

/** 연사 세션 오프너. 주제를 크게, 아래에 연사 이름·소속을 붙여요. */
export function Speaker({ data }: SlideProps) {
  return (
    <GreenSlide>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[100px]">
        <p className="mb-[28px] text-[24px] font-semibold tracking-[0.1em] text-white/70">
          SESSION
        </p>
        <h1 className="text-center text-[60px] leading-[1.25] font-bold tracking-[-0.02em]">
          {asText(data.title)}
        </h1>
        {asText(data.speaker) ? (
          <p className="mt-[36px] text-[30px] font-bold">
            {asText(data.speaker)}
          </p>
        ) : null}
        {asText(data.affiliation) ? (
          <p className="mt-[8px] text-[24px] text-white/75">
            {asText(data.affiliation)}
          </p>
        ) : null}
      </div>
      {/* 세션 제목에 집중하는 선언형 슬라이드라 엠블럼은 넣지 않아요(원본과 동일). */}
    </GreenSlide>
  );
}

/** 세션 사이 쉬는 시간. 안내와 다음 세션 예고를 보여줘요. */
export function Intermission({ data }: SlideProps) {
  return (
    <GreenSlide>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[100px]">
        <h1 className="text-center text-[60px] leading-[1.2] font-bold tracking-[-0.02em]">
          {asText(data.title)}
        </h1>
        {asText(data.note) ? (
          <p className="mt-[24px] max-w-[880px] text-center text-[26px] leading-[1.5] text-white/80">
            {asText(data.note)}
          </p>
        ) : null}
        {asText(data.next) ? (
          <div className="mt-[52px] rounded-[999px] bg-white/15 px-[36px] py-[16px] text-center">
            <span className="text-[22px] font-semibold tracking-[0.08em] text-white/70">
              다음 세션
            </span>
            <span className="ml-[16px] text-[26px] font-bold">
              {asText(data.next)}
            </span>
          </div>
        ) : null}
      </div>
      <GreedyLogo className="bottom-[16px] right-[16px]" />
    </GreenSlide>
  );
}

/** 주소를 넣으면 QR 코드가 생겨요. 왼쪽 안내, 오른쪽 QR. */
export function Qr({ data }: SlideProps) {
  const url = asText(data.url);
  return (
    <WhiteSlide title={asText(data.title)} badge={asText(data.badge)}>
      <div className="flex h-full items-center gap-[56px]">
        <div className="flex-1">
          <BodyLines value={data.body} size={28} gap={22} />
        </div>
        <div className="flex flex-none flex-col items-center gap-[16px]">
          <div className="rounded-[12px] border border-slide-mint bg-white p-[16px]">
            <QrCode value={url || "https://greedy.example"} size={360} />
          </div>
          {asText(data.caption) ? (
            <p className="max-w-[392px] truncate text-[18px] text-slide-muted">
              {asText(data.caption)}
            </p>
          ) : null}
        </div>
      </div>
    </WhiteSlide>
  );
}
