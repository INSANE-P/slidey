"use client";

import { useEffect, useRef, useState } from "react";
import type { SlideData } from "@/entities/slide/types";
import { CANVAS } from "@/entities/slide/SlideFrame";
import { SlideView } from "@/entities/slide/SlideView";

/**
 * 1280x720 슬라이드를 담는 그릇 크기에 맞춰 통째로 줄여요.
 * 안쪽은 언제나 원본 좌표라서 미리보기·발표·인쇄가 전부 같은 그림입니다.
 */
export function SlideStage({
  layout,
  data,
  className = "",
  rounded = true,
}: {
  layout: string;
  data: SlideData;
  className?: string;
  rounded?: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const fit = () => {
      const { width, height } = box.getBoundingClientRect();
      if (!width || !height) return;
      setScale(Math.min(width / CANVAS.w, height / CANVAS.h));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      className={`flex items-center justify-center overflow-hidden ${className}`}
    >
      <div
        style={{
          width: CANVAS.w * scale,
          height: CANVAS.h * scale,
          // 축소 전에는 빈 화면을 보여줘서 큰 슬라이드가 번쩍하지 않게 해요
          visibility: scale ? "visible" : "hidden",
        }}
        className={rounded ? "overflow-hidden rounded-[6px]" : ""}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <SlideView layout={layout} data={data} />
        </div>
      </div>
    </div>
  );
}
