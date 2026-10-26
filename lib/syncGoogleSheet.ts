import { supabase } from "@/lib/supabase";

/**
 * 웹앱 서버가 직접 구글 시트를 읽지 않고, 
 * 이미 Supabase DB에 적재된 데이터를 그대로 반환하도록 우회하는 함수입니다.
 */
export async function syncGoogleSheet() {
  // Supabase에 저장된 최신 메뉴 데이터를 조회
  const { data, error } = await supabase
    .from("cafeteria_menus")
    .select("*");

  if (error) {
    throw new Error(`Supabase 메뉴 데이터를 불러오지 못했어요: ${error.message}`);
  }

  // 기존 동기화 결과 포맷에 맞춰 반환
  const results = (data || []).map((item) => ({
    name: item.name,
    error: null,
  }));

  return results;
}