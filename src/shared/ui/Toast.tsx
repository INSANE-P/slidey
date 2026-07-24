"use client";

import { useEffect, useState } from "react";

/*
 * 아주 가벼운 토스트예요. 컨텍스트로 감싸지 않아도 어디서든 toast()를 부를 수 있게
 * 모듈 수준 구독으로 만들었어요. <Toaster />만 루트에 한 번 올리면 됩니다.
 */
type ToastKind = "success" | "error";
type ToastItem = { id: number; kind: ToastKind; message: string };

let counter = 0;
const listeners = new Set<(items: ToastItem[]) => void>();
let items: ToastItem[] = [];

function emit() {
  listeners.forEach((l) => l(items));
}

export function toast(message: string, kind: ToastKind = "success") {
  const id = ++counter;
  items = [...items, { id, kind, message }];
  emit();
  setTimeout(() => {
    items = items.filter((t) => t.id !== id);
    emit();
  }, 3000);
}

export function Toaster() {
  const [list, setList] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.add(setList);
    return () => {
      listeners.delete(setList);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4">
      {list.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto flex items-center gap-2 rounded-md px-4 py-2.5 text-body-sm font-medium text-white shadow-lg ${
            t.kind === "error" ? "bg-danger" : "bg-gray-900"
          }`}
        >
          <span aria-hidden>{t.kind === "error" ? "✕" : "✓"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
