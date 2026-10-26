import { supabase } from "@/lib/supabase";

// 원하시는 식당 출력 순서 정의
const RESTAURANT_ORDER = ['더밥심', '런치투게더', '호서대', '온정찬', '런치타임', '오정'];

export async function syncGoogleSheet() {
  // 한국 시간 기준 오늘 날짜 (YYYY-MM-DD)
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });

  // 1. 오늘 날짜에 해당하는 메뉴만 Supabase에서 조회
  const { data, error } = await supabase
    .from("cafeteria_menus")
    .select("*")
    .eq("date", today);

  if (error) {
    throw new Error(`Supabase 메뉴 데이터를 불러오지 못했어요: ${error.message}`);
  }

  // 2. 지정한 식당 순서대로 정렬
  const sortedData = (data || []).sort((a, b) => {
    return RESTAURANT_ORDER.indexOf(a.name) - RESTAURANT_ORDER.indexOf(b.name);
  });

  // 3. 결과 포맷 변환
  const results = sortedData.map((item) => ({
    name: item.name,
    error: null,
  }));

  return results;
}