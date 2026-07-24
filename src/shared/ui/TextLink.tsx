import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, focusRing } from "@/shared/lib/cn";

const textLinkVariants = cva(
  cn("inline-flex items-center gap-1 rounded-sm font-semibold transition-colors", focusRing),
  {
    variants: {
      variant: {
        /** 제안하는 이동. 브랜드색 */
        action: "text-brand hover:text-green-700",
        /** 조용한 이동. 무채색 */
        quiet: "text-text-subtle hover:text-text",
      },
      size: {
        sm: "text-caption",
        md: "text-body-sm",
      },
    },
    defaultVariants: { variant: "action", size: "sm" },
  },
);

type TextLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof textLinkVariants>;

export function TextLink({ className, variant, size, ...props }: TextLinkProps) {
  return (
    <Link
      className={cn(textLinkVariants({ variant, size }), className)}
      {...props}
    />
  );
}
