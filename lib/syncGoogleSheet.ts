import Papa from "papaparse";
import { supabase } from "@/lib/supabase";
import { generateAiComment } from "@/lib/generateAiComment";

function toArray(text: string | undefined): string[] {
  if (!text) return [];
  return text
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const LABEL_ROW_KEY_INDEX = 1; // 두 번째 열 = "구분"
const MAIN_ROW_LABEL = "메인";
const SIDES_ROW_LABEL = "반찬";

// 식당별 원본 보기 링크
const SOURCE_URL_MAP: Record<string, string> = {
  더밥심: "https://pf.kakao.com/_mHWxjX",
  런치타임: "https://www.instagram.com/lunchtime_ypp/",
  런치투게더: "https://pf.kakao.com/_swtYxl",
};

// 시트에 열이 남아있어도 무시할 식당 목록
const EXCLUDED_NAMES = new Set(["윤셰프"]);

function extractMonthDay(text: string): { month: number; day: number } | null {
  const slashMatch = text.match(/(\d{1,2})\s*[/\-.]\s*(\d{1,2})/);
  if (slashMatch) {
    return { month: Number(slashMatch[1]), day: Number(slashMatch[2]) };
  }

  const koreanMatch = text.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
  if (koreanMatch) {
    return { month: Number(koreanMatch[1]), day: Number(koreanMatch[2]) };
  }

  return null;
}

function getTodayMonthDay(): { month: number; day: number } {
  const now = new Date();
  return { month: now.getMonth() + 1, day: now.getDate() };
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

  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    console.warn("⚠️ CSV 파싱 경고:", parsed.errors);
  }

  const fields = parsed.meta.fields || [];

  if (fields.length < 3) {
    throw new Error(
      `시트 열이 너무 적어요. 날짜, 구분, 식당명들 순서로 최소 3개 열이 필요해요. (실제 헤더: ${JSON.stringify(
        fields
      )})`
    );
  }

  const dateKey = fields[0];
  const labelKey = fields[LABEL_ROW_KEY_INDEX];
  const cafeteriaNames = fields
    .slice(2)
    .filter(Boolean)
    .filter((name) => !EXCLUDED_NAMES.has(name.trim()));

  if (cafeteriaNames.length === 0) {
    throw new Error(
      `식당명 컬럼을 찾지 못했어요. 3번째 열부터 식당명이 있어야 해요. (실제 헤더: ${JSON.stringify(
        fields
      )})`
    );
  }

  const today = getTodayMonthDay();
  console.log("📅 오늘 날짜:", today);

  let currentMonthDay: { month: number; day: number } | null = null;
  const todayRows: Record<string, string>[] = [];

  for (const row of parsed.data) {
    const rawDate = row[dateKey]?.trim();
    if (rawDate) {
      const parsedDate = extractMonthDay(rawDate);
      if (parsedDate) currentMonthDay = parsedDate;
    }

    if (
      currentMonthDay &&
      currentMonthDay.month === today.month &&
      currentMonthDay.day === today.day
    ) {
      todayRows.push(row);
    }
  }

  if (todayRows.length === 0) {
    throw new Error(
      `오늘(${today.month}/${today.day}) 날짜의 데이터를 시트에서 찾지 못했어요. 날짜 열 표기를 확인해주세요.`
    );
  }

  const dataByCafeteria: Record<string, { main?: string; sides?: string }> = {};

  for (const row of todayRows) {
    const label = row[labelKey]?.trim();
    if (!label) continue;

    for (const name of cafeteriaNames) {
      if (!dataByCafeteria[name]) dataByCafeteria[name] = {};

      if (label === MAIN_ROW_LABEL) {
        dataByCafeteria[name].main = row[name];
      } else if (label === SIDES_ROW_LABEL) {
        dataByCafeteria[name].sides = row[name];
      }
    }
  }

  const results: any[] = [];

  for (const name of cafeteriaNames) {
    const trimmedName = name.trim();
    if (!trimmedName) continue;

    const entry = dataByCafeteria[name] || {};
    const mainList = toArray(entry.main);
    const sidesList = toArray(entry.sides);

    const aiComment = generateAiComment({
      name: trimmedName,
      main: mainList,
      sides: sidesList,
    });

    const upsertResult = await supabase.from("cafeteria_menus").upsert(
      {
        name: trimmedName,
        main: mainList,
        sides: sidesList,
        ai_comment: aiComment,
        source_url: SOURCE_URL_MAP[trimmedName] || null,
        source_type: "sheet",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "name" }
    );

    results.push({ name: trimmedName, error: upsertResult.error?.message ?? null });
  }

  return results;
}
