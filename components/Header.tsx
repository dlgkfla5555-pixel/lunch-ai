"use client";

type Props = {
  onRefresh: () => void;
  refreshing?: boolean;
};

export default function Header({ onRefresh, refreshing }: Props) {
  const now = new Date();

  const dateLabel = now.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });

  const timeLabel = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <header className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-black text-gray-900">오늘 구내식당</h1>
        <p className="text-gray-400 text-sm mt-1">
          오늘 뭐 먹지? 한눈에 보는 구내식당 메뉴
        </p>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-3 py-2 shadow-sm shrink-0">
        <div className="text-right">
          <p className="text-xs text-gray-500 whitespace-nowrap">
            {dateLabel} {timeLabel} 기준
          </p>
          <p className="text-[11px] text-gray-400 whitespace-nowrap">
            메뉴는 매일 업데이트돼요
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="16"
            height="16"
            className={refreshing ? "animate-spin text-gray-500" : "text-gray-500"}
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </button>
      </div>
    </header>
  );
}
