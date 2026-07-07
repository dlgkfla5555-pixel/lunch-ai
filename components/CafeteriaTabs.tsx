type Cafeteria = {
  id: string | number;
  name: string;
};

type Props = {
  cafeterias: Cafeteria[];
  activeIndex: number;
  onChange: (index: number) => void;
};

export default function CafeteriaTabs({ cafeterias, activeIndex, onChange }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-gray-200">
      {cafeterias.map((c, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={c.id}
            onClick={() => onChange(i)}
            className={`shrink-0 px-4 py-2 text-sm whitespace-nowrap border-b-2 transition ${
              active
                ? "border-black font-bold text-black"
                : "border-transparent text-gray-400"
            }`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
