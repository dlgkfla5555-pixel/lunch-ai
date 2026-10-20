export type CafeteriaInfo = {
  price?: string;
  notes?: string[];
};

export const CAFETERIA_INFO: Record<string, CafeteriaInfo> = {
  더밥심: {
    price: "7,500원",
    notes: ["간편결제 가능", "아메리카노 제공", "한강라면 제공"],
  },
  런치투게더: {
    price: "8,000원",
    notes: [
      "간편결제 가능",
      "생일자 무료(신분증 지참)",
      "탄산음료 제공",
      "후식(요거트, 라면땅) 제공",
      "여름 한정 슬러쉬 제공",
      "아메리카노 제공",
    ],
  },
  런치타임: { price: "7,500원" },
  오정: { price: "7,500원" },
  호서: {
    price: "7,700원",
    notes: ["간편결제 가능", "후식(요거트, 과일) 제공", "냉커피 & 탄산음료 제공"],
  },
  온정찬: {
    price: "7,500원",
    notes: ["한강라면 제공", "매실차/옥수수차 제공"],
  },
};

// 특이사항 문구에 어울리는 이모티콘 매핑
const NOTE_ICON_RULES: { keywords: string[]; icon: string }[] = [
  { keywords: ["간편결제", "카드", "삼성페이", "카카오페이"], icon: "💳" },
  { keywords: ["아메리카노", "냉커피", "커피"], icon: "☕" },
  { keywords: ["생일"], icon: "🎂" },
  { keywords: ["탄산음료", "슬러쉬"], icon: "🥤" },
  { keywords: ["요거트", "과일", "후식"], icon: "🍡" },
  { keywords: ["라면"], icon: "🍜" },
  { keywords: ["매실차", "옥수수차", "차"], icon: "🍵" },
  { keywords: ["무료"], icon: "🎁" },
];

export function getNoteIcon(note: string): string {
  const matched = NOTE_ICON_RULES.find((rule) =>
    rule.keywords.some((keyword) => note.includes(keyword))
  );
  return matched ? matched.icon : "📌";
}