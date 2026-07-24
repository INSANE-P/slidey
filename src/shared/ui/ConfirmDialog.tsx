"use client";

import { useEffect } from "react";
import { Button } from "./Button";

/**
 * 되돌리기 어려운 행동은 물어보고 진행해요. 삭제처럼요.
 * ESC·바깥 클릭으로 닫히고, 확인을 누를 때만 onConfirm이 불립니다.
 */
export function ConfirmDialog({
  title,
  description,
  confirmLabel = "삭제",
  danger = true,
  onConfirm,
  onClose,
}: {
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-gray-900/40 p-6"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-lg bg-bg p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-h3 text-text">{title}</h2>
        {description ? (
          <p className="mt-2 text-body-sm text-text-subtle">{description}</p>
        ) : null}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            취소
          </Button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`relative inline-flex h-8 items-center justify-center rounded-md px-4 text-body-sm font-semibold text-white transition-colors ${
              danger ? "bg-danger hover:bg-red-600/90" : "bg-brand hover:bg-green-700"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
