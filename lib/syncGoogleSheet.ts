import { supabase } from "@/lib/supabase";
import { generateAiComment } from "@/lib/generateAiComment";
import { getTodayKST, parseTodayMenus, type ParsedMenu } from "@/lib/parseMenuSheet";

// 식당별 원본 보기 링크 (시트 헤더 이름과 같아야 함)
const SOURCE_URL_MAP: Record<string, string> = {
  더밥심: "https://pf.kakao.com/_mHWxjX",
  런치타임: "https://www.instagram.com/lunchtime_ypp?igsh=MWNsajBzYzhqZWx0dQ%3D%3D",
  런치투게더: "https://pf.kakao.com/_swtYxl",
  호서: "https://www.instagram.com/hoseofood/",
  호서대: "https://www.instagram.com/hoseofood/",
  온정찬: "https://pf.kakao.com/_UIdXn/posts",
};

// 시트 헤더 이름 → 앱에 표시할 이름 (헤더가 "호서"든 "호서대"든 항상 "호서대"로 저장)
const NAME_ALIASES: Record<string, string> = {
  호서: "호서대",
};

// 시트에 열이 남아있어도 무시할 식당 목록
const EXCLUDED_NAMES = new Set(["윤셰프"]);

/** 환경변수 URL이 어떤 시트인지 요약 (비밀값은 노출하지 않음) */
function describeSheetUrl(url: string): string {
  const id = url.match(/\/spreadsheets\/d\/([^/?#]+)/)?.[1];
  const gid = url.match(/[?&#]gid=(\d+)/)?.[1];
  if (!id) return "알 수 없는 주소 형식";
  if (id === "e") return `웹에 게시된 링크(/d/e/…)${gid ? `, gid=${gid}` : ""}`;
  return `시트 ID ${id.slice(0, 10)}…${gid ? `, gid=${gid}` : ""}`;
}

export async function syncGoogleSheet() {
  const csvUrl = process.env.GOOGLE_SHEET_CSV_URL;

  if (!csvUrl) {
    throw new Error("GOOGLE_SHEET_CSV_URL 환경변수가 설정되지 않았어요.");
  }

  const res = await fetch(csvUrl, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`구글 시트를 가져오지 못했어요. status: ${res.status}`);
  }

  const csvText = await res.text();

  // 한국 시간 기준 오늘 (Vercel 서버는 UTC라서 new Date()의 날짜를 그대로 쓰면 어긋남)
  const today = getTodayKST();
  console.log("📅 오늘 날짜(KST):", today.iso);

  // 오늘 날짜 블록만 뽑아서 식당별 메인/반찬으로 정리
  let menus: ParsedMenu[];
  try {
    menus = parseTodayMenus(csvText, today, EXCLUDED_NAMES);
  } catch (e: any) {
    // 어느 시트를 읽고 있는지 같이 알려줘서 환경변수가 옛 시트를 가리키는지 바로 확인 가능
    throw new Error(`${e?.message || e} | 읽은 곳: ${describeSheetUrl(csvUrl)}`);
  }

  // 식당 이름 통일 (예: 호서 → 호서대)
  menus = menus.map((m) => ({ ...m, name: NAME_ALIASES[m.name] ?? m.name }));

  const results: { name: string; error: string | null }[] = [];

  for (const menu of menus) {
    if (!menu.name) continue;

    // AI 코멘트 생성이 실패해도 메뉴 저장은 계속 진행
    let aiComment: Awaited<ReturnType<typeof generateAiComment>> | null = null;
    try {
      aiComment = await generateAiComment({
        name: menu.name,
        main: menu.main,
        sides: menu.sides,
      });
    } catch (e) {
      console.warn(`⚠️ AI 코멘트 생성 실패 (${menu.name}):`, e);
    }

    const upsertResult = await supabase.from("cafeteria_menus").upsert(
      {
        name: menu.name,
        date: today.iso, // 👈 오늘 날짜(YYYY-MM-DD)를 함께 저장. 앱이 이 값으로 오늘 메뉴만 조회
        main: menu.main,
        sides: menu.sides,
        ai_comment: aiComment,
        source_url: SOURCE_URL_MAP[menu.name] || null,
        source_type: "sheet",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "name" }
    );

    results.push({ name: menu.name, error: upsertResult.error?.message ?? null });
  }

  return results;
}
