"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PRESETS } from "@/entities/deck/presets";
import { getLayout } from "@/entities/slide/layouts";
import { createDeck, createSlide } from "@/entities/deck/deck";
import { deleteDeck, listDecks, saveDeck } from "@/entities/deck/storage";
import type { Deck } from "@/entities/deck/types";
import { SlideStage } from "@/entities/slide/SlideStage";
import { Card } from "@/shared/ui/Card";
import { cn, focusRing } from "@/shared/lib/cn";
import { SiteHeader } from "@/widgets/SiteHeader";
import { SiteFooter } from "@/widgets/SiteFooter";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { toast } from "@/shared/ui/Toast";

export default function Home() {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[] | null>(null);
  const [pending, setPending] = useState<Deck | null>(null);

  useEffect(() => {
    // localStorage는 클라이언트에서만 읽어요 — 마운트 후 목록을 채워요.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDecks(listDecks());
  }, []);

  const start = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId)!;
    const deck = createDeck(
      preset.id === "blank" ? "이름 없는 덱" : preset.name,
      preset.slides.map((s) => createSlide(s.layout, s.data)),
    );
    saveDeck(deck);
    router.push(`/e/${deck.id}`);
  };

  const confirmDelete = () => {
    if (!pending) return;
    try {
      deleteDeck(pending.id);
      setDecks(listDecks());
      toast(`‘${pending.title}’ 덱을 삭제했어요`);
    } catch {
      toast("삭제하지 못했어요. 다시 시도해 주세요", "error");
    }
  };

  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <section className="mb-16">
          <h1 className="mb-6 text-h1 text-text">템플릿을 선택해 주세요</h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRESETS.map((preset) => {
              const first = preset.slides[0];
              const layout = getLayout(first.layout);
              return (
                <button
                  key={preset.id}
                  onClick={() => start(preset.id)}
                  className="group overflow-hidden rounded-lg border border-border bg-bg text-left transition-colors hover:border-brand"
                >
                  {/* 첫 슬라이드 미리보기로 어떤 틀인지 한눈에 보여줘요 */}
                  <SlideStage
                    layout={first.layout}
                    data={{ ...layout.sample, ...first.data }}
                    rounded={false}
                    className="aspect-video w-full border-b border-border bg-surface"
                  />
                  <div className="flex items-baseline justify-between gap-2 p-4">
                    <p className="text-h3 text-text group-hover:text-brand">
                      {preset.name}
                    </p>
                    <span className="flex-none text-caption text-text-subtle">
                      {preset.slides.length}장
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-h2 text-text">내 슬라이드</h2>
          {decks === null ? null : decks.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border py-12 text-center text-body-sm text-text-subtle">
              아직 만든 덱이 없어요. 위에서 하나 골라 시작해 보세요.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {decks.map((deck) => (
                <Card key={deck.id} className="overflow-hidden p-0">
                  <Link href={`/e/${deck.id}`}>
                    <SlideStage
                      layout={deck.slides[0]?.layout ?? "cover"}
                      data={deck.slides[0]?.data ?? {}}
                      rounded={false}
                      className="aspect-video w-full bg-surface"
                    />
                  </Link>
                  <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-body-sm font-semibold text-text">
                        {deck.title}
                      </p>
                      <p className="text-caption text-text-subtle">
                        {deck.slides.length}장 ·{" "}
                        {new Date(deck.updatedAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <div className="flex flex-none items-center gap-1.5">
                      {/* 재생 아이콘 + 라벨로 '누르는 버튼'임을 분명히 해요 */}
                      <Link
                        href={`/d/${deck.id}`}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-md border border-brand bg-bg px-3 py-1.5 text-body-sm font-semibold text-brand transition-colors hover:bg-brand-soft",
                          focusRing,
                        )}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        발표
                      </Link>
                      <button
                        onClick={() => setPending(deck)}
                        aria-label={`${deck.title} 삭제`}
                        className={cn(
                          "rounded-md border border-border p-2 text-text-subtle transition-colors hover:border-danger hover:text-danger",
                          focusRing,
                        )}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </ul>
          )}
        </section>
      </main>

      <SiteFooter />

      {pending ? (
        <ConfirmDialog
          title="이 덱을 삭제할까요?"
          description={`‘${pending.title}’이(가) 지워져요. 되돌릴 수 없어요.`}
          onConfirm={confirmDelete}
          onClose={() => setPending(null)}
        />
      ) : null}
    </>
  );
}
