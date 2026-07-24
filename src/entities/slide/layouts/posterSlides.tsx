import { asItems, asTable, asText, type SlideProps } from "@/entities/slide/types";
import { QrCode } from "@/entities/slide/qr";

/** 포스터 캔버스는 세로형(A-계열 비율)이에요. PDF로만 내보내요. */
export const POSTER_CANVAS = { w: 1080, h: 1527 };

/**
 * 밝은 에디토리얼 포스터. 흰 배경 + 상단 그린 헤더 블록, 그린은 포인트로만 써요.
 * 제목 / 소개 / 정보·QR / 일정표 / 주최 푸터로 나뉘고, 비운 칸은 사라져요.
 */
export function Poster({ data }: SlideProps) {
  const info = asItems(data.info).filter((r) => r.label || r.value);
  const qrs = asItems(data.qrs)
    .filter((q) => q.label || q.url)
    .slice(0, 2);
  const table = asTable(data.schedule);
  const hasSchedule = table.head.length > 0;

  return (
    <div
      className="flex flex-col overflow-hidden bg-white text-slide-ink"
      style={{ width: POSTER_CANVAS.w, height: POSTER_CANVAS.h }}
    >
      {/* 상단 그린 헤더 블록 — 산뜻한 그린, 흰 기린 마크가 얹혀요 */}
      <div className="flex items-center justify-between gap-[36px] bg-slide-green-soft px-[76px] pt-[68px] pb-[60px] text-white">
        <div className="min-w-0">
          {asText(data.eyebrow) ? (
            <p className="mb-[12px] text-[32px] font-bold tracking-[0.06em] text-white/75">
              {asText(data.eyebrow)}
            </p>
          ) : null}
          <h1 className="text-[92px] leading-[1.04] font-bold tracking-[-0.02em]">
            {asText(data.title)}
          </h1>
          {asText(data.subtitle) ? (
            <p className="mt-[16px] text-[38px] font-semibold text-white/80">
              {asText(data.subtitle)}
            </p>
          ) : null}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/greedy-emblem-white.png"
          alt=""
          aria-hidden
          className="size-[224px] flex-none"
        />
      </div>

      {/* 본문 — 흰 배경에 그리드로 정렬, 남는 공간을 고르게 나눠요 */}
      <div className="flex flex-1 flex-col justify-between px-[76px] pt-[56px] pb-[44px]">
        {asText(data.description) ? (
          <p className="text-[31px] leading-[1.55] text-slide-ink whitespace-pre-line">
            {asText(data.description)}
          </p>
        ) : null}

        {info.length || qrs.length ? (
          <div className="flex items-start gap-[52px]">
            {info.length ? (
              <div className="flex flex-1 flex-col">
                {info.map((row, i) => (
                  <div
                    key={i}
                    className={`flex items-baseline gap-[24px] py-[20px] ${
                      i > 0 ? "border-t border-slide-mint" : ""
                    }`}
                  >
                    <span className="w-[168px] flex-none text-[30px] font-bold text-slide-green-deep">
                      {row.label}
                    </span>
                    <span className="flex-1 text-[30px] leading-[1.3] text-slide-ink">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
            {qrs.length ? (
              <div className="flex flex-none items-start gap-[24px]">
                {qrs.map((q, i) => (
                  <div key={i} className="flex flex-col items-center gap-[12px]">
                    <div className="rounded-[16px] border-2 border-slide-mint p-[14px]">
                      <QrCode value={q.url || "https://greedy.example"} size={176} />
                    </div>
                    {q.label ? (
                      <span className="text-[24px] font-semibold text-slide-green-deep">
                        {q.label}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {hasSchedule ? (
          <table className="w-full table-fixed border-collapse text-[25px]">
            <thead>
              <tr>
                {table.head.map((cell, i) => (
                  <th
                    key={i}
                    className="border-b-[3px] border-slide-green px-[8px] py-[18px] text-left text-[26px] font-bold text-slide-green-deep"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, r) => (
                <tr key={r} className="border-b border-slide-mint">
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className="px-[8px] py-[18px] align-top text-slide-ink"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      {/* 주최 푸터 — 소개 문구 왼쪽, 그리디 워드마크 오른쪽 */}
      <div className="flex items-center justify-between border-t-2 border-slide-mint px-[76px] py-[36px]">
        <span className="text-[26px] font-semibold text-slide-muted">
          {asText(data.footer) || "세종대학교 개발 동아리 그리디"}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/greedy-wordmark.svg" alt="그리디" className="h-[38px] w-auto" />
      </div>
    </div>
  );
}
