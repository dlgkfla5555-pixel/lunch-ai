"use client";

import { useEffect, useState, useCallback } from "react";

type Comment = {
  id: number;
  content: string;
  created_at: string;
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function CommentBoard() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch("/api/comments");
      const json = await res.json();
      if (json.success) setComments(json.comments);
    } catch (err) {
      console.error("❌ 댓글 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error || "등록에 실패했어요.");
        return;
      }

      setText("");
      await fetchComments();
    } catch (err) {
      setError("네트워크 오류가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="익명으로 자유롭게 한마디 남겨보세요 (최대 300자)"
          rows={3}
          maxLength={300}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">{text.length}/300</p>
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="bg-black text-white text-sm font-semibold rounded-full px-4 py-2 disabled:opacity-40"
          >
            {submitting ? "등록 중..." : "등록"}
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </form>

      <div className="space-y-2">
        {loading && <p className="text-center text-gray-400 text-sm py-6">불러오는 중...</p>}

        {!loading && comments.length === 0 && (
          <p className="text-center text-gray-300 text-sm py-6">
            아직 남겨진 글이 없어요. 첫 글을 남겨보세요!
          </p>
        )}

        {comments.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm"
          >
            <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
              {c.content}
            </p>
            <p className="text-[11px] text-gray-300 mt-1.5">{formatTime(c.created_at)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
