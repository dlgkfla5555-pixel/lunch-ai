"use client";

import { useState } from "react";

type Props = {
  names: string[];
};

const CARD_COLORS = [
  "bg-pink-100 text-pink-500",
  "bg-blue-100 text-blue-500",
  "bg-yellow-100 text-yellow-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-500",
];

export default function CardFlipPicker({ names }: Props) {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const handleCardClick = (index: number) => {
    if (flippedIndex !== null || names.length === 0) return;

    const picked = names[Math.floor(Math.random() * names.length)];
    setWinner(picked);
    setFlippedIndex(index);
  };

  const handleReset = () => {
    setFlippedIndex(null);
    setWinner(null);
  };

  return (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 text-center">
      <p className="text-sm font-semibold text-gray-500 mb-4">
        {flippedIndex === null
          ? "카드 한 장을 골라보세요"
          : "오늘의 선택은..."}
      </p>

      <div className="flex justify-center gap-2 mb-5">
        {names.slice(0, 5).map((_, i) => {
          const isFlipped = flippedIndex === i;

          return (
            <button
              key={i}
              onClick={() => handleCardClick(i)}
              disabled={flippedIndex !== null}
              className="[perspective:600px] w-14 h-20 shrink-0"
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* 뒷면 (물음표) */}
                <div
                  className={`absolute inset-0 [backface-visibility:hidden] rounded-xl flex items-center justify-center text-xl font-bold ${CARD_COLORS[i % CARD_COLORS.length]}`}
                >
                  ?
                </div>

                {/* 앞면 (결과) */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl border-2 border-pink-400 bg-white flex items-center justify-center px-1">
                  <span className="text-xs font-bold text-pink-600 leading-tight">
                    {winner}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {flippedIndex !== null && (
        <button
          onClick={handleReset}
          className="bg-black text-white text-sm font-semibold rounded-full px-6 py-2.5"
        >
          다시 하기
        </button>
      )}
    </div>
  );
}
