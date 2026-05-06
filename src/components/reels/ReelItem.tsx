import { useState } from "react";
import { Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react";
import type { Reel } from "@/server/reels.server";
import { formatCount } from "@/lib/format";
import { CommentsSheet } from "./CommentsSheet";

interface Props {
  reel: Reel;
  active: boolean;
  onOpenComments: () => void;
  commentsOpen: boolean;
  onCloseComments: () => void;
}

export function ReelItem({
  reel,
  active,
  onOpenComments,
  commentsOpen,
  onCloseComments,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <section className="relative h-full w-full snap-start snap-always overflow-hidden bg-black">
      {active ? (
        <iframe
          key={reel.id}
          src={reel.embed_url}
          allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
          allowFullScreen
          scrolling="no"
          className="absolute left-1/2 top-1/2 h-[140%] w-[120%] -translate-x-1/2 -translate-y-1/2 border-0"
          title={`Reel by ${reel.author_username}`}
        />
      ) : reel.cover_url ? (
        <img
          src={reel.cover_url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : null}

      {/* gradient overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/85 to-transparent" />

      {/* topic badge */}
      {reel.topic && (
        <div className="absolute left-3 top-3 z-20 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {reel.topic}
        </div>
      )}

      {/* blocked banner */}
      {reel.blocked && reel.block_reason && (
        <div className="absolute inset-x-3 top-14 z-20 rounded-lg bg-red-600/90 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur">
          Filtered: {reel.block_reason}
        </div>
      )}

      {/* right action rail */}
      <div className="absolute bottom-28 right-3 z-20 flex flex-col items-center gap-5 text-white">
        <button onClick={() => setLiked((v) => !v)} className="flex flex-col items-center gap-1">
          <Heart
            className={`h-8 w-8 drop-shadow-lg ${liked ? "fill-red-500 stroke-red-500" : ""}`}
            strokeWidth={1.8}
          />
          <span className="text-xs font-semibold drop-shadow">
            {formatCount(reel.likes + (liked ? 1 : 0))}
          </span>
        </button>
        <button onClick={onOpenComments} className="flex flex-col items-center gap-1">
          <MessageCircle className="h-8 w-8 drop-shadow-lg" strokeWidth={1.8} />
          <span className="text-xs font-semibold drop-shadow">
            {formatCount(reel.comments_count)}
          </span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Send className="h-7 w-7 drop-shadow-lg" strokeWidth={1.8} />
          {reel.shares > 0 && (
            <span className="text-xs font-semibold drop-shadow">{formatCount(reel.shares)}</span>
          )}
        </button>
        <button>
          <MoreHorizontal className="h-7 w-7 drop-shadow-lg" strokeWidth={1.8} />
        </button>
      </div>

      {/* bottom-left caption */}
      <div className="absolute bottom-6 left-3 right-20 z-20 text-white">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold">@{reel.author_username}</div>
          {reel.author_followers > 0 && (
            <div className="text-xs text-neutral-300">
              {formatCount(reel.author_followers)} followers
            </div>
          )}
        </div>
        {reel.caption && (
          <>
            <div
              className={`mt-1 whitespace-pre-wrap text-sm leading-snug ${
                expanded ? "" : "line-clamp-2"
              }`}
            >
              {reel.caption}
            </div>
            {reel.caption.length > 80 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-0.5 text-xs font-medium text-neutral-300"
              >
                {expanded ? "less" : "more"}
              </button>
            )}
          </>
        )}
        {reel.hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {reel.hashtags.slice(0, 6).map((h) => (
              <span
                key={h}
                className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-neutral-200 backdrop-blur-sm"
              >
                #{h}
              </span>
            ))}
          </div>
        )}
        {reel.views > 0 && (
          <div className="mt-2 text-xs text-neutral-300">{formatCount(reel.views)} views</div>
        )}
      </div>

      <CommentsSheet
        open={commentsOpen}
        onClose={onCloseComments}
        comments={reel.top_comments || []}
        totalCount={reel.comments_count}
      />
    </section>
  );
}
