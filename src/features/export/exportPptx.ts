"use client";

import type PptxGenJSType from "pptxgenjs";
import { asItems, asLines, asTable, asText } from "@/entities/slide/types";
import type { Deck, Slide } from "@/entities/deck/types";
import { qrModules } from "@/entities/slide/qr";

/*
 * 웹 슬라이드는 1280x720px, PowerPoint 슬라이드는 13.333x7.5in이에요.
 * 96px = 1in 이라 좌표가 1:1로 떨어집니다. 그래서 화면과 파일이 어긋나지 않아요.
 */
const inch = (px: number) => px / 96;
/** 96px/in 화면과 72pt/in 활자 사이의 환산 */
const pt = (px: number) => Math.round(px * 0.75);

const GREEN = "007355";
const DEEP = "005B44";
const MINT = "D9EAD3";
const INK = "272525";
const MUTED = "595959";
const WHITE = "FFFFFF";

/** PowerPoint가 어느 PC에서나 갖고 있는 한글 글꼴이에요. */
const FACE = "맑은 고딕";

const PAD = 64;

type Pptx = InstanceType<typeof PptxGenJSType>;
type PptxSlide = ReturnType<Pptx["addSlide"]>;

/** 이미지 dataURL을 pptxgenjs가 받는 모양으로 다듬어요. */
const imageData = (src: string) =>
  src.startsWith("data:") ? src.slice("data:".length) : undefined;

function addImageAt(
  slide: PptxSlide,
  src: string,
  box: { x: number; y: number; w: number; h: number },
  round = false,
) {
  const frame = {
    x: inch(box.x),
    y: inch(box.y),
    w: inch(box.w),
    h: inch(box.h),
  };

  if (!src) {
    // 사진이 비면 화면과 똑같이 자리만 남겨요.
    slide.addShape("roundRect", {
      ...frame,
      fill: { color: MINT },
      line: { color: MINT },
      rectRadius: 0.06,
    });
    return;
  }

  const opts = {
    ...frame,
    // 원본 비율이 달라도 상자를 꽉 채우도록 잘라요. 화면 object-cover와 같습니다.
    sizing: { type: "cover" as const, w: frame.w, h: frame.h },
    ...(round ? { rounding: true } : {}),
  };

  const data = imageData(src);
  if (data) slide.addImage({ ...opts, data });
  else slide.addImage({ ...opts, path: src });
}

/** 주소를 QR PNG(데이터)로 그려요. 내보내기는 브라우저에서 돌아서 canvas를 쓸 수 있어요. */
function qrPngData(url: string, px: number): string {
  const modules = qrModules(url);
  const n = modules.length;
  const canvas = document.createElement("canvas");
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, px, px);
  ctx.fillStyle = "#000000";
  const cell = px / n;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (modules[r][c]) {
        ctx.fillRect(
          Math.floor(c * cell),
          Math.floor(r * cell),
          Math.ceil(cell),
          Math.ceil(cell),
        );
      }
    }
  }
  return canvas.toDataURL("image/png").slice("data:".length);
}

/** 여러 줄을 문단으로 넣어요. pptxgenjs는 마지막 줄만 breakLine이 없어야 합니다. */
const paragraphs = (lines: string[]) =>
  lines.map((text, i) => ({
    text,
    options: { breakLine: i < lines.length - 1 },
  }));

/** 줄 앞의 "- "/"• "를 머리 기호로 봐요 (화면 BodyLines와 같은 규칙). */
const MARK = /^[-•]\s+/;

/**
 * 본문 줄을 pptxgenjs 문단 배열로. 줄별 "- "면 그 줄만 점, 안 붙으면 소제목(볼드).
 * 대시가 없으면 bullet(dot·number·none)을 줄 전체에 적용해요(하위 호환).
 */
function bodyParagraphs(value: unknown, bullet: string) {
  const raw = asLines(value);
  const perLine = raw.some((l) => MARK.test(l));
  return raw.map((line, i) => {
    const marked = MARK.test(line);
    const text = marked ? line.replace(MARK, "") : line;
    const bulleted = perLine ? marked : bullet !== "none";
    const isHeader = perLine && !marked;
    const numbered = bulleted && !perLine && bullet === "number";
    return {
      text,
      options: {
        breakLine: i < raw.length - 1,
        bold: isHeader ? true : undefined,
        color: isHeader ? INK : MUTED,
        bullet: bulleted
          ? numbered
            ? ({ type: "number" } as const)
            : true
          : false,
      },
    };
  });
}

