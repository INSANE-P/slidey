"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDeck } from "@/entities/deck/storage";
import type { Deck } from "@/entities/deck/types";
import { getCanvas, getLayout } from "@/entities/slide/layouts";
import { SlideStage } from "@/entities/slide/SlideStage";
import { SlideView } from "@/entities/slide/SlideView";

export default function ViewerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const params = useSearchParams();
  const printMode = params.get("print") === "1";

  const [deck, setDeck] = useState<Deck | null>(null);
  const [missing, setMissing] = useState(false);
  const [index, setIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [hint, setHint] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // localStorage는 클라이언트에서만 읽어요 — 마운트 후 덱을 채워요.
    const found = getDeck(id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (found) setDeck(found);
    else setMissing(true);
  }, [id]);

  // 인쇄 화면은 슬라이드가 다 그려진 다음에 인쇄창을 띄워요.
  useEffect(() => {
    if (!printMode || !deck) return;
    const timer = setTimeout(() => window.print(), 600);
    return () => clearTimeout(timer);
  }, [printMode, deck]);

  const total = deck?.slides.length ?? 1;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.min(total - 1, Math.max(0, i + delta)));
    },
    [total],
  );

  // 마우스를 움직이면 컨트롤이 잠깐 나왔다가 조용히 사라져요. 실제 발표 프로그램처럼요.
  const nudgeUi = useCallback(() => {
    setUiVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setUiVisible(false), 2500);
  }, []);

  useEffect(() => {
    if (printMode) return;
    // 시작 직후 컨트롤을 자동으로 숨기고, "ESC로 편집으로" 힌트도 잠깐 뒤 사라지게 해요.
    // (uiVisible·hint는 이미 true로 시작하니 여기선 타이머만 걸어요.)
    hideTimer.current = setTimeout(() => setUiVisible(false), 2500);
    const t = setTimeout(() => setHint(false), 3500);
    return () => {
      clearTimeout(t);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [printMode]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  }, []);

  const exit = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    router.push(`/e/${id}`);
  }, [router, id]);

  useEffect(() => {
    if (printMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", " ", "PageDown"].includes(e.key)) {
        e.preventDefault();
        go(1);
        nudgeUi();
      }
      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
        nudgeUi();
      }
      if (e.key === "f") toggleFullscreen();
      if (e.key === "n") setShowNotes((v) => !v);
      if (e.key === "Escape" && !document.fullscreenElement) exit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, printMode, toggleFullscreen, exit, nudgeUi]);

  if (missing) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-text-subtle">이 브라우저에 없는 덱이에요.</p>
        <Link href="/" className="font-semibold text-brand">
          홈으로 가기
        </Link>
      </main>
    );
  }
  if (!deck) return null;

  if (printMode) {
    // 포스터처럼 세로형 캔버스면 인쇄 페이지도 그 크기로 맞춰요.
    const canvas = getCanvas(deck.slides[0]?.layout ?? "cover");
    const portrait = deck.slides.every((s) => getLayout(s.layout).pdfOnly);
    return (
      <div className="bg-white">
        {portrait ? (
          <style>{`@page { size: ${canvas.w}px ${canvas.h}px; margin: 0 }`}</style>
        ) : null}
        <p className="print-hide p-6 text-body-sm text-text-subtle">
          인쇄창에서 <b>대상을 &quot;PDF로 저장&quot;</b>, 여백은 <b>없음</b>,
          배경 그래픽은 <b>켜기</b>로 두면 그대로 나와요.
        </p>
        {deck.slides.map((s) => (
          <div key={s.id} className="print-page">
            <SlideView layout={s.layout} data={s.data} />
          </div>
        ))}
      </div>
    );
  }

  const slide = deck.slides[index];

  return (
    <div
      className="relative h-dvh w-screen overflow-hidden bg-black"
      onMouseMove={nudgeUi}
      style={{ cursor: uiVisible ? "default" : "none" }}
    >
      {/* 슬라이드만 화면 가운데. 좌우 남는 자리는 검은 여백이라 진짜 발표 화면 같아요 */}
      <SlideStage
        layout={slide.layout}
        data={slide.data}
        className="h-full w-full"
        rounded={false}
      />

      {/* 화면 절반씩 눌러 넘겨요 — PPT처럼요 */}
      <button
        aria-label="이전 슬라이드"
        onClick={() => go(-1)}
        className="absolute inset-y-0 left-0 w-1/2 cursor-[inherit]"
        tabIndex={-1}
      />
      <button
        aria-label="다음 슬라이드"
        onClick={() => go(1)}
        className="absolute inset-y-0 right-0 w-1/2 cursor-[inherit]"
        tabIndex={-1}
      />

      {/* 시작 힌트 — 잠깐 떴다가 사라져요. 관객 앞에서 오래 보이지 않아요 */}
      <div
        className={`pointer-events-none absolute top-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-body-sm text-white/90 transition-opacity duration-500 ${
          hint ? "opacity-100" : "opacity-0"
        }`}
      >
        ESC로 편집으로 돌아가요 · 방향키·클릭으로 넘겨요
      </div>

      {/* 발표자 노트 — N으로 켜고 꺼요 */}
      {showNotes && slide.notes ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-black/80 px-8 py-5 text-body leading-relaxed whitespace-pre-wrap text-white/90">
          {slide.notes}
        </div>
      ) : null}

      {/* 자동으로 숨는 컨트롤 막대 */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent px-6 pt-10 pb-4 text-body-sm text-white/80 transition-opacity duration-300 ${
          uiVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button onClick={exit} className="transition-colors hover:text-white">
          나가기
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => go(-1)}
            disabled={index === 0}
            className="px-2 text-h3 transition-colors hover:text-white disabled:opacity-30"
          >
            ‹
          </button>
          <span className="tabular-nums">
            {index + 1} / {total}
          </span>
          <button
            onClick={() => go(1)}
            disabled={index === total - 1}
            className="px-2 text-h3 transition-colors hover:text-white disabled:opacity-30"
          >
            ›
          </button>
        </div>
        <div className="flex items-center gap-4">
          {slide.notes ? (
            <button
              onClick={() => setShowNotes((v) => !v)}
              className={`transition-colors hover:text-white ${showNotes ? "text-white" : ""}`}
            >
              노트
            </button>
          ) : null}
          <button
            onClick={toggleFullscreen}
            className="transition-colors hover:text-white"
          >
            전체화면
          </button>
        </div>
      </div>
    </div>
  );
}
