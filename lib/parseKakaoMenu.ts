type ParsedMenu = {
  main: string[];
  sides: string[];
};

// 그 자체로 한 끼가 되는 음식 (면·국 계열 포함)
const MAIN_ICONS = new Set(["🍜", "🍲", "🍛", "🥘"]);
const MAIN_KEYWORDS = ["냉면", "짬뽕", "짜장", "우동", "국수", "라면", "탕", "찌개"];

// 항상 고정으로 나와서 결과에서 제외하고 싶은 메뉴들
const EXCLUDED_ITEMS = ["한강라면"];

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
    if (isExcluded(name)) continue; // 제외 목록이면 아예 담지 않음

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
