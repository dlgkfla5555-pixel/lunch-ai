export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { GET as updateMenusHandler } from "@/app/api/update-menus/route";
import { GET as syncSheetHandler } from "@/app/api/sync-sheet/route";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  console.log("⏰ cron-update started");

  const [kakaoRes, sheetRes] = await Promise.allSettled([
    updateMenusHandler(),
    syncSheetHandler(),
  ]);

  const kakaoJson =
    kakaoRes.status === "fulfilled" ? await kakaoRes.value.json() : { success: false };
  const sheetJson =
    sheetRes.status === "fulfilled" ? await sheetRes.value.json() : { success: false };

  console.log("⏰ cron-update kakao:", kakaoJson.success);
  console.log("⏰ cron-update sheet:", sheetJson.success);

  return Response.json({
    success: true,
    kakao: kakaoJson,
    sheet: sheetJson,
  });
}
