type Props = {
  text: string;
};

export default function AiCard({ text }: Props) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white shadow-lg">
      <p className="text-sm opacity-80">🤖 AI 추천</p>

      <h2 className="mt-2 text-xl font-bold leading-snug">
        {text}
      </h2>

      <p className="mt-3 text-xs opacity-80">
        오늘 데이터 기반으로 추천했어요
      </p>
    </div>
  );
}