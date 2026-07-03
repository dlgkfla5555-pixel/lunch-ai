type Props = {
  name: string;
  menu?: string;
  price?: string;
  updatedAt?: string;
};

export default function RestaurantCard({
  name,
  menu = "오늘의 메뉴 준비 중",
  price = "가격 정보 없음",
  updatedAt = "업데이트 정보 없음",
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm active:scale-[0.99] transition">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className="text-xs text-gray-400">{updatedAt}</span>
      </div>

      <p className="mt-2 text-gray-700">{menu}</p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">{price}</span>

        <button className="text-sm font-medium text-blue-500">
          원본 보기
        </button>
      </div>
    </div>
  );
}