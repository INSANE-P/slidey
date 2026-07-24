import { asItems, asTable, asText, type SlideProps } from "@/entities/slide/types";
import { WhiteSlide } from "@/entities/slide/SlideFrame";

/* 데이터 — 표, 숫자 강조, 일정 */

export function TableSlide({ data }: SlideProps) {
  const { head, rows } = asTable(data.table);
  return (
    <WhiteSlide title={asText(data.title)}>
      {asText(data.description) ? (
        <p className="mb-[20px] text-[24px] text-slide-muted">
          {asText(data.description)}
        </p>
      ) : null}
      {head.length === 0 ? null : (
      <table className="w-full table-fixed border-collapse text-[22px]">
        <thead>
          <tr>
            {head.map((cell, i) => (
              <th
                key={i}
                className="border border-slide-ink bg-slide-mint px-[18px] py-[14px] text-left font-bold"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td
                  key={c}
                  className="border border-slide-ink px-[18px] py-[14px] align-top"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </WhiteSlide>
  );
}

export function Stats({ data }: SlideProps) {
  const items = asItems(data.items).slice(0, 4);
  return (
    <WhiteSlide title={asText(data.title)}>
      <div className="flex h-full items-center justify-around gap-[24px]">
        {items.map((item, i) => (
          <div key={i} className="flex-1 text-center">
            <p className="text-[92px] leading-[1] font-bold tracking-[-0.03em] text-slide-green">
              {item.value}
            </p>
            <p className="mt-[16px] text-[26px] font-semibold">{item.label}</p>
            {item.sub ? (
              <p className="mt-[8px] text-[20px] text-slide-muted">{item.sub}</p>
            ) : null}
          </div>
        ))}
      </div>
    </WhiteSlide>
  );
}

export function Timeline({ data }: SlideProps) {
  const items = asItems(data.items).slice(0, 6);
  return (
    <WhiteSlide title={asText(data.title)}>
      <div className="relative h-full" style={{ paddingLeft: 26 }}>
        <div className="absolute top-[12px] bottom-[12px] left-[7px] w-[3px] bg-slide-mint" />
        <div className="flex h-full flex-col justify-around">
          {items.map((item, i) => (
            <div key={i} className="relative flex items-baseline gap-[24px]">
              <span
                className="absolute size-[17px] rounded-full bg-slide-green"
                style={{ left: -26, top: 8 }}
              />
              <span className="w-[150px] flex-none text-[24px] font-bold text-slide-green">
                {item.when}
              </span>
              <span className="text-[26px] font-semibold">{item.what}</span>
              {item.detail ? (
                <span className="text-[21px] text-slide-muted">{item.detail}</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </WhiteSlide>
  );
}
