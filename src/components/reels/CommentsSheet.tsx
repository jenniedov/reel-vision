import { useEffect, useRef, useState } from "react";
import { Heart, X } from "lucide-react";
import type { ReelComment } from "@/types/reel";
import { formatCount, relativeTime } from "@/lib/format";

interface Props {
  open: boolean;
  onClose: () => void;
  comments: ReelComment[];
  totalCount: number;
}

export function CommentsSheet({ open, onClose, comments, totalCount }: Props) {
  // Dedupe + sort by likes desc
  const seen = new Set<string>();
  const sorted = [...comments]
    .filter((c) => {
      const key = `${c.username}:${c.text}:${c.timestamp}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.likes - a.likes);

  const [dragY, setDragY] = useState(0);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!open) setDragY(0);
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        className={`absolute inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        style={{ transform: `translateY(${open ? dragY : 100}%)` }}
        className="absolute inset-x-0 bottom-0 z-50 flex h-[72%] flex-col rounded-t-2xl bg-neutral-900 text-white shadow-2xl transition-transform duration-300 ease-out"
      >
        <div
          className="cursor-grab touch-none pb-1 pt-2"
          onTouchStart={(e) => {
            startY.current = e.touches[0].clientY;
          }}
          onTouchMove={(e) => {
            if (startY.current == null) return;
            const dy = e.touches[0].clientY - startY.current;
            if (dy > 0) setDragY((dy / window.innerHeight) * 100);
          }}
          onTouchEnd={() => {
            if (dragY > 25) onClose();
            else setDragY(0);
            startY.current = null;
          }}
        >
          <div className="mx-auto h-1 w-10 rounded-full bg-neutral-600" />
        </div>
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
          <div className="w-6" />
          <div className="text-sm font-semibold">
            Comments{" "}
            {totalCount > 0 && (
              <span className="text-neutral-400">· {formatCount(totalCount)}</span>
            )}
          </div>
          <button onClick={onClose} aria-label="Close" className="text-neutral-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          {sorted.map((c, i) => (
            <div key={i} className="flex items-start gap-3 py-3">
              <img
                src={
                  c.profile_pic_url ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.username)}`
                }
                alt=""
                className="h-9 w-9 flex-shrink-0 rounded-full bg-neutral-800 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.username)}`;
                }}
              />
              <div className="min-w-0 flex-1 text-sm">
                <div>
                  <span className="font-semibold">{c.username}</span>{" "}
                  <span className="text-neutral-100">{c.text}</span>
                </div>
                <div className="mt-1 flex gap-3 text-xs text-neutral-400">
                  <span>{relativeTime(c.timestamp)}</span>
                  {c.likes > 0 && <span>{formatCount(c.likes)} likes</span>}
                  {c.replies_count > 0 && (
                    <span>
                      {c.replies_count} {c.replies_count === 1 ? "reply" : "replies"}
                    </span>
                  )}
                </div>
              </div>
              <CommentLikeButton initialLikes={c.likes} />
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="py-10 text-center text-sm text-neutral-500">
              No comments yet
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CommentLikeButton({ initialLikes }: { initialLikes: number }) {
  const [liked, setLiked] = useState(false);
  const count = initialLikes + (liked ? 1 : 0);
  return (
    <button
      onClick={() => setLiked((v) => !v)}
      className="flex flex-shrink-0 flex-col items-center gap-0.5 pt-1 text-neutral-400"
      aria-label={liked ? "Unlike comment" : "Like comment"}
    >
      <Heart
        className={`h-3.5 w-3.5 ${liked ? "fill-red-500 stroke-red-500" : ""}`}
        strokeWidth={2}
      />
      {count > 0 && <span className="text-[10px]">{formatCount(count)}</span>}
    </button>
  );
}
