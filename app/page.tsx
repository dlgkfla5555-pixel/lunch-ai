"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

type Menu = {
  id: number;
  name: string;
  likes: number;
};

export default function Home() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [input, setInput] = useState("");
  const [pick, setPick] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    const { data } = await supabase
      .from("test")
      .select("*")
      .order("id", { ascending: true });

    setMenus(data || []);
  };

  const addMenu = async () => {
    if (!input.trim()) return;

    await supabase.from("test").insert([
      { name: input, likes: 0 }
    ]);

    setInput("");
    fetchMenus();
  };

  const deleteMenu = async (id: number) => {
    await supabase.from("test").delete().eq("id", id);
    fetchMenus();
  };

  const likeMenu = async (menu: Menu) => {
    await supabase
      .from("test")
      .update({ likes: menu.likes + 1 })
      .eq("id", menu.id);

    fetchMenus();
  };

  const pickRandom = () => {
    if (menus.length === 0) return;
    const random = menus[Math.floor(Math.random() * menus.length)];
    setPick(random);
  };

  const aiRecommend = async () => {
  if (menus.length === 0) return;

  setLoading(true);
  setAiResult("");

  const now = new Date();
  const hour = now.getHours();

  let timeText = "점심";
  if (hour < 11) timeText = "아침";
  else if (hour < 17) timeText = "점심";
  else timeText = "저녁";

  // 간단 날씨 (임시 버전)
  const weather = "더움";

  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      menus,
      weather,
      time: timeText,
    }),
  });

  const data = await res.json();

  setAiResult(data.result);
  setLoading(false);
};

  const top3 = [...menus]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  return (
    <main className="mx-auto min-h-screen max-w-[430px] px-5 py-6 bg-gray-50 space-y-6">

      <Header />

      {/* 입력 */}
      <div className="bg-white p-4 rounded-2xl shadow-sm space-y-2">
        <div className="text-sm font-semibold text-gray-600">
          🍱 메뉴 추가
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="예: 김치찌개"
            className="flex-1 border rounded-xl px-3 py-2"
          />

          <button
            onClick={addMenu}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl 
            hover:scale-[1.02] active:scale-95 transition"
          >
            추가
          </button>
        </div>
      </div>

      {/* TOP 3 */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <div className="font-semibold mb-2">🔥 인기 TOP 3</div>

        {top3.length === 0 && (
          <div className="text-sm text-gray-400">
            아직 데이터 없음
          </div>
        )}

        {top3.map((m, i) => (
          <div key={m.id} className="flex justify-between py-1">
            <span>
              {i + 1}. {m.name}
            </span>
            <span className="text-sm text-gray-500">
              ❤️ {m.likes}
            </span>
          </div>
        ))}
      </div>

      {/* 전체 리스트 */}
      <div className="bg-white p-4 rounded-2xl shadow-sm space-y-3">
        <div className="font-semibold">🍽️ 전체 메뉴</div>

        {menus.map((menu) => (
          <div
            key={menu.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <div>{menu.name}</div>
              <div className="text-xs text-gray-400">
                ❤️ {menu.likes}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => likeMenu(menu)}
                className="text-sm hover:scale-110 active:scale-95 transition"
              >
                👍
              </button>

              <button
                onClick={() => deleteMenu(menu.id)}
                className="text-xs text-red-500"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 버튼 */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={pickRandom}
          className="py-3 bg-black text-white rounded-xl 
          hover:scale-[1.02] active:scale-95 transition"
        >
          랜덤 추천
        </button>

        <button
          onClick={aiRecommend}
          className="py-3 bg-purple-600 text-white rounded-xl 
          hover:scale-[1.02] active:scale-95 transition"
        >
          AI 추천
        </button>
      </div>

      {/* 로딩 */}
      {loading && (
        <div className="text-center text-gray-400 animate-pulse">
          AI가 메뉴를 분석 중...
        </div>
      )}

      {/* 랜덤 결과 */}
      {pick && (
        <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
          <div className="text-sm text-gray-500">랜덤 추천</div>
          <div className="text-xl font-bold">{pick.name}</div>
        </div>
      )}

      {/* AI 결과 */}
      {aiResult && (
        <div className="bg-white p-4 rounded-2xl shadow-sm whitespace-pre-wrap">
          {aiResult}
        </div>
      )}
    </main>
  );
}