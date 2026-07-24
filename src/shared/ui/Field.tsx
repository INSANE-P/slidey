import { cn, focusRing } from "@/shared/lib/cn";

/*
 * 입력 요소의 공통 룩이에요. input·textarea·select를
 * 같은 톤(라운드 8, border, 브랜드 포커스)으로 맞춰요.
 */
export const fieldBase = cn(
  "w-full rounded-sm border border-border bg-bg px-3 text-body-sm text-text transition-colors",
  "placeholder:text-text-subtle focus:border-brand",
  "disabled:bg-gray-100 disabled:text-disabled",
  focusRing,
);

type BaseProps = { invalid?: boolean };

export function TextField({
  invalid,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & BaseProps) {
  return (
    <input
      className={cn(fieldBase, "h-10", invalid && "border-danger", className)}
      {...props}
    />
  );
}

export function TextArea({
  invalid,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & BaseProps) {
  return (
    <textarea
      className={cn(
        fieldBase,
        "min-h-24 resize-y py-2 leading-relaxed",
        invalid && "border-danger",
        className,
      )}
      {...props}
    />
  );
}

export function SelectField({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, "h-10", className)} {...props}>
      {children}
    </select>
  );
}
