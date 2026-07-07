import { supabase } from "@/lib/supabase";

const MAX_LENGTH = 300;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("board_comments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw new Error(error.message);

    return Response.json({ success: true, comments: data });
  } catch (error: any) {
    console.error("❌ comments GET error:", error);
    return Response.json(
      { success: false, error: error?.message || "unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    const trimmed = (content || "").trim();

    if (!trimmed) {
      return Response.json(
        { success: false, error: "내용을 입력해주세요." },
        { status: 400 }
      );
    }

    if (trimmed.length > MAX_LENGTH) {
      return Response.json(
        { success: false, error: `${MAX_LENGTH}자 이내로 작성해주세요.` },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("board_comments").insert({ content: trimmed });

    if (error) throw new Error(error.message);

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("❌ comments POST error:", error);
    return Response.json(
      { success: false, error: error?.message || "unknown error" },
      { status: 500 }
    );
  }
}
