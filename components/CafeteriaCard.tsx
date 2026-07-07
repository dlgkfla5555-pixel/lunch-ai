import MenuChip from "./MenuChip";

type Cafeteria = {
  id: string | number;
  name: string;
  main: string | null;
  soup: string | null;
  sides: string[] | string | null;
  source_url: string | null;
  updated_at?: string;
};

type Props = {
  cafeteria: Cafeteria;
};

export default function CafeteriaCard({ cafeteria }: Props) {
  const sides =
  Array.isArray(cafeteria.sides)
    ? cafeteria.sides
    : typeof cafeteria.sides === "string"
    ? JSON.parse(cafeteria.sides || "[]")
    : [];

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100">

      {/* 이미지 영역 */}
      <div className="h-52 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">

        <div className="text-center">

          <div className="text-5xl mb-2">
            🍱
          </div>

          <div className="text-gray-500 text-sm">
            메뉴 사진
            <br />
            (다음 단계에서 자동 적용)
          </div>

        </div>

      </div>

      <div className="p-6">

        {/* 식당명 */}

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs text-gray-400 uppercase">
              Cafeteria
            </p>

            <h2 className="text-2xl font-bold">
              {cafeteria.name}
            </h2>

          </div>

          <div className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
            TODAY
          </div>

        </div>

        {/* 메인 */}

        <div className="mt-8">

          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Today's Main
          </p>

          <div className="text-3xl font-black mt-2">
            🍗 {cafeteria.main || "정보 없음"}
          </div>

        </div>

        {/* 국 */}

        {cafeteria.soup && (
          <div className="mt-7">

            <p className="text-gray-500 text-sm mb-3">
              🍲 국 · 면
            </p>

            <div className="flex flex-wrap gap-2">

              <MenuChip menu={cafeteria.soup} />

            </div>

          </div>
        )}

        {/* 반찬 */}

        {sides.length > 0 && (
          <div className="mt-7">

            <p className="text-gray-500 text-sm mb-3">
              🥗 반찬
            </p>

            <div className="flex flex-wrap gap-2">

              {sides.map((side) => (
                <MenuChip
                  key={side}
                  menu={side}
                />
              ))}

            </div>

          </div>
        )}

        {/* 버튼 */}

        {cafeteria.source_url && (
          <a
            href={cafeteria.source_url}
            target="_blank"
            className="
              mt-8
              flex
              justify-center
              items-center
              rounded-2xl
              bg-black
              text-white
              py-4
              font-semibold
              transition
              hover:opacity-90
            "
          >
            원본 메뉴 보기 →
          </a>
        )}

      </div>

    </div>
  );
}