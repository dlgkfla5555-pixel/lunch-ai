const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function formatMenuDate(updatedAt: string | null): {
  label: string;
  isToday: boolean;
} | null {
  if (!updatedAt) return null;

  const date = new Date(updatedAt);
  if (isNaN(date.getTime())) return null;

  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const label = `${date.getMonth() + 1}/${date.getDate()} (${WEEKDAYS[date.getDay()]})`;

  return { label, isToday };
}
