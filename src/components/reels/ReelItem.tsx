import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Send, MoreHorizontal, Volume2, VolumeX, Play } from "lucide-react";
import { formatCount, humanizeTopic } from "@/lib/format";
import { CommentsSheet, type ReelComment } from "./CommentsSheet";

export interface Reel {
  id: number;
  video_url: string;
  cover_url: string | null;
  caption: string;
  author_username: string;
  likes: number;
  comments_count: number;
  views: number;
  top_comments: ReelComment[];
  hashtags: string[];
  topic: string | null;
  blocked: boolean;
  block_reason: string | null;
}

interface Props {
  reel: Reel;
  active: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onOpenComments: () => void;
  commentsOpen: boolean;
  onCloseComments: () => void;
}

export function ReelItem({
  reel, active, muted, onToggleMute, onOpenComments, commentsOpen, onCloseComments,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.currentTime = 0;
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
    }
  }, [active]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <section className="relative h-full w-full snap-start snap-always overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={reel.video_url}
        poster={reel.cover_url ?? undefined}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* gradient overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent" />

      {/* play overlay */}
      {paused && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 z-10 flex items-center justify-center"
          aria-label="Play"
        >
          <Play className="h-20 w-20 text-white/80" fill="currentColor" />
        </button>
      )}

      {/* topic badge */}
      {reel.topic && (
        <div className="absolute left-3 top-3 z-20 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          #{humanizeTopic(reel.topic)}
        </div>
      )}

      {/* blocked banner */}
      {reel.blocked && reel.block_reason && (
        <div className="absolute inset-x-3 top-14 z-20 rounded-lg bg-red-600/90 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur">
          Filtered: {reel.block_reason}
        </div>
      )}

      {/* mute button */}
      <button
        onClick={onToggleMute}
        className="absolute right-3 top-3 z-20 rounded-full bg-black/40 p-2 text-white backdrop-blur-md"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {/* right action rail */}
      <div className="absolute bottom-24 right-3 z-20 flex flex-col items-center gap-5 text-white">
        <button onClick={() => setLiked((v) => !v)} className="flex flex-col items-center gap-1">
          <Heart
            className={`h-8 w-8 drop-shadow-lg ${liked ? "fill-red-500 stroke-red-500" : ""}`}
            strokeWidth={1.8}
          />
          <span className="text-xs font-semibold drop-shadow">{formatCount(reel.likes + (liked ? 1 : 0))}</span>
        </button>
        <button onClick={onOpenComments} className="flex flex-col items-center gap-1">
          <MessageCircle className="h-8 w-8 drop-shadow-lg" strokeWidth={1.8} />
          <span className="text-xs font-semibold drop-shadow">{formatCount(reel.comments_count)}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Send className="h-7 w-7 drop-shadow-lg" strokeWidth={1.8} />
        </button>
        <button className="flex flex-col items-center gap-1">
          <MoreHorizontal className="h-7 w-7 drop-shadow-lg" strokeWidth={1.8} />
        </button>
      </div>

      {/* bottom-left caption */}
      <div className="absolute bottom-6 left-3 right-20 z-20 text-white">
        <div className="text-sm font-semibold">@{reel.author_username}</div>
        <div
          className={`mt-1 whitespace-pre-wrap text-sm leading-snug ${expanded ? "" : "line-clamp-2"}`}
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
        {reel.hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {reel.hashtags.map((h) => (
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
