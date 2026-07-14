export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { scrapeKakaoLatestUrl } from "@/lib/scrapeKakaoLatestUrl";
import { scrapeKakaoPost } from "@/lib/scrapeKakaoPost";
import { parseKakaoMenu } from "@/lib/parseKakaoMenu";
import { generateAiComment } from "@/lib/generateAiComment";

export async function GET() {
  try {
    console.log("🚀 update-menus started");

    // =========================
    // 더밥심 (Kakao) - 최신 게시물 URL을 매번 새로 찾음
    // =========================
    const latestUrl = await scrapeKakaoLatestUrl();

    if (!latestUrl) {
      throw new Error("카카오 채널에서 최신 게시물 URL을 찾지 못했어요.");
    }

    console.log("🔗 Kakao latest URL:", latestUrl);

    const rawText = await scrapeKakaoPost(latestUrl);

    console.log("📄 RAW TEXT LENGTH:", rawText.length);

    const parsed = parseKakaoMenu(rawText);

    console.log("🧠 PARSED MENU:", parsed);

    const aiComment = generateAiComment({
      name: "더밥심",
      main: parsed.main,
      sides: parsed.sides,
    });

    console.log("💬 AI COMMENT:", aiComment);

    // =========================
    // Supabase 저장 - 더밥심
    // =========================
    const result = await supabase
      .from("cafeteria_menus")
      .upsert(
        {
          name: "더밥심",
          main: parsed.main,
          sides: parsed.sides,
          ai_comment: aiComment,
          source_url: latestUrl,
          source_type: "kakao",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "name" }
      );

    console.log("SUPABASE RESULT:", result);

    // =========================
    // 응답
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
