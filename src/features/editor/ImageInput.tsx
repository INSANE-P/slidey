"use client";

import { useRef, useState } from "react";
import { fieldBase } from "@/shared/ui/Field";
import { cn } from "@/shared/lib/cn";

/** 원본 사진은 너무 커서 그대로 담으면 저장이 터져요. 긴 변 1600px으로 줄여서 넣습니다. */
async function shrink(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const max = 1600;
  const ratio = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * ratio);
  canvas.height = Math.round(bitmap.height * ratio);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function ImageInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"file" | "url">("file");
  const [url, setUrl] = useState("");

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await shrink(file));
    } finally {
      setBusy(false);
    }
  };

  const applyUrl = () => {
    const trimmed = url.trim();
    if (trimmed) onChange(trimmed);
    setUrl("");
  };

  // 업로드한 사진은 data URL이라 URL 칸에 되비추면 지저분해요. 링크로 넣은 것만 보여줘요.
  const shownUrl = value.startsWith("http") ? value : "";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- 미리보기용 썸네일이에요
          <img
            src={value}
            alt=""
            className="size-11 flex-none rounded-md border border-border object-cover"
          />
        ) : (
          <div className="size-11 flex-none rounded-md bg-surface" />
        )}

        {/* 파일 / 링크 전환 */}
        <div className="inline-flex overflow-hidden rounded-sm border border-border">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={cn(
              "px-2.5 py-1.5 text-caption font-medium transition-colors",
              mode === "file" ? "bg-brand text-white" : "text-text-subtle hover:text-text",
            )}
          >
            파일
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={cn(
              "px-2.5 py-1.5 text-caption font-medium transition-colors",
              mode === "url" ? "bg-brand text-white" : "text-text-subtle hover:text-text",
            )}
          >
            링크
          </button>
        </div>

        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-caption text-text-subtle transition-colors hover:text-danger"
          >
            지우기
          </button>
        ) : null}
      </div>

      {mode === "file" ? (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="rounded-sm border border-border bg-bg px-3 py-2 text-body-sm font-medium text-text transition-colors hover:border-brand disabled:opacity-50"
          >
            {busy ? "줄이는 중" : value ? "다른 사진 고르기" : "사진 고르기"}
          </button>
        </>
      ) : (
        <div className="flex gap-2">
          <input
            value={url || shownUrl}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyUrl()}
            placeholder="https://…/photo.jpg"
            className={cn(fieldBase, "h-9 flex-1")}
          />
          <button
            type="button"
            onClick={applyUrl}
            className="flex-none rounded-sm border border-border px-3 text-body-sm font-medium text-text transition-colors hover:border-brand"
          >
            넣기
          </button>
        </div>
      )}
    </div>
  );
}
