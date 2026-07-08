"use client";

import { useState } from "react";

type Props = {
  names: string[];
};

const CONFETTI = ["✨", "🎀", "💫", "⭐", "🌸"];

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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 to-violet-50 border border-violet-100 p-6 text-center">
      <p className="relative text-sm font-semibold text-violet-400 mb-4 tracking-tight">
        오늘 뭐 먹을지 고민된다면?
      </p>

      {!result && (
        <div className="relative flex justify-center gap-3 mb-6">
          {names.slice(0, 5).map((name, i) => (
            <div
              key={name}
              className={`w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(180,150,220,0.35)] ${
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

          <div className="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center mb-3 shadow-[0_4px_16px_rgba(180,150,220,0.35)]">
            <span className="text-3xl">🎁</span>
          </div>

          <p className="text-xs font-semibold text-violet-300 mb-1">오늘의 선택은...</p>
          <p className="text-3xl font-black text-violet-500">{result}</p>
        </div>
      )}

      <button
        onClick={handleSpin}
        disabled={spinning}
        className="relative bg-white text-violet-400 text-sm font-bold rounded-full px-7 py-3 shadow-[0_2px_10px_rgba(180,150,220,0.3)] active:scale-95 transition disabled:opacity-60"
      >
        {spinning ? "뽑는 중..." : result ? "다시 뽑기" : "뽑기 시작"}
      </button>
    </div>
  );
}
