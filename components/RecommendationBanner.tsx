type Props = {
  name: string;
  tagline?: string;
  highlightMenu?: string | null;
};

export default function RecommendationBanner({ name, tagline, highlightMenu }: Props) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 p-5">
      <p className="text-xs font-semibold text-amber-600">오늘의 추천</p>
      <h2 className="text-2xl font-black mt-0.5 text-gray-900">{name}</h2>
      {tagline && <p className="text-sm text-gray-500 mt-0.5">{tagline}</p>}
      {highlightMenu && (
        <p className="text-sm text-gray-600 mt-2 font-medium">{highlightMenu}</p>
      )}
    </div>
  );
}
