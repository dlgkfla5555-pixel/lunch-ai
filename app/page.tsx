"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import GachaPicker from "@/components/GachaPicker";
import FeaturedCafeteriaCard from "@/components/FeaturedCafeteriaCard";
import CafeteriaTabs from "@/components/CafeteriaTabs";
import CommentBoard from "@/components/CommentBoard";

/** 한국 시간 기준 오늘 날짜 (YYYY-MM-DD) — DB의 date 컬럼과 같은 형식 */
function getTodayKST(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default function Home() {
  const [cafeterias, setCafeterias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"menu" | "board">("menu");

  const syncingRef = useRef(false);
  const autoSyncedRef = useRef(false);

  // 오늘 날짜(date = YYYY-MM-DD)의 메뉴만 조회. 불러온 개수를 반환
  const fetchData = useCallback(async (): Promise<number> => {
    const { data, error } = await supabase
      .from("cafeteria_menus")
      .select("*")
      .eq("date", getTodayKST())
      .order("display_order", { ascending: true });

    if (error) console.error("❌ ERROR:", error);

    const rows = data || [];
    setCafeterias(rows);
    setActiveIndex((i) => (i < rows.length ? i : 0));
    setLoading(false);
    return rows.length;
  }, []);

  // 시트 → DB 동기화 후 다시 조회
  const runSync = useCallback(async () => {
    if (syncingRef.current) return;
    syncingRef.current = true;

    setRefreshing(true);
    setRefreshError(null);

    try {
      const res = await fetch("/api/sync-sheet");
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "업데이트에 실패했어요");
      }

      // 식당별 저장 결과 중 실패가 있으면 알려주기 (조용히 넘어가지 않게)
      const failed = (json.results || []).filter((r: any) => r.error);
      if (failed.length > 0) {
        throw new Error(
          `저장 실패: ${failed.map((r: any) => `${r.name}(${r.error})`).join(", ")}`
        );
      }

      await fetchData();
    } catch (err: any) {
      console.error("❌ 새로고침 실패:", err);
      const message: string = err?.message || "알 수 없는 오류";
      setRefreshError(
        message.includes("날짜의 데이터")
          ? `오늘 메뉴가 아직 시트에 올라오지 않았어요. 11시 이후에 다시 확인해주세요.\n\n[상세] ${message}`
          : `업데이트에 실패했어요: ${message}`
      );
    } finally {
      syncingRef.current = false;
      setRefreshing(false);
    }
  }, [fetchData]);

  // 처음 열었을 때: 오늘 메뉴가 DB에 없으면 자동으로 한 번 동기화
  useEffect(() => {
    (async () => {
      const count = await fetchData();
      if (count === 0 && !autoSyncedRef.current) {
        autoSyncedRef.current = true;
        await runSync();
      }
    })();
  }, [fetchData, runSync]);

  const active = cafeterias[activeIndex];
  const showLoading = loading || (refreshing && cafeterias.length === 0);

  return (
    <main className="max-w-[430px] mx-auto p-5 space-y-4">
      <Header onRefresh={runSync} refreshing={refreshing} />

      <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-700 text-center">
        메뉴는 매일 오전 11시~12시 사이에 업데이트돼요!
      </div>

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
            <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2 whitespace-pre-line break-words">
              {refreshError}
            </div>
          )}

          {showLoading && <div className="text-center text-gray-400 py-10">불러오는 중...</div>}

          {!showLoading && !refreshError && cafeterias.length === 0 && (
            <div className="text-center text-gray-400 py-10 text-sm">
              오늘 메뉴가 아직 없어요. 새로고침을 눌러 확인해보세요.
            </div>
          )}

          {!loading && cafeterias.length > 0 && (
            <>
              <CafeteriaTabs
                cafeterias={cafeterias}
                activeIndex={activeIndex}
                onChange={setActiveIndex}
              />

              {active && (
                <FeaturedCafeteriaCard key={active.id} rank={activeIndex + 1} cafeteria={active} />
              )}
            </>
          )}

          {!loading && cafeterias.length > 0 && (
            <GachaPicker names={cafeterias.map((c) => c.name)} />
          )}
        </>
      )}
    </main>
  );
}
