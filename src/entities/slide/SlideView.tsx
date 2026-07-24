import type { ComponentType } from "react";
import type { SlideData, SlideProps } from "@/entities/slide/types";
import {
  Closing,
  Cover,
  Quote,
  Section,
  TeamDivider,
} from "@/entities/slide/layouts/coverSlides";
import {
  Code,
  Compare,
  Content,
  ImageFull,
  Split,
} from "@/entities/slide/layouts/contentSlides";
import {
  Agenda,
  AvatarGrid,
  People,
  Points,
} from "@/entities/slide/layouts/peopleSlides";
import { Stats, TableSlide, Timeline } from "@/entities/slide/layouts/dataSlides";

/** 레이아웃 id → 그리는 컴포넌트. lib/layouts.ts의 id와 짝을 맞춰요. */
export const SLIDE_COMPONENTS: Record<string, ComponentType<SlideProps>> = {
  cover: Cover,
  teamDivider: TeamDivider,
  section: Section,
  quote: Quote,
  closing: Closing,
  content: Content,
  split: Split,
  imageFull: ImageFull,
  compare: Compare,
  code: Code,
  people: People,
  avatarGrid: AvatarGrid,
  agenda: Agenda,
  points: Points,
  table: TableSlide,
  stats: Stats,
  timeline: Timeline,
};

/** 레이아웃 id와 값을 받아 해당 슬라이드를 그려요. */
export function SlideView({
  layout,
  data,
}: {
  layout: string;
  data: SlideData;
}) {
  const Component = SLIDE_COMPONENTS[layout] ?? Content;
  return <Component data={data} />;
}
