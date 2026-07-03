export default function Header() {
  const now = new Date();

  const date = now.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const time = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="mb-6">
      <p className="text-sm text-gray-500">{date}</p>

      <h1 className="mt-1 text-3xl font-bold">
        🍱 오늘 뭐 먹지?
      </h1>

      <p className="mt-2 text-sm text-gray-400">
        마지막 업데이트 {time}
      </p>
    </header>
  );
}