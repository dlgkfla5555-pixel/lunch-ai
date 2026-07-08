"use client";

import { useState } from "react";
import RankBadge, { getRankStyle } from "./RankBadge";
import MenuChip from "./MenuChip";
import CafeteriaMap from "./CafeteriaMap";
import { parseListField } from "@/lib/parseListField";
import { CAFETERIA_ADDRESSES } from "@/lib/cafeteriaAddresses";
import { CAFETERIA_INFO, getNoteIcon } from "@/lib/cafeteriaNotes";

type Cafeteria = {
  id: string | number;
  name: string;
  main: string[] | string | null;
  sides: string[] | string | null;
  source_url: string | null;
  ai_comment: string | null;
};

type Props = {
  rank: number;
  cafeteria: Cafeteria;
};

export default function FeaturedCafeteriaCard({ rank, cafeteria }: Props) {
  const style = getRankStyle(rank);
  const [showMap, setShowMap] = useState(false);

  const mains = parseListField(cafeteria.main).filter((s) => !s.startsWith("미정"));
  const sides = parseListField(cafeteria.sides).filter((s) => !s.startsWith("미정"));

  const address = CAFETERIA_ADDRESSES[cafeteria.name];
  const info = CAFETERIA_INFO[cafeteria.name];
  const notes = info?.notes || [];

  return (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5">
      {/* 상단: 순위 + 이름(+가격) + 위치/원본 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <RankBadge rank={rank} />
          <h3 className="text-lg font-bold text-gray-900 truncate">{cafeteria.name}</h3>
          {info?.price && (
            <span className="text-sm text-gray-400 shrink-0">· {info.price}</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {address && (
            <button
              onClick={() => setShowMap((prev) => !prev)}
              className={`text-xs font-semibold rounded-full px-3 py-1.5 transition border ${
                showMap
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              위치
            </button>
          )}

          {cafeteria.source_url && (
            <a
              href={cafeteria.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-green-600 border border-green-200 rounded-full px-3 py-1.5 hover:bg-green-50 transition"
            >
              원본
            </a>
          )}
        </div>
      </div>

      {/* 지도 (토글) */}
      {showMap && address && (
        <div className="mt-3">
          <CafeteriaMap address={address} />
          <p className="text-xs text-gray-400 mt-1.5">{address}</p>
        </div>
      )}

      {/* 메인(위) / 반찬(아래) 세로 배치 */}
      <div className="mt-4 border border-gray-100 rounded-2xl p-4 space-y-4">
        <div>
          <p className="text-xs text-gray-400 mb-2">메인</p>
          {mains.length > 0 ? (
            <div className="bg-green-50 rounded-xl p-3 space-y-1">
              {mains.map((item) => (
                <div key={item} className="text-base font-bold text-gray-800">
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-green-50 rounded-xl p-3 text-sm text-gray-300">미제공</div>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2">반찬</p>
          <div className="flex flex-wrap gap-2">
            {sides.length > 0 ? (
              sides.map((side) => <MenuChip key={side} menu={side} />)
            ) : (
              <span className="text-sm text-gray-300">미제공</span>
            )}
          </div>
        </div>
      </div>

      {/* 특이사항 배지 (이모티콘 포함) */}
      {notes.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-2">특이사항</p>
          <div className="flex flex-wrap gap-2">
            {notes.map((note) => (
              <span
                key={note}
                className="flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full px-3 py-1.5"
              >
                <span>{getNoteIcon(note)}</span>
                <span>{note}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 한줄 코멘트 */}
      <div className="mt-4 bg-green-50/60 rounded-2xl p-4">
        <p className="text-sm text-gray-600">
          {cafeteria.ai_comment || "코멘트를 준비하지 못했어요."}
        </p>
      </div>
    </div>
  );
}
