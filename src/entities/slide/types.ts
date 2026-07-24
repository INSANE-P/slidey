/** 슬라이드 한 장의 스키마와 값 타입이에요. 레이아웃 정의와 폼이 이걸 공유해요. */

export type FieldType =
  | "text"
  | "textarea"
  | "list"
  | "image"
  | "select"
  | "items"
  | "table";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  optional?: boolean;
  /** list·items에서 넣을 수 있는 최대 개수. 넘기면 레이아웃이 깨져요. */
  max?: number;
  /** select 전용 */
  options?: { value: string; label: string }[];
  /** items 전용 — 항목 하나가 가지는 필드들 */
  fields?: FieldDef[];
}

export type LayoutGroup = "표지·마무리" | "본문" | "사람·목록" | "데이터";

export interface LayoutDef {
  id: string;
  name: string;
  /** 언제 쓰는 레이아웃인지 — 갤러리에 그대로 노출돼요 */
  description: string;
  group: LayoutGroup;
  /** green이면 그린 배경 슬라이드 */
  tone: "green" | "white";
  fields: FieldDef[];
  /** 새로 추가할 때 채워지는 기본값 */
  sample: SlideData;
}

export type SlideData = Record<string, unknown>;

/** 레이아웃 렌더 컴포넌트가 공통으로 받는 props. */
export type SlideProps = { data: SlideData };

/** items 필드 한 줄 */
export type ItemRow = Record<string, string>;

/** table 필드 값 */
export interface TableValue {
  head: string[];
  rows: string[][];
}

export const asText = (v: unknown): string => (typeof v === "string" ? v : "");

export const asLines = (v: unknown): string[] =>
  asText(v)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export const asItems = (v: unknown): ItemRow[] =>
  Array.isArray(v) ? (v as ItemRow[]) : [];

export const asTable = (v: unknown): TableValue => {
  const t = v as TableValue | undefined;
  if (!t || !Array.isArray(t.head) || !Array.isArray(t.rows)) {
    return { head: [], rows: [] };
  }
  return t;
};
