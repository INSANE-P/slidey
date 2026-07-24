"use client";

import type { FieldDef, ItemRow, SlideData, TableValue } from "@/entities/slide/types";
import { asItems, asTable, asText } from "@/entities/slide/types";
import { ImageInput } from "@/features/editor/ImageInput";
import { SelectField, TextArea, TextField, fieldBase } from "@/shared/ui/Field";
import { cn } from "@/shared/lib/cn";

function Label({
  field,
  count,
}: {
  field: FieldDef;
  count?: { now: number; max: number };
}) {
  const over = count && count.now > count.max;
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <span className="text-body-sm font-semibold text-text">
        {field.label}
        {field.optional ? (
          <span className="ml-1.5 text-caption font-normal text-text-subtle">
            선택
          </span>
        ) : null}
      </span>
      {count ? (
        <span className={cn("text-caption", over ? "text-danger" : "text-text-subtle")}>
          {over ? `${count.max}개까지 들어가요` : `${count.now}/${count.max}`}
        </span>
      ) : null}
    </div>
  );
}

/** 필드 하나를 그 타입에 맞는 입력 칸으로 그려요. */
export function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  if (field.type === "items") {
    return <ItemsField field={field} value={value} onChange={onChange} />;
  }
  if (field.type === "table") {
    return <TableField field={field} value={value} onChange={onChange} />;
  }

  const text = asText(value);
  const lines = text.split("\n").filter((l) => l.trim()).length;

  return (
    <div>
      <Label
        field={field}
        count={
          field.type === "list" && field.max
            ? { now: lines, max: field.max }
            : undefined
        }
      />
      {field.type === "text" ? (
        <TextField
          value={text}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}
      {field.type === "textarea" || field.type === "list" ? (
        <TextArea
          value={text}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}
      {field.type === "image" ? (
        <ImageInput value={text} onChange={onChange} />
      ) : null}
      {field.type === "select" ? (
        <SelectField
          value={text || field.options?.[0]?.value}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectField>
      ) : null}
      {field.hint ? (
        <p className="mt-1.5 text-caption text-text-subtle">{field.hint}</p>
      ) : null}
    </div>
  );
}

function ItemsField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const items = asItems(value);
  const max = field.max ?? 6;

  const update = (index: number, key: string, next: string) => {
    const copy = items.map((row, i) =>
      i === index ? { ...row, [key]: next } : row,
    );
    onChange(copy);
  };

  const add = () => {
    const blank: ItemRow = {};
    field.fields?.forEach((f) => (blank[f.key] = ""));
    onChange([...items, blank]);
  };

  return (
    <div>
      <Label field={field} count={{ now: items.length, max }} />
      <div className="flex flex-col gap-2">
        {items.map((row, i) => (
          <div
            key={i}
            className="rounded-md border border-border bg-brand-soft/40 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-caption font-semibold text-text-subtle">
                {i + 1}번째
              </span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="text-caption text-text-subtle transition-colors hover:text-danger"
              >
                삭제
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              {field.fields?.map((sub) => (
                <Field
                  key={sub.key}
                  field={sub}
                  value={row[sub.key]}
                  onChange={(next) => update(i, sub.key, asText(next))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {items.length < max ? (
        <button
          type="button"
          onClick={add}
          className="mt-2 w-full rounded-sm border border-dashed border-border py-2 text-body-sm font-medium text-text-subtle transition-colors hover:border-brand hover:text-brand"
        >
          + {field.label} 추가
        </button>
      ) : null}
      {field.hint ? (
        <p className="mt-1.5 text-caption text-text-subtle">{field.hint}</p>
      ) : null}
    </div>
  );
}

function TableField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const table = asTable(value);
  const cols = Math.max(table.head.length, 1);

  const set = (next: TableValue) => onChange(next);

  const setHead = (c: number, v: string) =>
    set({ ...table, head: table.head.map((h, i) => (i === c ? v : h)) });

  const setCell = (r: number, c: number, v: string) =>
    set({
      ...table,
      rows: table.rows.map((row, i) =>
        i === r ? row.map((cell, j) => (j === c ? v : cell)) : row,
      ),
    });

  return (
    <div>
      <Label field={field} />
      <div className="overflow-x-auto rounded-md border border-border p-2">
        <table className="w-full border-separate border-spacing-1">
          <tbody>
            <tr>
              {table.head.map((cell, c) => (
                <td key={c}>
                  <input
                    className={cn(fieldBase, "h-9 bg-brand-soft/50 font-semibold")}
                    value={cell}
                    onChange={(e) => setHead(c, e.target.value)}
                  />
                </td>
              ))}
            </tr>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c}>
                    <input
                      className={cn(fieldBase, "h-9")}
                      value={cell}
                      onChange={(e) => setCell(r, c, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() =>
            set({ ...table, rows: [...table.rows, Array(cols).fill("")] })
          }
          className="rounded-sm border border-border px-3 py-1.5 text-caption font-medium text-text transition-colors hover:border-brand"
        >
          + 행
        </button>
        <button
          type="button"
          onClick={() =>
            set({
              head: [...table.head, ""],
              rows: table.rows.map((row) => [...row, ""]),
            })
          }
          className="rounded-sm border border-border px-3 py-1.5 text-caption font-medium text-text transition-colors hover:border-brand"
        >
          + 열
        </button>
        {table.rows.length > 1 ? (
          <button
            type="button"
            onClick={() => set({ ...table, rows: table.rows.slice(0, -1) })}
            className="rounded-sm px-3 py-1.5 text-caption text-text-subtle transition-colors hover:text-danger"
          >
            마지막 행 삭제
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** 슬라이드 하나의 모든 필드를 순서대로 그려요. */
export function SlideForm({
  fields,
  data,
  onChange,
}: {
  fields: FieldDef[];
  data: SlideData;
  onChange: (key: string, next: unknown) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => (
        <Field
          key={field.key}
          field={field}
          value={data[field.key]}
          onChange={(next) => onChange(field.key, next)}
        />
      ))}
    </div>
  );
}
