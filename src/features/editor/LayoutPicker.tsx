"use client";

import { LAYOUTS, LAYOUT_GROUPS } from "@/entities/slide/layouts";
import { SlideStage } from "@/entities/slide/SlideStage";

/** 레이아웃 갤러리. 미리보기는 각 레이아웃의 기본값을 그대로 그려요. */
export function LayoutPicker({
  current,
  onPick,
  onClose,
}: {
  current?: string;
  onPick: (layoutId: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-bg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-h3 text-text">레이아웃 고르기</h2>
            <p className="text-caption text-text-subtle">
              디자인은 고정이에요. 내용만 채우면 됩니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm px-3 py-1.5 text-body-sm text-text-subtle transition-colors hover:text-text"
          >
            닫기
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {LAYOUT_GROUPS.map((group) => (
            <section key={group} className="mb-7 last:mb-0">
              <h3 className="mb-3 text-body-sm font-bold text-text-subtle">
                {group}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {LAYOUTS.filter((l) => l.group === group).map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => onPick(layout.id)}
                    className={`overflow-hidden rounded-md border text-left transition ${
                      current === layout.id
                        ? "border-brand ring-2 ring-brand/25"
                        : "border-border hover:border-brand"
                    }`}
                  >
                    <SlideStage
                      layout={layout.id}
                      data={layout.sample}
                      rounded={false}
                      className="aspect-video w-full bg-surface"
                    />
                    <div className="border-t border-border px-3 py-2.5">
                      <p className="text-body-sm font-semibold text-text">
                        {layout.name}
                      </p>
                      <p className="mt-0.5 text-caption text-text-subtle">
                        {layout.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
