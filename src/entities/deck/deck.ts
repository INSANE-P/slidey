import { getLayout } from "@/entities/slide/layouts";
import type { Deck, Slide } from "@/entities/deck/types";
import type { SlideData } from "@/entities/slide/types";

export const newId = () =>
  Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

/** 레이아웃 기본값을 복제해서 새 슬라이드를 만들어요. */
export function createSlide(layoutId: string, override: SlideData = {}): Slide {
  const layout = getLayout(layoutId);
  return {
    id: newId(),
    layout: layout.id,
    data: structuredClone({ ...layout.sample, ...override }),
    notes: "",
  };
}

export function createDeck(title: string, slides: Slide[]): Deck {
  return {
    id: newId(),
    title,
    slides,
    updatedAt: new Date().toISOString(),
  };
}

export function moveSlide(slides: Slide[], from: number, to: number): Slide[] {
  if (to < 0 || to >= slides.length) return slides;
  const next = [...slides];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
