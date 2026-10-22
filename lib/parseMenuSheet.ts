import Papa from "papaparse";

const LABEL_ROW_KEY_INDEX = 1; // 두 번째 열 = "구분"
const MAIN_ROW_LABEL = "메인";
const SIDES_ROW_LABEL = "반찬";

export type TodayInfo = { year: number; month: number; day: number; iso: string };
export type ParsedMenu = { name: string; main: string[]; sides: string[] };

/** 한국 시간 기준 오늘 날짜 (서버가 UTC여도 날짜가 어긋나지 않게) */
export function getTodayKST(now: Date = new Date()): TodayInfo {
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // 예: "2026-10-21"
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day, iso };
}

function toArray(text: string | undefined): string[] {
  if (!text) return [];
  return text
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** "10/21", "10/21(수)", "2026-10-21", "10월 21일" 등에서 월/일 추출 */
export function extractMonthDay(text: string): { month: number; day: number } | null {
  const valid = (month: number, day: number) =>
    month >= 1 && month <= 12 && day >= 1 && day <= 31 ? { month, day } : null;

  let m = text.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
  if (m) return valid(Number(m[1]), Number(m[2]));

  m = text.match(/\d{4}\s*[/\-.]\s*(\d{1,2})\s*[/\-.]\s*(\d{1,2})/); // 연도 포함
  if (m) return valid(Number(m[1]), Number(m[2]));

  m = text.match(/(\d{1,2})\s*[/\-.]\s*(\d{1,2})/);
  if (m) return valid(Number(m[1]), Number(m[2]));

  return null;
}

/**
 * 시트 CSV(날짜 | 구분 | 식당1 | 식당2 ...)에서 "오늘 날짜" 블록만 뽑아 식당별 메인/반찬으로 반환.
 * - 날짜 칸은 병합돼 있어 첫 행에만 값이 있으므로, 비어 있으면 위 행의 날짜를 이어받음
 * - 다른 날짜의 행은 절대 섞지 않음
 */
export function parseTodayMenus(
  csvText: string,
  today: TodayInfo,
  excludedNames: Set<string> = new Set()
): ParsedMenu[] {
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
    .filter((name) => name && name.trim())
    .filter((name) => !excludedNames.has(name.trim()));

  if (cafeteriaNames.length === 0) {
    throw new Error(
      `식당명 컬럼을 찾지 못했어요. 3번째 열부터 식당명이 있어야 해요. (실제 헤더: ${JSON.stringify(
        fields
      )})`
    );
  }

  let currentMonthDay: { month: number; day: number } | null = null;
  const todayRows: Record<string, string>[] = [];
  const seenDates: string[] = []; // 진단용: 시트에서 실제로 읽은 날짜 값들

  for (const row of parsed.data) {
    const rawDate = row[dateKey]?.trim();
    if (rawDate) {
      if (!seenDates.includes(rawDate)) seenDates.push(rawDate);
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
      `오늘(${today.month}/${today.day}) 날짜의 데이터를 시트에서 찾지 못했어요. 날짜 열 표기를 확인해주세요.` +
        ` | 읽은 헤더: ${fields.join(" / ")}` +
        ` | 읽은 날짜 값(최근 5개): ${seenDates.slice(-5).join(", ") || "(없음)"}` +
        ` | 데이터 행: ${parsed.data.length}개`
    );
  }

  return cafeteriaNames.map((name) => {
    let main: string | undefined;
    let sides: string | undefined;

    for (const row of todayRows) {
      const label = row[labelKey]?.trim();
      if (label === MAIN_ROW_LABEL) main = row[name];
      else if (label === SIDES_ROW_LABEL) sides = row[name];
    }

    return { name: name.trim(), main: toArray(main), sides: toArray(sides) };
  });
}
