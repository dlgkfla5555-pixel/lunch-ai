import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { menus, weather, time } = await req.json();

  const prompt = `
너는 점심 메뉴 추천 전문가야.

상황:
- 날씨: ${weather || "모름"}
- 시간: ${time || "점심"}

메뉴 리스트:
${menus.map((m: any) => `- ${m.name}`).join("\n")}

조건:
- 상황에 맞게 가장 적절한 1개 추천
- 짧고 자연스럽게 이유 포함
- 사람 말투처럼
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a friendly food recommendation assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    }),
  });

  const data = await res.json();

  return NextResponse.json({
    result: data.choices?.[0]?.message?.content || "추천 실패",
  });
}