"use client";

import { useState, useRef } from "react";

type Props = {
  names: string[];
};

const ITEM_HEIGHT = 56;
const REPEAT_COUNT = 6;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function SlotMachinePicker({ names }: Props) {
  const [reelItems, setReelItems] = useState<string[]>(names);
  const [offset, setOffset] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const winnerIndexRef = useRef(0);

  const handleSpin = () => {
    if (names.length === 0 || spinning) return;

    // 여러 바퀴 섞은 릴 데이터 생성, 마지막 사이클에서 당첨자 위치 지정
    const cycles: string[] = [];
    for (let i = 0; i < REPEAT_COUNT; i++) {
      cycles.push(...shuffle(names));
    }
    const pickedIndex = Math.floor(Math.random() * names.length);
    const picked = names[pickedIndex];
    const landingIndex = cycles.length - names.length + pickedIndex;
    cycles[landingIndex] = picked;

    setReelItems(cycles);
    winnerIndexRef.current = landingIndex;
    setWinner(null);
    setSpinning(true);
    setOffset(0);

    // 리플로우 이후 목표 위치로 트랜지션 이동
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOffset(landingIndex * ITEM_HEIGHT);
      });
    });
  };

  const handleTransitionEnd = () => {
    if (!spinning) return;
    setSpinning(false);
    setWinner(reelItems[winnerIndexRef.current]);
  };

  return (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 text-center">
      <p className="text-sm font-semibold text-gray-500 mb-4">오늘 뭐 먹을지 고민된다면?</p>

      <div className="relative mx-auto mb-5 w-full max-w-[220px]">
        <div
          className="relative overflow-hidden bg-gray-900 rounded-2xl"
          style={{ height: ITEM_HEIGHT }}
        >
          <div
            className="transition-transform ease-out"
            style={{
              transform: `translateY(-${offset}px)`,
              transitionDuration: spinning ? "2500ms" : "0ms",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {reelItems.map((name, i) => (
              <div
                key={i}
                className="flex items-center justify-center text-white font-bold text-base px-2"
                style={{ height: ITEM_HEIGHT }}
              >
                {name}
              </div>
            ))}
          </div>

          {/* 중앙 선택선 표시 */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full border-y-2 border-pink-400/70" />
        </div>
      </div>

      {winner && !spinning && (
        <p className="text-sm text-gray-400 mb-4">
          오늘의 선택은 <span className="font-bold text-gray-800">{winner}</span> 이에요!
        </p>
      )}

      <button
        onClick={handleSpin}
        disabled={spinning}
        className="bg-black text-white text-sm font-semibold rounded-full px-6 py-2.5 disabled:opacity-50"
      >
        {spinning ? "돌아가는 중..." : winner ? "다시 돌리기" : "슬롯 돌리기"}
      </button>
    </div>
  );
}
