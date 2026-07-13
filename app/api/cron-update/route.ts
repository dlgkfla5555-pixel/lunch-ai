export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

  const sheetRes = await syncSheetHandler();
  const sheetJson = await sheetRes.json();

  console.log("⏰ cron-update sheet:", sheetJson.success);

  return Response.json({
    success: true,
    sheet: sheetJson,
  });
}
