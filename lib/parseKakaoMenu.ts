type ParsedMenu = {
  main: string[];
  sides: string[];
};

// 그 자체로 한 끼가 되는 음식 (면·국·밥·고기 계열)
const MAIN_ICONS = new Set(["🍜", "🍲", "🍛", "🥘"]);

const MAIN_KEYWORDS = [
  // 면·국물류
  "냉면",
  "짬뽕",
  "짜장",
  "우동",
  "국수",
  "라면",
  "탕",
  "찌개",
  "국",
  // 밥류
  "비빔밥",
  "볶음밥",
  "덮밥",
  "국밥",
  "죽",
  // 고기류
  "불고기",
  "고기",
  "갈비",
  "제육",
  "돈까스",
  "까스",
  "치킨",
  "스테이크",
  "삼겹살",
  "족발",
  "닭",
];

// 항목 제외 목록 (특정 메뉴는 항상 결과에서 빼고 싶을 때)
const EXCLUDED_ITEMS = ["한강라면", "누룽지", "아이스커피"];

const ITEM_REGEX = /(\p{Extended_Pictographic}\uFE0F?)\s*[^\[\]]*\[([^\]]+)\]/gu;

function cleanName(raw: string): string {
  return raw
    .replace(/\(with\s+/gi, "(")
    .replace(/\s+/g, " ")
    .trim();
}

function isExcluded(name: string): boolean {
  return EXCLUDED_ITEMS.some((excluded) => name.includes(excluded));
}

export function parseKakaoMenu(rawText: string): ParsedMenu {
  const items: { icon: string; name: string }[] = [];

  let match: RegExpExecArray | null;
  ITEM_REGEX.lastIndex = 0;
  while ((match = ITEM_REGEX.exec(rawText)) !== null) {
    const name = cleanName(match[2]);
    if (isExcluded(name)) continue;

    items.push({ icon: match[1], name });
  }

  if (items.length === 0) {
    return { main: [], sides: [] };
  }

  const main: string[] = [];
  const sides: string[] = [];

  items.forEach((item, idx) => {
    const isMainByKeyword =
      MAIN_ICONS.has(item.icon) || MAIN_KEYWORDS.some((keyword) => item.name.includes(keyword));

    if (idx === 0 || isMainByKeyword) {
      main.push(item.name);
    } else {
      sides.push(item.name);
    }
  });

  return { main, sides };
}
