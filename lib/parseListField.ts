/**
 * DB에서 온 값이 배열(jsonb)이든, Postgres 배열 리터럴(text[])이든,
 * 콤마 구분 문자열이든, JSON 문자열이든 항상 string[] 로 안전하게 변환.
 */
export function parseListField(value: string[] | string | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);

  const trimmed = value.trim();
  if (!trimmed) return [];

  // JSON 배열 문자열인 경우 (예: '["짜장","콩나물짬뽕"]')
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [trimmed];
    } catch {
      // JSON 파싱 실패 시 아래 콤마 분리로 폴백
    }
  }

  // Postgres 배열 리터럴인 경우 (예: '{샐러드,단무지}' 또는 '{"샐러드","단무지"}')
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    const inner = trimmed.slice(1, -1);
    if (!inner) return [];
    return inner
      .split(",")
      .map((s) => s.trim().replace(/^"(.*)"$/, "$1").trim())
      .filter(Boolean);
  }

  // 콤마 구분 문자열인 경우 (예: '짜장, 콩나물짬뽕')
  return trimmed
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// "미정"으로 시작하는 값은 실제 데이터가 아닌 placeholder 텍스트로 간주
export function isPlaceholder(value: string | null | undefined): boolean {
  if (!value) return true;
  return value.trim().startsWith("미정");
}

export function displayOrFallback(
  value: string | null | undefined,
  fallback: string = "미제공"
): string {
  return isPlaceholder(value) ? fallback : (value as string);
}
