import type { SlideData } from "@/entities/slide/types";

/** 슬라이드 한 장 = 어떤 레이아웃(layout)에 어떤 값(data)을 담았는지. */
export interface Slide {
  id: string;
  layout: string;
  data: SlideData;
  notes?: string;
}

/** 덱 = 제목 + 슬라이드 묶음. */
export interface Deck {
  id: string;
  title: string;
  slides: Slide[];
  updatedAt: string;
}
