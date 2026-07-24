import type { LayoutDef } from "./types";

/**
 * 레이아웃 한 벌 = 폼 + 슬라이드.
 * 여기에 fields를 적으면 편집 폼이 자동으로 생기고,
 * components/slides/registry.tsx의 같은 id 컴포넌트가 그려요.
 *
 * cover~avatarGrid는 [그리디 3·4기] PPT에서 실제로 쓰던 틀이고,
 * 나머지는 같은 규칙(그린 라인·기린 로고·연녹색 칩)으로 넓힌 것들이에요.
 */
export const LAYOUTS: LayoutDef[] = [
  {
    id: "cover",
    name: "표지",
    description: "덱의 첫 장. 그린 배경에 제목과 일시·장소를 넣어요.",
    group: "표지·마무리",
    tone: "green",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "그리디 5기 OT" },
      {
        key: "subtitle",
        label: "부제",
        type: "text",
        optional: true,
        placeholder: "세종대학교 개발 동아리",
      },
      {
        key: "meta",
        label: "일시·장소",
        type: "list",
        optional: true,
        max: 3,
        hint: "한 줄에 하나씩 적으면 오른쪽 아래에 쌓여요.",
        placeholder: "2026.09.01 18:30\n집 307",
      },
    ],
    sample: {
      title: "그리디 5기 OT",
      subtitle: "",
      meta: "2026.09.01 18:30\n집 307",
    },
  },
  {
    id: "section",
    name: "간지",
    description: "주제가 바뀔 때 끼우는 장. 그린 배경에 제목만 크게.",
    group: "표지·마무리",
    tone: "green",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "프로젝트 소개" },
      {
        key: "subtitle",
        label: "부제",
        type: "text",
        optional: true,
        placeholder: "이번 학기에 무엇을 만드나요",
      },
    ],
    sample: { title: "프로젝트 소개", subtitle: "" },
  },
  {
    id: "teamDivider",
    name: "팀 넘김",
    description: "발표 중 팀이 바뀔 때 딱 넘기는 장. 위아래 그린 라인 사이에 팀 이름만.",
    group: "표지·마무리",
    tone: "white",
    fields: [
      { key: "title", label: "팀", type: "text", placeholder: "1팀" },
      {
        key: "subtitle",
        label: "덧붙임",
        type: "text",
        optional: true,
        placeholder: "서비스 이름이나 한 줄 소개",
      },
    ],
    sample: { title: "1팀", subtitle: "" },
  },
  {
    id: "quote",
    name: "한 줄 메시지",
    description: "철학이나 슬로건처럼 한 문장만 남기고 싶을 때.",
    group: "표지·마무리",
    tone: "green",
    fields: [
      {
        key: "quote",
        label: "문장",
        type: "textarea",
        placeholder: "교내 개발 생태계에 선한 영향력을",
      },
      {
        key: "author",
        label: "덧붙이는 말",
        type: "text",
        optional: true,
        placeholder: "그리디가 시작한 이유",
      },
    ],
    sample: { quote: "교내 개발 생태계에 선한 영향력을", author: "" },
  },
  {
    id: "closing",
    name: "마무리",
    description: "감사 인사. 발표 마지막 장에 써요.",
    group: "표지·마무리",
    tone: "green",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "감사합니다" },
      {
        key: "subtitle",
        label: "부제",
        type: "text",
        optional: true,
        placeholder: "질문은 언제든 편하게",
      },
    ],
    sample: {
      title: "감사합니다",
      subtitle: "질문은 언제든 편하게",
    },
  },

  {
    id: "content",
    name: "제목 + 본문",
    description: "가장 많이 쓰는 기본 장. 제목 아래 문장을 쌓아요.",
    group: "본문",
    tone: "white",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "그리디 소개" },
      {
        key: "badge",
        label: "말머리",
        type: "text",
        optional: true,
        hint: "제목 위에 붙는 연녹색 꼬리표예요.",
        placeholder: "동아리 소개",
      },
      {
        key: "body",
        label: "본문",
        type: "list",
        max: 6,
        hint: "한 줄에 한 문장씩. 6줄까지 들어가요.",
        placeholder:
          "24년 8월 여름에 만들어졌습니다.\n교내 유일무이한 개발 동아리를 목표하고 있습니다.",
      },
      {
        key: "bullet",
        label: "머리 기호",
        type: "select",
        optional: true,
        options: [
          { value: "none", label: "없음 (문장 나열)" },
          { value: "dot", label: "● 점" },
          { value: "number", label: "1. 번호" },
        ],
      },
    ],
    sample: {
      title: "그리디 소개",
      badge: "",
      body: "24년 8월 여름에 만들어졌습니다.\n교내 유일무이한 개발 동아리를 목표하고 있습니다.\n보고 배웠던 좋은 개발 문화를 공유하고 싶습니다.",
      bullet: "none",
    },
  },
  {
    id: "split",
    name: "좌우 2단",
    description: "한쪽엔 글, 한쪽엔 사진. 활동 소개에 잘 맞아요.",
    group: "본문",
    tone: "white",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "우리가 하는 것" },
      { key: "badge", label: "말머리", type: "text", optional: true },
      {
        key: "body",
        label: "본문",
        type: "list",
        max: 5,
        placeholder: "매주 스터디를 합니다.\n학기마다 팀 프로젝트를 합니다.",
      },
      { key: "image", label: "사진", type: "image" },
      {
        key: "imageSide",
        label: "사진 위치",
        type: "select",
        options: [
          { value: "right", label: "오른쪽" },
          { value: "left", label: "왼쪽" },
        ],
      },
      { key: "caption", label: "사진 설명", type: "text", optional: true },
    ],
    sample: {
      title: "우리가 하는 것",
      badge: "",
      body: "매주 스터디를 합니다.\n학기마다 팀 프로젝트를 합니다.\n데모데이로 결과를 나눕니다.",
      image: "",
      imageSide: "right",
      caption: "",
    },
  },
  {
    id: "imageFull",
    name: "큰 사진",
    description: "단체사진이나 화면 캡처를 크게 보여줄 때.",
    group: "본문",
    tone: "white",
    fields: [
      { key: "title", label: "제목", type: "text", optional: true },
      { key: "image", label: "사진", type: "image" },
      { key: "caption", label: "사진 설명", type: "text", optional: true },
    ],
    sample: { title: "3기 데모데이", image: "", caption: "" },
  },
  {
    id: "compare",
    name: "2단 비교",
    description: "장단점, Before/After, 기술 선택지를 나란히 놓아요.",
    group: "본문",
    tone: "white",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "어떤 걸 쓸까요" },
      { key: "leftTitle", label: "왼쪽 제목", type: "text", placeholder: "REST" },
      {
        key: "leftBody",
        label: "왼쪽 내용",
        type: "list",
        max: 5,
        placeholder: "익숙합니다.\n캐싱이 쉽습니다.",
      },
      { key: "rightTitle", label: "오른쪽 제목", type: "text", placeholder: "GraphQL" },
      {
        key: "rightBody",
        label: "오른쪽 내용",
        type: "list",
        max: 5,
        placeholder: "필요한 것만 받습니다.\n학습 비용이 있습니다.",
      },
    ],
    sample: {
      title: "어떤 걸 쓸까요",
      leftTitle: "REST",
      leftBody: "익숙합니다.\n캐싱이 쉽습니다.",
      rightTitle: "GraphQL",
      rightBody: "필요한 것만 받습니다.\n학습 비용이 있습니다.",
    },
  },
  {
    id: "code",
    name: "코드",
    description: "코드 조각을 보여줄 때. 세션·스터디 발표용이에요.",
    group: "본문",
    tone: "white",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "이렇게 씁니다" },
      { key: "description", label: "설명", type: "text", optional: true },
      {
        key: "code",
        label: "코드",
        type: "textarea",
        placeholder: "const greedy = () => '함께 자라기';",
      },
    ],
    sample: {
      title: "이렇게 씁니다",
      description: "",
      code: "const greedy = () => '함께 자라기';",
    },
  },

  {
    id: "people",
    name: "사람 소개",
    description: "사진 옆에 이름과 소개 줄. 메인테이너·팀원 소개에 써요.",
    group: "사람·목록",
    tone: "white",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "메인테이너 소개" },
      {
        key: "items",
        label: "사람",
        type: "items",
        max: 3,
        hint: "한 장에 3명까지. 더 많으면 장을 나누거나 아바타 그리드를 쓰세요.",
        fields: [
          { key: "image", label: "사진", type: "image" },
          { key: "name", label: "이름", type: "text", placeholder: "찬빈(INSANE-P)" },
          {
            key: "bullets",
            label: "소개",
            type: "list",
            max: 3,
            placeholder: "그리디 2기 FE 멤버\n여행 좋아해요~",
          },
        ],
      },
    ],
    sample: {
      title: "메인테이너 소개",
      items: [
        {
          image: "",
          name: "찬빈(INSANE-P)",
          bullets: "그리디 2기 FE 멤버\n그리디 3기 스터디 리드",
        },
      ],
    },
  },
  {
    id: "avatarGrid",
    name: "아바타 그리드",
    description: "동그란 사진과 이름표를 여러 명 늘어놓아요.",
    group: "사람·목록",
    tone: "white",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "백엔드 리뷰어" },
      {
        key: "badge",
        label: "말머리",
        type: "text",
        optional: true,
        placeholder: "코드리뷰",
      },
      {
        key: "items",
        label: "사람",
        type: "items",
        max: 10,
        hint: "10명까지. 5명씩 두 줄로 놓여요.",
        fields: [
          { key: "image", label: "사진", type: "image" },
          { key: "name", label: "이름", type: "text", placeholder: "@김민기" },
        ],
      },
    ],
    sample: {
      title: "백엔드 리뷰어",
      badge: "",
      items: [
        { image: "", name: "@김민기" },
        { image: "", name: "@남해윤" },
      ],
    },
  },
  {
    id: "agenda",
    name: "목차",
    description: "오늘 무엇을 이야기할지 번호로 정리해요.",
    group: "사람·목록",
    tone: "white",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "오늘 순서" },
      {
        key: "items",
        label: "항목",
        type: "list",
        max: 7,
        placeholder: "그리디 소개\n올해 계획\n스터디 운영\nQ&A",
      },
    ],
    sample: {
      title: "오늘 순서",
      items: "그리디 소개\n올해 계획\n스터디 운영\nQ&A",
    },
  },
  {
    id: "points",
    name: "항목 + 설명",
    description: "핵심 가치나 규칙을 제목·부제 짝으로 늘어놓아요.",
    group: "사람·목록",
    tone: "white",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "그리디 철학" },
      {
        key: "items",
        label: "항목",
        type: "items",
        max: 4,
        fields: [
          { key: "label", label: "항목", type: "text", placeholder: "다함께" },
          { key: "sub", label: "영문·보조", type: "text", optional: true, placeholder: "TOGETHER" },
          {
            key: "description",
            label: "설명",
            type: "text",
            optional: true,
            placeholder: "모두에게 친절하고 따뜻하게",
          },
        ],
      },
    ],
    sample: {
      title: "그리디 철학",
      items: [
        { label: "다함께", sub: "TOGETHER", description: "" },
        { label: "친절하게", sub: "KINDNESS", description: "모두에게 따뜻하게" },
      ],
    },
  },

  {
    id: "table",
    name: "표",
    description: "선택지를 칸으로 비교해요. 헤더는 연녹색이에요.",
    group: "데이터",
    tone: "white",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "API 명세" },
      { key: "description", label: "설명", type: "text", optional: true },
      { key: "table", label: "표", type: "table" },
    ],
    sample: {
      title: "API 명세",
      description: "",
      table: {
        head: ["", "Notion", "Swagger"],
        rows: [
          ["장점", "쓰기 편리하다.", "러닝 커브가 낮다."],
          ["단점", "관리 비용이 든다.", "코드가 지저분해진다."],
        ],
      },
    },
  },
  {
    id: "stats",
    name: "숫자 강조",
    description: "인원, 기간, 수료율 같은 숫자를 크게 보여줘요.",
    group: "데이터",
    tone: "white",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "4기 규모" },
      {
        key: "items",
        label: "숫자",
        type: "items",
        max: 4,
        fields: [
          { key: "value", label: "숫자", type: "text", placeholder: "42" },
          { key: "label", label: "이름", type: "text", placeholder: "활동 인원" },
          { key: "sub", label: "덧붙임", type: "text", optional: true, placeholder: "FE 20 · BE 22" },
        ],
      },
    ],
    sample: {
      title: "4기 규모",
      items: [
        { value: "42", label: "활동 인원", sub: "" },
        { value: "14", label: "주 커리큘럼", sub: "" },
        { value: "6", label: "팀 프로젝트", sub: "" },
      ],
    },
  },
  {
    id: "timeline",
    name: "일정",
    description: "커리큘럼이나 학기 일정을 시간순으로 늘어놓아요.",
    group: "데이터",
    tone: "white",
    fields: [
      { key: "title", label: "제목", type: "text", placeholder: "14주 커리큘럼" },
      {
        key: "items",
        label: "일정",
        type: "items",
        max: 6,
        fields: [
          { key: "when", label: "시기", type: "text", placeholder: "1~4주" },
          { key: "what", label: "내용", type: "text", placeholder: "기초 다지기" },
          { key: "detail", label: "설명", type: "text", optional: true },
        ],
      },
    ],
    sample: {
      title: "14주 커리큘럼",
      items: [
        { when: "1~4주", what: "기초 다지기", detail: "" },
        { when: "5~9주", what: "심화 학습", detail: "" },
        { when: "10~14주", what: "팀 프로젝트", detail: "" },
      ],
    },
  },
];

export const LAYOUT_MAP = new Map(LAYOUTS.map((l) => [l.id, l]));

export const getLayout = (id: string): LayoutDef =>
  LAYOUT_MAP.get(id) ?? LAYOUTS[0];

export const LAYOUT_GROUPS = [
  "표지·마무리",
  "본문",
  "사람·목록",
  "데이터",
] as const;
