import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { menus } = await req.json();

  const prompt = `
너는 점심 메뉴 추천 전문가야.
아래 메뉴 중 오늘 가장 적절한 1개를 골라줘.

메뉴:
${menus.map((m: any) => `- ${m.name}`).join("\n")}

짧게 한 줄로 이유와 함께 추천해줘.
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
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  const data = await res.json();

  const result = data.choices?.[0]?.message?.content || "추천 실패";

  return NextResponse.json({ result });
}