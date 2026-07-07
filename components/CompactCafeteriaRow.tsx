import RankBadge, { getRankStyle } from "./RankBadge";
import { parseListField } from "@/lib/parseListField";

type Cafeteria = {
  id: string | number;
  name: string;
  main: string[] | string | null;
  sides: string[] | string | null;
  source_url: string | null;
};

type Props = {
  rank: number;
  cafeteria: Cafeteria;
};

export default function CompactCafeteriaRow({ rank, cafeteria }: Props) {
  const style = getRankStyle(rank);

  const mains = parseListField(cafeteria.main).filter((s) => !s.startsWith("미정"));
  const sides = parseListField(cafeteria.sides).filter((s) => !s.startsWith("미정"));

  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <RankBadge rank={rank} />

        <div className={`w-10 h-10 rounded-xl ${style.building} flex items-center justify-center text-lg shrink-0`}>
          🏢
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm truncate">{cafeteria.name}</p>
          <p className="text-[11px] text-gray-400">방금 업데이트</p>
        </div>

        {cafeteria.source_url && (
          <a
            href={cafeteria.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-600 border border-blue-200 rounded-full px-2.5 py-1.5 whitespace-nowrap shrink-0"
          >
            원본 보기
          </a>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-2 pl-[52px]">
        <span>🍖 {mains.length > 0 ? mains.join(", ") : "미제공"}</span>
        <span>🥗 {sides.length > 0 ? sides.join(", ") : "미제공"}</span>
      </div>
    </div>
  );
}
