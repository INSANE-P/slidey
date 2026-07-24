import { TextLink } from "@/shared/ui/TextLink";

/** 페이지 맨 아래 푸터. 소개 한 줄과 채널 링크만 조용히 둬요. */
export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/slidey-wordmark.svg"
          alt="Slidey"
          className="h-6 w-auto self-start"
        />
        <p className="text-body-sm text-text-subtle">
          그리디 디자인 틀로 발표 자료를 만들고, 발표하고, 내려받아요.
        </p>
        <div className="flex gap-5">
          <TextLink variant="quiet" href="https://github.com/greedy-team" target="_blank">
            GitHub
          </TextLink>
          <TextLink
            variant="quiet"
            href="https://instagram.com/sejong_greedy"
            target="_blank"
          >
            Instagram
          </TextLink>
          <TextLink variant="quiet" href="mailto:sejonggreedy@gmail.com">
            문의하기
          </TextLink>
        </div>
        <p className="text-caption text-text-subtle">© 2026 Greedy</p>
      </div>
    </footer>
  );
}