function greenBackground(slide: PptxSlide) {
  slide.background = { color: GREEN };
}

/** 원본 PPT처럼 슬라이드 코너에 그리디 엠블럼을 얹어요. */
function addLogo(
  slide: PptxSlide,
  logo: string,
  where: "top" | "bottom",
  size = 128,
) {
  slide.addImage({
    data: logo,
    x: inch(where === "top" ? 1280 - 24 - size : 1280 - 16 - size),
    y: inch(where === "top" ? 20 : 720 - 16 - size),
    w: inch(size),
    h: inch(size),
  });
}

/** 흰 배경 본문 슬라이드의 제목·그린 라인·엠블럼 */
function whiteHeader(
  slide: PptxSlide,
  logo: string,
  title: string,
  badge?: string,
) {
  addLogo(slide, logo, "top");

  // 화면(SlideFrame)과 같은 좌표: 제목 왼쪽 48, 라인 왼쪽 24, 라인 두께 10.
  if (badge) {
    slide.addText(badge, {
      x: inch(48),
      y: inch(26),
      w: inch(320),
      h: inch(34),
      fontFace: FACE,
      fontSize: pt(20),
      bold: true,
      color: DEEP,
      fill: { color: MINT },
      align: "left",
      margin: 8,
    });
  }

  if (title) {
    slide.addText(title, {
      x: inch(48),
      y: inch(badge ? 78 : 20),
      // 제목은 오른쪽 위 엠블럼을 피해서 끝나요 (frame.tsx의 RULE_RIGHT와 같음)
      w: inch(1280 - 48 - 190),
      h: inch(92),
      fontFace: FACE,
      fontSize: pt(68),
      bold: true,
      color: INK,
      align: "left",
      valign: "middle",
      margin: 0,
    });
  }

  slide.addShape("rect", {
    x: inch(24),
    y: inch(badge ? 164 : 122),
    w: inch(1280 - 24 - 190),
    h: inch(10),
    fill: { color: GREEN },
    line: { color: GREEN },
  });
}

const contentBox = (badge?: string) => ({
  x: inch(48),
  y: inch(badge ? 206 : 176),
  w: inch(1280 - 48 - PAD),
  h: inch(720 - (badge ? 206 : 176) - 52),
});

function bodyText(
  slide: PptxSlide,
  value: unknown,
  badge?: string,
  bullet = "none",
) {
  const paras = bodyParagraphs(value, bullet);
  if (!paras.length) return;

  slide.addText(paras, {
    ...contentBox(badge),
    fontFace: FACE,
    fontSize: pt(26),
    color: MUTED,
    lineSpacingMultiple: 1.45,
    paraSpaceAfter: 8,
    margin: 0,
    valign: "top",
  });
}

