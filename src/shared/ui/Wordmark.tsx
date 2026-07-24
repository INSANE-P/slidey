import Link from "next/link";
import { cn } from "@/shared/lib/cn";

/**
 * Slidey 로고예요. GREEDY 워드마크 같은 위트 있는 손글씨체로 그린
 * 하나의 SVG(public/slidey-wordmark.svg)를 씁니다.
 * href를 주면 클릭하면 홈으로 가는 링크가 됩니다.
 */
export function Wordmark({
  href,
  className,
  size = "md",
}: {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const height = { sm: "h-5", md: "h-6", lg: "h-8" }[size];

  const content = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/slidey-wordmark.svg"
      alt="Slidey"
      className={cn(height, "w-auto select-none", className)}
      draggable={false}
    />
  );

  if (href) {
    return (
      <Link href={href} aria-label="그리디 Slides 홈" className="inline-flex">
        {content}
      </Link>
    );
  }
  return content;
}
