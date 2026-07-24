import { Wordmark } from "@/shared/ui/Wordmark";

/**
 * 사이트 상단 고정 헤더예요. 워드마크만 두고 군더더기는 뺐어요.
 * right에 노드를 주면 오른쪽에 넣을 수 있어요(홈에서는 비워 둡니다).
 */
export function SiteHeader({ right }: { right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
        <Wordmark href="/" size="md" />
        {right ? <div className="flex items-center gap-3">{right}</div> : null}
      </div>
    </header>
  );
}
