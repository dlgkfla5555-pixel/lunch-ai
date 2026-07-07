// 메뉴 이름에 포함된 키워드를 보고 어울리는 이모지를 골라주는 함수.
// 배열 순서가 중요함: 더 구체적인 키워드를 위쪽에, 포괄적인 키워드를 아래쪽에 배치.
const ICON_RULES: { keywords: string[]; icon: string }[] = [
  // 면류
  { keywords: ["짬뽕"], icon: "🍲" },
  { keywords: ["짜장", "짜파게티", "중화면"], icon: "🍜" },
  { keywords: ["냉면"], icon: "🍜" },
  { keywords: ["우동"], icon: "🍜" },
  { keywords: ["라면"], icon: "🍜" },

  // 고기/메인 요리
  { keywords: ["닭갈비"], icon: "🍗" },
  { keywords: ["치킨", "닭"], icon: "🍗" },
  { keywords: ["돈까스", "까스"], icon: "🍖" },
  { keywords: ["삼겹살", "제육", "고기", "스테이크"], icon: "🥩" },
  { keywords: ["갈비"], icon: "🍖" },
  { keywords: ["산적"], icon: "🍢" },

  // 만두/튀김/분식류
  { keywords: ["만두"], icon: "🥟" },
  { keywords: ["꽈배기"], icon: "🥨" },
  { keywords: ["탕수육"], icon: "🍤" },
  { keywords: ["떡볶이"], icon: "🌶️" },

  // 밥/죽류
  { keywords: ["누룽지"], icon: "🥣" },
  { keywords: ["비빔밥", "볶음밥"], icon: "🍚" },
  { keywords: ["죽"], icon: "🥣" },

  // 국/탕/찌개
  { keywords: ["미역국", "국", "탕", "찌개"], icon: "🍲" },

  // 달걀
  { keywords: ["달걀후라이", "계란후라이", "후라이"], icon: "🍳" },
  { keywords: ["달걀", "계란"], icon: "🥚" },

  // 채소/나물류
  { keywords: ["콩나물"], icon: "🌱" },
  { keywords: ["상추"], icon: "🥬" },
  { keywords: ["김치"], icon: "🥬" },
  { keywords: ["나물"], icon: "🌿" },
  { keywords: ["오이지", "오이"], icon: "🥒" },
  { keywords: ["감자"], icon: "🥔" },
  { keywords: ["호박"], icon: "🎃" },
  { keywords: ["버섯"], icon: "🍄" },
  { keywords: ["무생채", "무"], icon: "🥕" },
  { keywords: ["샐러드", "야채"], icon: "🥗" },
  { keywords: ["단무지"], icon: "🟡" },

  // 후식/음료
  { keywords: ["아이스커피", "커피"], icon: "☕" },
  { keywords: ["요거트"], icon: "🥛" },
];

export function getMenuIcon(menuName: string): string {
  const matched = ICON_RULES.find((rule) =>
    rule.keywords.some((keyword) => menuName.includes(keyword))
  );
  return matched ? matched.icon : "🍽️";
}
