type Props = {
  setTab: (tab: string) => void;
  currentTab: string;
};

export default function BottomTab({ setTab, currentTab }: Props) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[430px]">
      <div className="flex justify-between rounded-2xl bg-white px-6 py-3 shadow-lg">

        <button
          onClick={() => setTab("ai")}
          className={`text-sm font-medium ${
            currentTab === "ai" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          AI 추천
        </button>

        <button
          onClick={() => setTab("list")}
          className={`text-sm font-medium ${
            currentTab === "list" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          식당
        </button>

        <button
          onClick={() => setTab("compare")}
          className={`text-sm font-medium ${
            currentTab === "compare" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          비교
        </button>

      </div>
    </div>
  );
}