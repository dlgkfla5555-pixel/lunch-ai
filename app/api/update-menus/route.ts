export const maxDuration = 60;

import { supabase } from "@/lib/supabase";
import { scrapeKakaoLatestUrl } from "@/lib/scrapeKakaoLatestUrl";
import { scrapeKakaoPost } from "@/lib/scrapeKakaoPost";
import { parseKakaoMenu } from "@/lib/parseKakaoMenu";
import { generateAiComment } from "@/lib/generateAiComment";

export async function GET() {
  try {
    console.log("🚀 update-menus started");

    // =========================
    // 🍱 더밥심 (Kakao)
    // =========================
    const latestUrl = "https://pf.kakao.com/_mHWxjX/113852240";

    console.log("🔗 Kakao latest URL:", latestUrl);

    const rawText = await scrapeKakaoPost(latestUrl);

    console.log("📄 RAW TEXT LENGTH:", rawText.length);

    const parsed = parseKakaoMenu(rawText);

    console.log("🧠 PARSED MENU:", parsed);

    const aiComment = generateAiComment({
      name: "더밥심",
      main: parsed.main,
      sides: parsed.sides,
      dessert: parsed.dessert,
    });

    console.log("💬 AI COMMENT:", aiComment);

    // =========================
    // 🟢 Supabase 저장 - 더밥심
    // =========================
    const result = await supabase
      .from("cafeteria_menus")
      .upsert(
        {
          name: "더밥심",
          main: parsed.main,
          sides: parsed.sides,
          dessert: parsed.dessert,
          ai_comment: aiComment,
          source_url: latestUrl,
          source_type: "kakao",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "name" }
      );

    console.log("SUPABASE RESULT:", result);

    // =========================
    // ✅ 응답
    // =========================
    return Response.json({
      success: true,
      kakao: {
        url: latestUrl,
        parsed,
        aiComment,
      },
    });
  } catch (error: any) {
    console.error("❌ update-menus error:", error);

    return Response.json({
      success: false,
      error: error?.message || "unknown error",
    });
  }
}
