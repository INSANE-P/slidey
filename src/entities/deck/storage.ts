"use client";

import type { Deck } from "@/entities/deck/types";

/**
 * 지금은 브라우저에만 저장해요. 공유 링크를 붙일 때 이 파일의 함수만
 * Supabase 호출로 바꾸면 되고, 화면 코드는 건드리지 않아도 됩니다.
 */
const KEY = "greedy-deck:decks";

const readAll = (): Record<string, Deck> => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
};

const writeAll = (decks: Record<string, Deck>) => {
  window.localStorage.setItem(KEY, JSON.stringify(decks));
};

export const listDecks = (): Deck[] =>
  Object.values(readAll()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );

export const getDeck = (id: string): Deck | null => readAll()[id] ?? null;

export const saveDeck = (deck: Deck) => {
  const all = readAll();
  all[deck.id] = { ...deck, updatedAt: new Date().toISOString() };
  writeAll(all);
};

export const deleteDeck = (id: string) => {
  const all = readAll();
  delete all[id];
  writeAll(all);
};
