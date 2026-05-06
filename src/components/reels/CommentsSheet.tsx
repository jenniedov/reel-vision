import { useEffect, useRef, useState } from "react";
import { formatCount, relativeTime } from "@/lib/format";
import { X } from "lucide-react";

export interface ReelComment {
  username: string;
  text: string;
  likes: number;
  replies_count: number;
  timestamp: string;
  profile_pic_url?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  comments: ReelComment[];
  totalCount: number;
}

export function CommentsSheet({ open, onClose, comments, totalCount }: Props) {
  const sorted = [...comments].sort((a, b) => b.likes - a.likes);
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
        className="absolute inset-x-0 bottom-0 z-50 h-[70%] rounded-t-2xl bg-neutral-900 text-white shadow-2xl transition-transform duration-300 ease-out flex flex-col"
      >
        <div
          className="pt-2 pb-1 cursor-grab touch-none"
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
            Comments {totalCount > 0 && <span className="text-neutral-400">· {formatCount(totalCount)}</span>}
          </div>
          <button onClick={onClose} aria-label="Close" className="text-neutral-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          {sorted.map((c, i) => (
            <div key={i} className="flex gap-3 py-3">
              <img
                src={c.profile_pic_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.username)}`}
                alt=""
                className="h-9 w-9 flex-shrink-0 rounded-full bg-neutral-800 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.username)}`;
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
                  <button className="font-medium hover:text-neutral-200">Reply</button>
                </div>
              </div>
              {c.likes > 0 && (
                <div className="self-start pt-1 text-neutral-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="py-10 text-center text-sm text-neutral-500">No comments yet</div>
          )}
        </div>
      </div>
    </>
  );
}
