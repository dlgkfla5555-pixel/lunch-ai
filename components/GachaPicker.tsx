"use client";

import { useState } from "react";

type Props = {
  names: string[];
};

const CAPSULE_GRADIENTS = [
  "bg-gradient-to-br from-pink-400 to-rose-500",
  "bg-gradient-to-br from-sky-400 to-blue-500",
  "bg-gradient-to-br from-amber-300 to-orange-500",
  "bg-gradient-to-br from-emerald-400 to-teal-500",
  "bg-gradient-to-br from-purple-400 to-violet-600",
];

const CONFETTI = ["🎉", "✨", "🎊", "💫", "⭐"];

export default function GachaPicker({ names }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSpin = () => {
    if (names.length === 0 || spinning) return;

    setResult(null);
    setShowConfetti(false);
    setSpinning(true);

    window.setTimeout(() => {
      const picked = names[Math.floor(Math.random() * names.length)];
      setResult(picked);
      setSpinning(false);
      setShowConfetti(true);
      window.setTimeout(() => setShowConfetti(false), 1000);
    }, 1100);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 p-6 text-center shadow-lg">
      {/* 은은한 배경 장식 */}
      <div className="pointer-events-none absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
      <div className="pointer-events-none absolute -bottom-8 -right-4 w-28 h-28 rounded-full bg-white/10 blur-xl" />

      <p className="relative text-sm font-bold text-white/90 mb-4 tracking-tight">
        오늘 뭐 먹을지 고민된다면?
      </p>

      {!result && (
        <div className="relative flex justify-center gap-3 mb-6">
          {names.slice(0, 5).map((name, i) => (
            <div
              key={name}
              className={`w-11 h-11 rounded-full ${CAPSULE_GRADIENTS[i % CAPSULE_GRADIENTS.length]} shadow-md ${
                spinning ? "animate-gacha-shake-hard" : "animate-bounce"
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {result && (
        <div className="relative mb-6 animate-gacha-drop">
          {showConfetti && (
            <div className="pointer-events-none absolute inset-x-0 -top-2 flex justify-center gap-3">
              {CONFETTI.map((emoji, i) => (
                <span
                  key={i}
                  className="animate-confetti text-lg"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}

          <div className="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center mb-3 shadow-xl animate-glow-pulse">
            <span className="text-3xl">🎁</span>
          </div>

          <p className="text-xs font-semibold text-white/80 mb-1">오늘의 선택은...</p>
          <p className="text-3xl font-black text-white drop-shadow-md">{result}</p>
        </div>
      )}

      <button
        onClick={handleSpin}
        disabled={spinning}
        className="relative bg-white text-fuchsia-600 text-sm font-bold rounded-full px-7 py-3 shadow-md active:scale-95 transition disabled:opacity-60"
      >
        {spinning ? "뽑는 중..." : result ? "다시 뽑기" : "뽑기 시작 ✦"}
      </button>
    </div>
  );
}
