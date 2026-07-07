type Props = {
  menu: string;
};

export default function MenuChip({ menu }: Props) {
  return (
    <div className="bg-gray-100 rounded-full px-3 py-2 text-sm font-medium text-gray-700">
      {menu}
    </div>
  );
}
