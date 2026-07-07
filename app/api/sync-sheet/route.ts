import { syncGoogleSheet } from "@/lib/syncGoogleSheet";

export async function GET() {
  try {
    const results = await syncGoogleSheet();
    return Response.json({ success: true, results });
  } catch (error: any) {
    console.error("❌ sync-sheet error:", error);
    return Response.json({
      success: false,
      error: error?.message || "unknown error",
    });
  }
}
