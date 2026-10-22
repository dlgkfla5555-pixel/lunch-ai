import { syncGoogleSheet } from "@/lib/syncGoogleSheet";

// 빌드 때 결과가 고정(캐시)되지 않고, 요청할 때마다 실제로 동기화가 돌도록 강제
export const dynamic = "force-dynamic";
export const revalidate = 0;

// 배포된 코드가 최신인지 확인하는 용도의 표시 (응답에 version이 보이면 이 코드가 배포된 것)
const VERSION = "2026-10-22-v2-dynamic";

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
