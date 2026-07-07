export type CafeteriaInfo = {
  price?: string;
  notes?: string[];
};

export const CAFETERIA_INFO: Record<string, CafeteriaInfo> = {
  더밥심: { price: "7,500원", notes: ["간편결제 가능", "아메리카노 제공"] },
  런치투게더: { price: "8,000원", notes: ["간편결제 가능", "생일자 무료(신분증 지참)"] },
  런치타임: { price: "7,500원" },
  오정: { price: "7,500원" },
};

// 특이사항 문구에 어울리는 이모티콘 매핑
const NOTE_ICON_RULES: { keywords: string[]; icon: string }[] = [
  { keywords: ["간편결제", "카드", "삼성페이", "카카오페이"], icon: "💳" },
  { keywords: ["아메리카노", "커피"], icon: "☕" },
  { keywords: ["생일"], icon: "🎂" },
  { keywords: ["무료"], icon: "🎁" },
];

export function getNoteIcon(note: string): string {
  const matched = NOTE_ICON_RULES.find((rule) =>
    rule.keywords.some((keyword) => note.includes(keyword))
  );
  return matched ? matched.icon : "📌";
}
