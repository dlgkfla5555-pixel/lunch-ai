"use client";

import { useState } from "react";

type Props = {
  names: string[];
};

const CAPSULE_COLORS = [
  "bg-pink-200",
  "bg-blue-200",
  "bg-yellow-200",
  "bg-green-200",
  "bg-purple-200",
];

export default function GachaPicker({ names }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSpin = () => {
    if (names.length === 0 || spinning) return;

    setResult(null);
    setSpinning(true);

    window.setTimeout(() => {
      const picked = names[Math.floor(Math.random() * names.length)];
      setResult(picked);
      setSpinning(false);
    }, 1200);
  };

  return (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 text-center">
      <p className="text-sm font-semibold text-gray-500 mb-4">오늘 뭐 먹을지 고민된다면?</p>

      {!result && (
        <div className="flex justify-center gap-3 mb-5">
          {names.slice(0, 5).map((name, i) => (
            <div
              key={name}
              className={`w-10 h-10 rounded-full ${CAPSULE_COLORS[i % CAPSULE_COLORS.length]} ${
                spinning ? "animate-gacha-shake" : ""
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      )}

      {result && (
        <div className="mb-5 animate-gacha-pop">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-3">
            <span className="text-2xl">🎉</span>
          </div>
          <p className="text-xs text-gray-400 mb-1">오늘의 선택은...</p>
          <p className="text-2xl font-black text-gray-900">{result}</p>
        </div>
      )}

      <button
        onClick={handleSpin}
        disabled={spinning}
        className="bg-black text-white text-sm font-semibold rounded-full px-6 py-2.5 disabled:opacity-50"
      >
        {spinning ? "뽑는 중..." : result ? "다시 뽑기" : "뽑기 시작"}
      </button>
    </div>
  );
}
