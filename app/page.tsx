"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import SlotMachinePicker from "@/components/SlotMachinePicker";
import FeaturedCafeteriaCard from "@/components/FeaturedCafeteriaCard";
import CafeteriaTabs from "@/components/CafeteriaTabs";
import CommentBoard from "@/components/CommentBoard";

export default function Home() {
  const [cafeterias, setCafeterias] = useState<any[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"menu" | "board">("menu");

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase
      .from("cafeteria_menus")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) console.error("❌ ERROR:", error);
    setCafeterias(data || []);
    setLoading(false);
  }, []);

  const fetchLikes = useCallback(async () => {
    try {
      const res = await fetch("/api/like");
      const json = await res.json();

      if (json.success) {
        const likeMap: Record<string, number> = {};
        for (const row of json.likes) {
          likeMap[row.cafeteria_name] = row.count;
        }
        setLikes(likeMap);
      }
    } catch (err) {
      console.error("❌ 좋아요 조회 실패:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchLikes();
  }, [fetchData, fetchLikes]);

  const handleRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);
    setRefreshError(null);

    try {
      const [kakaoRes, sheetRes] = await Promise.allSettled([
        fetch("/api/update-menus").then((r) => r.json()),
        fetch("/api/sync-sheet").then((r) => r.json()),
      ]);

      const kakaoFailed = kakaoRes.status === "fulfilled" && !kakaoRes.value.success;
      const sheetFailed = sheetRes.status === "fulfilled" && !sheetRes.value.success;
      const kakaoRejected = kakaoRes.status === "rejected";
      const sheetRejected = sheetRes.status === "rejected";

      if ((kakaoFailed || kakaoRejected) && (sheetFailed || sheetRejected)) {
        setRefreshError("업데이트에 실패했어요. 잠시 후 다시 시도해주세요.");
      } else if (kakaoFailed || kakaoRejected || sheetFailed || sheetRejected) {
        setRefreshError("일부 데이터만 업데이트됐어요.");
      }

      await fetchData();
      await fetchLikes();
    } catch (err: any) {
      console.error("❌ 새로고침 실패:", err);
      setRefreshError("업데이트에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, fetchData, fetchLikes]);

  const handleLikeSuccess = useCallback((name: string, count: number) => {
    setLikes((prev) => ({ ...prev, [name]: count }));
  }, []);

  const active = cafeterias[activeIndex];

  return (
    <main className="max-w-[430px] mx-auto p-5 space-y-4">
      <Header onRefresh={handleRefresh} refreshing={refreshing} />

      {/* 메뉴 / 메모장 모드 전환 */}
      <div className="flex gap-1 bg-gray-100 rounded-full p-1">
        <button
          onClick={() => setViewMode("menu")}
          className={`flex-1 text-sm font-semibold rounded-full py-2 transition ${
            viewMode === "menu" ? "bg-white shadow-sm text-black" : "text-gray-400"
          }`}
        >
          오늘의 메뉴
        </button>
        <button
          onClick={() => setViewMode("board")}
          className={`flex-1 text-sm font-semibold rounded-full py-2 transition ${
            viewMode === "board" ? "bg-white shadow-sm text-black" : "text-gray-400"
          }`}
        >
          메모장
        </button>
      </div>

      {viewMode === "board" ? (
        <CommentBoard />
      ) : (
        <>
          {refreshError && (
            <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2">
              {refreshError}
            </div>
          )}

          {loading && <div className="text-center text-gray-400 py-10">불러오는 중...</div>}

          {!loading && cafeterias.length > 0 && (
            <SlotMachinePicker names={cafeterias.map((c) => c.name)} />
          )}

          {!loading && cafeterias.length > 0 && (
            <>
              <CafeteriaTabs
                cafeterias={cafeterias}
                activeIndex={activeIndex}
                onChange={setActiveIndex}
              />

              {active && (
                <FeaturedCafeteriaCard
                  key={active.id}
                  rank={activeIndex + 1}
                  cafeteria={active}
                  likeCount={likes[active.name] || 0}
                  onLikeSuccess={handleLikeSuccess}
                />
              )}
            </>
          )}

          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-700">
            매뉴는 매일 오전 11시~12시 사이에 업데이트돼요!
          </div>
        </>
      )}
    </main>
  );
}
