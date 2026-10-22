import { syncGoogleSheet } from "@/lib/syncGoogleSheet";

// 배포된 코드가 최신인지 확인하는 용도의 표시 (응답에 version이 보이면 이 코드가 배포된 것)
const VERSION = "2026-10-22-date-kst";

export async function GET() {
  try {
    const results = await syncGoogleSheet();
    return Response.json({ success: true, version: VERSION, results });
  } catch (error: any) {
    console.error("❌ sync-sheet error:", error);
    return Response.json({
      success: false,
      version: VERSION,
      error: error?.message || "unknown error",
    });
  }
}
