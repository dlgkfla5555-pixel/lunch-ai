import { supabase } from "@/lib/supabase";

function getTodayDateString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return Response.json({ success: false, error: "name이 필요해요." }, { status: 400 });
    }

    const today = getTodayDateString();

    const { data, error } = await supabase.rpc("increment_like", {
      p_name: name,
      p_date: today,
    });

    if (error) throw new Error(error.message);

    return Response.json({ success: true, count: data });
  } catch (error: any) {
    console.error("❌ like error:", error);
    return Response.json(
      { success: false, error: error?.message || "unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const today = getTodayDateString();

    const { data, error } = await supabase
      .from("cafeteria_likes")
      .select("cafeteria_name, count")
      .eq("like_date", today);

    if (error) throw new Error(error.message);

    return Response.json({ success: true, likes: data });
  } catch (error: any) {
    console.error("❌ like GET error:", error);
    return Response.json(
      { success: false, error: error?.message || "unknown error" },
      { status: 500 }
    );
  }
}