function renderSlide(pptx: Pptx, slide: Slide, logo: string) {
  const s = pptx.addSlide();
  const d = slide.data;
  const title = asText(d.title);

  if (slide.notes) s.addNotes(slide.notes);

  switch (slide.layout) {
    case "cover": {
      greenBackground(s);
      s.addText(title, {
        x: inch(PAD),
        y: inch(196),
        w: inch(1280 - PAD * 2),
        h: inch(96),
        fontFace: FACE,
        fontSize: pt(76),
        bold: true,
        color: WHITE,
        align: "center",
        margin: 0,
      });
      if (asText(d.subtitle)) {
        s.addText(asText(d.subtitle), {
          x: inch(PAD),
          y: inch(296),
          w: inch(1280 - PAD * 2),
          h: inch(38),
          fontFace: FACE,
          fontSize: pt(28),
          color: WHITE,
          align: "center",
          margin: 0,
        });
      }
      s.addShape("rect", {
        x: inch(24),
        y: inch(338),
        w: inch(1232),
        h: inch(6),
        fill: { color: WHITE },
        line: { color: WHITE },
      });
      const meta = asLines(d.meta);
      if (meta.length) {
        s.addText(paragraphs(meta), {
          x: inch(600),
          y: inch(376),
          w: inch(624),
          h: inch(140),
          fontFace: FACE,
          fontSize: pt(28),
          bold: true,
          color: WHITE,
          align: "right",
          valign: "top",
          paraSpaceAfter: 6,
          margin: 0,
        });
      }
      addLogo(s, logo, "bottom", 200);
      break;
    }

    case "teamDivider": {
      addLogo(s, logo, "top");
      // 위아래 그린 라인 사이에 팀 이름만
      for (const y of [276, 438]) {
        s.addShape("rect", {
          x: 0,
          y: inch(y),
          w: inch(1280),
          h: inch(6),
          fill: { color: GREEN },
          line: { color: GREEN },
        });
      }
      s.addText(title, {
        x: inch(80),
        y: inch(282),
        w: inch(1120),
        h: inch(156),
        fontFace: FACE,
        fontSize: pt(80),
        bold: true,
        color: INK,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      if (asText(d.subtitle)) {
        s.addText(asText(d.subtitle), {
          x: inch(80),
          y: inch(462),
          w: inch(1120),
          h: inch(40),
          fontFace: FACE,
          fontSize: pt(26),
          color: MUTED,
          align: "center",
          margin: 0,
        });
      }
      break;
    }

    case "section": {
      // 원본 간지: 흰 배경 + 위아래 굵은 그린 라인 + 검은 중앙 제목 + 우상단 엠블럼
      addLogo(s, logo, "top");
      for (const y of [268, 446]) {
        s.addShape("rect", {
          x: 0,
          y: inch(y),
          w: inch(1280),
          h: inch(10),
          fill: { color: GREEN },
          line: { color: GREEN },
        });
      }
      s.addText(title, {
        x: inch(80),
        y: inch(274),
        w: inch(1120),
        h: inch(172),
        fontFace: FACE,
        fontSize: pt(88),
        bold: true,
        color: INK,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      if (asText(d.subtitle)) {
        s.addText(asText(d.subtitle), {
          x: inch(80),
          y: inch(468),
          w: inch(1120),
          h: inch(40),
          fontFace: FACE,
          fontSize: pt(28),
          color: MUTED,
          align: "center",
          margin: 0,
        });
      }
      break;
    }

    case "quote": {
      greenBackground(s);
      s.addText(asText(d.quote), {
        x: inch(120),
        y: inch(230),
        w: inch(1040),
        h: inch(180),
        fontFace: FACE,
        fontSize: pt(52),
        bold: true,
        color: WHITE,
        align: "center",
        valign: "middle",
        lineSpacingMultiple: 1.4,
        margin: 0,
      });
      if (asText(d.author)) {
        s.addText(asText(d.author), {
          x: inch(120),
          y: inch(430),
          w: inch(1040),
          h: inch(36),
          fontFace: FACE,
          fontSize: pt(26),
          color: WHITE,
          align: "center",
          margin: 0,
        });
      }
      // 선언형 슬라이드라 엠블럼 없음
      break;
    }

    case "closing": {
      greenBackground(s);
      s.addText(title, {
        x: inch(80),
        y: inch(240),
        w: inch(1120),
        h: inch(100),
        fontFace: FACE,
        fontSize: pt(72),
        bold: true,
        color: WHITE,
        align: "center",
        margin: 0,
      });
      if (asText(d.subtitle)) {
        s.addText(asText(d.subtitle), {
          x: inch(80),
          y: inch(348),
          w: inch(1120),
          h: inch(40),
          fontFace: FACE,
          fontSize: pt(28),
          color: WHITE,
          align: "center",
          margin: 0,
        });
      }
      addLogo(s, logo, "bottom", 200);
      break;
    }

    case "split": {
      const badge = asText(d.badge);
      whiteHeader(s, logo, title, badge);
      const box = contentBox(badge);
      const imageLeft = asText(d.imageSide) === "left";
      const textX = imageLeft ? PAD + 480 + 48 : PAD;
      const imageX = imageLeft ? PAD : 1280 - PAD - 480;

      s.addText(paragraphs(asLines(d.body)), {
        x: inch(textX),
        y: box.y,
        w: inch(1280 - PAD * 2 - 480 - 48),
        h: box.h,
        fontFace: FACE,
        fontSize: pt(26),
        color: MUTED,
        lineSpacingMultiple: 1.45,
        paraSpaceAfter: 8,
        valign: "top",
        margin: 0,
      });
      addImageAt(s, asText(d.image), {
        x: imageX,
        y: badge ? 194 : 168,
        w: 480,
        h: 336,
      });
      if (asText(d.caption)) {
        s.addText(asText(d.caption), {
          x: inch(imageX),
          y: inch((badge ? 194 : 168) + 346),
          w: inch(480),
          h: inch(28),
          fontFace: FACE,
          fontSize: pt(18),
          color: MUTED,
          margin: 0,
        });
      }
      break;
    }

    case "imageFull": {
      if (title) {
        whiteHeader(s, logo, title);
        addImageAt(s, asText(d.image), { x: PAD, y: 168, w: 1152, h: 440 });
      } else {
        addImageAt(s, asText(d.image), { x: 0, y: 0, w: 1280, h: 720 });
        addLogo(s, logo, "top");
      }
      if (asText(d.caption)) {
        s.addText(asText(d.caption), {
          x: inch(PAD),
          y: inch(title ? 618 : 640),
          w: inch(700),
          h: inch(32),
          fontFace: FACE,
          fontSize: pt(18),
          color: MUTED,
          margin: 0,
        });
      }
      break;
    }

    case "compare": {
      whiteHeader(s, logo, title);
      const columns = [
        { title: asText(d.leftTitle), body: d.leftBody, x: PAD },
        { title: asText(d.rightTitle), body: d.rightBody, x: PAD + 576 + 32 },
      ];
      const w = 1280 - PAD * 2 - 32;
      columns.forEach((col) => {
        s.addShape("roundRect", {
          x: inch(col.x),
          y: inch(168),
          w: inch(w / 2),
          h: inch(440),
          fill: { color: "EDF4EA" },
          line: { color: "EDF4EA" },
          rectRadius: 0.1,
        });
        s.addText(col.title, {
          x: inch(col.x + 32),
          y: inch(196),
          w: inch(w / 2 - 64),
          h: inch(44),
          fontFace: FACE,
          fontSize: pt(32),
          bold: true,
          color: DEEP,
          margin: 0,
        });
        s.addText(paragraphs(asLines(col.body)), {
          x: inch(col.x + 32),
          y: inch(256),
          w: inch(w / 2 - 64),
          h: inch(330),
          fontFace: FACE,
          fontSize: pt(23),
          color: MUTED,
          bullet: true,
          paraSpaceAfter: 6,
          valign: "top",
          margin: 0,
        });
      });
      break;
    }

    case "code": {
      whiteHeader(s, logo, title);
      const top = asText(d.description) ? 214 : 168;
      if (asText(d.description)) {
        s.addText(asText(d.description), {
          x: inch(PAD),
          y: inch(168),
          w: inch(1152),
          h: inch(34),
          fontFace: FACE,
          fontSize: pt(24),
          color: MUTED,
          margin: 0,
        });
      }
      s.addText(asText(d.code), {
        x: inch(PAD),
        y: inch(top),
        w: inch(1152),
        h: inch(664 - top),
        fontFace: "Consolas",
        fontSize: pt(21),
        color: WHITE,
        fill: { color: INK },
        lineSpacingMultiple: 1.6,
        valign: "top",
        margin: 14,
      });
      break;
    }

    case "people": {
      whiteHeader(s, logo, title);
      const people = asItems(d.items).slice(0, 3);
      const rowH = 440 / Math.max(people.length, 1);
      people.forEach((person, i) => {
        const y = 168 + rowH * i + (rowH - 136) / 2;
        addImageAt(s, person.image ?? "", { x: PAD, y, w: 136, h: 136 }, true);
        s.addText(person.name ?? "", {
          x: inch(PAD + 172),
          y: inch(y + 6),
          w: inch(900),
          h: inch(40),
          fontFace: FACE,
          fontSize: pt(30),
          bold: true,
          color: INK,
          margin: 0,
        });
        s.addText(paragraphs(asLines(person.bullets)), {
          x: inch(PAD + 172),
          y: inch(y + 54),
          w: inch(900),
          h: inch(80),
          fontFace: FACE,
          fontSize: pt(22),
          color: MUTED,
          bullet: true,
          valign: "top",
          margin: 0,
        });
      });
      break;
    }

    case "avatarGrid": {
      const badge = asText(d.badge);
      whiteHeader(s, logo, title, badge);
      const people = asItems(d.items).slice(0, 10);
      const top = badge ? 194 : 168;
      const colW = (1280 - PAD * 2 + 28) / 5;
      people.forEach((person, i) => {
        const x = PAD + (i % 5) * colW + (colW - 28 - 132) / 2;
        const y = top + Math.floor(i / 5) * 220;
        addImageAt(s, person.image ?? "", { x, y, w: 132, h: 132 }, true);
        s.addText(person.name ?? "", {
          x: inch(PAD + (i % 5) * colW),
          y: inch(y + 144),
          w: inch(colW - 28),
          h: inch(38),
          fontFace: FACE,
          fontSize: pt(20),
          color: INK,
          align: "center",
          valign: "middle",
          fill: { color: MINT },
          margin: 2,
        });
      });
      break;
    }

    case "agenda": {
      whiteHeader(s, logo, title);
      asLines(d.items)
        .slice(0, 7)
        .forEach((line, i) => {
          const y = 168 + i * 64;
          s.addShape("ellipse", {
            x: inch(PAD),
            y: inch(y),
            w: inch(46),
            h: inch(46),
            fill: { color: GREEN },
            line: { color: GREEN },
          });
          s.addText(String(i + 1), {
            x: inch(PAD),
            y: inch(y),
            w: inch(46),
            h: inch(46),
            fontFace: FACE,
            fontSize: pt(22),
            bold: true,
            color: WHITE,
            align: "center",
            valign: "middle",
            margin: 0,
          });
          s.addText(line, {
            x: inch(PAD + 68),
            y: inch(y),
            w: inch(1000),
            h: inch(46),
            fontFace: FACE,
            fontSize: pt(28),
            color: INK,
            valign: "middle",
            margin: 0,
          });
        });
      break;
    }

    case "points": {
      whiteHeader(s, logo, title);
      const items = asItems(d.items).slice(0, 4);
      const w = (1280 - PAD * 2 - 28) / 2;
      const h = (440 - 28) / 2;
      items.forEach((item, i) => {
        const x = PAD + (i % 2) * (w + 28);
        const y = 168 + Math.floor(i / 2) * (h + 28);
        s.addShape("roundRect", {
          x: inch(x),
          y: inch(y),
          w: inch(w),
          h: inch(h),
          fill: { color: "EDF4EA" },
          line: { color: "EDF4EA" },
          rectRadius: 0.08,
        });
        s.addText(item.label ?? "", {
          x: inch(x + 32),
          y: inch(y + 24),
          w: inch(w - 64),
          h: inch(46),
          fontFace: FACE,
          fontSize: pt(34),
          bold: true,
          color: DEEP,
          margin: 0,
        });
        if (item.sub) {
          s.addText(`(${item.sub})`, {
            x: inch(x + 32),
            y: inch(y + 74),
            w: inch(w - 64),
            h: inch(28),
            fontFace: FACE,
            fontSize: pt(20),
            bold: true,
            color: GREEN,
            charSpacing: 1,
            margin: 0,
          });
        }
        if (item.description) {
          s.addText(item.description, {
            x: inch(x + 32),
            y: inch(y + 110),
            w: inch(w - 64),
            h: inch(h - 134),
            fontFace: FACE,
            fontSize: pt(22),
            color: MUTED,
            valign: "top",
            margin: 0,
          });
        }
      });
      break;
    }

    case "table": {
      whiteHeader(s, logo, title);
      const { head, rows } = asTable(d.table);
      const top = asText(d.description) ? 214 : 168;
      if (asText(d.description)) {
        s.addText(asText(d.description), {
          x: inch(PAD),
          y: inch(168),
          w: inch(1152),
          h: inch(34),
          fontFace: FACE,
          fontSize: pt(24),
          color: MUTED,
          margin: 0,
        });
      }
      if (head.length) {
        s.addTable(
          [
            head.map((cell) => ({
              text: cell,
              options: { bold: true, fill: { color: MINT } },
            })),
            ...rows.map((row) => row.map((cell) => ({ text: cell }))),
          ],
          {
            x: inch(PAD),
            y: inch(top),
            w: inch(1152),
            fontFace: FACE,
            fontSize: pt(22),
            color: INK,
            border: { type: "solid", color: INK, pt: 1 },
            valign: "top",
          },
        );
      }
      break;
    }

    case "stats": {
      whiteHeader(s, logo, title);
      const items = asItems(d.items).slice(0, 4);
      const w = (1280 - PAD * 2) / Math.max(items.length, 1);
      items.forEach((item, i) => {
        const x = PAD + w * i;
        s.addText(item.value ?? "", {
          x: inch(x),
          y: inch(280),
          w: inch(w),
          h: inch(100),
          fontFace: FACE,
          fontSize: pt(92),
          bold: true,
          color: GREEN,
          align: "center",
          margin: 0,
        });
        s.addText(item.label ?? "", {
          x: inch(x),
          y: inch(396),
          w: inch(w),
          h: inch(36),
          fontFace: FACE,
          fontSize: pt(26),
          bold: true,
          color: INK,
          align: "center",
          margin: 0,
        });
        if (item.sub) {
          s.addText(item.sub, {
            x: inch(x),
            y: inch(436),
            w: inch(w),
            h: inch(28),
            fontFace: FACE,
            fontSize: pt(20),
            color: MUTED,
            align: "center",
            margin: 0,
          });
        }
      });
      break;
    }

    case "timeline": {
      whiteHeader(s, logo, title);
      const items = asItems(d.items).slice(0, 6);
      const rowH = 440 / Math.max(items.length, 1);
      s.addShape("rect", {
        x: inch(PAD + 7),
        y: inch(180),
        w: inch(3),
        h: inch(416),
        fill: { color: MINT },
        line: { color: MINT },
      });
      items.forEach((item, i) => {
        const y = 168 + rowH * i + rowH / 2 - 20;
        s.addShape("ellipse", {
          x: inch(PAD),
          y: inch(y + 10),
          w: inch(17),
          h: inch(17),
          fill: { color: GREEN },
          line: { color: GREEN },
        });
        s.addText(item.when ?? "", {
          x: inch(PAD + 40),
          y: inch(y),
          w: inch(150),
          h: inch(40),
          fontFace: FACE,
          fontSize: pt(24),
          bold: true,
          color: GREEN,
          valign: "middle",
          margin: 0,
        });
        s.addText(
          [
            { text: item.what ?? "", options: { bold: true, fontSize: pt(26) } },
            ...(item.detail
              ? [
                  {
                    text: `   ${item.detail}`,
                    options: { fontSize: pt(21), color: MUTED },
                  },
                ]
              : []),
          ],
          {
            x: inch(PAD + 214),
            y: inch(y),
            w: inch(900),
            h: inch(40),
            fontFace: FACE,
            color: INK,
            valign: "middle",
            margin: 0,
          },
        );
      });
      break;
    }

    case "speaker": {
      greenBackground(s);
      s.addText("SESSION", {
        x: inch(100),
        y: inch(150),
        w: inch(1080),
        h: inch(34),
        fontFace: FACE,
        fontSize: pt(24),
        bold: true,
        color: WHITE,
        align: "center",
        charSpacing: 3,
        margin: 0,
      });
      s.addText(title, {
        x: inch(100),
        y: inch(230),
        w: inch(1080),
        h: inch(180),
        fontFace: FACE,
        fontSize: pt(60),
        bold: true,
        color: WHITE,
        align: "center",
        valign: "middle",
        lineSpacingMultiple: 1.25,
        margin: 0,
      });
      if (asText(d.speaker)) {
        s.addText(asText(d.speaker), {
          x: inch(100),
          y: inch(452),
          w: inch(1080),
          h: inch(40),
          fontFace: FACE,
          fontSize: pt(30),
          bold: true,
          color: WHITE,
          align: "center",
          margin: 0,
        });
      }
      if (asText(d.affiliation)) {
        s.addText(asText(d.affiliation), {
          x: inch(100),
          y: inch(498),
          w: inch(1080),
          h: inch(34),
          fontFace: FACE,
          fontSize: pt(24),
          color: WHITE,
          align: "center",
          margin: 0,
        });
      }
      // 세션 제목에 집중하는 선언형 슬라이드라 엠블럼 없음
      break;
    }

    case "intermission": {
      greenBackground(s);
      s.addText(title, {
        x: inch(100),
        y: inch(240),
        w: inch(1080),
        h: inch(100),
        fontFace: FACE,
        fontSize: pt(60),
        bold: true,
        color: WHITE,
        align: "center",
        margin: 0,
      });
      if (asText(d.note)) {
        s.addText(asText(d.note), {
          x: inch(200),
          y: inch(352),
          w: inch(880),
          h: inch(70),
          fontFace: FACE,
          fontSize: pt(26),
          color: WHITE,
          align: "center",
          lineSpacingMultiple: 1.5,
          margin: 0,
        });
      }
      if (asText(d.next)) {
        s.addText(
          [
            { text: "다음 세션   ", options: { bold: true, color: WHITE, fontSize: pt(22) } },
            { text: asText(d.next), options: { bold: true, color: WHITE, fontSize: pt(26) } },
          ],
          {
            x: inch(240),
            y: inch(452),
            w: inch(800),
            h: inch(56),
            fontFace: FACE,
            align: "center",
            valign: "middle",
            fill: { color: "1F8A6B" },
            rectRadius: 0.3,
            margin: 0,
          },
        );
      }
      addLogo(s, logo, "bottom", 200);
      break;
    }

    case "qr": {
      const badge = asText(d.badge);
      whiteHeader(s, logo, title, badge);
      const top = badge ? 194 : 168;
      s.addText(paragraphs(asLines(d.body)), {
        x: inch(PAD),
        y: inch(top),
        w: inch(620),
        h: inch(720 - top - 56),
        fontFace: FACE,
        fontSize: pt(28),
        color: MUTED,
        lineSpacingMultiple: 1.45,
        paraSpaceAfter: 8,
        valign: "middle",
        margin: 0,
      });
      const qrPx = 360;
      const originX = 1280 - PAD - qrPx - 16;
      const originY = (720 - qrPx) / 2;
      s.addShape("roundRect", {
        x: inch(originX - 16),
        y: inch(originY - 16),
        w: inch(qrPx + 32),
        h: inch(qrPx + 32),
        fill: { color: WHITE },
        line: { color: MINT, width: 1 },
        rectRadius: 0.12,
      });
      s.addImage({
        data: qrPngData(asText(d.url) || "https://greedy.example", qrPx),
        x: inch(originX),
        y: inch(originY),
        w: inch(qrPx),
        h: inch(qrPx),
      });
      break;
    }

    case "content": {
      const badge = asText(d.badge);
      whiteHeader(s, logo, title, badge);
      const image = asText(d.image);
      // 사진이 있으면 텍스트+사진 2단, 없으면 텍스트만
      if (image) {
        const top = badge ? 206 : 176;
        const imageLeft = asText(d.imageSide) === "left";
        const textX = imageLeft ? 48 + 500 + 48 : 48;
        const imageX = imageLeft ? 48 : 1280 - PAD - 500;
        s.addText(bodyParagraphs(d.body, asText(d.bullet)), {
          x: inch(textX),
          y: inch(top),
          w: inch(1280 - 48 - PAD - 500 - 48),
          h: inch(720 - top - 52),
          fontFace: FACE,
          fontSize: pt(30),
          color: MUTED,
          lineSpacingMultiple: 1.45,
          paraSpaceAfter: 8,
          valign: "middle",
          margin: 0,
        });
        addImageAt(s, image, { x: imageX, y: top, w: 500, h: 400 });
        if (asText(d.caption)) {
          s.addText(asText(d.caption), {
            x: inch(imageX),
            y: inch(top + 410),
            w: inch(500),
            h: inch(28),
            fontFace: FACE,
            fontSize: pt(18),
            color: MUTED,
            margin: 0,
          });
        }
      } else {
        bodyText(s, d.body, badge, asText(d.bullet) || "none");
      }
      break;
    }

    default: {
      const badge = asText(d.badge);
      whiteHeader(s, logo, title, badge);
      bodyText(s, d.body, badge, asText(d.bullet) || "none");
    }
  }
}

/** 파일을 base64로 읽어와요. pptxgenjs는 파일 경로 대신 데이터가 필요합니다. */
async function loadAsData(path: string): Promise<string> {
  const res = await fetch(path);
  const blob = await res.blob();
  const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
  return dataUrl.slice("data:".length);
}

export async function downloadPptx(deck: Deck) {
  const { default: PptxGenJS } = await import("pptxgenjs");
  const pptx = new PptxGenJS();

  // 16:9 기본 캔버스는 10in이라 좌표가 어긋나요. 13.333in으로 다시 잡습니다.
  pptx.defineLayout({ name: "GREEDY", width: 13.333, height: 7.5 });
  pptx.layout = "GREEDY";
  pptx.title = deck.title;

  const logo = await loadAsData("/greedy-logo.png");
  deck.slides.forEach((slide) => renderSlide(pptx as Pptx, slide, logo));

  await pptx.writeFile({ fileName: `${deck.title || "greedy-deck"}.pptx` });
}
