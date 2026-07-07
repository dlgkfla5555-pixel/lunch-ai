"use client";

import { useEffect, useState } from "react";

type Props = {
  name: string;
  initialCount: number;
  onLikeSuccess?: (name: string, count: number) => void;
};

function getTodayKey(): string {
  const now = new Date();
  return `liked_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export default function LikeButton({ name, initialCount, onLikeSuccess }: Props) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    try {
      const key = getTodayKey();
      const likedList: string[] = JSON.parse(localStorage.getItem(key) || "[]");
      setLiked(likedList.includes(name));
    } catch {
      // localStorage 접근 실패는 무시
    }
  }, [name]);

  const handleClick = async () => {
    if (liked || submitting) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();

      if (json.success) {
        setCount(json.count);
        setLiked(true);

        const key = getTodayKey();
        const likedList: string[] = JSON.parse(localStorage.getItem(key) || "[]");
        localStorage.setItem(key, JSON.stringify([...likedList, name]));

        // 부모(page.tsx)에게 최신 카운트를 바로 알려줘서
        // "오늘의 추천" 배너가 새로고침 없이도 즉시 갱신되게 함
        onLikeSuccess?.(name, json.count);
      }
    } catch (err) {
      console.error("❌ 좋아요 실패:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={liked || submitting}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
        liked
          ? "bg-pink-50 border-pink-200 text-pink-600"
          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
      } disabled:cursor-default`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        width="16"
        height="16"
      >
        <path d="M20.8 4.6c-1.8-1.8-4.7-1.8-6.5 0L12 6.9l-2.3-2.3c-1.8-1.8-4.7-1.8-6.5 0-1.8 1.8-1.8 4.7 0 6.5L12 20.4l8.8-8.8c1.8-1.8 1.8-4.8 0-7z" />
      </svg>
      {count}
    </button>
  );
}
