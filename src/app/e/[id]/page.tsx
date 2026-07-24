"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getLayout } from "@/entities/slide/layouts";
import { createSlide, moveSlide, newId } from "@/entities/deck/deck";
import { getDeck, saveDeck } from "@/entities/deck/storage";
import type { Deck } from "@/entities/deck/types";
import { SlideStage } from "@/entities/slide/SlideStage";
import { SlideForm } from "@/features/editor/SlideForm";
import { LayoutPicker } from "@/features/editor/LayoutPicker";
import { downloadPptx } from "@/features/export/exportPptx";
import { Button } from "@/shared/ui/Button";
import { TextArea } from "@/shared/ui/Field";
import { Wordmark } from "@/shared/ui/Wordmark";
import { toast } from "@/shared/ui/Toast";

type PickerMode = "add" | "change" | null;

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [missing, setMissing] = useState(false);
  const [index, setIndex] = useState(0);
  const [picker, setPicker] = useState<PickerMode>(null);
  const [dirty, setDirty] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  // 저장은 사용자가 원할 때만 해요. 최신 값은 ref로 들고 있어서 단축키에서도 정확히 저장돼요.
  const deckRef = useRef<Deck | null>(null);
  const dirtyRef = useRef(false);
  useEffect(() => {
    deckRef.current = deck;
    dirtyRef.current = dirty;
  });

  useEffect(() => {
    // localStorage는 클라이언트에서만 읽어요 — SSR 하이드레이션 불일치를 피하려고 마운트 후 채워요.
    const found = getDeck(id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (found) setDeck(found);
    else setMissing(true);
  }, [id]);

  /** 편집하면 '저장 안 됨' 상태가 돼요. 실제 저장은 save()에서만 해요. */
  const update = useCallback((next: Deck) => {
    setDeck(next);
    setDirty(true);
  }, []);

  const save = useCallback((silent = false) => {
    const d = deckRef.current;
    if (!d) return;
    saveDeck(d);
    setDirty(false);
    if (!silent) toast("저장했어요");
  }, []);

  // 저장 안 한 채 나가려 하면 붙잡아요.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const slide = deck?.slides[index];
  const layout = useMemo(
    () => (slide ? getLayout(slide.layout) : null),
    [slide],
  );
  // 포스터처럼 PDF로만 내보내는 덱이면 PPTX·발표를 숨겨요.
  const pdfOnly = !!deck?.slides.every((s) => getLayout(s.layout).pdfOnly);

  // Ctrl/Cmd+S로 저장, 방향키로 슬라이드 이동(입력 중일 땐 건드리지 않아요).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
        return;
      }
      const el = document.activeElement;
      const typing =
        el instanceof HTMLElement &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable);
      if (typing) return;
      const len = deckRef.current?.slides.length ?? 1;
      if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      }
      if (["ArrowDown", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        setIndex((i) => Math.min(len - 1, i + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  /** 발표·PDF·PPTX로 가기 전에 먼저 저장해요. */
  const saveThen = (fn: () => void) => {
    save(true);
    fn();
  };

  if (missing) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-text-subtle">이 브라우저에 없는 슬라이드예요.</p>
        <Link href="/" className="font-semibold text-brand">
          홈으로 가기
        </Link>
      </main>
    );
  }
  if (!deck || !slide || !layout) return null;

  const setSlides = (slides: Deck["slides"]) => update({ ...deck, slides });

  const changeField = (key: string, value: unknown) =>
    setSlides(
      deck.slides.map((s, i) =>
        i === index ? { ...s, data: { ...s.data, [key]: value } } : s,
      ),
    );

  const addSlide = (layoutId: string) => {
    const next = [...deck.slides];
    next.splice(index + 1, 0, createSlide(layoutId));
    setSlides(next);
    setIndex(index + 1);
    setPicker(null);
  };

  const changeLayout = (layoutId: string) => {
    // 내용은 살리고 틀만 바꿔요. 새 틀에 없는 칸은 기본값으로 채워집니다.
    const fresh = createSlide(layoutId);
    setSlides(
      deck.slides.map((s, i) =>
        i === index
          ? { ...s, layout: layoutId, data: { ...fresh.data, ...s.data } }
          : s,
      ),
    );
    setPicker(null);
  };

  const duplicateSlide = () => {
    const copy = { ...slide!, id: newId(), data: structuredClone(slide!.data) };
    const next = [...deck.slides];
    next.splice(index + 1, 0, copy);
    setSlides(next);
    setIndex(index + 1);
  };

  const removeSlide = () => {
    if (deck.slides.length === 1) return;
    setSlides(deck.slides.filter((_, i) => i !== index));
    setIndex(Math.max(0, index - 1));
  };

  // 썸네일을 target 위치에 떨어뜨리면 순서가 바뀌고, 보고 있던 슬라이드를 계속 따라가요.
  const dropOn = (target: number) => {
    setDropTarget(null);
    if (dragIndex === null || dragIndex === target) return;
    setSlides(moveSlide(deck.slides, dragIndex, target));
    setIndex(target);
    setDragIndex(null);
  };

  return (
    // 데스크톱은 3단(썸네일·미리보기·폼), 모바일은 세로 스택(미리보기·썸네일 스트립·폼)으로 리플로우해요.
    <div className="flex h-dvh flex-col bg-surface lg:min-w-[1120px]">
      <header className="flex flex-none items-center gap-2 border-b border-border bg-bg px-3 py-2.5 sm:gap-3 sm:px-4">
        <Wordmark href="/" size="sm" className="flex-none" />
        <input
          value={deck.title}
          onChange={(e) => update({ ...deck, title: e.target.value })}
          className="min-w-0 flex-1 rounded-sm px-2 py-1.5 text-body-sm font-semibold text-text outline-none transition-colors hover:bg-surface focus:bg-surface"
        />
        <div className="flex flex-none items-center gap-1.5 sm:gap-3">
          {/* 저장 상태 텍스트는 좁은 화면에선 숨기고 버튼만 남겨요 */}
          <span className="hidden text-caption text-text-subtle sm:inline">
            {dirty ? "저장 안 됨" : "저장됨"}
          </span>
          <Button
            variant={dirty ? "primary" : "ghost"}
            size="sm"
            onClick={() => save()}
            disabled={!dirty}
          >
            저장
          </Button>
          <span className="hidden h-5 w-px bg-border sm:block" />
          {pdfOnly ? null : (
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => saveThen(() => downloadPptx(deck))}
            >
              PPTX
            </Button>
          )}
          <Button
            variant={pdfOnly ? "primary" : "ghost"}
            size="sm"
            onClick={() => saveThen(() => router.push(`/d/${deck.id}?print=1`))}
          >
            PDF
          </Button>
          {pdfOnly ? null : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => saveThen(() => router.push(`/d/${deck.id}`))}
            >
              발표
            </Button>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* 썸네일 — 모바일은 가로 스트립(미리보기 아래), 데스크톱은 왼쪽 세로 목록 */}
        <nav className="order-2 flex flex-none gap-2 overflow-x-auto border-t border-border bg-bg p-3 lg:order-1 lg:w-[184px] lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:border-t-0 lg:border-r">
          {deck.slides.map((s, i) => (
            <div key={s.id} className="relative w-28 flex-none lg:w-auto">
              {/* 끌어다 놓을 위치를 미리 보여주는 삽입 선(데스크톱 드래그) */}
              {dragIndex !== null && dropTarget === i && dragIndex !== i ? (
                <div className="pointer-events-none absolute -top-1 left-4 right-0 z-10 hidden items-center gap-1 lg:flex">
                  <span className="size-2 rounded-full bg-brand" />
                  <span className="h-[3px] flex-1 rounded-full bg-brand" />
                </div>
              ) : null}
              <div
                // PPT처럼 썸네일을 잡아 끌어 순서를 바꿔요(데스크톱)
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDropTarget(i);
                }}
                onDrop={() => dropOn(i)}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDropTarget(null);
                }}
                onClick={() => setIndex(i)}
                className={`flex items-start gap-2 rounded-sm text-left transition lg:cursor-grab lg:active:cursor-grabbing ${
                  i === index ? "ring-2 ring-brand" : "hover:opacity-80"
                } ${dragIndex === i ? "opacity-40" : ""}`}
              >
                <span className="hidden w-4 flex-none pt-1 text-caption text-text-subtle lg:block">
                  {i + 1}
                </span>
                <SlideStage
                  layout={s.layout}
                  data={s.data}
                  className="pointer-events-none aspect-video flex-1 rounded-sm border border-border bg-bg"
                  rounded={false}
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => setPicker("add")}
            className="w-28 flex-none rounded-sm border border-dashed border-border py-3 text-body-sm font-medium text-text-subtle transition-colors hover:border-brand hover:text-brand lg:w-auto"
          >
            + 슬라이드
          </button>
        </nav>

        {/* 미리보기 — 모바일은 상단 고정(16:9), 데스크톱은 가운데를 채워요 */}
        <main className="order-1 flex flex-none flex-col lg:order-2 lg:min-w-0 lg:flex-1">
          <div className="flex flex-none items-center justify-between border-b border-border px-4 py-2.5 sm:px-5">
            <span className="text-body-sm font-semibold text-text">
              슬라이드 {index + 1}
              <span className="font-normal text-text-subtle"> / {deck.slides.length}</span>
            </span>
            <div className="flex items-center gap-1">
              <span className="mr-1 hidden text-caption text-text-subtle lg:inline">
                썸네일을 끌어 순서를 바꿔요
              </span>
              <ToolbarButton onClick={duplicateSlide}>복제</ToolbarButton>
              <ToolbarButton
                onClick={removeSlide}
                disabled={deck.slides.length === 1}
                danger
              >
                삭제
              </ToolbarButton>
            </div>
          </div>
          <div className="flex aspect-video w-full items-center justify-center p-3 lg:aspect-auto lg:min-h-0 lg:flex-1 lg:p-6">
            <SlideStage
              layout={slide.layout}
              data={slide.data}
              className="h-full w-full"
            />
          </div>
        </main>

        {/* 폼 — 모바일은 아래에서 남은 공간을 채우며 스크롤, 데스크톱은 오른쪽 사이드바 */}
        <aside className="order-3 flex min-h-0 flex-1 flex-col overflow-y-auto border-t border-border bg-bg lg:flex-none lg:border-t-0 lg:border-l lg:w-[400px]">
          <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3.5">
            <div className="min-w-0">
              <p className="text-body-sm font-bold text-text">{layout.name}</p>
              <p className="truncate text-caption text-text-subtle">
                {layout.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPicker("change")}
            >
              틀 바꾸기
            </Button>
          </div>

          <div className="px-5 py-5">
            <SlideForm
              fields={layout.fields}
              data={slide.data}
              onChange={changeField}
            />

            <div className="mt-6 border-t border-border pt-5">
              <p className="mb-1.5 text-body-sm font-semibold text-text">
                발표자 노트
                <span className="ml-1.5 text-caption font-normal text-text-subtle">
                  슬라이드엔 안 나와요
                </span>
              </p>
              <TextArea
                value={slide.notes ?? ""}
                onChange={(e) =>
                  setSlides(
                    deck.slides.map((s, i) =>
                      i === index ? { ...s, notes: e.target.value } : s,
                    ),
                  )
                }
                placeholder="발표할 때 볼 메모예요."
              />
            </div>
          </div>
        </aside>
      </div>

      {picker ? (
        <LayoutPicker
          current={picker === "change" ? slide.layout : undefined}
          onPick={picker === "add" ? addSlide : changeLayout}
          onClose={() => setPicker(null)}
        />
      ) : null}
    </div>
  );
}

/** 슬라이드 조작 막대의 작은 텍스트 버튼 */
function ToolbarButton({
  onClick,
  disabled,
  danger,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-sm px-2.5 py-1.5 text-body-sm font-medium transition-colors disabled:opacity-30 ${
        danger
          ? "text-text-subtle hover:text-danger"
          : "text-text-subtle hover:bg-surface hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}
