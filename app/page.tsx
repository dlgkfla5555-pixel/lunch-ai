"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import RecommendationBanner from "@/components/RecommendationBanner";
import FeaturedCafeteriaCard from "@/components/FeaturedCafeteriaCard";
import CafeteriaTabs from "@/components/CafeteriaTabs";

export default function Home() {
  const [cafeterias, setCafeterias] = useState<any[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  // 좋아요가 제일 많은 식당을 "오늘의 추천"으로 (좋아요가 하나도 없으면 1번째로 폴백)
  const recommended =
    cafeterias.length > 0
      ? [...cafeterias].sort((a, b) => (likes[b.name] || 0) - (likes[a.name] || 0))[0]
      : null;

  const hasAnyLikes = Object.values(likes).some((c) => c > 0);
  const top = hasAnyLikes ? recommended : cafeterias[0];

  const active = cafeterias[activeIndex];

  return (
    <main className="max-w-[430px] mx-auto p-5 space-y-4">
      <Header onRefresh={handleRefresh} refreshing={refreshing} />

      {refreshError && (
        <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2">
          {refreshError}
        </div>
      )}

      {loading && <div className="text-center text-gray-400 py-10">불러오는 중...</div>}

      {!loading && top && (
        <RecommendationBanner
          name={top.name}
          tagline={hasAnyLikes ? "오늘 좋아요를 가장 많이 받았어요" : "오늘 가장 든든한 한 끼"}
          highlightMenu={Array.isArray(top.main) ? top.main[0] : top.main}
        />
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
    </main>
  );
}
