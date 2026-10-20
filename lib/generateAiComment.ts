import { supabase } from "@/lib/supabase";

type MenuInput = {
  name: string;
  main: string[];
  sides: string[];
};

type CategoryComments = {
  keywords: string[];
  comments: string[];
};

const CATEGORY_COMMENTS: CategoryComments[] = [
  {
    keywords: [
      "보쌈",
      "제육",
      "삼겹살",
      "갈비",
      "고기",
      "불고기",
      "목살",
      "족발",
      "스테이크",
    ],
    comments: [
      "단백질 든든하게 채우는 하루예요",
      "고기 한 점의 위로, 오늘 딱 필요했죠",
      "힘 낼 준비 완료, 단백질 충전 완료",
      "씹을수록 힘이 나는 든든한 한 끼예요",
      "오늘은 고기로 에너지 제대로 보충해요",
      "야근 각오하고 든든하게 드셔도 좋아요",
      "단백질 폭발, 오후도 거뜬하겠어요",
      "고기 앞에서는 다이어트 잠시 미뤄도 돼요",
      "묵직하게 배 채우는 오늘의 한 상이에요",
      "힘 쓸 일 많은 날엔 이런 메뉴가 최고죠",
      "육즙 가득, 포만감도 가득한 하루예요",
      "컨디션 저하는 고기로 극복 가능해요",
    ],
  },
  {
    keywords: ["짬뽕", "매운", "불닭", "김치찌개", "낙지", "떡볶이", "마라", "매콤"],
    comments: [
      "매콤함이 스트레스를 싹 날려줄 거예요",
      "땀 한 방울과 함께 개운해지는 한 끼예요",
      "얼큰한 국물, 오늘 하루 리셋 완료",
      "화끈하게 한 그릇 비우고 힘내봐요",
      "매운맛으로 오후 집중력 끌어올려요",
      "칼칼한 맛이 은근 중독성 있어요",
      "스트레스 풀고 싶을 땐 역시 매운맛이죠",
      "코끝이 찡해지는 진짜 얼큰함이에요",
      "매콤함 뒤에 남는 개운함이 매력이에요",
      "불맛 좋아하는 분들껜 완벽한 선택이에요",
      "화끈하게 매운맛 즐기고 오후 시작해요",
      "얼얼하지만 자꾸 손이 가는 그 맛이죠",
    ],
  },
  {
    keywords: ["튀김", "까스", "탕수육", "가스", "크로켓"],
    comments: [
      "바삭한 식감이 오늘의 포인트예요",
      "겉바속촉, 한 입에 만족감 두 배예요",
      "튀김 냄새만으로 이미 기분 좋아지는 날",
      "바삭바삭 씹는 맛이 일품인 메뉴예요",
      "튀김은 언제나 옳다는 진리를 느껴봐요",
      "고소하고 바삭한 유혹, 참기 힘들죠",
      "한입 베어물면 소리부터 만족스러운 메뉴",
      "기름진 행복, 오늘 하루 허락해도 돼요",
      "겉은 바삭 속은 촉촉, 완벽한 밸런스예요",
      "튀김 좋아하는 분들 오늘 승리하셨어요",
    ],
  },
  {
    keywords: ["국", "탕", "찌개", "우동", "전골"],
    comments: [
      "뜨끈한 국물이 속을 편하게 해줘요",
      "한 숟갈에 몸이 사르르 풀리는 맛이에요",
      "든든한 국물 요리로 속부터 채워봐요",
      "뜨끈한 국물만큼 위로되는 게 없죠",
      "후루룩 넘기는 순간 행복해지는 국물이에요",
      "국물 요리는 언제 먹어도 진리예요",
      "속이 편안해지는 따뜻한 한 그릇이에요",
      "국물까지 싹싹 비우게 되는 맛이에요",
      "몸도 마음도 데워주는 든든한 메뉴예요",
      "뜨끈함 한 그릇이면 오후도 거뜬해요",
    ],
  },
  {
    keywords: ["냉면", "냉국수", "냉국", "콩국수"],
    comments: [
      "시원하게 넘기는 면발이 매력적이에요",
      "더위를 싹 날려주는 시원한 한 그릇이에요",
      "차가운 면발이 입맛을 확 살려줘요",
      "시원함 한 방으로 컨디션 회복 완료예요",
      "톡 쏘는 육수가 개운함을 더해줘요",
      "여름엔 역시 이런 시원한 메뉴가 최고죠",
      "쫄깃한 면발에 시원함까지, 완벽해요",
      "한 젓가락에 더위가 달아나는 맛이에요",
    ],
  },
  {
    keywords: ["짜장", "짜파게티", "중화면", "울면"],
    comments: [
      "든든한 면 요리로 포만감 제대로예요",
      "고소하게 비벼먹는 재미가 있는 메뉴예요",
      "짜장 한 그릇이면 기분까지 좋아져요",
      "면발에 소스가 착 감기는 그 맛이죠",
      "비비는 순간부터 행복해지는 한 끼예요",
      "짜장 좋아하는 분들껜 반가운 하루예요",
      "한 그릇 뚝딱, 만족스러운 면 요리예요",
    ],
  },
  {
    keywords: ["비빔밥", "볶음밥", "덮밥", "국밥", "카레"],
    comments: [
      "한 그릇에 다 담긴 든든한 조합이에요",
      "슥슥 비벼 먹는 재미가 있는 메뉴예요",
      "골고루 챙겨먹는 균형 잡힌 한 끼예요",
      "든든한 밥심으로 오후를 버텨봐요",
      "한 그릇으로 끝내는 깔끔한 식사예요",
      "비비는 손맛까지 즐거운 오늘의 메뉴예요",
      "다채로운 재료가 한데 어우러진 한 끼예요",
      "밥 한 톨까지 맛있게 비우게 되는 맛이에요",
    ],
  },
  {
    keywords: ["새우", "오징어", "조개", "미역", "홍합", "해물"],
    comments: [
      "바다의 감칠맛이 가득한 한 끼예요",
      "해물 특유의 시원한 감칠맛이 매력이에요",
      "쫄깃한 식감이 자꾸 생각나는 메뉴예요",
      "바다향 가득, 오늘 메뉴 기대돼요",
      "해물 좋아하는 분들껜 반가운 소식이에요",
      "감칠맛 폭발하는 오늘의 한 상이에요",
    ],
  },
  {
    keywords: ["치킨", "닭갈비", "닭볶음탕", "닭"],
    comments: [
      "고소한 육즙이 매력적인 메뉴예요",
      "닭고기 특유의 담백함이 살아있어요",
      "부드러운 식감에 자꾸 손이 가요",
      "고소하고 든든한 오늘의 선택이에요",
      "닭요리 좋아하는 분들껜 완벽한 하루예요",
    ],
  },
  {
    keywords: ["돈까스", "돈가스"],
    comments: [
      "겉바속촉의 정석, 오늘의 메뉴예요",
      "바삭한 튀김옷 아래 촉촉함이 숨어있어요",
      "돈까스 한 조각이면 기분까지 좋아지죠",
      "소스까지 완벽한 조화를 이루는 메뉴예요",
    ],
  },
  {
    keywords: ["나물", "야채", "샐러드", "두부", "무침"],
    comments: [
      "가볍고 건강하게 챙기는 한 끼예요",
      "속이 편안한 담백한 구성이 매력이에요",
      "신선한 재료로 든든하게 채워봐요",
      "건강 챙기고 싶은 날엔 딱이에요",
      "가볍지만 알찬 구성의 오늘 메뉴예요",
      "채소 듬뿍, 부담 없이 즐겨보세요",
      "속이 편안해지는 산뜻한 한 끼예요",
    ],
  },
  {
    keywords: ["죽"],
    comments: [
      "부드럽게 속을 달래주는 한 그릇이에요",
      "편안하게 즐기는 오늘의 메뉴예요",
      "든든하면서도 부담 없는 선택이에요",
    ],
  },
];

