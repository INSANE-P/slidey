import type { SlideData } from "@/entities/slide/types";

/**
 * 상황별 덱 프리셋.
 * 그리디가 실제로 자주 하는 발표를 슬라이드 구성까지 미리 짜뒀어요.
 * 새 상황이 생기면 여기에 한 덩어리만 더하면 됩니다.
 */
export interface Preset {
  id: string;
  name: string;
  description: string;
  slides: { layout: string; data?: SlideData }[];
}

export const PRESETS: Preset[] = [
  {
    id: "blank",
    name: "직접 꾸미기",
    description: "빈 슬라이드부터 직접 쌓아요.",
    // 표지지만 내용은 비워 둬요. 프리셋 제목이 미리 박혀 있으면 이상하니까요.
    slides: [{ layout: "cover", data: { title: "", subtitle: "", meta: "" } }],
  },
  {
    id: "ot",
    name: "동아리 OT",
    description: "기수 시작 총회. 소개 → 철학 → 사람 → 운영 → 일정 순서예요.",
    slides: [
      { layout: "cover", data: { title: "그리디 5기 OT" } },
      { layout: "agenda", data: { title: "오늘 순서", items: "그리디 소개\n우리의 철학\n사람 소개\n운영 방식\n앞으로의 일정" } },
      { layout: "section", data: { title: "그리디 소개" } },
      { layout: "split", data: { title: "그리디는" } },
      { layout: "points", data: { title: "그리디 철학" } },
      { layout: "section", data: { title: "사람 소개" } },
      { layout: "people", data: { title: "메인테이너 소개" } },
      { layout: "avatarGrid", data: { title: "함께하는 사람들" } },
      { layout: "section", data: { title: "어떻게 활동하나요" } },
      { layout: "content", data: { title: "운영 방식" } },
      { layout: "timeline", data: { title: "한 학기 일정" } },
      { layout: "stats", data: { title: "5기 규모" } },
      { layout: "closing", data: { title: "감사합니다" } },
    ],
  },
  {
    id: "project-ot",
    name: "프로젝트 OT",
    description: "팀 프로젝트 시작. 목표 → 팀 편성 → 규칙 → 일정.",
    slides: [
      { layout: "cover", data: { title: "프로젝트 OT" } },
      { layout: "agenda", data: { title: "오늘 순서", items: "프로젝트 목표\n팀 편성\n협업 규칙\n일정과 마일스톤" } },
      { layout: "section", data: { title: "프로젝트 목표" } },
      { layout: "content", data: { title: "무엇을 만드나요" } },
      { layout: "quote", data: { quote: "완성보다 과정에서 배우는 게 많아요" } },
      { layout: "section", data: { title: "팀 편성" } },
      { layout: "avatarGrid", data: { title: "1팀" } },
      { layout: "section", data: { title: "협업 규칙" } },
      { layout: "content", data: { title: "깃 컨벤션", badge: "협업" } },
      { layout: "avatarGrid", data: { title: "코드 리뷰어", badge: "코드리뷰" } },
      { layout: "timeline", data: { title: "마일스톤" } },
      { layout: "closing", data: { title: "잘 부탁드립니다" } },
    ],
  },
  {
    id: "demoday",
    // 운영진이 진행하는 프레임이에요. 팀 발표 자료는 각 팀이 자기 노션·PPT로 하고,
    // 이 덱은 지난 요구사항 → 팀 발표(넘김) → Q&A → 다음 요구사항 흐름만 잡아요.
    name: "데모데이",
    description: "운영진 진행 프레임. 지난 요구사항 → 팀 발표 → Q&A → 다음 요구사항.",
    slides: [
      { layout: "cover", data: { title: "프로젝트 1차 데모데이" } },
      { layout: "section", data: { title: "지난 주차 요구사항" } },
      {
        layout: "content",
        data: {
          title: "지난 요구사항 돌아보기",
          badge: "리마인드",
          body: "기술 스택 선정 이유 문서화\nAPI 명세 작성\n디자인 완성 및 MVP 개발\n코드 리뷰",
          bullet: "dot",
        },
      },
      { layout: "teamDivider", data: { title: "1팀", subtitle: "팀 발표를 진행해 주세요" } },
      { layout: "section", data: { title: "Q&A" } },
      { layout: "teamDivider", data: { title: "2팀", subtitle: "팀 발표를 진행해 주세요" } },
      { layout: "section", data: { title: "Q&A" } },
      { layout: "section", data: { title: "다음 주차 요구사항" } },
      {
        layout: "content",
        data: {
          title: "공통 요구사항",
          badge: "공통",
          body: "QA 시트 작성\n실제 운영 중인 서비스 시연 준비",
          bullet: "dot",
        },
      },
      {
        layout: "content",
        data: {
          title: "백엔드 요구사항",
          badge: "백엔드",
          body: "개발 서버 배포\n배포 자동화(CI·스크립트)\n로깅 고민(포맷·레벨·대상)\n테스트 고도화",
          bullet: "dot",
        },
      },
      {
        layout: "content",
        data: {
          title: "프론트엔드 요구사항",
          badge: "프론트엔드",
          body: "핵심 기능 동작 확인(Unit Test)\n빌드·배포 환경 구분(dev·prod)\n웹 접근성 대응",
          bullet: "dot",
        },
      },
      { layout: "closing", data: { title: "수고하셨습니다" } },
    ],
  },
  {
    id: "reviewer",
    name: "리뷰어와의 만남",
    description: "리뷰어·멤버 네트워킹. 목적 → 아이스브레이킹 → 조 편성 → 네트워킹.",
    slides: [
      { layout: "cover", data: { title: "리뷰어와의 만남" } },
      {
        layout: "content",
        data: {
          title: "오늘의 목적",
          badge: "리뷰어와의 만남",
          body: "친해지자~! 온라인에서만 만났는데 교류를 활성화해요.\n모르는 건 편하게 물어볼 수 있는 기반을 만들어요.",
        },
      },
      { layout: "agenda", data: { title: "오늘 순서", items: "아이스브레이킹\n조별 미션\n네트워킹\n마무리" } },
      { layout: "section", data: { title: "아이스브레이킹" } },
      {
        layout: "content",
        data: {
          title: "진진가",
          badge: "아이스브레이킹",
          body: "각 팀원을 설명하는 문장을 만들어요.\n한 명은 거짓 문장, 나머지는 진실 문장이에요.\n어느 게 거짓인지 맞혀 보세요!",
          bullet: "number",
        },
      },
      { layout: "section", data: { title: "조 편성" } },
      {
        layout: "table",
        data: {
          title: "조 편성",
          table: {
            head: ["1조", "2조", "3조", "4조"],
            rows: [
              ["", "", "", ""],
              ["", "", "", ""],
              ["", "", "", ""],
            ],
          },
        },
      },
      {
        layout: "content",
        data: {
          title: "공통점 찾기",
          badge: "조별 미션",
          body: "10분 동안 조에서 서로의 공통점을 찾아보세요.\n조별로 돌아가며 발표해요.\n다른 조는 재미 점수와 심사평을 매겨요.",
          bullet: "number",
        },
      },
      { layout: "section", data: { title: "네트워킹" } },
      { layout: "closing", data: { title: "즐거운 시간 되세요" } },
    ],
  },
  {
    id: "conference",
    name: "그리디콘",
    description: "컨퍼런스 진행. 오프닝 → 연사 세션 → 실시간 질문 QR → 경품.",
    slides: [
      {
        layout: "cover",
        data: {
          title: "세종 그리디콘",
          subtitle: "Sejong Greedy Conference",
          meta: "2026.11.19(수) ~ 11.20(목)\n대양 AI 센터 콜라보랩",
        },
      },
      {
        layout: "content",
        data: {
          title: "부스 소개",
          badge: "행사 안내",
          body: "그리디 — 포토 부스\n판도라큐브 — 자체 제작 게임 전시\n엔샵 — 퀴즈와 사은품",
          bullet: "dot",
        },
      },
      {
        layout: "table",
        data: {
          title: "오늘의 연사자",
          table: {
            head: ["시간", "발표 주제", "연사"],
            rows: [
              ["17:00", "어제보다 나은 오늘 만들기", "김주환님"],
              ["18:00", "천천히 그러나 분명히", "류성현님"],
              ["19:00", "설계하는 개발자", "이제응님"],
            ],
          },
        },
      },
      {
        layout: "speaker",
        data: {
          title: "어제보다 나은 오늘 만들기",
          speaker: "김주환님",
          affiliation: "N사 백엔드 개발자",
        },
      },
      {
        layout: "qr",
        data: {
          title: "실시간 질문 QR",
          badge: "QnA",
          body: "곳곳에 부착되어 있어요!\n언제든 질문을 남겨주실 수 있어요.",
          url: "https://greedy.example/qna",
        },
      },
      {
        layout: "intermission",
        data: {
          title: "쉬는 시간이에요 :)",
          note: "다음 연사자에게 궁금한 점은 QR로 미리 남겨주세요.",
          next: "류성현님 — 천천히 그러나 분명히",
        },
      },
      {
        layout: "speaker",
        data: {
          title: "천천히 그러나 분명히",
          speaker: "류성현님",
          affiliation: "우아한테크코스 코치",
        },
      },
      {
        layout: "content",
        data: {
          title: "경품 추첨",
          badge: "이벤트",
          body: "1등(1명) — 기계식 키보드\n2등(2명) — 버티컬 마우스",
          bullet: "dot",
        },
      },
      { layout: "closing", data: { title: "감사합니다" } },
    ],
  },
  {
    id: "poster",
    name: "포스터",
    description: "세로형 홍보 포스터 한 장. PDF로 내보내 붙여요.",
    slides: [{ layout: "poster" }],
  },
];

export const getPreset = (id: string) =>
  PRESETS.find((p) => p.id === id) ?? PRESETS[0];
