const RANK_STYLES: Record<number, { bg: string; building: string }> = {
  1: { bg: "bg-green-500", building: "bg-green-50 text-green-600" },
  2: { bg: "bg-purple-500", building: "bg-purple-50 text-purple-600" },
  3: { bg: "bg-orange-500", building: "bg-orange-50 text-orange-600" },
  4: { bg: "bg-blue-500", building: "bg-blue-50 text-blue-600" },
  5: { bg: "bg-pink-500", building: "bg-pink-50 text-pink-600" },
};

export function getRankStyle(rank: number) {
  return RANK_STYLES[rank] ?? { bg: "bg-gray-400", building: "bg-gray-50 text-gray-500" };
}

export default function RankBadge({ rank }: { rank: number }) {
  const style = getRankStyle(rank);
  return (
    <div
      className={`w-6 h-6 rounded-full ${style.bg} text-white text-xs font-bold flex items-center justify-center shrink-0`}
    >
      {rank}
    </div>
  );
}