import { asLines, asText, type SlideProps } from "@/entities/slide/types";
import { GreedyLogo, WhiteSlide } from "@/entities/slide/SlideFrame";
import { BodyLines, SlideImage, densityByCount } from "@/entities/slide/SlideParts";

/* 본문 — 제목+본문, 좌우 2단, 큰 사진, 2단 비교, 코드 */

export function Content({ data }: SlideProps) {
  const bullet = asText(data.bullet) || "none";
  // 줄이 적으면 크게, 많으면 담백하게. 적을 땐 세로로만 가운데로 모아요.
  const { size, gap, sparse } = densityByCount(asLines(data.body).length, [
    { upTo: 2, size: 40, gap: 28 },
    { upTo: 4, size: 30, gap: 22 },
    { upTo: 6, size: 26, gap: 18 },
  ]);
  return (
    <WhiteSlide title={asText(data.title)} badge={asText(data.badge)}>
      <div className={`flex h-full flex-col ${sparse ? "justify-center" : ""}`}>
        <BodyLines value={data.body} bullet={bullet} size={size} gap={gap} />
      </div>
    </WhiteSlide>
  );
}

export function Split({ data }: SlideProps) {
  const imageLeft = asText(data.imageSide) === "left";
  return (
    <WhiteSlide title={asText(data.title)} badge={asText(data.badge)}>
      <div
        className={`flex h-full items-center gap-[48px] ${imageLeft ? "flex-row-reverse" : ""}`}
      >
        <div className="flex-1">
          <BodyLines value={data.body} />
        </div>
        <div className="flex w-[500px] flex-none flex-col gap-[12px]">
          <SlideImage src={asText(data.image)} className="h-[400px] w-full" />
          {asText(data.caption) ? (
            <p className="text-[18px] text-slide-muted">{asText(data.caption)}</p>
          ) : null}
        </div>
      </div>
    </WhiteSlide>
  );
}

export function ImageFull({ data }: SlideProps) {
  const title = asText(data.title);
  // 제목이 없으면 사진을 화면 전체로 깔아요.
  if (!title) {
    return (
      <div className="slide-canvas bg-white">
        <SlideImage
          src={asText(data.image)}
          rounded=""
          className="absolute inset-0 size-full"
        />
        {asText(data.caption) ? (
          <p className="absolute bottom-[28px] left-[40px] rounded-[6px] bg-white/85 px-[16px] py-[8px] text-[20px] text-slide-ink">
            {asText(data.caption)}
          </p>
        ) : null}
        <GreedyLogo className="top-[20px] right-[24px]" />
      </div>
    );
  }
  return (
    <WhiteSlide title={title}>
      <div className="flex h-full flex-col gap-[12px]">
        <SlideImage src={asText(data.image)} className="min-h-0 w-full flex-1" />
        {asText(data.caption) ? (
          <p className="text-[18px] text-slide-muted">{asText(data.caption)}</p>
        ) : null}
      </div>
    </WhiteSlide>
  );
}

function CompareColumn({ title, body }: { title: string; body: unknown }) {
  return (
    <div className="flex-1 rounded-[10px] bg-slide-mint/40 p-[32px]">
      <h3 className="mb-[20px] text-[32px] font-bold text-slide-green-deep">
        {title}
      </h3>
      <BodyLines value={body} bullet="dot" size={23} gap={16} />
    </div>
  );
}

export function Compare({ data }: SlideProps) {
  return (
    <WhiteSlide title={asText(data.title)}>
      <div className="flex h-full gap-[32px]">
        <CompareColumn title={asText(data.leftTitle)} body={data.leftBody} />
        <CompareColumn title={asText(data.rightTitle)} body={data.rightBody} />
      </div>
    </WhiteSlide>
  );
}

export function Code({ data }: SlideProps) {
  return (
    <WhiteSlide title={asText(data.title)}>
      {asText(data.description) ? (
        <p className="mb-[20px] text-[24px] text-slide-muted">
          {asText(data.description)}
        </p>
      ) : null}
      <pre className="max-h-full overflow-hidden rounded-[10px] bg-slide-ink p-[28px] text-[21px] leading-[1.6] text-white">
        <code className="font-mono">{asText(data.code)}</code>
      </pre>
    </WhiteSlide>
  );
}