const DEFAULT_COMMENTS = [
  "오늘도 든든한 한 끼 되세요",
  "균형 잡힌 알찬 구성이에요",
  "오늘 메뉴, 기대해도 좋아요",
  "맛있게 드시고 힘내는 오후 보내세요",
  "정성 담긴 오늘의 메뉴, 즐겨보세요",
  "한 끼의 행복, 오늘도 챙겨가세요",
  "맛있는 한 끼로 하루를 채워보세요",
  "오늘 점심도 만족스러우시길 바라요",
  "든든하게 채우고 남은 하루도 파이팅이에요",
  "정성 가득한 메뉴로 활력 충전해요",
  "오늘 하루도 맛있게 시작해봐요",
  "알찬 구성으로 준비된 오늘의 한 상이에요",
  "맛있는 시간, 오늘도 놓치지 마세요",
  "한 끼 잘 먹으면 하루가 든든해져요",
  "오늘의 메뉴, 소소한 행복이 되길 바라요",
  "골고루 챙긴 오늘의 식사, 즐겨보세요",
  "잠깐의 식사가 하루의 활력이 되길 바라요",
  "맛있게 먹고 오후도 가볍게 보내요",
  "오늘 점심시간, 든든하게 채워보세요",
  "정성스런 한 끼로 재충전하는 시간이에요",
];

function getTodayDateString(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function pickCandidatePool(menu: MenuInput): string[] {
  const allText = [...menu.main, ...menu.sides].filter(Boolean).join(" ");

  const matched: string[] = [];
  for (const category of CATEGORY_COMMENTS) {
    if (category.keywords.some((keyword) => allText.includes(keyword))) {
      matched.push(...category.comments);
    }
  }

  return matched.length > 0 ? matched : [...DEFAULT_COMMENTS];
}

export async function generateAiComment(menu: MenuInput): Promise<string | null> {
  const allText = [...menu.main, ...menu.sides].filter(Boolean).join(" ");
  if (!allText.trim()) return null;

  const candidates = pickCandidatePool(menu);

  // 오늘 다른 식당들이 이미 쓴 코멘트 + 이 식당의 직전 코멘트를 조회해서 제외
  const usedToday = new Set<string>();
  let previousForThis: string | null = null;

  try {
    const { data } = await supabase
      .from("cafeteria_menus")
      .select("name, ai_comment, updated_at");

    const today = getTodayDateString();

    for (const row of data || []) {
      if (!row.ai_comment) continue;

      if (row.name === menu.name) {
        previousForThis = row.ai_comment;
        continue;
      }

      const rowDate = row.updated_at ? getTodayDateString(new Date(row.updated_at)) : null;
      if (rowDate === today) {
        usedToday.add(row.ai_comment);
      }
    }
  } catch (err) {
    console.warn("⚠️ 코멘트 중복 체크 조회 실패, 그냥 랜덤으로 진행할게요:", err);
  }

  const exclude = new Set(usedToday);
  if (previousForThis) exclude.add(previousForThis);

  let pool = candidates.filter((c) => !exclude.has(c));

  // 후보가 다 겹쳐서 남는 게 없으면, 전체 후보에서라도 고름 (완전히 실패하는 것보다 나음)
  if (pool.length === 0) pool = candidates;

  return pool[Math.floor(Math.random() * pool.length)];
}
