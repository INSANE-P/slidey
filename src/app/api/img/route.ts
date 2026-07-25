/*
 * 외부 URL 사진을 같은 출처로 중계해요.
 * PPTX로 내보낼 땐 브라우저가 이미지를 직접 받아 파일에 넣는데,
 * 다른 도메인 사진은 CORS에 막혀 내보내기 전체가 실패해요.
 * 서버가 대신 받아 그대로 돌려주면 CORS 없이 사진을 담을 수 있어요.
 */

export const runtime = "nodejs";

/** 너무 큰 파일은 받지 않아요. 발표용 사진엔 충분한 크기예요. */
const MAX_BYTES = 15 * 1024 * 1024;

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) return new Response("missing url", { status: 400 });

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return new Response("bad url", { status: 400 });
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return new Response("only http(s)", { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, { headers: { accept: "image/*" } });
  } catch {
    return new Response("fetch failed", { status: 502 });
  }

  const type = upstream.headers.get("content-type") ?? "";
  if (!upstream.ok || !type.startsWith("image/")) {
    return new Response("not an image", { status: 415 });
  }

  const body = await upstream.arrayBuffer();
  if (body.byteLength > MAX_BYTES) {
    return new Response("too large", { status: 413 });
  }

  return new Response(body, {
    headers: {
      "content-type": type,
      // 같은 사진을 여러 번 내보낼 수 있으니 하루 캐시해요.
      "cache-control": "public, max-age=86400",
    },
  });
}
