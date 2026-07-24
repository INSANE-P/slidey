import { asItems, asLines, asText, type SlideProps } from "@/entities/slide/types";
import { WhiteSlide } from "@/entities/slide/SlideFrame";
import { BodyLines, SlideImage, densityByCount } from "@/entities/slide/SlideParts";

/* 사람·목록 — 사람 소개, 아바타 그리드, 목차, 항목+설명 */

export function People({ data }: SlideProps) {
  const items = asItems(data.items).slice(0, 3);
  return (
    <WhiteSlide title={asText(data.title)}>
      <div className="flex h-full flex-col justify-around">
        {items.map((person, i) => (
          <div key={i} className="flex items-center gap-[36px]">
            <SlideImage
              src={person.image}
              rounded="rounded-full"
              className="size-[136px] flex-none"
            />
            <div className="flex-1">
              <p className="mb-[10px] text-[32px] font-bold">{person.name}</p>
              <BodyLines value={person.bullets} bullet="dot" size={24} gap={10} />
            </div>
          </div>
        ))}
      </div>
    </WhiteSlide>
  );
}

export function AvatarGrid({ data }: SlideProps) {
  const items = asItems(data.items).slice(0, 10);
  return (
    <WhiteSlide title={asText(data.title)} badge={asText(data.badge)}>
      <div className="grid grid-cols-5 gap-x-[28px] gap-y-[24px]">
        {items.map((person, i) => (
          <div key={i} className="flex flex-col items-center gap-[12px]">
            <SlideImage
              src={person.image}
              rounded="rounded-full"
              className="size-[132px]"
            />
            <span className="w-full truncate rounded-[6px] bg-slide-mint px-[10px] py-[8px] text-center text-[20px] text-slide-ink">
              {person.name}
            </span>
          </div>
        ))}
      </div>
    </WhiteSlide>
  );
}

export function Agenda({ data }: SlideProps) {
  const items = asLines(data.items).slice(0, 7);
  // 항목이 적으면 큼직하게 가운데로 모으고, 많으면 세로로 꽉 채워 배분해요(아래 여백 제거).
  const { size, sparse } = densityByCount(items.length, [
    { upTo: 3, size: 46, gap: 0 },
    { upTo: 5, size: 40, gap: 0 },
    { upTo: 7, size: 34, gap: 0 },
  ]);
  const badge = Math.round(size * 1.5);
  return (
    <WhiteSlide title={asText(data.title)}>
      <ol
        className={`flex h-full flex-col ${sparse ? "justify-center gap-[36px]" : "justify-between py-[8px]"}`}
      >
        {items.map((line, i) => (
          <li key={i} className="flex items-center gap-[24px]">
            <span
              className="flex flex-none items-center justify-center rounded-full bg-slide-green font-bold text-white"
              style={{ width: badge, height: badge, fontSize: size * 0.8 }}
            >
              {i + 1}
            </span>
            <span style={{ fontSize: size }}>{line}</span>
          </li>
        ))}
      </ol>
    </WhiteSlide>
  );
}

export function Points({ data }: SlideProps) {
  const items = asItems(data.items).slice(0, 4);
  return (
    <WhiteSlide title={asText(data.title)}>
      <div className="grid h-full grid-cols-2 gap-[28px]">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-[10px] bg-slide-mint/40 px-[32px] py-[28px]"
          >
            <p className="text-[34px] font-bold text-slide-green-deep">
              {item.label}
            </p>
            {item.sub ? (
              <p className="mt-[6px] text-[20px] font-semibold tracking-[0.06em] text-slide-green">
                ({item.sub})
              </p>
            ) : null}
            {item.description ? (
              <p className="mt-[14px] text-[22px] leading-[1.45] text-slide-muted">
                {item.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </WhiteSlide>
  );
}
