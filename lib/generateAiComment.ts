type MenuInput = {
  name: string;
  main: string[];
  sides: string[];
};

const KEYWORD_COMMENTS: { keywords: string[]; comments: string[] }[] = [
  {
    keywords: ["짬뽕", "불닭", "매운", "김치찌개", "낙지", "닭갈비", "떡볶이"],
    comments: [
      "매콤한 자극이 필요한 날, 딱이에요!",
      "얼큰하게 스트레스까지 날려버려요",
      "땀 쭉 빼는 매콤한 한 끼예요",
    ],
  },
  {
    keywords: ["갈비", "고기", "돈까스", "치킨", "제육", "삼겹살", "스테이크"],
    comments: [
      "든든하게 채우는 고기 한 상이에요",
      "오후 버틸 힘, 여기서 채우고 가세요",
      "단백질 가득, 만족스러운 한 끼예요",
    ],
  },
  {
    keywords: ["튀김", "까스", "탕수육", "핫도그"],
    comments: ["바삭한 식감이 기대되는 메뉴예요", "겉바속촉, 오늘 점심 승리 예감!"],
  },
  {
    keywords: ["냉면", "국", "탕", "찌개", "우동", "라면"],
    comments: ["뜨끈한(혹은 시원한) 국물이 매력적이에요", "후루룩 한 그릇, 든든하게 채워요"],
  },
  {
    keywords: ["샐러드", "야채", "나물", "두부"],
    comments: ["가볍고 건강하게 챙기는 한 끼예요", "속이 편안한 담백한 구성이에요"],
  },
  {
    keywords: ["짜장", "짜파게티", "중화면", "볶음면"],
    comments: ["든든한 면 요리로 포만감 up!", "고소하게 비벼먹는 재미가 있어요"],
  },
];

const DEFAULT_COMMENTS = [
  "오늘도 든든한 한 끼 되세요!",
  "균형 잡힌 알찬 구성이에요",
  "오늘 메뉴, 기대해도 좋아요!",
  "맛있게 드시고 힘내는 오후 보내세요",
];

function pickRandom(arr: string[], seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  return arr[hash % arr.length];
}

export function generateAiComment(menu: MenuInput): string | null {
  const allText = [...menu.main, ...menu.sides].filter(Boolean).join(" ");

  if (!allText.trim()) return null;

  const seed = `${menu.name}-${menu.main.join("")}`;

  for (const group of KEYWORD_COMMENTS) {
    const matched = group.keywords.some((keyword) => allText.includes(keyword));
    if (matched) {
      return pickRandom(group.comments, seed);
    }
  }

  return pickRandom(DEFAULT_COMMENTS, seed);
}
