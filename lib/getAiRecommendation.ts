import { Restaurant } from "@/types/restaurant";

export function getAiRecommendation(restaurants: Restaurant[]) {
  if (restaurants.length === 0) {
    return "추천할 메뉴가 없습니다.";
  }

  const hour = new Date().getHours();

  // 1. 시간대 기반 점수 시스템
  const scored = restaurants.map((r) => {
    let score = 0;

    // 점심 시간 (11~13시) → 든든한 메뉴 선호
    if (hour >= 11 && hour <= 13) {
      if (r.menu.includes("제육") || r.menu.includes("불고기")) {
        score += 3;
      }
    }

    // 저녁 시간 → 가벼운 메뉴 선호
    if (hour >= 17) {
      if (r.menu.includes("비빔") || r.menu.includes("샐러드")) {
        score += 3;
      }
    }

    // 기본 랜덤성 (살짝 AI 느낌)
    score += Math.random();

    return { ...r, score };
  });

  // 2. 점수 기준 정렬
  scored.sort((a, b) => b.score - a.score);

  const selected = scored[0];

  return `오늘은 ${selected.menu} 어때요? 🍱`;
}