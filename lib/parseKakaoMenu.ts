type ParsedMenu = {
  main: string[];
  sides: string[];
};

// 그 자체로 한 끼가 되는 음식 (면·국 계열 포함)
const MAIN_ICONS = new Set(["🍜", "🍲", "🍛", "🥘"]);
const MAIN_KEYWORDS = ["냉면", "짬뽕", "짜장", "우동", "국수", "라면", "탕", "찌개"];

const ITEM_REGEX = /(\p{Extended_Pictographic}\uFE0F?)\s*[^\[\]]*\[([^\]]+)\]/gu;

function cleanName(raw: string): string {
  return raw
    .replace(/\(with\s+/gi, "(")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseKakaoMenu(rawText: string): ParsedMenu {
  const items: { icon: string; name: string }[] = [];

  let match: RegExpExecArray | null;
  ITEM_REGEX.lastIndex = 0;
  while ((match = ITEM_REGEX.exec(rawText)) !== null) {
    items.push({ icon: match[1], name: cleanName(match[2]) });
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
      // 후식·기타였던 것들도 이제는 그냥 반찬으로 통합
      sides.push(item.name);
    }
  });

  return { main, sides };
}
